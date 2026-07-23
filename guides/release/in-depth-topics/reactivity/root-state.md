Root state is the foundation of the reactive graph: the values that change
_directly_, rather than being computed from something else. Everything else in
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

A write to a tracked property is the _only_ way anything changes in a reactive
application. Every update you see on screen traces back to some event handler,
timer, or response callback assigning to root state.

## What Qualifies as Root State

A value belongs in root state only if _both_ of these are true:

1. It changes over time, in response to the outside world (user input, network
   responses, timers).
2. It cannot be computed from other state.

The second rule is the one that gets broken most often in practice, and it's
worth being strict about. For every tracked property, ask yourself: _could I
compute this instead?_

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
`itemCount`, forever. Once two copies of the truth exist, they will eventually
disagree - and that whole class of bug simply doesn't exist for the getter.

Storing derived values is sometimes pitched as an optimization. However,
autotracking already recomputes lazily, and only when inputs change, so the
optimization is usually imaginary. When a derivation really is expensive, you
can [cache it](../derived-state/#toc_caching) instead of promoting it to root
state.

A useful instinct from the
[Solid](https://docs.solidjs.com/concepts/intro-to-reactivity) and
[Starbeam](https://starbeamjs.com/) communities: a well-factored reactive
application has surprisingly _little_ root state. A search page might have
exactly two root values - the query string and the raw results - while
everything else on screen (filtered lists, counts, empty-state flags, disabled
buttons) is derived.

## Writes, Equality, and Dirtying

When does a write actually invalidate things? In Ember today, the answer is
simple: _every_ assignment to a tracked property dirties it, even if you
assign the value it already had.

```js
this.count = this.count; // still invalidates everything that consumed `count`
```

Consumers re-evaluate, and the renderer re-checks the DOM it produced. The DOM
itself won't change if the final values are equal, but the recomputation
happens. Other systems make the opposite choice: Solid's signals compare the
new value to the old one - `===` by default - and do nothing if they're equal,
cutting invalidation off at the source. Signalium's `signal()` behaves
similarly.

[RFC #1071](https://github.com/emberjs/rfcs/pull/1071) brings that dial to
Ember. The decorator accepts an options form, `@tracked({ equals })`, that
skips invalidation entirely when the old and new values are equal:

```js
import { tracked } from '@glimmer/tracking';

class Player {
  @tracked({ equals: (a, b) => a === b }) score = 0;

  reset = () => {
    this.score = 0; // if score was already 0, nothing invalidates
  };
}
```

Without options, `@tracked` keeps its historical always-dirty behavior, so
existing code is unaffected.

When is custom equality worth it? The default is fine for most state - a
write usually happens because something actually changed. Custom equality
pays off when writes frequently _don't_ change the value:

- **High-frequency events that usually land on the same value.** Writing the
  current scroll direction (`'up'` or `'down'`) on every scroll event, or the
  current breakpoint name on every resize: the event fires constantly, but
  the value only changes at the moment of reversal or crossing.
- **Data that is re-fetched but rarely different.** Polling a server returns
  a fresh object every time. By reference it is always "new"; by content it
  is almost always the same as last time.
- **Value-like objects.** Dates, durations, coordinates: two distinct
  instances can represent the same value. Comparing by content - for example,
  `(a, b) => a.getTime() === b.getTime()` for dates - reflects what the value
  _means_ rather than where it lives in memory.

In each of these cases, without an equality check every write invalidates
every consumer, and the renderer re-evaluates everything downstream just to
conclude that nothing changed. An equality check cuts that work off at the
root. The flip side: the check itself runs on every write, so for values that
really do change on most writes, the default is the cheaper choice.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The <code>@tracked({ equals })</code> form and the <code>tracked()</code> function described later on this page come from <a href="https://github.com/emberjs/rfcs/pull/1071">RFC #1071</a>, which is <a href="https://github.com/emberjs/ember.js/pull/21471">implemented</a> but has not yet shipped in a stable Ember release. Until it ships, you can get equality-checking behavior by guarding the write yourself: <code>if (next !== this.count) this.count = next;</code>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Because dirtying is per-property, the _granularity_ of your root state
determines the granularity of updates. Three tracked properties invalidate
independently; one tracked object replaced wholesale invalidates everything
that read any part of it. Neither is wrong - but it's a dial you control.

## Mutable Data: Replace or Track the Collection

`@tracked` tracks _assignments to the property_, not mutations inside the
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

You have two good options here. The first is to treat values as immutable and
_replace_ them, which keeps all change flowing through the one tracked write:

```js
addItem = (item) => {
  this.items = [...this.items, item];
};
```

The second is to use a tracked collection from
[`@ember/reactive/collections`](https://api.emberjs.com/ember/release/modules/@ember%2Freactive%2Fcollections),
which tracks reads and writes of its _contents_ at fine granularity:

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
worth knowing: the collection functions _copy_ the data you pass in, so
mutating the tracked collection never mutates the original; and tracked
collections are shallow - `trackedObject`'s properties are tracked, but
objects stored _inside_ it are ordinary objects unless you wrap them too. See
[Autotracking In-Depth](../../autotracking-in-depth/#toc_plain-old-javascript-objects-pojos)
for the full tour of `trackedObject`, `trackedArray`, `trackedMap`, and
`trackedSet`.

Prefer replacement for small values and value-like data. Prefer tracked
collections when a collection is long-lived, large, or mutated from many
places.

## Keep Root State Private, Expose Meaning

Root state is an implementation detail. The code that _uses_ your state
shouldn't know (or care) which parts are stored and which are computed. A
pattern used heavily in Starbeam's documentation - and just as good in Ember -
is to keep reactive storage private and expose a domain-shaped public API:

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

Consumers read `cart.total` and call `cart.add(product)` - ordinary
JavaScript, fully reactive, with no way to corrupt the internal storage. If
you later change how items are stored, nothing outside the class notices.
Classes like this need no framework machinery at all; they work in components,
services, route models, and plain unit tests alike.

## Classes Are Root State, Too

Step back and look at what `Cart` is: tracked storage plus the getters
derived from it, bundled behind one reference. From the outside, an _instance_
of `Cart` is a single reactive value - root state that happens to be
non-primitive. A tracked property can hold a number or a string; it can just
as well hold a `Cart`.

That gives you two levels of granularity, and the dirtying rule from earlier
applies to both:

- **Mutate the instance** - call `cart.add(product)` - and only consumers of
  the affected internal state invalidate.
- **Replace the instance** - assign a new `Cart` to a tracked property - and
  everything that read any part of it invalidates. That's a "reset all" in a
  single write:

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
[Reactivity and the Outside World](../outside-world/) guide covers this
pattern - effects tied to a lifetime - in depth.

One more design rule for state classes: when a class needs to read state that
lives somewhere else (component arguments, another class's tracked fields),
have it accept _functions_ rather than values, so that it reads the current
state on every use instead of a snapshot from construction time. See
[Deferring Consumption](../derived-state/#toc_deferring-consumption) for the
full pattern.

## Reactive Values Without Classes

[RFC #1071](https://github.com/emberjs/rfcs/pull/1071) also overloads
`tracked` to work as a plain function. Called with a value instead of applied
as a decorator, it returns a standalone reactive value - root state that isn't
attached to any class:

```js
import { tracked } from '@glimmer/tracking';

const count = tracked(0);

count.value;     // reading consumes, like any tracked property
count.value = 1; // writing invalidates consumers
```

Unlike the decorator, a standalone value checks equality by default (using
`Object.is`), so assigning the value it already holds invalidates nothing. You
can pass your own comparison with `tracked(initial, { equals })` - useful in
exactly the situations described in
[Writes, Equality, and Dirtying](#toc_writes-equality-and-dirtying) above. For
example, a poll that returns a fresh object every time:

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
`update((current) => next)` - which writes based on the current value
_without_ consuming it - and `freeze()`, which prevents all further writes.

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

- **Component state** belongs on the component, or on plain classes the
  component creates. It's created and thrown away with the component instance.
  See [Component State and Actions](../../../components/component-state-and-actions/).
- **Application-wide state** belongs in a [service](../../../services/), which
  lives as long as the application and can be injected anywhere.
- **URL-driven state** (the current route, query params) belongs in the
  router. Reach for it via route models and query params rather than copying
  it into tracked properties.

One place root state should generally _not_ live is module scope:

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

## Root State Is Not a Cache for Someone Else's Truth

A special case of "could I compute this instead?" arises with _data that
arrives from elsewhere_: arguments passed to your component, records from your
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
draft, for example), that's _new_ root state whose initial value happens to
come from elsewhere. Create it explicitly in response to a user action, not by
mirroring the argument on every change. The
[Patterns for Components](../../patterns-for-components/) guide shows several
shapes of this.
