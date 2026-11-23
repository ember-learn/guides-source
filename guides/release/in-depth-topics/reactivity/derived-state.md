Derived state is everything that is computed from [root state](../root-state/).
In a healthy Ember application, nearly all of your state is derived.
Derived state needs no special API.
Any getter, function, or template expression that reads tracked state is derived state, and it stays up to date on its own.

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

These are native JavaScript [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get), with nothing from Ember on them.

`summary` reads `hasQuery` and `visibleResults`, and those read root state.
So any `{{ }}` in a template that reads `summary` _consumes_ `query` and `results`, and updates when they change.
You will also see this called _becoming entangled with_ them.

## Derivations Are Lazy

A change to root state does not run your getters.
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

search.normalizedQuery; // logs "computing!" once
```

This is pull-based reactivity, described in [Thinking in Reactivity](../).
A getter that nothing reads costs nothing, no matter how often its inputs change.
Ten getters that read the same tracked property do not make a write to that property slower.

This also means that you cannot rely on when a getter runs, or on whether it runs at all.
A derivation can run once, many times, or never.
If you want to "run this code when X changes", derived state is the wrong tool.
See [Inputs and Outputs](../inputs-and-outputs/).

## Derivations Must Be Pure

A derivation computes a value from its inputs.
It must not change anything, and it must not write to tracked state.
Ember enforces part of this rule.
In development, a write to a tracked value that was already read during the current render throws an error:

```text
Error: You attempted to update `count` on `Counter`, but it had already been
used previously in the same computation.
```

This error is called the _backtracking assertion_.
The renderer evaluates your template from top to bottom, and a write partway through invalidates output that it already produced.
If you get this error, change the code so that it does not need the write:

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

Pure derivations are also easy to test.
Call `new Search()`, set some properties, and assert on the getters.

## Caching

By default, a getter recomputes every time it is read.
Most derivations are cheap, and a cache can cost more than the computation.
For example, it is faster to read `this.items.length` again than to check whether a cached copy is still valid.

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

A `@cached` getter remembers its result, along with the root state that it consumed to compute that result.
Reads return the cached value until some of that root state is invalidated.

`@cached` does not compare the new result to the old one.
If `transactions` is invalidated but the sorted output is identical, downstream consumers are still re-evaluated.
To prevent this, give the root state an equality check. See [Writes, Equality, and Dirtying](../root-state/#toc_writes-equality-and-dirtying).

There are two more reasons to use `@cached`:

- An uncached getter that returns a new array or object on every read breaks `===` checks further down.
  Child components get "new" values that have the same content as the old ones.
  A cached getter returns the same object until its inputs change.
- Some derivations must run at most once per change, for example because they allocate a lot or because they log.

See [Autotracking In-Depth](../../autotracking-in-depth/#toc_caching-of-tracked-properties) for a step-by-step illustration of the caching behavior.

## Composition

Derivations are getters and functions, so one derivation can use another.
Prefer many small derivations to one large one:

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

You can read, test, and reuse each step on its own.

When several components need the same derived state, put the root state and its derivations together in a class or a [service](../../../services/).
The components then read the getters.
The `Cart` example in [Root State](../root-state/#toc_keep-root-state-private) shows such a class.

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

`initials` does not read tracked state itself.
It is still re-evaluated for a person when the `name` passed to it is invalidated.
See [Helper Functions](../../../components/helper-functions/) for more.

You can also export a function like this from a module, and share it across your application:

```js {data-filename=app/utils/cart-math.js}
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

When this function runs in a template, a getter, or another function, the read of `items` is consumed by the caller.
Module scope [is a poor home for root state](../root-state/#toc_where-root-state-lives), but a function like this holds no state, so it is safe to share.

## Deferring Consumption

A read of a tracked value consumes it immediately.
Getters and functions both _defer_ that read.
Nothing runs when you define them, only when something asks for the result.
This is the [laziness from earlier](#toc_derivations-are-lazy).

The body of a getter runs when the property is read.
Its tracked reads are consumed by the reader, such as the template or another getter:

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

Sometimes you need to defer a read in a place where you cannot use a getter, such as a constructor argument.
Use a function for this, usually an arrow function.
Nothing is consumed until the function is called.

```js
let name = this.person.name;          // reads (and consumes) immediately
let getName = () => this.person.name; // reads nothing - yet
```

An arrow function keeps `this` and the scope around it.
You can pass one to another object, and each call reads the current value.

This matters most in constructors and field initializers, because they run once, when the object is created.
Any tracked value that they read is a snapshot.
This is the same problem as [copying arguments into root state](../root-state/#toc_do-not-copy-state-that-you-do-not-own).
If you pass functions instead, the values stay current:

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

In the first version, `Filter` only ever sees the items and the query from the time the component was constructed.
In the second version, each read of `filter.results` calls the two functions, which read the current tracked state of the component.

Pass a plain value when the receiver needs a snapshot.
Pass a function when the receiver needs the current value.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You rarely need this technique in templates. Component arguments are already lazy. <code>@items={{this.items}}</code> is not consumed until the child reads <code>this.args.items</code>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Choosing Between Root State and Derived State

When you need a new piece of UI state, try these options in order:

1. Can it be an expression in the template?
   `{{if @isAdmin "superuser"}}` needs no JavaScript at all.
2. Can it be a getter or pure function? This covers nearly everything else.
3. Is it new information that arrives from outside? Only then is it
   [root state](../root-state/).

If an event handler updates several tracked properties to keep them consistent, some of those properties are probably derived state.
Move them into getters, and let the handler write only the value that changed:

```js
// Avoid: the handler maintains derived state by hand
selectPlan = (plan) => {
  this.selectedPlan = plan;
  this.price = plan.monthlyPrice * (this.isAnnual ? 12 : 1);
  this.discount = this.isAnnual ? plan.annualDiscount : 0;
  this.total = this.price - this.discount;
};

// Prefer: the handler writes one value, and getters do the rest
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

In the first version, `total` is only correct if every code path that changes an input also recomputes it.
In the second version, `total` is always correct.
If some other part of the app toggles `isAnnual`, `total` still updates, and that code does not need to know that `total` exists.
