Reactivity is at the heart of every modern UI framework.
When your data changes, everything computed from that data updates, including the page itself.
You declare what the output is for any given state, and the framework decides when and what to update.

You have used Ember's reactivity system, called _autotracking_, since your first `@tracked` property.
The guides in this section go deeper than the API.
They cover how to think about reactivity, so that you can design state that stays correct as your application grows.
These ideas are not unique to Ember.
The broader JavaScript ecosystem calls them _signals_, and most modern frameworks are built on the same foundations.
Learning them will help you reason about UI state in any framework.

## The Three Layers of Reactive State

Every reactive application is built from three layers:

- _Root state_ is the values that change directly, because a user clicked something, a server responded, or time passed.
  In Ember, root state is what you mark with `@tracked` or store in a tracked collection such as `trackedArray`.
- _Derived state_ is the values computed from root state, or from other derived state.
  When you change a piece of root state, you do not tell the derived values to update. They update on their own.
  In Ember, derived state is ordinary getters, functions, and template expressions.
- _Outputs_ are where your data meets the outside world: the rendered DOM, the document title, a chart drawn on a canvas.
  In Ember, the primary output is your templates.
  The renderer watches everything your templates read, and updates the DOM when any of it changes.

Data flows in one direction: root state at the bottom, derivations stacked on top, outputs at the edge.
Events from the outside world, such as clicks, responses, and timers, write to root state.
Everything above stays consistent on its own.

Here is what all three layers look like in a single component:

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
    // Events write to root state; everything else updates on its own
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
That ratio is typical of well-designed reactive code, and it points at the most important habit in these guides.
Derive most of your state.
Keep only the irreducible minimum as root state.
The [Root State](./root-state/) and [Derived State](./derived-state/) guides develop this idea in detail.

## The Two Fundamental Operations

Underneath every reactive system, autotracking included, are two operations.
When a value is read while something reactive is being computed, the system records that the computation used that value.
A template rendering and a cached getter evaluating are both examples of such a computation.
This is called _consuming_.
When a value is written, the system marks every computation that consumed it as out of date.
This is called _invalidating_, or _dirtying_.

When Ember renders `{{this.total}}` in the component above, it evaluates `total`, which reads `subtotal` and `tax`, which read `items`.
Because `items` is a tracked collection, those reads are consumed.
Later, when `addItem` pushes into `this.items`, the write invalidates the rendered output.
Ember then schedules a rerender of only the parts of the DOM that consumed it.

Two properties of this design come up again and again.

First, dependencies are discovered at runtime, every time.
You never declare what a getter depends on.
The system records what it reads during each evaluation.
This means even conditional dependencies work:

```js
get displayName() {
  return this.useNickname ? this.nickname : this.fullName;
}
```

While `useNickname` is `false`, changes to `nickname` do not invalidate anything, because `displayName` never read it.
If `useNickname` becomes `true`, the next evaluation reads `nickname`, and from then on changes to it propagate.
The dependency graph rewires itself on every run.

Second, tracking is synchronous.
The system can only observe reads that happen while a reactive computation is running.
If you read tracked state in a callback that runs later, after an `await` or inside a `setTimeout`, that read happens outside any tracking context.
Nothing is consumed.
This is rarely a problem in practice, since templates, getters, and helpers are all synchronous.
It does explain a whole class of "why did this not update?" bugs.
The [Inputs and Outputs](./inputs-and-outputs/) guide covers this boundary in detail.

## Pull, Not Push

There are two ways a reactive system can respond to a write:

- A _push_-based system eagerly re-runs every affected computation the moment a value changes.
- A _pull_-based, or lazy, system marks affected computations as out of date.
  It recomputes them only when someone needs their result.

Autotracking is pull-based.
When you write to a tracked property, no user code runs at all.
Your getters are not re-evaluated, and nothing is recomputed.
The write lets the renderer know that something it consumed is out of date.
Later, asynchronously but before the browser paints, the renderer re-evaluates the expressions in your templates and updates the DOM.

This has practical consequences that are easy to feel but hard to place if you do not know the model:

- Writes are cheap, and they coalesce.
  Setting ten tracked properties in one event handler causes one rerender, not ten, so you do not need to batch updates yourself.
- Unused state is free.
  A derived value that nothing currently reads is never computed, no matter how often its inputs change. Work scales with what is on the page, not with what is in your data.
- Reading state never observes a half-applied update.
  Because derivations run on demand rather than in a notification cascade, there is no window where `tax` has updated but `subtotal` has not.
- There is no "re-run this code when X changes" primitive.
  In a push-based system you might reach for an _effect_ for that. Ember deliberately does not offer one, and the [Inputs and Outputs](./inputs-and-outputs/) guide explains why, and what to do instead.

## Where to Go from Here

The rest of this section works through each layer of the model:

- [Root State](./root-state/) covers what belongs in root state, what does not, and how to design it.
- [Derived State](./derived-state/) covers laziness, purity, caching, composition, and deferring consumption.
- [Inputs and Outputs](./inputs-and-outputs/) covers inputs, outputs, side effects, async, and the edges of the graph.

For the mechanics of `@tracked` itself, such as updating, custom classes, arrays and objects, and `@cached`, see [Autotracking In-Depth](../autotracking-in-depth/).
