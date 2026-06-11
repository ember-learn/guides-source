Root state is the foundation of the reactive graph: the values that change _directly_, rather than being computed from something else. Everything else in your application—derived values, rendered DOM—is a consequence of root state. That makes designing your root state the highest-leverage decision in managing UI state: get it right, and the rest of your code becomes formulas that can't fall out of sync.

In Ember, you create root state by marking storage as tracked:

```js
import { tracked } from '@glimmer/tracking';

class Draft {
  @tracked title = '';
  @tracked body = '';
}
```

A write to a tracked property is the _only_ way anything changes in a reactive application. Every update you see on screen traces back to some event handler, timer, or response callback assigning to root state.

## What Qualifies as Root State

A value belongs in root state only if _both_ of these are true:

1. It changes over time, in response to the outside world (user input, network responses, timers).
2. It cannot be computed from other state.

The second rule is the one that gets violated in practice, and it's worth being strict about. Ask of every tracked property: _could I compute this instead?_

```js
class Cart {
  @tracked items = [];

  // 🛑 Don't: this is derived state stored as root state
  @tracked itemCount = 0;

  // ✅ Do: derive it
  get itemCount() {
    return this.items.length;
  }
}
```

The tracked `itemCount` looks harmless, but it creates a second source of truth. Now every code path that changes `items` must also remember to update `itemCount`, forever. Once two copies of the truth exist, they _will_ disagree eventually, and that bug class simply doesn't exist for the getter. Storing derived values is sometimes pitched as an optimization—but autotracking already recomputes lazily and only when inputs change, so the optimization is usually imaginary. (When a derivation really is expensive, [cache it](../derived-state/#toc_caching)—don't promote it to root state.)

