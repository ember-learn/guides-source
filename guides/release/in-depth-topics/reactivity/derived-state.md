Derived state is everything derived from [root state](../root-state/).
In a healthy Ember application, most and nearly all of your state is derived.
Derived state requires no special API -- any usage of an ordinary getter, an ordinary function, or an ordinary template expression that reads tracked state is derived state.
Derived state stays up to date on its own.

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

The getters are solely native JavaScript, [get](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

Because `summary` reads from `hasQuery` and `visibleResults`, and because those eventually access root state, any `{{ }}` regions in the template that access summary will _become entangled with_ or _consume_ `query` and `results`, and updates will happen automatically.

## Derivations Are Lazy

The most important fact about derived state in Ember is that changing root state does not run your getters.
A write to `@tracked` state only marks the things that consumed it as out of date.
The getter runs again when something reads it, and only then.
If nothing reads it, it never runs.

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

search.normalizedQuery; // logs "computing!" - exactly once
```

This is pull-based reactivity, described in [Thinking in Reactivity](../).
It is why you can be generous with derived state.
A getter that nothing currently displays costs nothing, no matter how often its inputs change.
Ten getters that read the same tracked property add no overhead to writes.
Work happens at read time, driven by what the page needs.

One consequence is that you cannot rely on when, or whether, a getter runs.
A derivation can run once, many times, or never.
It can run later than you expect, or more often than you expect.
If you want to "run this code when X changes," you are looking for something other than derived state.
See [Inputs and Outputs](../inputs-and-outputs/).

## Derivations Must Be Pure

The job of a derivation is to compute a value from its inputs.
It must not change anything, and above all, it must not write to tracked state.
This rule is universal across reactive systems, and Ember enforces it.
A write to a tracked value that was already read during the current render throws a development-mode error:

```text
Error: You attempted to update `count`, but it had already been used
previously in the same computation.
```

This error is the _backtracking assertion_.
Render evaluates your derivations top to bottom, and a write partway through would invalidate output that was already produced.
When you hit it, restructure the code so that the write is not needed:

```js
// Avoid: a "derivation" that pushes its result somewhere else
get filteredItems() {
  let filtered = this.items.filter((item) => item.matches(this.query));
  this.resultCount = filtered.length; // write inside a read!
  return filtered;
}

// Prefer: derive both values independently
get filteredItems() {
  return this.items.filter((item) => item.matches(this.query));
}

get resultCount() {
  return this.filteredItems.length;
}
```

Purity is also what makes derived state easy to test.
Call `new Search()`, set some properties, and assert on some getters.

## Caching

By default, a getter recomputes every time it is read.
Most derivations are cheap and a cache can cost more than re-deriving.
for example, recomputing a `this.items.length` is faster than checking whether a cached copy is still valid.

When a derivation is expensive, such as sorting thousands of rows or building the dataset for a chart, mark it with `@cached`:

```js
import { cached, tracked } from '@glimmer/tracking';

class Report {
  @tracked transactions = [];

  @cached
  get sortedByAmount() {
    return this.transactions.toSorted((a, b) => b.amount - a.amount);
  }
}
```

A `@cached` getter remembers its result along with all roots of state it consumed while computing it.
Reads return the cached value until one of those consumed roots of states is invalidated.

Note what `@cached` does not do.
It does not compare the new result to the old one.
If `transactions` is invalidated but the sorted output comes out identical, consumers downstream are still re-evaluated. To prevent this, the roots of state should be configured for value equality (see [`@tracked`](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/tracked/). 

Beyond raw cost, there are two more good reasons to reach for `@cached`:

- Stable identity: an uncached getter that returns a fresh array or object on every read can defeat downstream `===` checks. Child components then see "new" values that are deep-equal to the old ones. Caching makes the derivation return the same object until its inputs change.
- Once-per-change semantics. If a derivation must observably run at most once per change, because it allocates, logs, or is very hot, `@cached` guarantees that.

See [Autotracking In-Depth](../../autotracking-in-depth/#toc_caching-of-tracked-properties) for a step-by-step illustration of the caching behavior.

## Composition: Build Big Derivations from Small Ones

Derivations are getters and functions, so they compose the way all JavaScript composes.
The dependency graph follows along.
Prefer many small derivations over one large one:

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

Each step is independently readable, testable, and reusable.
Invalidation stays precise, because each layer only consumes what it reads.

For derived state that several components need, the same composition rule applies one level up.
Put the root state and its derivations together in a class or a [service](../../../services/), and let components consume the finished getters.
The `Cart` example in [Root State](../root-state/#toc_keep-root-state-private-expose-meaning) shows the class form.

## Derivations Outside of Classes

Derivations do not have to live on classes.
A plain function that reads tracked state is a derivation too.
In template tag files, you can use one directly as a helper:

```gjs {data-filename=app/components/roster.gjs}
import Component from '@glimmer/component';

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

`initials` does not read tracked state itself, but it participates in the graph all the same.
It is re-evaluated for a person whenever the `name` passed to it is invalidated.
Pure functions like this are parameterized derivations, and they are the most reusable form of derived state.
See [Helper Functions](../../../components/helper-functions/) for more.

The same idea scales up to module scope.
A function that takes reactive data as arguments can be shared across your whole application:

```js {data-filename=app/utils/cart-math.js}
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

Wherever this runs during a reactive computation, in a template, a getter, or another function, reading `items` entangles the caller with that data.
The result stays live.
Note the contrast with module-scoped state, which [is a poor home for root state](../root-state/#toc_where-root-state-lives).
A derivation function holds no state of its own, so sharing it at module scope is always safe.

## Deferring Consumption

Reading a tracked value consumes it immediately.
Both of Ember's derivation tools, getters and functions, work by _deferring_ that read.
Nothing runs when they are defined, only when someone asks for the result.
This is the [laziness from earlier](#toc_derivations-are-lazy) seen from the side of the consumer.
Deferring the read is what places consumption in the right tracking context.

You have been deferring with getters all along.
It is the default style when you work with classes.
The body of a getter runs when the property is read.
Its tracked reads are consumed by whoever is reading, such as the template or another getter, at the moment they matter:

```js
class Profile {
  @tracked name = 'zoey';

  // Defining this reads (and consumes) nothing...
  get displayName() {
    return this.name.toUpperCase();
  }
}

let profile = new Profile();

// ...consumption happens here, in the reader's context
profile.displayName;
```

Sometimes you need the same deferral for a value that you hand to someone else, somewhere a getter cannot reach, such as a constructor argument.
That is the job of a plain function, usually an arrow function.
Wrap the read, and nothing is consumed until the function is called.

```js
let name = this.person.name;          // reads (and consumes) immediately
let getName = () => this.person.name; // reads nothing - yet
```

Arrow functions capture `this` and their surrounding scope, which makes them portable derivations.
You can hand one to another object, and every call re-reads the current value from wherever the state lives.

This matters most in constructors and field initializers, because they run once, when an object is created.
Any tracked value they read is captured as a one-time snapshot.
This is the same trap as [copying arguments into root state](../root-state/#toc_root-state-is-not-a-cache-for-someone-elses-truth).
Passing functions instead keeps the connection live:

```js
// Avoid: values are read once, at construction, and go stale
class Filter {
  constructor(items, query) {
    this.items = items;
    this.query = query;
  }

  get results() {
    return this.items.filter((item) => item.matches(this.query));
  }
}

export default class SearchResults extends Component {
  @tracked query = '';

  filter = new Filter(this.args.items, this.query);
}
```

```js
// Prefer: values are read on every use, through the functions
class Filter {
  #getItems;
  #getQuery;

  constructor(getItems, getQuery) {
    this.#getItems = getItems;
    this.#getQuery = getQuery;
  }

  get results() {
    return this.#getItems().filter((item) =>
      item.matches(this.#getQuery())
    );
  }
}

export default class SearchResults extends Component {
  @tracked query = '';

  filter = new Filter(
    () => this.args.items,
    () => this.query
  );
}
```

In the first version, `Filter` sees the items and query from the moment the component was constructed, forever.
In the second, every read of `filter.results` calls the two functions, which read the current tracked state of the component.
Consumption flows through the function call, so `results` stays as live as a getter defined on the component itself.

As a guideline, pass a plain value when the receiver needs a snapshot.
Pass a function when the receiver needs the current value over time.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You rarely need this technique in templates. Component arguments are already lazy. <code>@items={{this.items}}</code> is not consumed until the child reads <code>this.args.items</code>. Deferring with functions is a tool for plain JavaScript, where evaluation is eager.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Thinking in Derivations

When a new piece of UI state shows up, try these options in order:

1. Can it be an expression in the template?
   `{{if @isAdmin "superuser"}}` needs no JavaScript at all.
2. Can it be a getter or pure function? This covers nearly everything else.
3. Is it new information that arrives from outside? Only then is it
   [root state](../root-state/).

Watch for one symptom.
An event handler that updates several tracked properties "to keep them consistent" is almost always storing derivations.
Move the consistency into getters, and let the handler write the one fact that changed:

```js
// Avoid: the handler maintains derived state by hand
selectPlan = (plan) => {
  this.selectedPlan = plan;
  this.price = plan.monthlyPrice * (this.isAnnual ? 12 : 1);
  this.discount = this.isAnnual ? plan.annualDiscount : 0;
  this.total = this.price - this.discount;
};

// Prefer: the handler records one fact; getters do the rest
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

In the first version, `total` is only correct if every code path that touches any input remembers to recompute it.
In the second, `total` cannot be wrong.
Toggling `isAnnual` from a different part of the app updates it, through code that was written without any knowledge of that future feature.
That is the payoff of derived state.
It is why "derive, do not sync" is the central habit of reactive programming.
