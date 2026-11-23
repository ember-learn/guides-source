In a reactive system, when your data changes, everything computed from that data updates, including the page.
You describe the output for a given state, and the framework decides when to update and what to update.

Ember's reactivity system is called _autotracking_.
If you have written a `@tracked` property, you have used it.
The guides in this section are less about the API and more about how to design state that stays correct as an application grows.
The same ideas appear in other frameworks, where they are usually called _signals_.

## The Three Layers of Reactive State

A reactive application has three layers:

- _Root state_ is the values that change directly, because a user clicked something, a server responded, or time passed.
  In Ember, root state is what you mark with `@tracked` or store in a tracked collection such as `trackedArray`.
- _Derived state_ is the values computed from root state, or from other derived state.
  When you change a piece of root state, you do not tell the derived values to update. They update on their own.
  In Ember, derived state is ordinary getters, functions, and template expressions.
- _Outputs_ are the places where your data leaves the application, such as the rendered DOM, the document title, or a chart drawn on a canvas.
  In Ember, the main output is your templates.
  The renderer watches everything your templates read, and updates the DOM when any of it changes.

Data flows in one direction, from root state, through derived state, to the outputs.
Events such as clicks, responses, and timers write to root state.

Here are all three layers in one component:

```gjs {data-filename=app/components/cart.gjs}
import Component from '@glimmer/component';
import { trackedArray } from '@ember/reactive/collections';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

export default class Cart extends Component {
  // Root state: the values that change directly
  items = trackedArray([]);

  // Derived state: computed from root state
  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  get tax() {
    return this.subtotal * 0.08;
  }

  get total() {
    return this.subtotal + this.tax;
  }

  addItem = (item) => {
    // Events write to root state
    this.items.push(item);
  };

  // Output: the rendered page
  <template>
    <p>Total: {{this.total}}</p>
    <button type="button" {{on "click" (fn this.addItem @product)}}>
      Add to cart
    </button>
  </template>
}
```

This component has one piece of root state and three getters.
Most reactive code looks like this: a small amount of root state, and everything else derived from it.
The [Root State](./root-state/) and [Derived State](./derived-state/) guides explain how to get there.

## Consuming and Invalidating

Autotracking, like other reactive systems, has two basic operations.
When a value is read while something reactive is being computed, the system records that the computation used that value.
A template rendering and a cached getter evaluating are both examples of such a computation.
This is called _consuming_.
When a value is written, the system marks every computation that consumed it as out of date.
This is called _invalidating_, or _dirtying_.

When Ember renders `{{this.total}}` in the component above, it evaluates `total`, which reads `subtotal` and `tax`, which read `items`.
Because `items` is a tracked collection, those reads are consumed.
Later, when `addItem` pushes into `this.items`, the write invalidates the rendered output.
Ember then schedules a rerender of only the parts of the DOM that consumed it.

You never declare what a getter depends on.
The system records what the getter reads each time it runs, so conditional dependencies work:

```js
get displayName() {
  return this.useNickname ? this.nickname : this.fullName;
}
```

While `useNickname` is `false`, changes to `nickname` do not invalidate anything, because `displayName` never read it.
If `useNickname` becomes `true`, the next evaluation reads `nickname`, and from then on changes to `nickname` do invalidate `displayName`.

Tracking is also synchronous.
The system can only observe reads that happen while a reactive computation is running.
If you read tracked state in a callback that runs later, after an `await` or inside a `setTimeout`, that read happens outside any tracking context.
Nothing is consumed.
Templates, getters, and helpers are all synchronous, so this is rarely a problem.
When something does not update and you cannot tell why, check for a read after an `await`.
The [Inputs and Outputs](./inputs-and-outputs/) guide has more on this.

## Pull, Not Push

There are two ways a reactive system can respond to a write:

- A _push_-based system eagerly re-runs every affected computation the moment a value changes.
- A _pull_-based, or lazy, system marks affected computations as out of date.
  It recomputes them only when someone needs their result.

Autotracking is pull-based.
When you write to a tracked property, your getters do not run.
The write only tells the renderer that something it consumed is out of date.
Later, asynchronously but before the browser paints, the renderer re-evaluates the affected expressions in your templates and updates the DOM.

In practice this means:

- If you set ten tracked properties in one event handler, you get one rerender, not ten.
  You do not need to batch updates yourself.
- A derived value that nothing reads is never computed, no matter how often its inputs change.
- A read never sees a half-applied update.
  Derivations run on demand, so there is no moment where `tax` is updated but `subtotal` is not.
- There is no way to say "run this code when X changes".
  Push-based systems offer an _effect_ for that.
  Ember does not, and the [Inputs and Outputs](./inputs-and-outputs/) guide explains why, and what to do instead.

## Where to Go from Here

- [Root State](./root-state/) covers what belongs in root state and how to design it.
- [Derived State](./derived-state/) covers laziness, purity, caching, and composition.
- [Inputs and Outputs](./inputs-and-outputs/) covers side effects and async.

For the details of `@tracked` itself, see [Autotracking In-Depth](../autotracking-in-depth/).
