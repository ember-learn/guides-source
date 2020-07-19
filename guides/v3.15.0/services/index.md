A [`Service`](https://api.emberjs.com/ember/release/modules/@ember%2Fservice) is an Ember object that lives for the duration of the application, and can be made available in different parts of your application.

Services are useful for features that require shared state or persistent connections. Example uses of services might
include:

* User/session authentication.
* Geolocation.
* WebSockets.
* Server-sent events or notifications.
* Server-backed API calls that may not fit Ember Data.
* Third-party APIs.
* Logging.

### Defining Services

Services can be generated using Ember CLI's `service` generator.
For example, the following command will create the `ShoppingCart` service:

```bash
ember generate service shopping-cart
```

Services must extend the [`Service`](https://api.emberjs.com/ember/release/modules/@ember%2Fservice) base class:

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
}
```

Like any Ember object, a service is initialized and can have properties and methods of its own.
Below, the shopping cart service manages an items array that represents the items currently in the shopping cart.

```javascript {data-filename=app/services/shopping-cart.js}
import { A } from '@ember/array';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = A([]);

  add(item) {
    this.items.pushObject(item);
  }

  remove(item) {
    this.items.removeObject(item);
  }

  empty() {
    this.items.clear();
  }
}
```

### Accessing Services

To access a service,
you can inject it in any container-resolved object such as a component or another service using the `inject` decorator from the `@ember/service` module.
Standard practice is to alias `inject` as `service` to make it more clear that it is performing service injection.
There are two ways to use this decorator.
You can either invoke it with no arguments, or you can pass it the registered name of the service.
When no arguments are passed, the service is loaded based on the name of the decorated property.
You can load the shopping cart service with no arguments like below.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service shoppingCart;
}
```

This injects the shopping cart service into the component and makes it available as the `shoppingCart` property.

Another way to inject a service is to provide the name of the service as an argument to the decorator.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service('shopping-cart') cart;
}
```

This injects the shopping cart service into the component and makes it available as the `cart` property.

Sometimes a service may or may not exist, like when an initializer conditionally registers a service.
Since normal injection will throw an error if the service doesn't exist,
you must look up the service using Ember's [`getOwner`](https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) instead.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  get cart() {
    return getOwner(this).lookup('service:shopping-cart');
  }
}
```

Injected properties are lazy loaded; meaning the service will not be instantiated until the property is explicitly called.

Once loaded, a service will persist until the application exits.

Below we add a remove action to the `cart-contents` component.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CartContentsComponent extends Component {
  @service('shopping-cart') cart;

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

Once injected into a component, a service can also be used in the template.
Note `cart` being used below to get data from the cart.

```handlebars {data-filename=app/templates/components/cart-contents.hbs}
<ul>
  {{#each this.cart.items as |item|}}
    <li>
      {{item.name}}
      <button {{on "click" (fn this.remove item)}}>Remove</button>
    </li>
  {{/each}}
</ul>
```

<!-- eof - needed for pages that end in a code block  -->
