Some state must outlive any single component.
The signed-in user, the contents of a shopping cart, and an open WebSocket connection are examples.
Every component that shows or changes this state needs the same instance.

The application instance, called the owner, has the longest lifetime in an Ember application.
State tied to the owner is created once, shared everywhere, and destroyed when the application is destroyed.
In tests, that happens at the end of every test.

Ember gives you two ways to tie state to the owner: a plain class, described on this page, and a [Service](../services/).
Prefer the plain class because plain classes will participate in the import graph and naturally fit in to automatic bundle splitting (unlike services).
Use a Service only for the small, minimally required, set of state that the application needs to boot.

## One Instance Per Owner

The pattern is a `WeakMap` keyed on the owner.
The first call for a given class creates the instance, gives it the owner, and links its lifetime to the owner.
Every later call returns that same instance.

```javascript {data-filename=app/utils/singleton.js}
import { associateDestroyableChild } from '@ember/destroyable';
import { getOwner, setOwner } from '@ember/owner';

const instances = new WeakMap();

export function singleton(context, Class) {
  let owner = getOwner(context) ?? context;
  let cache = instances.get(owner);

  if (!cache) {
    cache = new Map();
    instances.set(owner, cache);
  }

  let instance = cache.get(Class);

  if (!instance) {
    instance = new Class(owner);
    setOwner(instance, owner);
    associateDestroyableChild(owner, instance);
    cache.set(Class, instance);
  }

  return instance;
}
```

The first argument is any object that has an owner, or the owner itself.
Because the outer key is the owner, two applications on the same page never share an instance.
For the same reason, a test never sees state from an earlier test.
Because the `WeakMap` holds the owner weakly, the cache disappears with the application.

## Defining the State

The class is a plain class, the same as in [State in Plain Classes](../state-in-plain-classes/).
The constructor receives the owner, and the class can ignore it.

```javascript {data-filename=app/state/shopping-cart.js}
import { trackedArray } from '@ember/reactive/collections';

export class ShoppingCart {
  items = trackedArray([]);

  add = (item) => {
    this.items.push(item);
  };

  remove = (item) => {
    this.items.splice(this.items.indexOf(item), 1);
  };

  empty = () => {
    this.items.splice(0, this.items.length);
  };
}
```

The file can live anywhere.
There is no naming rule to obey, because nothing looks the class up by name.
Put it next to the feature that owns it.

## Using the State

Any component, route, helper, or Service asks for the instance with the class itself.
A getter keeps creation lazy: nothing is created until the first read.

```gjs {data-filename=app/components/cart-contents.gjs}
import Component from '@glimmer/component';
import { singleton } from 'my-app/utils/singleton';
import { ShoppingCart } from 'my-app/state/shopping-cart';

export default class CartContents extends Component {
  get cart() {
    return singleton(this, ShoppingCart);
  }

  <template>
    <h2>Shopping Cart</h2>
    <ul>
      {{#each this.cart.items as |item|}}
        <li>
          {{item.name}}
          <button type="button" {{on "click" (fn this.cart.remove item)}}>Remove</button>
        </li>
      {{/each}}
    </ul>
  </template>
}
```

A second component asks for the same class and receives the same instance:

```gjs {data-filename=app/components/add-to-cart.gjs}
import Component from '@glimmer/component';
import { singleton } from 'my-app/utils/singleton';
import { ShoppingCart } from 'my-app/state/shopping-cart';

export default class AddToCart extends Component {
  add = () => {
    singleton(this, ShoppingCart).add(this.args.item);
  };

  <template>
    <button type="button" {{on "click" this.add}}>Add to cart</button>
  </template>
}
```

Because the instance has an owner, the class can use the `service` decorator, as shown in [Using Services From the Class](../state-in-plain-classes/#toc_using-services-from-the-class).
Because the instance is linked to the owner, `registerDestructor` inside the class runs when the application is destroyed.

## What You Get

Compared with a Service, a plain class tied to the owner has these properties:

* The import is the lookup. Your editor can jump from `ShoppingCart` to its definition, and a rename tool can rename it.
* The code loads only when a module that imports it loads. A class used on one route is not part of the initial bundle when that route is split out.
* There is no base class. The class is created with `new`, in the application and in a unit test.
* There is no name. Two classes with the same name in different folders do not collide.

There is also no registry.
Nothing outside of your code can find the instance, and nothing can replace the class with a different one.
This is especially useful for libraries where they need shared state, but do not want to expose that state to their consumers.

## Testing

In a unit test, create the class with `new`, or ask for the shared instance with `this.owner`.

```javascript {data-filename=tests/unit/state/shopping-cart-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app/tests/helpers';
import { singleton } from 'my-app/utils/singleton';
import { ShoppingCart } from 'my-app/state/shopping-cart';

module('Unit | State | ShoppingCart', function (hooks) {
  setupTest(hooks);

  test('add puts an item in the cart', function (assert) {
    let cart = singleton(this.owner, ShoppingCart);

    cart.add({ name: 'Apple' });

    assert.strictEqual(cart.items.length, 1);
  });
});
```

In a rendering test, there is nothing to stub.
Ask for the same instance before you render, and put it in the state that the test needs.

```javascript {data-filename=tests/integration/components/cart-contents-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { singleton } from 'my-app/utils/singleton';
import { ShoppingCart } from 'my-app/state/shopping-cart';
import CartContents from 'my-app/components/cart-contents';

module('Integration | Component | cart-contents', function (hooks) {
  setupRenderingTest(hooks);

  test('it lists the items in the cart', async function (assert) {
    singleton(this.owner, ShoppingCart).add({ name: 'Apple' });

    await render(<template><CartContents /></template>);

    assert.dom('li').hasText('Apple');
  });
});
```
