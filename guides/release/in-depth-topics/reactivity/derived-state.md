Derived state is everything computed _from_ [root state](../root-state/). In
a healthy Ember application, this is most of your state - and in Ember, it
requires no special API at all. An
ordinary getter, an ordinary function, an ordinary template expression: if it
reads tracked state, it is derived state, and it stays up to date
automatically.

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

There is no decorator on these getters, no list of dependencies, no
subscription. `summary` depends on `hasQuery` and `visibleResults`, which
depend on `query` and `results` - and the system discovers that graph by
itself, by watching what each computation reads while it runs.

## Derivations Are Lazy

The most important thing to understand about derived state in Ember:
**changing root state does not run your getters.** A write to `@tracked` state
only marks the things that consumed it as out of date. The getter runs again
when - and only when - something actually reads it. If nothing reads it, it
never runs.

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

This is _pull-based_ reactivity, described in
[Thinking in Reactivity](../), and it's why you can be generous with derived
state. A getter that nothing currently displays costs nothing, no matter how
often its inputs change. Ten getters reading the same tracked property add no
overhead to writes. Work happens at read time, driven by what the page
actually needs.

The corollary: **never rely on a getter running for its timing.** A derivation
may run once, many times, or never; it may run later than you expect or more
often than you expect. If you find yourself wanting "run this code _when_ X
changes," you are looking for something other than derived state - see
[Reactivity and the Outside World](../outside-world/).

## Derivations Must Be Pure

A derivation's job is to compute a value from its inputs. It must not _change_
anything - and above all, it must not write to tracked state. This rule is
universal across reactive systems (Solid's documentation gives the same
warning about memos), and Ember enforces it: writing to a tracked value that
has already been read during the current render throws a development-mode
error:

```text
Error: You attempted to update `count`, but it had already been used
previously in the same computation.
```

This is sometimes called the _backtracking assertion_: render evaluates your
derivations top to bottom, and a write partway through would invalidate output
that was already produced. The fix is never to find a sneakier place for the
write; it's to restructure so the write isn't needed:

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

Purity is also what makes derived state effortless to test: `new Search()`,
set some properties, assert on some getters. No rendering, no waiting, no
framework.

## Caching

By default, a getter recomputes every time it is read. This surprises people
coming from systems whose derivations are memoized by default, like Solid's
`createMemo` and Signalium's `reactive` functions - but it's the right
default, because most derivations are cheap and a cache has its own costs.
Recomputing `this.items.length` is faster than checking whether a cached copy
is still valid.

When a derivation _is_ genuinely expensive - sorting thousands of rows,
building a chart's dataset - mark it with `@cached`:

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

A `@cached` getter remembers its result along with everything it consumed
while computing it. Reads return the cached value until one of those consumed
inputs is invalidated; then the next read recomputes.

