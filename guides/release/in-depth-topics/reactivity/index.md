Reactivity is at the heart of every modern UI framework: when your data
changes, everything computed from that data - including the page itself -
updates automatically. You declare what the output should be for any given
state, and the framework figures out when and what to update.

You have been using Ember's reactivity system, called _autotracking_, since
your first `@tracked` property. The guides in this section go deeper than the
API: they cover how to _think_ about reactivity, so that you can design state
that stays correct as your application grows. These ideas are not unique to
Ember - systems like [Solid](https://www.solidjs.com/),
[Starbeam](https://starbeamjs.com/), [Signalium](https://signalium.dev/), and
the [TC39 Signals proposal](https://github.com/tc39/proposal-signals) are
built on the same foundations - so learning them will help you reason about UI
state in any framework.

## The Three Layers of Reactive State

Every reactive application is built from three layers:

- **Root state** is the values that change directly, because a user clicked
  something, a server responded, or time passed. In Ember, root state is what
  you mark with `@tracked`.
- **Derived state** is the values computed _from_ root state, or from other
  derived state. When you change a piece of root state, you don't tell the
  derived values to update - they just do. In Ember, derived state is
  ordinary getters, functions, and template expressions.
- **Outputs** are where your data meets the outside world: the rendered DOM,
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
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

export default class Cart extends Component {
  // Root state: the values that change directly
  @tracked items = [];

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
    this.items = [...this.items, item];
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

Notice the proportions in this component: one tracked property, three getters.
This is typical of well-designed reactive code, and it is the most important
habit this section hopes to teach: **most of your state should be derived, and
only the irreducible minimum should be root state.** The
[Root State](./root-state/) and [Derived State](./derived-state/) guides
develop this idea in detail.

## The Two Fundamental Operations

Underneath every reactive system - autotracking included - are just two
operations:

- **Consume**: when a value is _read_ while something reactive is being
  computed (a template rendering, a cached getter evaluating), the system
  records that the computation used that value.
- **Invalidate** (or _dirty_): when a value is _written_, the system marks
  every computation that consumed it as out of date.

That's the whole trick! When Ember renders `{{this.total}}` in the component
above, it evaluates `total`, which reads `subtotal` and `tax`, which read
`items` - and because `items` is tracked, that read is _consumed_. Later, when
`addItem` assigns to `this.items`, the write _invalidates_ the rendered
output, and Ember schedules a rerender of exactly the parts of the DOM that
consumed it.

Two properties of this design are worth internalizing.

First, **dependencies are discovered at runtime, every time.** You never
declare what a getter depends on; the system records what it _actually reads_
during each evaluation. This means even conditional dependencies just work:

```js
get displayName() {
  return this.useNickname ? this.nickname : this.fullName;
}
```

While `useNickname` is `false`, changes to `nickname` don't invalidate
anything, because `displayName` never read it. If `useNickname` becomes
`true`, the next evaluation reads `nickname`, and from then on changes to it
propagate. The dependency graph rewires itself on every run.

Second, **tracking is synchronous.** The system can only observe reads that
happen _while_ a reactive computation is running. If you read tracked state in
a callback that runs later - after an `await`, or inside a `setTimeout` - that
read happens outside any tracking context, and nothing is consumed. This is
rarely a problem in practice, since templates, getters, and helpers are all
synchronous, but it explains a whole class of "why didn't this update?" bugs.
The [Reactivity and the Outside World](./outside-world/) guide covers this
boundary in detail.

## Pull, Not Push

There are two ways a reactive system can respond to a write:

- A **push**-based system eagerly re-runs every affected computation the
  moment a value changes.
- A **pull**-based (or _lazy_) system merely marks affected computations as
  out of date, and recomputes them only when someone actually needs their
  result.

Autotracking is pull-based. When you write to a tracked property, _no user
code runs_. Your getters are not re-evaluated; nothing is recomputed. The
write just lets the renderer know that something it consumed is out of date.
Later - asynchronously, but before the browser paints - the renderer
re-evaluates the expressions in your templates and updates the DOM.

This has practical consequences that are easy to feel but hard to place if you
don't know the model:

- **Writes are cheap, and they coalesce.** Setting ten tracked properties in
  one event handler causes one rerender, not ten. You don't need to batch
  updates yourself.
- **Unused state is free.** A derived value that nothing currently reads is
  never computed, no matter how often its inputs change. Work scales with
  what's on the page, not with what's in your data.
- **Reading state never observes a half-applied update.** Because derivations
  run on demand rather than in a notification cascade, there is no window
  where `tax` has updated but `subtotal` hasn't. Your data is always
  internally consistent.
- **There is no "re-run this code when X changes" primitive.** In a push-based
  system you might reach for an _effect_ for that. Ember deliberately doesn't
  offer one; the [Reactivity and the Outside World](./outside-world/) guide
  explains why, and what to do instead.

## The Same Ideas, Elsewhere

If you've used other reactive systems - or read about "signals," which is what
the broader JavaScript ecosystem calls these ideas - here is how the
vocabulary maps:

| Framework / library | Root state              | Derived state            | Outputs                  |
| ------------------- | ----------------------- | ------------------------ | ------------------------ |
| Ember               | `@tracked`, `tracked()` | getters, `@cached`       | templates (the renderer) |
| Svelte              | `$state`                | `$derived`               | templates, `$effect`     |
| Vue                 | `ref`, `reactive`       | `computed`               | templates, `watch`       |
| Angular             | `signal`                | `computed`               | templates, `effect`      |
| Solid               | `createSignal`          | functions, `createMemo`  | JSX, `createEffect`      |
| Starbeam            | cells, `reactive`       | formulas, getters        | renderer, resources      |
| Signalium           | `signal`                | `reactive` functions     | watchers, relays         |

A note on the comparisons: these tools don't all sit at the same level of
abstraction. Starbeam and Signalium are reactivity libraries rather than full
application frameworks, and Solid - though you can build applications with
it - is significantly lower-level than Ember. It's often described as a
framework for building frameworks, which is why it hands you primitives like
`createEffect` directly, where Ember routes the same job through the renderer
and lifecycle-managed constructs.

The other differences are mostly at the edges: when computation happens
(Solid's effects are eager; Ember and Signalium are lazy), and how outputs are
expressed. The core - consume on read, invalidate on write, derive everything
you can - is the same everywhere.

The rest of this section works through each layer of the model:

- [Root State](./root-state/) - what should (and should not) be root state,
  and how to design it.
- [Derived State](./derived-state/) - laziness, purity, caching, composition,
  and deferring consumption.
- [Reactivity and the Outside World](./outside-world/) - outputs, side
  effects, async, and the edges of the graph.

For the mechanics of `@tracked` itself - updating, custom classes, arrays and
objects, `@cached` - see [Autotracking In-Depth](../autotracking-in-depth/).
