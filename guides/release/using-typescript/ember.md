**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

In this section, we cover how to use TypeScript effectively with specific Ember.js APIs.

We do _not_ cover general usage of Ember; instead, we assume that as background knowledge. Please see the [Ember Guides](../..) and [API docs](https://api.emberjs.com)!

If you'd like to make your _own_ component subclass-able, you need to make it generic as well.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        Are you sure you want to provide an inheritance-based API? Oftentimes, it's easier to maintain (and involves less TypeScript hoop-jumping) to use a compositional API instead. If you're sure, here's how!
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

```typescript {data-filename="app/components/fancy-input-args.ts"}
import Component from '@glimmer/component';

export interface FancyInputArgs {
  // ...
}

export default class FancyInput<
  Args extends FancyInputArgs = FancyInputArgs
> extends Component<Args> {
  // ...
}
```

Requiring that `Args extends FancyInputArgs` means that subclasses can have _more_ than these args, but not _fewer_. Specifying that the `Args = FancyInputArgs` means that they _default_ to just being `FancyInputArgs`, so users don't need to supply an explicit generic type parameter here unless they're adding more arguments to the class.

## Services

Ember Services are global singleton classes that can be made available to different parts of an Ember application via dependency injection. Due to their global, shared nature, writing services in TypeScript gives you a build-time-enforcable API for some of the most central parts of your application.

(If you are not familiar with Services in Ember, first make sure you have read and understood the [Ember Guide on Services](../../services/)!)

### A basic service

Let's take this example from the [Ember Guide](../../services/):

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

## Routes

Working with Routes is in general just working normal TypeScript classes. Ember's types supply the definitions for the various lifecycle events available within route subclasses, which will provide autocomplete and type-checking along the way in general.

However, there is one thing to watch out for: the types of the arguments passed to methods will _not_ autocomplete as you may expect. This is because in _general_ a subclass may override a superclass method as long as it calls its superclass's method correctly. This is very bad practice, but it is legal JavaScript! This is never a concern for lifecycle hooks in Ember, because they are called by the framework itself. However, TypeScript does not and cannot know that, so we have to provide the types directly.

Accordingly, we have to provide the types for hooks ourselves:

```typescript {data-filename="app/routes/my.ts"}
import Route from '@ember/routing/route';
import Transition from '@ember/routing/transition';

export default class MyRoute extends Route {
  beforeModel(transition: Transition) {
    // ...
  }
}
```

### Working with route models

We often use routes' models throughout our application, since they’re a core ingredient of our application’s data. As such, we want to make sure that we have good types for them!

We can start by defining some type utilities to let us get the resolved value returned by a route’s model hook:

```typescript {data-filename="app/lib/type-utils.ts"}
import Route from '@ember/routing/route';

/**
  Get the resolved type of an item.

  - If the item is a promise, the result will be the resolved value type
  - If the item is not a promise, the result will just be the type of the item
 */
export type Resolved<P> = P extends Promise<infer T> ? T : P;

/** Get the resolved model value from a route. */
export type ModelFrom<R extends Route> = Resolved<ReturnType<R['model']>>;
```

How that works:

- `Resolved<P>` says "if this is a promise, the type here is whatever the promise resolves to; otherwise, it's just the value"
- [`ReturnType<T>`][return-type] gets the return value of a given function
- `R['model']` (where `R` has to be `Route` itself or a subclass) uses TypeScript's [mapped types] to say "the property named `model` on `R`"

[return-type]: https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
[mapped types]: https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

`ModelFrom<Route>` ends up giving you the resolved value returned from the `model` hook for a given route. We can use this functionality to guarantee that the `model` on a `Controller` is always exactly the type returned by `Route::model` by writing something like this:

```typescript {data-filename="app/controllers/controller-with-model.ts"}
import Controller from '@ember/controller';
import MyRoute from 'my-app/routes/my-route';
import { ModelFrom } from 'my-app/lib/type-utils';

export default class ControllerWithModel extends Controller {
  declare model: ModelFrom<MyRoute>;
}
```

Now, our controller’s `model` property will _always_ stay in sync with the corresponding route’s model hook.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        The <code>ModelFrom</code> type utility <i>only</i> works if you do not mutate the <code>model</code> in either the <code>afterModel</code> or <code>setupController</code> hooks on the route! That's generally considered to be a bad practice anyway.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Controllers

Like routes, controllers are just normal classes with a few special Ember lifecycle hooks and properties available.

The main thing to be aware of is special handling around query params. In order to provide type safety for query param configuration, Ember's types specify that when defining a query param's `type` attribute, you must supply one of the allowed types: `'boolean'`, `'number'`, `'array'`, or `'string'` (the default). However, if you supply these types as you would in JS, like this:

```typescript {data-filename="app/controllers/heyo.ts"}
import Controller from '@ember/controller';

export default class HeyoController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
    },
  ];
}
```

Then you will see a type error like this:

```text
Property 'queryParams' in type 'HeyoController' is not assignable to the same property in base type 'Controller'.
  Type '{ category: { type: string; }; }[]' is not assignable to type '(string | Record<string, string | QueryParamConfig | undefined>)[]'.
    Type '{ category: { type: string; }; }' is not assignable to type 'string | Record<string, string | QueryParamConfig | undefined>'.
      Type '{ category: { type: string; }; }' is not assignable to type 'Record<string, string | QueryParamConfig | undefined>'.
        Property 'category' is incompatible with index signature.
          Type '{ type: string; }' is not assignable to type 'string | QueryParamConfig | undefined'.
            Type '{ type: string; }' is not assignable to type 'QueryParamConfig'.
              Types of property 'type' are incompatible.
                Type 'string' is not assignable to type '"string" | "number" | "boolean" | "array" | undefined'.ts(2416)
```

This is because TS currently infers the type of `type: "array"` as `type: string`. You can work around this by supplying `as const` after the declaration:

```typescript {data-filename="app/controllers/heyo.ts", data-diff="-6,+7"}
import Controller from '@ember/controller';

export default class HeyoController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
      category: { type: 'array' as const },
    },
  ];
}
```

Now it will type-check.

<!-- TODO: assert from @ember/debug -->

The type is an array of `unknown` because, unless you are using Glint, we don’t have any way to make templates aware of the information in this definition—so users could pass in _anything_. We can work around this using [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)—TypeScript’s process of refining types to more specific types than originally declared.

```typescript
import { assert } from '@ember/debug';

function totalLength(positional: unknown[]) {
  assert(
    'all positional args to `total-length` must be strings',
    positional.every((arg): arg is string => typeof arg === 'string')
  );

  // TypeScript now knows that `positional` is a `string[]` because we asserted above
  return positional.reduce((sum, s) => sum + s.length, 0);
}
```
