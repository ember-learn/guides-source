A [`Service`](https://api.emberjs.com/ember/release/classes/Service) is an Ember object that lives for the duration of the application, and can be made available in different parts of your application.

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

Services must extend the [`Service`](https://api.emberjs.com/ember/release/classes/Service) base class:

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

### Accessing services from native classes

If you want to access a service from a plain JavaScript class, you'll need to get a reference to the "[owner](https://api.emberjs.com/ember/release/modules/@ember%2Fowner)" object, which is responsible for managing services.

First, we can define a class that accesses services as described above:

```javascript {data-filename=app/components/cart-content/vanilla-class.js}
import { service } from '@ember/service';

export class VanillaClass {
  @service shoppingCart;

  someMethod() {
    // Now you can use the service
    this.shoppingCart.add(/* ... */);
  }
}
```

And then to wire up `VanillaClass` to work with `@service`, you'll need to implement a ceremony:

```javascript {data-filename=app/components/cart-content/index.js}
import { getOwner, setOwner } from '@ember/owner';
import { VanillaClass } from './vanilla-class';

export default class CartContentsComponent extends Component {
  @cached
  get vanillaClass() {
    const instance = new VanillaClass();

    setOwner(instance, getOwner(this));

    return instance;
  }
}
```

In reality, this could be any framework-construct: a service, route, controller, etc -- in this case we use a component, but this could also be done in another vanilla class that's already be wired up.
The pattern here is to use a [`@cached`](https://api.emberjs.com/ember/5.3/functions/@glimmer%2Ftracking/cached) getter to ensure a stable reference to the class, and then using [`setOwner`]( https://api.emberjs.com/ember/5.3/functions/@ember%2Fowner/setOwner) and [`getOwner`](https://api.emberjs.com/ember/5.3/functions/@ember%2Fowner/getOwner), we finish the wiring ceremony needed to make native classes work with services.


<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">

Note that a stable reference in this situation means that when the property is accessed multiple times the same reference is returned. Without the `@cached` decorator, a new `VanillaClass` would be instantiated upon each access of the getter.

      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

The exact way in which the wiring ceremony is done is up to you, but it often depends on what is needed, and community libraries may abstract away all of these if they wish.

#### With arguments

If your native class needs arguments, we can change the above example to instantiate the class like this:

```javascript {data-filename=app/components/cart-content/index.js}
import { setOwner, getOwner } from '@ember/owner';

import { VanillaClass } from './vanilla-class';

export default class CartContentsComponent extends Component {
  @cached
  get vanillaClass() {
    const instance = new VanillaClass(this.args.foo);

    setOwner(instance, getOwner(this));

    return instance;
  }
}
```

Back in the `VanillaClass` itself, you must store the value somewhere, via the constructor:

```javascript {data-filename=app/components/cart-content/vanilla-class.js}
import { getOwner } from '@ember/owner';
import { service } from '@ember/service';

export class VanillaClass {
  @service shoppingCart;

  constructor(foo) {
    this.foo = foo;
  }

  /* ... */
}
```

In this situation, when the component's `@foo` argument changes (accessed in JavaScript via `this.args.foo`), a new `VanillaClass` will be instantiated and wired up if it was accessed.

#### Reactive arguments

Sometimes you'll want `@tracked` state to retain its reactivity when passing to a native class, so for that you'll need to use an anonymous arrow function.


```javascript {data-filename=app/components/cart-content/index.js}
import { setOwner, getOwner } from '@ember/owner';

import { VanillaClass } from './vanilla-class';

export default class CartContentsComponent extends Component {
  @cached
  get vanillaClass() {
    const instance = new VanillaClass(() => this.args.foo);

    setOwner(instance, getOwner(this));

    return instance;
  }
}
```

Back in the `VanillaClass` itself, you must store the value somewhere and possibly provide yourself an easy way to access the value:

```javascript {data-filename=app/components/cart-content/vanilla-class.js}
import { service } from '@ember/service';

export class VanillaClass {
  @service shoppingCart;

  constructor(fooFunction) {
    this.fooFunction = fooFunction;
  }

  get foo() {
    return this.fooFunction();
  }

  /* ... */
}
```

With this technique, the tracked data provided by `this.arg.foo` is lazily evaluated in `VanillaClass`, allowing the `VanillaClass` to participate in lazy evaluation and auto-tracking like every where else you may be used to in an app.

