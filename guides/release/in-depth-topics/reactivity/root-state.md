Root state is the foundation of the reactive graph: the values that change
directly, rather than being computed from something else. Everything else in
your application - derived values, rendered DOM - is a consequence of root
state. That makes designing your root state the highest-leverage decision you
make when managing UI state. Get it right, and the rest of your code becomes
derived values that can't fall out of sync.

In Ember, you create root state by marking a property as tracked:

```js
import { tracked } from '@glimmer/tracking';

class Draft {
  @tracked title = '';
  @tracked body = '';
}
```

A write to a tracked property is the only way anything changes in a reactive
application. Every update you see on screen traces back to some event
handler, timer, or response callback assigning to root state.

## What Qualifies as Root State

A value belongs in root state only if both of these are true:

1. It changes over time, in response to the outside world (user input,
   network responses, timers).
2. It cannot be computed from other state.

The second rule is the one that gets broken most often in practice. For every
tracked property, ask yourself: _could I compute this instead?_

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

The tracked `itemCount` looks harmless, but it creates a second source of
truth. Every code path that changes `items` must now also remember to update
`itemCount`, forever. Once two copies of the truth exist, they will
eventually disagree - and that whole class of bug simply doesn't exist for
the getter.

Storing derived values is sometimes pitched as an optimization. However,
autotracking already recomputes lazily, and only when inputs change, so the
optimization is usually imaginary. When a derivation really is expensive, you
can [cache it](../derived-state/#toc_caching) instead of promoting it to root
state.

As a rule of thumb, a well-factored reactive application has surprisingly
little root state. A search page might have exactly two root values - the
query string and the raw results - while everything else on screen (filtered
lists, counts, empty-state flags, disabled buttons) is derived.

## Root State Is Not a Cache for Someone Else's Truth

A special case of "could I compute this instead?" arises with data that
arrives from elsewhere: arguments passed to your component, records from your
data layer, the current route. The reactive system already tracks these.
Copying them into your own tracked properties creates the synchronization
problem all over again:

```js
// 🛑 Don't: copying an argument into root state
class UserCard extends Component {
  @tracked displayName = this.args.user.name;
}
```

This captures `name` once and goes stale when the argument changes. Deriving
stays current automatically:

```js
// ✅ Do: derive from the argument
class UserCard extends Component {
  get displayName() {
    return this.args.user.name ?? 'Anonymous';
  }
}
```

If you genuinely need "the argument, until the user edits it locally" (a form
draft, for example), that's new root state whose initial value happens to
come from elsewhere. Create it explicitly in response to a user action, not
by mirroring the argument on every change. The
[Patterns for Components](../../patterns-for-components/) guide shows several
shapes of this.

## Writes, Equality, and Dirtying

When does a write actually invalidate things? By default, every assignment to
a tracked property dirties it, even if you assign the value it already had.

```js
this.count = this.count; // still invalidates everything that consumed `count`
```

Consumers re-evaluate, and the renderer re-checks the DOM it produced. The
DOM itself won't change if the final values are equal, but the recomputation
happens.

When a write that changes nothing shouldn't dirty anything, the decorator
accepts an options form, `@tracked({ equals })`, that skips invalidation
entirely when the old and new values are equal:

```js
import { tracked } from '@glimmer/tracking';

class Player {
  @tracked({ equals: (a, b) => a === b }) score = 0;

  reset = () => {
    this.score = 0; // if score was already 0, nothing invalidates
  };
}
```

Without options, `@tracked` has always-dirty behavior.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>@tracked({ equals })</code> and the <code>tracked()</code> function described later on this page are new in Ember 7.3.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Most state doesn't need custom equality, because a write usually happens
when something actually changed. It pays off when writes frequently don't
change the value:

- High-frequency events that usually land on the same value. For instance,
  writing the current scroll direction (`'up'` or `'down'`) on every scroll
  event, or the current breakpoint name on every resize: the event fires
  constantly, but the value only changes at the moment of reversal or
  crossing.
- Data that is re-fetched but rarely different. Polling a server returns a
  fresh object every time. By reference it is always "new"; by content it is
  almost always the same as last time.
- Value-like objects such as dates, durations, and coordinates, where two
  distinct instances can represent the same value. Comparing by content - for
  example, `(a, b) => a.getTime() === b.getTime()` for dates - reflects what
  the value means rather than where it lives in memory.

In each of these cases, without an equality check every write invalidates
every consumer, and the renderer re-evaluates everything downstream just to
conclude that nothing changed. An equality check cuts that work off at the
root. On the other hand, the check itself runs on every write, so for values
that really do change on most writes, the default is the cheaper choice.

Because dirtying is per-property, the granularity of your root state
determines the granularity of updates. Three tracked properties invalidate
independently; one tracked object replaced wholesale invalidates everything
that read any part of it. Reactive systems thrive on fine-grained changes:
prefer shapes that let you write exactly the piece that changed, and keep the
identity of everything else stable.

## Mutable Data: Track the Collection

`@tracked` tracks assignments to the property, not mutations inside the
value. Pushing into a plain array or setting a key on a plain object is
invisible to the system:

```js
class ShoppingList {
  @tracked items = [];

  addItem(item) {
    this.items.push(item); // 🛑 not tracked - nothing updates
  }
}
```

The right tool here is a tracked collection from
[`@ember/reactive/collections`](https://api.emberjs.com/ember/release/modules/@ember%2Freactive%2Fcollections),
which tracks reads and writes of its contents at fine granularity:

```js
import { trackedArray } from '@ember/reactive/collections';

class ShoppingList {
  items = trackedArray([]);

  addItem = (item) => {
    this.items.push(item); // ✅ tracked
  };
}
```

Note that the property itself no longer needs `@tracked`. The collection
carries its own reactivity, and the property is never reassigned. Two details
to know: the collection functions copy the data you pass in, so mutating the
tracked collection never mutates the original; and tracked collections are
shallow - `trackedObject`'s properties are tracked, but objects stored inside
it are ordinary objects unless you wrap them too. See
[Autotracking In-Depth](../../autotracking-in-depth/#toc_plain-old-javascript-objects-pojos)
for the full tour of `trackedObject`, `trackedArray`, `trackedMap`, and
`trackedSet`.

You may also see code that replaces the value instead, assigning a brand-new
array to the tracked property:

```js
addItem = (item) => {
  this.items = this.items.concat(item); // works, but has caveats
};
```

The assignment is a tracked write, so this updates - but it is the coarsest
change there is. Every consumer of `items` invalidates, even ones that only
cared about one entry, and the array's identity changes on every update,
which defeats downstream `===` checks and caches (see
[stable identity](../derived-state/#toc_caching)). Something that was really
a one-item change gets treated as if the entire array were new. Retain
identity wherever possible: keep one long-lived tracked collection and mutate
it, so that the system invalidates only what actually changed. Replacement is
best reserved for genuinely value-like data - a string, a date, a small
tuple - where the new value simply is a different value.

## Keep Root State Private, Expose Meaning

Root state is an implementation detail. The code that uses your state
shouldn't know (or care) which parts are stored and which are computed. A
good pattern is to keep reactive storage private and expose a domain-shaped
public API:

```js
import { trackedMap } from '@ember/reactive/collections';

export class Cart {
  // Root state: private, mutable, reactive
  #items = trackedMap();

  // Public API: read-only, derived
  get items() {
    return Array.from(this.#items.values());
  }

  get isEmpty() {
    return this.#items.size === 0;
  }

  get total() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Mutations, named for what they do to the cart
  add(product, quantity = 1) {
    this.#items.set(product.id, { ...product, quantity });
  }

  remove(productId) {
    this.#items.delete(productId);
  }
}
```

Consumers read `cart.total` and call `cart.add(product)` - ordinary
JavaScript, fully reactive, with no way to corrupt the internal storage. If
you later change how items are stored, nothing outside the class notices.
Classes like this need no framework machinery at all; they work in
components, services, route models, and plain unit tests alike.

## Classes Are Root State, Too

Step back and look at what `Cart` is: tracked storage plus the getters
derived from it, bundled behind one reference. From the outside, an instance
of `Cart` is a single reactive value - root state that happens to be
non-primitive. A tracked property can hold a number or a string; it can just
as well hold a `Cart`.

That gives you two levels of granularity, and the dirtying rule from earlier
applies to both. Mutating the instance (calling `cart.add(product)`)
invalidates only the consumers of the affected internal state. Replacing the
instance (assigning a new `Cart` to a tracked property) invalidates
everything that read any part of it - a single write that resets everything:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Checkout extends Component {
  // The reference is root state; so is the storage inside the instance
  @tracked cart = new Cart();

  startOver = () => {
    this.cart = new Cart();
  };
}
```

Day to day, prefer mutation: it keeps the instance's identity stable and
invalidation precise. Reach for replacement only when you genuinely mean
"this is a whole new thing," as `startOver` does above.

Because these are plain classes, their lifetime is ordinary JavaScript
lifetime: an instance lives as long as something references it. Create one in
a component field, and it lives and dies with the component. Create one per
row of a table, and each lives as long as its row is rendered. No framework
registration is needed - garbage collection is the cleanup.

The exception is a class that starts an external process: a timer, a
subscription, a socket. Garbage collection won't stop those, so tie the
instance's lifetime to its owner with the tools from
[`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable):

```js {data-filename=app/components/dashboard.gjs}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import {
  associateDestroyableChild,
  registerDestructor,
} from '@ember/destroyable';

class Poller {
  @tracked lastReading = null;

  constructor() {
    let timer = setInterval(() => this.poll(), 5000);
    registerDestructor(this, () => clearInterval(timer));
  }

  async poll() {
    let response = await fetch('/api/readings/latest');
    this.lastReading = await response.json();
  }
}

export default class Dashboard extends Component {
  poller = associateDestroyableChild(this, new Poller());

  <template>
    Latest reading: {{this.poller.lastReading.temperature}}
  </template>
}
```

`registerDestructor` gives `Poller` its cleanup; `associateDestroyableChild`
links it to the component, so when the component is destroyed, the poller is
destroyed with it. The
[Inputs and Outputs](../inputs-and-outputs/) guide covers this
pattern - effects tied to a lifetime - in depth.

One more design rule for state classes: when a class needs to read state that
lives somewhere else (component arguments, another class's tracked fields),
have it accept functions rather than values, so that it reads the current
state on every use instead of a snapshot from construction time. See
[Deferring Consumption](../derived-state/#toc_deferring-consumption) for the
full pattern.

## Reactive Values Without Classes

`tracked` also works as a plain function. Called with a value instead of
applied as a decorator, it returns a standalone reactive value - root state
that isn't attached to any class:

```js
import { tracked } from '@glimmer/tracking';

const count = tracked(0);

count.value;     // reading consumes, like any tracked property
count.value = 1; // writing invalidates consumers
```

Unlike the decorator, a standalone value checks equality by default (using
`Object.is`), so assigning the value it already holds invalidates nothing.
This is the one place the two forms of `tracked` disagree, and it's easy to
trip over. The same-looking write behaves differently in each:

```js
class Counter {
  @tracked count = 0;
}
let counter = new Counter();
counter.count = 0; // dirties: the decorator does not check equality

const count = tracked(0);
count.value = 0;   // does nothing: the value is already 0
```

If you need the two forms to match, give the decorator an equality check
(`@tracked({ equals: Object.is })`), or opt the standalone value out of
checking with `equals: () => false`.

You can also pass your own comparison with `tracked(initial, { equals })`,
which is useful in exactly the situations described in
[Writes, Equality, and Dirtying](#toc_writes-equality-and-dirtying) above.
For example, a poll that returns a fresh object every time:

```js
import { tracked } from '@glimmer/tracking';

const serverStatus = tracked(
  { state: 'ok', pendingJobs: 0 },
  {
    equals: (a, b) =>
      a.state === b.state && a.pendingJobs === b.pendingJobs,
  }
);

// Each response is a brand-new object, so the default `Object.is`
// would treat every poll as a change. With `equals`, consumers only
// invalidate when the contents actually changed.
serverStatus.value = await fetchStatus();
```

Beyond `.value` there are function shorthands: `get()` and `set(value)`, plus
`update((current) => next)` - which writes based on the current value without
consuming it - and `freeze()`, which prevents all further writes.

For application code, classes with `@tracked` remain the primary tool. The
function form fills the gaps a decorator can't reach: function-based helpers
and modifiers, tests that want a reactive value without ceremony, and demos.
It also pairs well with the private-storage pattern above, as a truly private
reactive field:

```js
import { tracked } from '@glimmer/tracking';

export class Toggle {
  #state = tracked(false);

  get isOn() {
    return this.#state.value;
  }

  toggle = () => {
    this.#state.value = !this.#state.value;
  };
}
```

The function form is also a good mental model for the decorator itself: you
can think of each `@tracked` property as syntactic sugar over one of these
values - one per property, per instance - where reading the property reads
`.value` and assigning it writes `.value` (with equality checking turned off,
for historical compatibility).

## Where Root State Lives

Root state needs an owner - something whose lifetime matches the state's
lifetime:

- Component state belongs on the component, or on plain classes the component
  creates. It's created and thrown away with the component instance. See
  [Component State and Actions](../../../components/component-state-and-actions/).
- Application-wide state belongs in a [service](../../../services/), which
  lives as long as the application and can be injected anywhere.
- URL-driven state (the current route, query params) belongs in the router.
  Reach for it via route models and query params rather than copying it into
  tracked properties.

One place root state should generally not live is module scope:

```js
// 🛑 Avoid in apps
import { trackedObject } from '@ember/reactive/collections';

export const settings = trackedObject({ theme: 'light' });
```

It works - reactivity doesn't care where storage lives - but modules are only
evaluated once, so this state silently persists across acceptance and
integration tests, leaking one test's writes into the next. State that would
be module-scoped almost always wants to be a service, which is created and
destroyed per application instance (and per test). The exception is demos and
scratch code, where module state's brevity is the point.

To sum up: store only what you can't compute, decide how writes should dirty
it, pick the shape that fits (a tracked property, a collection, a class, a
standalone value), and give it an owner whose lifetime matches the state's.
Everything else in your application should be
[derived state](../derived-state/) - which is the subject of the next guide.
