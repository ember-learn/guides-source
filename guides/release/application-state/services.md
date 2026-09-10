A [`Service`](https://api.emberjs.com/ember/release/classes/Service) is application-wide state with a name.
Ember creates one instance the first time something asks for it by that name, and keeps it until the application is destroyed.
Any part of the application can ask for it.

### When to Use a Service

A Service is a global.
Every Service is part of the small set of state that the application needs to run, no matter which route the user is on.
As an application grows, most of its state is not part of that set.
Most state belongs to a [component or to the URL](../../application-state/).
State that many components need is [shared through a plain class](../application-wide-state/) that only the code that imports it can reach.

Use a Service when the state must be found by name:

* The framework provides it, such as the `router` service.
* An addon provides it, or an addon expects your application to provide it under a known name.
* You need to replace it with a different class in tests or in a given environment, through the [registry](../../applications/dependency-injection/).

A Service costs more than a plain class:

* It must extend the `Service` base class. The container creates it, so you cannot create it with `new`.
* It is found by a string, so your editor cannot jump from the injection to the definition.
* It must live in `app/services`. Ember includes every file in that folder in the initial bundle, because any part of the application can ask for any Service by name.

Example uses of services include:

* User/session authentication.
* Geolocation.
* WebSockets.
* Server-sent events or notifications.
* Server-backed API calls that may not fit EmberData.
* Third-party APIs.
* Logging.

### Defining Services

Services can be generated using Ember CLI's `service` generator.
For example, the following command will create the `ShoppingCart` service:

```bash
ember generate service shopping-cart
```

Services must extend the [`Service`](https://api.emberjs.com/ember/release/classes/Service) base class:

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
}
```

Like any Ember object, a service is initialized and can have properties and methods of its own.
Below, the shopping cart service manages an items array that represents the items currently in the shopping cart.

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';
import { trackedArray } from '@ember/reactive/collections';

export default class ShoppingCartService extends Service {
  items = trackedArray([]);

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  empty() {
    this.items.splice(0, this.items.length);
  }
}
```

### Accessing Services

To access a service,
you can inject it into any container-resolved object such as a component or another service using the `service` decorator from the `@ember/service` module.
There are two ways to use this decorator.
You can either invoke it with no arguments, or you can pass it the registered name of the service.
When no arguments are passed, the service is loaded based on the name of the decorated property.
You can load the shopping cart service with no arguments like below.

```gjs {data-filename=app/components/cart-contents.gjs}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service shoppingCart;

  <template>
    <h2>Shopping Cart</h2>
  </template>
}
```

This injects the shopping cart service into the component and makes it available as the `shoppingCart` property.

Another way to inject a service is to provide the name of the service as an argument to the decorator.

```gjs {data-filename=app/components/cart-contents.gjs}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service('shopping-cart') cart;

  <template>
    <h2>Shopping Cart</h2>
  </template>
}
```

This injects the shopping cart service into the component and makes it available as the `cart` property.

Sometimes a service may or may not exist, like when an initializer conditionally registers a service.
Since normal injection will throw an error if the service doesn't exist,
you must look up the service using Ember's [`getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) instead.

```gjs {data-filename=app/components/cart-contents.gjs}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  get cart() {
    return getOwner(this).lookup('service:shopping-cart');
  }

  <template>
    <h2>Shopping Cart</h2>
  </template>
}
```

Injected properties are lazy loaded; meaning the service will not be instantiated until the property is explicitly called.

Once loaded, a service will persist until the application exits.

Once injected into a component, a service can also be used in the template.

Below we add a remove action to the `cart-contents` component.

```gjs {data-filename=app/components/cart-contents.gjs}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  @service('shopping-cart') cart;

  remove = (item) => {
    this.cart.remove(item);
  };

  <template>
    <h2>Shopping Cart</h2>
    <ul>
    {{#each this.cart.items as |item|}}
      <li>
        {{item.name}}
        <button type="button" {{on "click" (fn this.remove item)}}>Remove</button>
      </li>
    {{/each}}
    </ul>
  </template>
}
```

<!-- eof - needed for pages that end in a code block  -->
