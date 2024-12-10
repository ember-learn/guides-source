A [`Service`](https://api.emberjs.com/ember/5.12.0/classes/Service) is an Ember object that lives for the duration of the application, and can be made available in different parts of your application.

Services are useful for features that require shared state or persistent connections. Example uses of services might
include:

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

Services must extend the [`Service`](https://api.emberjs.com/ember/5.12.0/classes/Service) base class:

```javascript {data-filename=app/services/shopping-cart.js}
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
}
```

Like any Ember object, a service is initialized and can have properties and methods of its own.
Below, the shopping cart service manages an items array that represents the items currently in the shopping cart.

```javascript {data-filename=app/services/shopping-cart.js}
import { TrackedArray } from 'tracked-built-ins';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = new TrackedArray([]);

  add(item) {
    this.items.push(item);
  }

  remove(item) 
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

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service shoppingCart;
}
```

This injects the shopping cart service into the component and makes it available as the `shoppingCart` property.

Another way to inject a service is to provide the name of the service as an argument to the decorator.

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentsComponent extends Component {
  // Will load the service defined in: app/services/shopping-cart.js
  @service('shopping-cart') cart;
}
```

This injects the shopping cart service into the component and makes it available as the `cart` property.

Sometimes a service may or may not exist, like when an initializer conditionally registers a service.
Since normal injection will throw an error if the service doesn't exist,
you must look up the service using Ember's [`getOwner`](https://api.emberjs.com/ember/5.12.0/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) instead.

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
import { service } from '@ember/service';
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

```handlebars {data-filename=app/components/cart-contents.hbs}
<ul>
  {{#each this.cart.items as |item|}}
    <li>
      {{item.name}}
      <button type="button" {{on "click" (fn this.remove item)}}>Remove</button>
    </li>
  {{/each}}
</ul>
```

<!-- eof - needed for pages that end in a code block  -->
