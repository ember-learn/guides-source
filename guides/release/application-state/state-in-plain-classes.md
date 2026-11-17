A component class holds tracked properties, getters, and actions.
As a feature grows, that class grows with it.
When that happens, you may want to move the state into a plain JavaScript class that the component creates.
The component stays small, and the state can be tested without rendering anything.

A plain class does not extend anything from Ember.
Tracked properties and tracked collections work in any class, as described in [Autotracking In-Depth](../../in-depth-topics/autotracking-in-depth/#toc_tracked-properties-in-custom-classes).

## Defining the Class

This class keeps track of which items in a list are selected:

```javascript {data-filename=app/components/item-list/selection.js}
import { trackedSet } from '@ember/reactive/collections';

export class Selection {
  #items = trackedSet();

  get count() {
    return this.#items.size;
  }

  has = (item) => {
    return this.#items.has(item);
  };

  toggle = (item) => {
    if (this.#items.has(item)) {
      this.#items.delete(item);
    } else {
      this.#items.add(item);
    }
  };

  clear = () => {
    this.#items.clear();
  };
}
```

The methods are arrow functions so that they keep their `this` when a template calls them.

## Creating It With the Component

A class field creates the instance when the component is created.
Each instance of the component gets its own `Selection`.
When the component leaves the page, nothing holds on to the `Selection`, and it is garbage collected.

```gjs {data-filename=app/components/item-list.gjs}
import Component from '@glimmer/component';
import { Selection } from './item-list/selection';

export default class ItemList extends Component {
  selection = new Selection();

  <template>
    <p>{{this.selection.count}} selected</p>

    <ul>
      {{#each @items as |item|}}
        <li>
          <label>
            <input
              type="checkbox"
              checked={{this.selection.has item}}
              {{on "change" (fn this.selection.toggle item)}}
            />
            {{item.name}}
          </label>
        </li>
      {{/each}}
    </ul>

    <button type="button" {{on "click" this.selection.clear}}>Clear</button>
  </template>
}
```

## Passing Arguments

A constructor argument is a snapshot.
If you pass `this.args.items` to the constructor, the class keeps the first array forever, even after the component receives new items.

To give the class a value that stays current, pass a function that returns the value.
The class calls the function when it needs the value, so autotracking sees the read and updates anything that depends on it.

```javascript {data-filename=app/components/item-list/selection.js}
import { trackedSet } from '@ember/reactive/collections';

export class Selection {
  #items = trackedSet();
  #getAll;

  constructor(getAll) {
    this.#getAll = getAll;
  }

  get allSelected() {
    return this.#getAll().every((item) => this.#items.has(item));
  }

  selectAll = () => {
    for (let item of this.#getAll()) {
      this.#items.add(item);
    }
  };

  // ...
}
```

```javascript {data-filename=app/components/item-list.gjs}
export default class ItemList extends Component {
  selection = new Selection(() => this.args.items);

  // ...
}
```

When `@items` changes, `allSelected` recomputes, because it reads the argument through the function.

## Using Services From the Class

The [`service`](https://api.emberjs.com/ember/release/functions/@ember%2Fservice/service) decorator finds services through the object's owner.
A plain class has no owner until you give it one with [`setOwner`](https://api.emberjs.com/ember/release/functions/@ember%2Fowner/setOwner).
Pass the owner into the constructor, and read services only in methods and getters, not in field initializers.

```javascript {data-filename=app/components/item-list/selection.js}
import { trackedSet } from '@ember/reactive/collections';
import { setOwner } from '@ember/owner';
import { service } from '@ember/service';

export class Selection {
  @service notifications;

  #items = trackedSet();
  #getAll;

  constructor(owner, getAll) {
    setOwner(this, owner);
    this.#getAll = getAll;
  }

  clear = () => {
    this.#items.clear();
    this.notifications.show('Selection cleared');
  };

  // ...
}
```

```javascript {data-filename=app/components/item-list.gjs}
import { getOwner } from '@ember/owner';

export default class ItemList extends Component {
  selection = new Selection(getOwner(this), () => this.args.items);

  // ...
}
```

[`getOwner`](https://api.emberjs.com/ember/release/functions/@ember%2Fowner/getOwner) works on any object that Ember created, such as a component, a route, or a Service.
It also works on any plain class that already received an owner.

## Cleaning Up

Some state holds on to something outside of the application: a timer, a WebSocket, or an event listener.
That work must stop when the component leaves the page.

Register the cleanup with [`registerDestructor`](https://api.emberjs.com/ember/release/functions/@ember%2Fdestroyable/registerDestructor) inside the class.
Then link the instance to the component with [`associateDestroyableChild`](https://api.emberjs.com/ember/release/functions/@ember%2Fdestroyable/associateDestroyableChild).
When Ember destroys the component, it destroys the instance, and the destructor runs.

```javascript {data-filename=app/components/stock-ticker/price-feed.js}
import { tracked } from '@glimmer/tracking';
import { registerDestructor } from '@ember/destroyable';

export class PriceFeed {
  @tracked price;

  #socket;

  constructor(symbol) {
    this.#socket = new WebSocket(`wss://prices.example.com/${symbol}`);
    this.#socket.onmessage = (event) => {
      this.price = JSON.parse(event.data).price;
    };

    registerDestructor(this, () => this.#socket.close());
  }
}
```

```gjs {data-filename=app/components/stock-ticker.gjs}
import Component from '@glimmer/component';
import { associateDestroyableChild } from '@ember/destroyable';
import { PriceFeed } from './stock-ticker/price-feed';

export default class StockTicker extends Component {
  feed = associateDestroyableChild(this, new PriceFeed(this.args.symbol));

  <template>
    {{@symbol}}: {{this.feed.price}}
  </template>
}
```

`associateDestroyableChild` returns the child, so you can wrap the constructor call with it.

## Creating It Lazily

A class field creates the instance as soon as the component is created.
To create it on first use instead, put the same code in a getter marked with [`@cached`](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/cached).
The getter runs once, and every later read returns the same instance.

```javascript {data-filename=app/components/item-list.gjs}
import { cached } from '@glimmer/tracking';

export default class ItemList extends Component {
  @cached
  get selection() {
    return new Selection(getOwner(this), () => this.args.items);
  }

  // ...
}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Do not read tracked values inside a <code>@cached</code> getter that creates an instance.
          If the getter reads <code>this.args.items</code> directly, it creates a new instance every time the items change.
          Pass a function instead, as shown above, so that the getter itself reads nothing that is tracked.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Testing

A plain class is tested with `new`, without rendering a component.

```javascript {data-filename=tests/unit/components/item-list/selection-test.js}
import { module, test } from 'qunit';
import { Selection } from 'my-app/components/item-list/selection';

module('Unit | Component | item-list | Selection', function () {
  test('toggle adds and removes an item', function (assert) {
    let apple = { name: 'Apple' };
    let selection = new Selection(() => [apple]);

    selection.toggle(apple);
    assert.true(selection.has(apple));

    selection.toggle(apple);
    assert.false(selection.has(apple));
  });
});
```

If the class needs an owner, use `setupTest` and pass `this.owner` to the constructor, as described in [Testing Basics](../../testing/unit-testing-basics/).
