Reactivity is the heart of every modern UI framework: when your data changes, everything computed from that data—including the page itself—updates automatically. You declare _what_ the output should be for any given state, and the system figures out _when_ and _what_ to update.

You have been using Ember's reactivity system—called _autotracking_—since your first `@tracked` property. This section of the guides goes deeper: not just _how_ to use the APIs, but how to _think_ about reactivity, so that you can design state that stays correct as your application grows. The ideas here are not unique to Ember—systems like [Solid](https://www.solidjs.com/), [Starbeam](https://starbeamjs.com/), [Signalium](https://signalium.dev/), and the [TC39 Signals proposal](https://github.com/tc39/proposal-signals) share the same foundations—so learning them will sharpen how you think about UI state in general.

## The Spreadsheet Mental Model

The oldest and best mental model for reactivity is a spreadsheet.

In a spreadsheet, some cells contain plain _values_ that you type in: `A1 = 5`, `A2 = 10`. Other cells contain _formulas_ that reference those values: `A3 = A1 + A2`. When you change `A1`, you don't tell `A3` to update—it just does. And a formula can reference other formulas, building up a whole graph of computation that stays consistent no matter which value you edit.

Every reactive system is this spreadsheet, generalized:

- **Root state** is the cells you type into: the values that change directly, because a user clicked something, a server responded, or time passed. In Ember, root state is what you mark with `@tracked`.
- **Derived state** is the formulas: values computed _from_ root state (or from other derived state). In Ember, derived state is ordinary getters, functions, and template expressions.
- **Outputs** are where the data universe meets the outside world: the rendered DOM, the document title, a chart drawn on a canvas. In Ember, the primary output is your templates—the renderer watches everything your templates read, and updates the DOM when any of it changes.

Data flows in one direction: root state at the bottom, derivations stacked on top, outputs at the edge. Events from the outside world (clicks, responses, timers) write to root state, and the whole graph above stays consistent automatically.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

export default class Cart extends Component {
  // Root state: the values that change directly
  @tracked items = [];

  // Derived state: formulas over root state
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

Notice the proportions: one tracked property, three getters. This is typical of well-designed reactive code, and it's the most important habit this section of the guides hopes to teach: **most of your state should be derived, and only the irreducible minimum should be root state.** The [Root State](./root-state/) and [Derived State](./derived-state/) chapters develop this in detail.

## The Two Fundamental Operations

Underneath every reactive system—autotracking included—are just two operations:

- **Consume**: when a value is _read_ while something reactive is being computed (a template rendering, a cached getter evaluating), the system records "this computation used that value."
- **Invalidate** (or _dirty_): when a value is _written_, the system marks every computation that consumed it as out of date.

That's the whole trick. When Ember renders `{{this.total}}`, it evaluates `total`, which reads `subtotal` and `tax`, which read `items`—and because `items` is tracked, that read is _consumed_. Later, when `addItem` assigns to `this.items`, the write _invalidates_ the rendered output, and Ember schedules a re-render of exactly the parts of the DOM that consumed it.

Two properties of this design are worth internalizing:

**Dependencies are discovered at runtime, every time.** You never declare what a getter depends on; the system records what it _actually reads_ during each evaluation. This means even conditional dependencies just work:

```js
get displayName() {
  return this.useNickname ? this.nickname : this.fullName;
}
```

While `useNickname` is `false`, changes to `nickname` don't invalidate anything—`displayName` never read it. If `useNickname` becomes `true`, the next evaluation reads `nickname`, and from then on changes to it propagate. The dependency graph rewires itself on every run.

**Tracking is synchronous.** The system can only observe reads that happen _during_ a reactive computation. If you read tracked state in a callback that runs later—after an `await`, inside a `setTimeout`—that read happens outside any tracking context, and nothing is consumed. This is rarely a problem in practice (templates, getters, and helpers are all synchronous), but it explains a class of "why didn't this update?" bugs. The [Reactivity and the Outside World](./outside-world/) chapter covers the boundary in detail.

## Pull, Not Push

There are two ways a reactive system can respond to a write:

- A **push**-based system eagerly re-runs every affected computation the moment a value changes.
- A **pull**-based (or _lazy_) system merely marks affected computations as out of date, and recomputes them only when someone actually needs their result.

Autotracking is pull-based. When you write to a tracked property, _no user code runs_. Your getters are not re-evaluated; nothing is recomputed. The write just bumps an internal revision counter and lets the renderer know that something it consumed is out of date. Later—asynchronously, but before the browser paints—the renderer re-evaluates the expressions in your templates and updates the DOM.

This has practical consequences that are easy to feel but hard to place if you don't know the model:

- **Writes are cheap, and they coalesce.** Setting ten tracked properties in one event handler causes one re-render, not ten. You don't need to batch updates yourself.
- **Unused state is free.** A derived value that nothing currently reads is never computed, no matter how often its inputs change. Work scales with what's _on the page_, not with what's _in your data_.
- **Reading state never observes a half-applied update.** Because derivations run on demand rather than in a notification cascade, there is no window where `tax` has updated but `subtotal` hasn't. Your data is always internally consistent.
- **There is no "re-run this code when X changes" primitive.** In a push-based system you might reach for an _effect_ for that. Ember deliberately doesn't offer one; the [Reactivity and the Outside World](./outside-world/) chapter explains why, and what to do instead.

## The Same Ideas, Elsewhere

If you've used other reactive systems—or read about "signals," which is what the broader JavaScript ecosystem calls these ideas—here is how the vocabulary maps:

| Concept       | Ember                         | Solid                  | Starbeam          | Signalium            |
| ------------- | ----------------------------- | ---------------------- | ----------------- | -------------------- |
| Root state    | `@tracked`                    | `createSignal`         | cells, `reactive` | `signal`             |
| Derived state | getters, `@cached`            | functions, `createMemo` | formulas, getters | `reactive` functions |
| Outputs       | templates, modifiers          | JSX, `createEffect`    | renderer, resources | watchers, relays   |

The differences between these systems are mostly at the edges—when computation happens (Solid's effects are eager; Ember and Signalium are lazy) and how outputs are expressed (Solid hands you `createEffect`; Ember and Starbeam route effects through the renderer and lifecycle-managed constructs). The core—consume on read, invalidate on write, derive everything you can—is the same everywhere.

The rest of this section works through each layer of the model:

- [Root State](./root-state/) — what should (and should not) be root state, and how to design it.
- [Derived State](./derived-state/) — formulas: laziness, purity, caching, and composition.
- [Reactivity and the Outside World](./outside-world/) — outputs, side effects, async, and the edges of the graph.

For the mechanics of `@tracked` itself—updating, custom classes, arrays and objects, `@cached`—see [Autotracking In-Depth](../autotracking-in-depth/).
