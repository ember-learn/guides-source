Root state is the set of values that change directly, instead of being computed from something else.
Derived values and the rendered DOM all come from root state, so it pays to keep root state small.
The less of it you have, the less there is that can fall out of sync.

In Ember, you create root state by marking a property as tracked:

```js
import { tracked } from '@glimmer/tracking';

class Draft {
  @tracked title = '';
  @tracked body = '';
}
```

A write to root state is the only way that anything changes in a reactive application.
Every update on screen starts with an event handler, a timer, or a response callback that writes to root state.

## What Qualifies as Root State

A value belongs in root state only if both of these are true:

1. It changes over time, in response to the outside world. User input, network responses, and timers are examples.
2. It cannot be computed from other state.

The second rule is the one that people break most often.
For each tracked property, ask if you can compute it instead.

```js
// Avoid: derived state stored as root state
class Cart {
  @tracked items = [];
  @tracked itemCount = 0;
}
```

```js
// Prefer: derive it
class Cart {
  @tracked items = [];

  get itemCount() {
    return this.items.length;
  }
}
```

With the tracked `itemCount`, every code path that changes `items` must also update `itemCount`.
Sooner or later one of them will not, and the two values will disagree.
The getter cannot have that bug.

People sometimes store derived values to save work.
Most getters are cheap, and a template only reads a getter again when its inputs change, so there is usually no work to save.
When a derivation is expensive, [cache it](../derived-state/#toc_caching) instead of making it root state.

A search page, for example, can have only two root values: the query string and the raw results.
The filtered list, the counts, the empty-state message, and the disabled buttons are all derived.

## Do Not Copy State That You Do Not Own

Some data arrives from elsewhere: arguments passed to your component, records from your data layer, the current route.
The reactive system already tracks these.
If you copy them into your own tracked properties, you have two values to keep in sync again:

```js
// Avoid: copying an argument into root state
class UserCard extends Component {
  @tracked displayName = this.args.user.name;
}
```

This reads `name` once, and goes stale when the argument changes.
A getter stays current:

```js
// Prefer: derive from the argument
class UserCard extends Component {
  get displayName() {
    return this.args.user.name ?? 'Anonymous';
  }
}
```

Sometimes you need "the argument, until the user edits it locally", as in a form draft.
That is new root state, and its initial value comes from the argument.
Create it in response to a user action, such as a click on an "Edit" button.
Do not try to mirror the argument each time it changes.

## Writes, Equality, and Dirtying

By default, every assignment to a tracked property dirties it, even if you assign the value it already had.

```js
this.count = this.count; // still invalidates everything that consumed `count`
```

Consumers re-evaluate, and the renderer checks the DOM that it produced.
The DOM does not change if the final values are equal, but the recomputation still happens.

To skip invalidation when the old value and the new value are equal, pass an `equals` function to the decorator:

```js
import { tracked } from '@glimmer/tracking';

class Player {
  @tracked({ equals: (a, b) => a === b }) score = 0;

  reset = () => {
    this.score = 0; // if score was already 0, nothing invalidates
  };
}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>@tracked({ equals })</code> and the <code>tracked()</code> function described later on this page require Ember 7.3 or later.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Most state does not need this, because a write usually means that something changed.
An `equals` function helps when many writes do not change the value:

- Frequent events that usually produce the same value.
  If you write the scroll direction (`'up'` or `'down'`) on every scroll event, the value only changes when the user reverses.
- Data that you fetch again and that is rarely different.
  Each poll of a server returns a new object, usually with the same content as the last one.
- Objects such as dates, durations, and coordinates, where two instances can represent the same value.
  For dates, you can compare with `(a, b) => a.getTime() === b.getTime()`.

Without an equality check, each of these writes makes the renderer re-evaluate every consumer, only to find that nothing changed.
The check has a cost too, because it runs on every write.
For values that change on most writes, the default is cheaper.

Each tracked property invalidates on its own.
Three tracked properties invalidate independently, but if you replace one tracked object, everything that read any part of it is invalidated.
Where you can, shape your root state so that you write only the piece that changed.

## Mutable Data: Track the Collection

`@tracked` tracks assignments to the property, not mutations inside the value.
Pushing into a plain array or setting a key on a plain object is invisible to the system:

```js
class ShoppingList {
  @tracked items = [];

  addItem(item) {
    this.items.push(item); // not tracked - nothing updates
  }
}
```

The right tool here is a tracked collection from [`@ember/reactive/collections`](https://api.emberjs.com/ember/release/modules/@ember%2Freactive%2Fcollections).
A tracked collection tracks reads and writes of its contents:

```js
import { trackedArray } from '@ember/reactive/collections';

class ShoppingList {
  items = trackedArray([]);

  addItem = (item) => {
    this.items.push(item); // tracked
  };
}
```

The property no longer needs `@tracked`, because the collection is reactive and the property is never reassigned.

The collection functions copy the data that you pass in, so a change to the tracked collection does not change the original.
Tracked collections are also shallow.
The properties of a `trackedObject` are tracked, but an object stored inside it is an ordinary object unless you wrap it too.
See [Autotracking In-Depth](../../autotracking-in-depth/#toc_plain-old-javascript-objects-pojos) for more on `trackedObject`, `trackedArray`, `trackedMap`, and `trackedSet`.

You can also see code that assigns a new array to the tracked property:

```js
addItem = (item) => {
  this.items = this.items.concat(item); // works, but has caveats
};
```

The assignment is a tracked write, so the page updates.
But every consumer of `items` is invalidated, including consumers that only read one entry.
The array is also a different object after each update, which breaks `===` checks and caches further down. See [stable identity](../derived-state/#toc_caching).

Prefer to keep one tracked collection and mutate it, so that only the changed parts are invalidated.
Replacement is fine for values such as a string, a date, or a small tuple.

## Keep Root State Private

The code that uses your state does not need to know which parts are stored and which are computed.
You can keep the reactive storage private, and expose getters and methods:

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

Other code reads `cart.total` and calls `cart.add(product)`, and cannot reach the storage.
If you change how the items are stored, nothing outside the class needs to change.
The class does not extend anything from Ember, so you can use it in components, services, route models, and unit tests.

## Classes as Root State

From the outside, an instance of `Cart` is one reactive value.
A tracked property can hold a number or a string, and it can hold a `Cart` too.

You can then change the cart in two ways.
If you mutate the instance, for example with `cart.add(product)`, only the consumers of the changed storage are invalidated.
If you assign a new `Cart` to the tracked property, everything that read any part of the old cart is invalidated:

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

Most of the time, mutate.
Replace the instance only when you want a new one, as `startOver` does.

These are plain classes, so an instance lives as long as something references it.
If you create one in a component field, it is garbage collected with the component.
You do not need to register it anywhere.

The exception is a class that starts a timer, a subscription, or a socket.
Garbage collection does not stop those.
Link the instance to its owner with the functions from [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable):

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

`registerDestructor` gives `Poller` its cleanup.
`associateDestroyableChild` links the poller to the component, so that Ember destroys the poller when it destroys the component.
The [Inputs and Outputs](../inputs-and-outputs/) guide has more on this pattern.

Sometimes a class needs to read state that lives somewhere else, such as component arguments or the tracked fields of another class.
Pass it functions instead of values.
The class then reads the current state on each use, not a snapshot from the time it was constructed.
See [Deferring Consumption](../derived-state/#toc_deferring-consumption).

## Reactive Values Without Classes

`tracked` also works as a plain function.
When you call it with a value, it returns a reactive value that is not attached to a class:

```js
import { tracked } from '@glimmer/tracking';

const count = tracked(0);

count.value;     // reading consumes, like any tracked property
count.value = 1; // writing invalidates consumers
```

Unlike the decorator, the function form checks equality by default, with `Object.is`.
If you assign the value that it already holds, nothing is invalidated.
The two forms of `tracked` differ here, so the same write behaves differently in each:

```js
class Counter {
  @tracked count = 0;
}
let counter = new Counter();
counter.count = 0; // dirties: the decorator does not check equality

const count = tracked(0);
count.value = 0;   // does nothing: the value is already 0
```

To make the two forms match, give the decorator an equality check with `@tracked({ equals: Object.is })`, or turn the check off for the function form with `equals: () => false`.

You can also pass your own comparison with `tracked(initial, { equals })`, for the cases in [Writes, Equality, and Dirtying](#toc_writes-equality-and-dirtying).
For example, a poll that returns a new object each time:

```js
import { tracked } from '@glimmer/tracking';

const serverStatus = tracked(
  { state: 'ok', pendingJobs: 0 },
  {
    equals: (a, b) =>
      a.state === b.state && a.pendingJobs === b.pendingJobs,
  }
);

// Each response is a new object, so `Object.is` would treat
// every poll as a change.
serverStatus.value = await fetchStatus();
```

A tracked value also has these methods:

- `get()` reads the value.
- `set(value)` writes the value.
- `update((current) => next)` writes a value based on the current one, and does not consume it.
- `freeze()` prevents all later writes.

In application code, you will mostly use classes with `@tracked`.
The function form is for places where there is no class to decorate, such as function-based helpers and modifiers, tests, and demos.
You can also use it for a private reactive field:

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

You can think of each `@tracked` property as one of these values, with one value per property, per instance.
A read of the property reads `.value`, and an assignment writes `.value`, with the equality check turned off.

## Where Root State Lives

Put root state on something that lives as long as the state is needed:

- Component state belongs on the component, or on plain classes that the component creates. See [Component State and Actions](../../../components/component-state-and-actions/).
- Application-wide state belongs in a [service](../../../services/), which lives as long as the application and can be injected anywhere.
- URL state, such as the current route and query params, belongs in the router. Read it through route models and query params, and do not copy it into tracked properties.

Module scope is a poor home for root state:

```js
// Avoid in apps
import { trackedObject } from '@ember/reactive/collections';

export const settings = trackedObject({ theme: 'light' });
```

This works, because the reactive system does not care where the storage lives.
But a module is evaluated once, so the state stays around between tests, and the writes of one test leak into the next.
Use a service instead.
Ember creates and destroys a service with each application instance, so each test gets a new one.
Module state is fine in demos and throwaway code.

The next guide covers everything that is not root state: [derived state](../derived-state/).
