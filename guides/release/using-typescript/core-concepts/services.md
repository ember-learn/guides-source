**Note:** 🚧 This section is under construction! 🏗️ The content here may undergo significant revision in the months ahead!

Ember [Services][services] are global singleton classes that can be made available to different parts of an Ember application via dependency injection. Due to their global, shared nature, writing services in TypeScript gives you a build-time-enforcable API for some of the most central parts of your application.

[services]: ../../../services/

### A basic service

Let's take this example from the [Ember Guide](../../services/#toc_defining-services):

```typescript {data-filename="app/services/shopping-cart.ts"}
import Service from '@ember/service';
import { TrackedSet } from 'tracked-built-ins';

export default class ShoppingCartService extends Service {
  items = new TrackedSet();

  add(item) {
    this.items.add(item);
  }

  remove(item) {
    this.items.remove(item);
  }

  empty() {
    this.items.clear();
  }
}
```

Just making this a TypeScript file gives us some type safety without having to add any additional type information. We'll see this when we use the service elsewhere in the application.

### Using services

You can use a service in any container-resolved object such as a component or another service. Services are injected into these objects by decorating a property with the `service` decorator. Because legacy decorators can't affect the type of the property they decorate, we must manually type the property. Also, we must use the `declare` modifier to tell the TypeScript compiler to trust that this property will be set up by something outside this component—namely, the decorator.

Here's an example using the `ShoppingCartService` we defined above in a component:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

import ShoppingCartService from 'my-app/services/shopping-cart';

export default class CartContentsComponent extends Component {
  @service declare shoppingCart: ShoppingCartService;

  @action
  remove(item) {
    this.shoppingCart.remove(item);
  }
}
```

Any attempt to access a property or method not defined on the service will fail type-checking:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

import ShoppingCartService from 'my-app/services/shopping-cart';

export default class CartContentsComponent extends Component {
  @service declare shoppingCart: ShoppingCartService;

  @action
  remove(item) {
    // Error: Property 'saveForLater' does not exist on type 'ShoppingCartService'.
    this.shoppingCart.saveForLater(item);
  }
}
```

Services can also be loaded from the dependency injection container manually:

```typescript {data-filename="app/components/cart-contents.ts"}
import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import { action } from '@ember/object';

import ShoppingCartService from 'my-app/services/shopping-cart';

export default class CartContentsComponent extends Component {
  get cart() {
    return getOwner(this)?.lookup(
      'service:shopping-cart'
    ) as ShoppingCartService;
  }

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

Here we need to [cast] the lookup result to `ShoppingCartService` in order to get any type-safety because the lookup return type is `any` (see caution below).

[cast]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        This type-cast provides no guarantees that what is returned by the lookup is actually the service you are expecting. Because the Ember TypeScript types do not resolve the lookup micro-syntax (<code>'service:&lt;name&gt;'</code>) to the service class, a typo would result in returning something other than the specified type. It only guarantees that <i>if</i> the expected service is returned that you are using it correctly.
        </p>
        <p>
        There is a merged (but not yet implemented) <a href="https://emberjs.github.io/rfcs/0585-improved-ember-registry-apis.html">RFC</a> which improves this design and makes it straightforward to type-check.
        </p>
        <p>
        For now, however, remember that <i>the cast is unsafe</i>!
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
