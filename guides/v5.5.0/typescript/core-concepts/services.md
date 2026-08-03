Ember [Services][] are global singleton classes that can be made available to different parts of an Ember application via dependency injection. Due to their global, shared nature, writing services in TypeScript gives you a build-time-enforceable API for some of the most central parts of your application.

## A Basic Service

Let's take this example from elsewhere in the [Ember Guides][example-location]:

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

## Using Services

Ember looks up services with the `@service` decorator at runtime, using the name of the service being injected as the default value—a clever bit of metaprogramming that makes for a nice developer experience. TypeScript cannot do this, because the name of the service to inject isn't available at compile time in the same way.

Since legacy decorators do not have access to enough information to produce an appropriate type by themselves, we need to import and add the type explicitly. Also, we must use the [`declare`][declare] property modifier to tell the TypeScript compiler to trust that this property will be set up by something outside this component—namely, the decorator. (Learn more about using Ember's decorators with TypeScript [here][decorators].) Here's an example using the `ShoppingCartService` we defined above in a component:

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

export default class CartContentsComponent extends Component {
  get cart() {
    return getOwner(this)?.lookup('service:shopping-cart');
  }

  @action
  remove(item) {
    this.cart.remove(item);
  }
}
```

In order for TypeScript to infer the correct type for the `ShoppingCartService` from the call to `Owner.lookup`, we must first [register][registries] the `ShoppingCartService` type with `declare module`:

```typescript {data-filename="app/services/shopping-cart.ts"}
export default class ShoppingCartService extends Service {
  //...
}

declare module '@ember/service' {
  interface Registry {
    'shopping-cart': ShoppingCartService;
  }
}
```

<!-- Internal links -->

[example-location]: ../../../services/#toc_defining-services
[decorators]: ../../additional-resources/gotchas/#toc_decorators
[registries]: ../../additional-resources/gotchas/#toc_registries
[services]: ../../../services/

<!-- External links -->

[declare]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier
