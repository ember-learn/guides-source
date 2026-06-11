Derived state is the formula layer of the reactive graph: everything computed _from_ [root state](../root-state/). In a healthy Ember application, this is most of your state—and in Ember, it requires no special API at all. An ordinary getter, an ordinary function, an ordinary template expression: if it reads tracked state, it is derived state, and it stays up to date automatically.

```js
import { tracked } from '@glimmer/tracking';

class Search {
  @tracked query = '';
  @tracked results = [];

  get hasQuery() {
    return this.query.length > 0;
  }

  get visibleResults() {
    return this.results.filter((result) => !result.hidden);
  }

  get summary() {
    return this.hasQuery
      ? `${this.visibleResults.length} results for “${this.query}”`
      : 'Type to search';
  }
}
```

There is no decorator on these getters, no list of dependencies, no subscription. `summary` depends on `hasQuery` and `visibleResults`, which depend on `query` and `results`—and the system discovers that graph by itself, by watching what each computation reads while it runs.

## Derivations Are Lazy

The most important thing to understand about derived state in Ember: **changing root state does not run your getters.** A write to `@tracked` state only marks the things that consumed it as out of date. The getter runs again when—and only when—something actually reads it. If nothing reads it, it never runs.

```js
class Search {
  @tracked query = '';

  get normalizedQuery() {
    console.log('computing!');
    return this.query.trim().toLowerCase();
  }
}

let search = new Search();

search.query = 'Hello';
search.query = 'Hello, world';
search.query = 'Hello, world!';
// ...nothing is logged. No computation has happened at all.

search.normalizedQuery; // logs "computing!" — exactly once
```

This is _pull-based_ reactivity (described in [Thinking in Reactivity](../)), and it's why you can be generous with derived state. A getter that nothing currently displays costs nothing, no matter how often its inputs change. Ten getters reading the same tracked property add no overhead to writes. Work happens at read time, driven by what the page actually needs.

The corollary: **never rely on a getter running for its timing.** A derivation may run once, many times, or never; it may run later than you expect or more often than you expect. If you find yourself wanting "run this code _when_ X changes," you are looking for something other than derived state—see [Reactivity and the Outside World](../outside-world/).

## Derivations Must Be Pure

A derivation's job is to compute a value from its inputs. It must not _change_ anything—and above all, it must not write to tracked state. This rule is universal across reactive systems (Solid's documentation gives the same warning about memos), and Ember enforces it: writing to a tracked value that has already been read during the current render throws a development-mode error:

```text
Error: You attempted to update `count`, but it had already been used
previously in the same computation.
```

This is sometimes called the _backtracking assertion_: render evaluates your derivations top to bottom, and a write partway through would invalidate output that was already produced—the reactive equivalent of a spreadsheet formula that edits other cells. The fix is never to find a sneakier place for the write; it's to restructure so the write isn't needed:

```js
// 🛑 Don't: a "derivation" that pushes its result somewhere else
get filteredItems() {
  let filtered = this.items.filter((item) => item.matches(this.query));
  this.resultCount = filtered.length; // write inside a read!
  return filtered;
}

// ✅ Do: derive both values independently
get filteredItems() {
  return this.items.filter((item) => item.matches(this.query));
}

get resultCount() {
  return this.filteredItems.length;
}
```

Purity is also what makes derived state effortless to test: `new Search()`, set some properties, assert on some getters. No rendering, no waiting, no framework.

## Caching

By default, a getter recomputes every time it is read. This surprises people coming from systems whose derivations are memoized by default (Solid's `createMemo`, Signalium's `reactive` functions)—but it's the right default, because most derivations are cheap and a cache has its own costs. Recomputing `this.items.length` is faster than checking whether a cached copy is still valid.

When a derivation _is_ genuinely expensive—sorting thousands of rows, building a chart's dataset—mark it with `@cached`:

```js
import { cached, tracked } from '@glimmer/tracking';

class Report {
  @tracked transactions = [];

  @cached
  get sortedByAmount() {
    return [...this.transactions].sort((a, b) => b.amount - a.amount);
  }
}
```

A `@cached` getter remembers its result along with everything it consumed while computing it. Reads return the cached value until one of those consumed inputs is invalidated; then the next read recomputes. (Note what `@cached` does _not_ do: it doesn't compare the new result to the old one. If `transactions` is invalidated but the sorted output happens to come out identical, consumers downstream are still re-evaluated. Some systems—Solid's memos, Signalium—add an equality cutoff here; Ember today does not.)

Two more good reasons to reach for `@cached`, beyond raw cost:

- **Stable identity.** An uncached getter that returns a fresh array or object on every read can defeat downstream `===` checks and cause child components to see "new" values that are deep-equal to the old ones. Caching makes the derivation return the _same_ object until its inputs actually change.
- **Once-per-change semantics.** If a derivation must observably run at most once per change (because it allocates, logs, or is just very hot), `@cached` guarantees that.

See [Autotracking In-Depth](../../autotracking-in-depth/#toc_caching-of-tracked-properties) for a step-by-step illustration of the caching behavior.

## Composition: Build Big Formulas from Small Ones

Because derivations are just getters and functions, they compose the way all JavaScript composes—and the dependency graph follows along. Prefer many small derivations over one large one:

```js
get activeUsers() {
  return this.users.filter((user) => user.isActive);
}

get activeAdmins() {
  return this.activeUsers.filter((user) => user.isAdmin);
}

get headline() {
  return `${this.activeAdmins.length} admins online`;
}
```

Each step is independently readable, testable, and reusable—and invalidation stays precise, because each layer only consumes what it actually reads.

Derivations don't have to live on classes, either. A plain function that reads tracked state is a derivation too, and in template tag files you can use one directly as a helper:

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('');
}

export default class Roster extends Component {
  <template>
    {{#each @people as |person|}}
      <span class="avatar">{{initials person.name}}</span>
    {{/each}}
  </template>
}
```

`initials` doesn't read tracked state itself, but it participates in the graph all the same: it's re-evaluated for a person whenever the `name` passed to it is invalidated. Pure functions like this—parameterized derivations—are the most reusable form of derived state. See [Helper Functions](../../../components/helper-functions/) for more.

For derived state that several components need, the same composition rule applies one level up: put the root state _and_ its derivations together in a class (as in the `Cart` example in [Root State](../root-state/#toc_keep-root-state-private-expose-meaning)) or a [service](../../../services/), and let components consume the finished getters.

## Thinking in Derivations

When a new piece of UI state shows up, the order to try is:

1. **Can it be an expression in the template?** `{{if @isAdmin "superuser"}}` needs no JavaScript at all.
2. **Can it be a getter or pure function?** This covers nearly everything else.
3. **Is it genuinely new information that arrives from outside?** Only then is it [root state](../root-state/).

A symptom worth watching for: an event handler that updates several tracked properties "to keep them consistent" is almost always storing derivations. Move the consistency into getters, and let the handler write the one fact that actually changed:

```js
// 🛑 Don't: the handler maintains derived state by hand
selectPlan = (plan) => {
  this.selectedPlan = plan;
  this.price = plan.monthlyPrice * (this.isAnnual ? 12 : 1);
  this.discount = this.isAnnual ? plan.annualDiscount : 0;
  this.total = this.price - this.discount;
};

// ✅ Do: the handler records one fact; formulas do the rest
selectPlan = (plan) => {
  this.selectedPlan = plan;
};

get price() {
  return this.selectedPlan.monthlyPrice * (this.isAnnual ? 12 : 1);
}

get discount() {
  return this.isAnnual ? this.selectedPlan.annualDiscount : 0;
}

get total() {
  return this.price - this.discount;
}
```

In the first version, `total` is only correct if every code path that touches any input remembers to recompute it. In the second, `total` _cannot_ be wrong—toggling `isAnnual` from a completely different part of the app updates it automatically, through code that was written without any knowledge of that future feature. That's the payoff of the formula layer, and it's why "derive, don't sync" is the central habit of reactive programming.