A useful instinct from the [Solid](https://docs.solidjs.com/concepts/intro-to-reactivity) and [Starbeam](https://starbeamjs.com/) communities: a well-factored reactive application has surprisingly _little_ root state. A search page might have exactly two root values—the query string and the raw results—while everything else on screen (filtered lists, counts, empty-state flags, disabled buttons) is derived.

## Writes, Equality, and Dirtying

When does a write actually invalidate things? In Ember today, the answer is simple: _every_ assignment to a tracked property dirties it, even if you assign the value it already had.

```js
this.count = this.count; // still invalidates everything that consumed `count`
```

Consumers re-evaluate, and the renderer re-checks the DOM it produced (the DOM itself won't change if the final values are equal, but the recomputation happens). Other systems make the opposite choice: Solid's signals and Signalium's `signal()` compare the new value to the old one—with `===` by default—and do nothing if they're equal, cutting invalidation off at the source.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <a href="https://github.com/emberjs/rfcs/pull/1071">RFC #1071</a> (accepted, not yet released) brings configurable equality to Ember: <code>@tracked({ equals: (a, b) => a === b })</code>, and a <code>tracked()</code> function for creating reactive values outside of classes. Until it ships, you can get equality-checking behavior by guarding the write yourself: <code>if (next !== this.count) this.count = next;</code>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Because dirtying is per-property, the _granularity_ of your root state determines the granularity of updates. Three tracked properties invalidate independently; one tracked object replaced wholesale invalidates everything that read any part of it. Neither is wrong—but it's a dial you control.

## Mutable Data: Replace or Track the Collection

`@tracked` tracks _assignments to the property_, not mutations inside the value. Pushing into a plain array or setting a key on a plain object is invisible to the system:

```js
class ShoppingList {
  @tracked items = [];

  addItem(item) {
    this.items.push(item); // 🛑 not tracked — nothing updates
  }
}
```

You have two good options. The first is to treat values as immutable and _replace_ them, which keeps all change flowing through the one tracked write:

```js
addItem = (item) => {
  this.items = [...this.items, item];
};
```

The second is to use a tracked collection from [`@ember/reactive/collections`](https://api.emberjs.com/ember/release/modules/@ember%2Freactive%2Fcollections), which tracks reads and writes of its _contents_ at fine granularity:

```js
import { trackedArray } from '@ember/reactive/collections';

class ShoppingList {
  items = trackedArray([]);

  addItem = (item) => {
    this.items.push(item); // ✅ tracked
  };
}
```

Note that the property itself no longer needs `@tracked`—the collection carries its own reactivity, and the property is never reassigned. Tracked collections are shallow: `trackedObject`'s properties are tracked, but objects stored _inside_ it are ordinary objects unless you wrap them too. See [Autotracking In-Depth](../../autotracking-in-depth/#toc_plain-old-javascript-objects-pojos) for the full tour of `trackedObject`, `trackedArray`, `trackedMap`, and `trackedSet`.

Prefer replacement for small values and value-like data; prefer tracked collections when a collection is long-lived, large, or mutated from many places.

## Keep Root State Private, Expose Meaning

Root state is an implementation detail. The code that _uses_ your state shouldn't know (or care) which parts are stored and which are computed. A pattern used heavily in Starbeam's documentation—and just as good in Ember—is to keep reactive storage private and expose a domain-shaped public API:

```js
import { trackedMap } from '@ember/reactive/collections';

export class Cart {
  // Root state: private, mutable, reactive
  #items = trackedMap();

  // Public API: domain-shaped, read-only, derived
  get items() {
    return [...this.#items.values()];
  }

  get isEmpty() {
    return this.#items.size === 0;
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Mutations: named after what they mean, not how they're stored
  add(product, quantity = 1) {
    this.#items.set(product.id, { ...product, quantity });
  }

  remove(productId) {
    this.#items.delete(productId);
  }
}
```

Consumers read `cart.total` and call `cart.add(product)`—ordinary JavaScript, fully reactive, with no way to corrupt the internal storage. If you later change how items are stored, nothing outside the class notices. Classes like this need no framework machinery at all; they work in components, services, route models, and plain unit tests alike.

## Where Root State Lives

Root state needs an owner—something whose lifetime matches the state's lifetime:

- **Component state** belongs on the component (or on plain classes the component creates). It's created and thrown away with the component instance. See [Component State and Actions](../../../components/component-state-and-actions/).
- **Application-wide state** belongs in a [service](../../../services/), which lives as long as the application and can be injected anywhere.
- **URL-driven state** (the current route, query params) belongs in the router—reach for it via route models and query params rather than copying it into tracked properties.

One place root state should generally _not_ live is module scope:

```js
// 🛑 Avoid in apps
import { trackedObject } from '@ember/reactive/collections';

export const settings = trackedObject({ theme: 'light' });
```

It works—reactivity doesn't care where storage lives—but modules are only evaluated once, so this state silently persists across acceptance and integration tests, leaking one test's writes into the next. State that would be module-scoped almost always wants to be a service, which is created and destroyed per application instance (and per test). The exception is demos and scratch code, where module state's brevity is the point.

## Root State Is Not a Cache for Someone Else's Truth

A special case of "could I compute this instead?" arises with _data that arrives from elsewhere_—arguments passed to your component, records from your data layer, the current route. The reactive system already tracks these. Copying them into your own tracked properties creates the synchronization problem again:

```js
// 🛑 Don't: copying an argument into root state
class UserCard extends Component {
  @tracked displayName = this.args.user.name;
}
```

This captures `name` once and goes stale when the argument changes. Deriving stays current automatically:

```js
// ✅ Do: derive from the argument
class UserCard extends Component {
  get displayName() {
    return this.args.user.name ?? 'Anonymous';
  }
}
```

If you genuinely need "the argument, until the user edits it locally" (a form draft, for example), that's _new_ root state whose initial value happens to come from elsewhere—create it explicitly in response to a user action, not by mirroring the argument on every change. The [Patterns for Components](../../patterns-for-components/) guide shows several shapes of this.
