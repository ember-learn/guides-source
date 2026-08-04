Reactivity is at the heart of every modern UI framework: when your data
changes, everything computed from that data - including the page itself -
updates automatically. You declare what the output should be for any given
state, and the framework figures out when and what to update.

You have been using Ember's reactivity system, called _autotracking_, since
your first `@tracked` property. The guides in this section go deeper than the
API: they cover how to think about reactivity, so that you can design state
that stays correct as your application grows. These ideas are not unique to
Ember - the broader JavaScript ecosystem calls them _signals_, and most modern
frameworks are built on the same foundations - so learning them will help you
reason about UI state in any framework.

## The Three Layers of Reactive State

Every reactive application is built from three layers:

- _Root state_ is the values that change directly, because a user clicked
  something, a server responded, or time passed. In Ember, root state is what
  you mark with `@tracked` or store in a tracked collection such as
  `trackedArray`.
- _Derived state_ is the values computed from root state, or from other
  derived state. When you change a piece of root state, you don't tell the
  derived values to update - they just do. In Ember, derived state is
  ordinary getters, functions, and template expressions.
- _Outputs_ are where your data meets the outside world: the rendered DOM,
  the document title, a chart drawn on a canvas. In Ember, the primary output
  is your templates. The renderer watches everything your templates read, and
  updates the DOM when any of it changes.

Data flows in one direction: root state at the bottom, derivations stacked on
top, outputs at the edge. Events from the outside world (clicks, responses,
timers) write to root state, and everything above stays consistent
automatically.

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

Notice that this component has one piece of root state and three getters.
This is typical of well-designed reactive code, and it points at the most
important habit these guides hope to teach: most of your state should be
derived, and only the irreducible minimum should be root state. The
[Root State](./root-state/) and [Derived State](./derived-state/) guides
develop this idea in detail.

## The Two Fundamental Operations

Underneath every reactive system - autotracking included - are just two
operations. When a value is read while something reactive is being computed
(a template rendering, a cached getter evaluating), the system records that
the computation used that value. This is called _consuming_. When a value is
written, the system marks every computation that consumed it as out of date.
This is called _invalidating_, or _dirtying_.

That's the whole trick! When Ember renders `{{this.total}}` in the component
above, it evaluates `total`, which reads `subtotal` and `tax`, which read
`items` - and because `items` is a tracked collection, those reads are
consumed. Later, when `addItem` pushes into `this.items`, the write
invalidates the rendered output, and Ember schedules a rerender of exactly
the parts of the DOM that consumed it.

Two properties of this design come up again and again.

First, dependencies are discovered at runtime, every time. You never declare
what a getter depends on; the system records what it actually reads during
each evaluation. This means even conditional dependencies just work:

```js
get displayName() {
  return this.useNickname ? this.nickname : this.fullName;
}
```

While `useNickname` is `false`, changes to `nickname` don't invalidate
anything, because `displayName` never read it. If `useNickname` becomes
`true`, the next evaluation reads `nickname`, and from then on changes to it
propagate. The dependency graph rewires itself on every run.

Second, tracking is synchronous. The system can only observe reads that
happen while a reactive computation is running. If you read tracked state in
a callback that runs later - after an `await`, or inside a `setTimeout` -
that read happens outside any tracking context, and nothing is consumed. This
is rarely a problem in practice, since templates, getters, and helpers are
all synchronous, but it explains a whole class of "why didn't this update?"
bugs. The [Inputs and Outputs](./inputs-and-outputs/) guide covers
this boundary in detail.

## Pull, Not Push

There are two ways a reactive system can respond to a write:

- A _push_-based system eagerly re-runs every affected computation the moment
  a value changes.
- A _pull_-based (or lazy) system merely marks affected computations as out
  of date, and recomputes them only when someone actually needs their result.

Autotracking is pull-based. When you write to a tracked property, no user
code runs at all. Your getters are not re-evaluated; nothing is recomputed.
The write just lets the renderer know that something it consumed is out of
date. Later - asynchronously, but before the browser paints - the renderer
re-evaluates the expressions in your templates and updates the DOM.

This has practical consequences that are easy to feel but hard to place if
you don't know the model:

- Writes are cheap, and they coalesce. Setting ten tracked properties in one
  event handler causes one rerender, not ten, so you don't need to batch
  updates yourself.
- Unused state is free. A derived value that nothing currently reads is never
  computed, no matter how often its inputs change. Work scales with what's on
  the page, not with what's in your data.
- Reading state never observes a half-applied update. Because derivations run
  on demand rather than in a notification cascade, there is no window where
  `tax` has updated but `subtotal` hasn't.
- There is no "re-run this code when X changes" primitive. In a push-based
  system you might reach for an _effect_ for that. Ember deliberately doesn't
  offer one; the [Inputs and Outputs](./inputs-and-outputs/) guide
  explains why, and what to do instead.

## Where to Go from Here

The rest of this section works through each layer of the model:

- [Root State](./root-state/) - what should (and should not) be root state,
  and how to design it.
- [Derived State](./derived-state/) - laziness, purity, caching, composition,
  and deferring consumption.
- [Inputs and Outputs](./inputs-and-outputs/) - inputs, outputs, side
  effects, async, and the edges of the graph.

For the mechanics of `@tracked` itself - updating, custom classes, arrays and
objects, `@cached` - see [Autotracking In-Depth](../autotracking-in-depth/).