Note what `@cached` does _not_ do: it doesn't compare the new result to the
old one. If `transactions` is invalidated but the sorted output happens to
come out identical, consumers downstream are still re-evaluated. Some systems
(Solid's memos, Signalium) add an equality cutoff here; Ember today does not.

Beyond raw cost, there are two more good reasons to reach for `@cached`:

- **Stable identity.** An uncached getter that returns a fresh array or object
  on every read can defeat downstream `===` checks and cause child components
  to see "new" values that are deep-equal to the old ones. Caching makes the
  derivation return the _same_ object until its inputs actually change.
- **Once-per-change semantics.** If a derivation must observably run at most
  once per change (because it allocates, logs, or is just very hot), `@cached`
  guarantees that.

See [Autotracking In-Depth](../../autotracking-in-depth/#toc_caching-of-tracked-properties)
for a step-by-step illustration of the caching behavior.

## Composition: Build Big Derivations from Small Ones

Because derivations are just getters and functions, they compose the way all
JavaScript composes - and the dependency graph follows along. Prefer many
small derivations over one large one:

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

Each step is independently readable, testable, and reusable - and invalidation
stays precise, because each layer only consumes what it actually reads.

For derived state that several components need, the same composition rule
applies one level up: put the root state _and_ its derivations together in a
class (as in the `Cart` example in
[Root State](../root-state/#toc_keep-root-state-private-expose-meaning)) or a
[service](../../../services/), and let components consume the finished
getters.

## Derivations Outside of Classes

Derivations don't have to live on classes. A plain function that reads tracked
state is a derivation too, and in template tag files you can use one directly
as a helper:

```gjs {data-filename=app/components/roster.gjs}
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

`initials` doesn't read tracked state itself, but it participates in the graph
all the same: it's re-evaluated for a person whenever the `name` passed to it
is invalidated. Pure functions like this - parameterized derivations - are the
most reusable form of derived state. See
[Helper Functions](../../../components/helper-functions/) for more.

The same idea scales up to module scope. A function that takes reactive data
as arguments can be shared across your whole application:

```js {data-filename=app/utils/cart-math.js}
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

Wherever this runs during a reactive computation - a template, a getter,
another function - reading `items` entangles the caller with that data, and
the result stays live. Note the contrast with module-scoped _state_, which
[should generally be avoided](../root-state/#toc_where-root-state-lives): a
derivation function holds no state of its own, so sharing it at module scope
is always safe.

## Deferring Consumption

Reading a tracked value consumes it _right now_. Both of Ember's derivation
tools - getters and functions - work by _deferring_ that read: nothing runs
when they're defined, only when someone asks for the result.

You've been deferring with getters all along; it's the default style when
working with classes. A getter's body runs when the property is read, so its
tracked reads are consumed by whoever is reading - the template, another
getter - at exactly the moment they matter:

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

Sometimes you need the same deferral for a value you're handing to someone
else, somewhere a getter can't reach - like a constructor argument. That's
the job of a plain function, usually an arrow function: wrap the read, and
nothing is consumed until the function is called.

```js
let name = this.person.name;          // reads (and consumes) immediately
let getName = () => this.person.name; // reads nothing - yet
```

Arrow functions capture `this` and their surrounding scope, which makes them
_portable_ derivations: you can hand one to another object, and every call
re-reads the current value from wherever the state actually lives.

This matters most in constructors and field initializers, because they run
exactly once, when an object is created. Any tracked value they read is
captured as a one-time snapshot - the same trap as
[copying arguments into root state](../root-state/#toc_root-state-is-not-a-cache-for-someone-elses-truth).
Passing functions instead keeps the connection live:

```js
// 🛑 Don't: values are read once, at construction, and go stale
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
  filter = new Filter(this.args.items, this.query);
}
```

```js
// ✅ Do: values are read on every use, through the functions
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
  filter = new Filter(
    () => this.args.items,
    () => this.query
  );
}
```

In the first version, `Filter` sees the items and query from the moment the
component was constructed, forever. In the second, every read of
`filter.results` calls the two functions, which read the component's _current_
tracked state. Consumption flows through the function call, so `results` stays
just as live as a getter defined on the component itself.

The guideline: pass a plain value when the receiver should see a snapshot;
pass a function when the receiver should keep seeing the current value over
time.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You rarely need this technique in templates. Component arguments are already lazy: <code>@items={{this.items}}</code> isn't consumed until the child actually reads <code>this.args.items</code>. Deferring with functions is a tool for plain JavaScript, where evaluation is eager.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Thinking in Derivations

When a new piece of UI state shows up, try these options in order:

1. **Can it be an expression in the template?**
   `{{if @isAdmin "superuser"}}` needs no JavaScript at all.
2. **Can it be a getter or pure function?** This covers nearly everything
   else.
3. **Is it genuinely new information that arrives from outside?** Only then is
   it [root state](../root-state/).

A symptom worth watching for: an event handler that updates several tracked
properties "to keep them consistent" is almost always storing derivations.
Move the consistency into getters, and let the handler write the one fact that
actually changed:

```js
// 🛑 Don't: the handler maintains derived state by hand
selectPlan = (plan) => {
  this.selectedPlan = plan;
  this.price = plan.monthlyPrice * (this.isAnnual ? 12 : 1);
  this.discount = this.isAnnual ? plan.annualDiscount : 0;
  this.total = this.price - this.discount;
};

// ✅ Do: the handler records one fact; getters do the rest
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

In the first version, `total` is only correct if every code path that touches
any input remembers to recompute it. In the second, `total` _cannot_ be wrong.
Toggling `isAnnual` from a completely different part of the app updates it
automatically, through code that was written without any knowledge of that
future feature. That's the payoff of derived state, and it's why "derive,
don't sync" is the central habit of reactive programming.
