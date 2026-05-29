## Routes

Since Ember [Routes][] are just regular JavaScript classes with a few special Ember lifecycle hooks and properties available, TypeScript should "Just Work." Ember's types supply the definitions for the various methods available within route subclasses, which will provide autocomplete and type-checking along the way.

## Controllers

Like routes, [Controllers][] are just normal JavaScript classes with a few special Ember lifecycle hooks and properties available.

The main thing to be aware of is special handling around query params. In order to provide type safety for query param configuration, Ember's types specify that when defining a query param's `type` attribute, you must supply one of the allowed types: `'boolean'`, `'number'`, `'array'`, or `'string'` (the default). However, if you supply these types as you would in JS, like this:

```typescript {data-filename="app/controllers/my.ts"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
    },
  ];
}
```

Then you will see a type error like this:

```text
Property 'queryParams' in type 'MyController' is not assignable to the same property in base type 'Controller'.
  Type '{ category: { type: string; }; }[]' is not assignable to type '(string | Record<string, string | QueryParamConfig | undefined>)[]'.
    Type '{ category: { type: string; }; }' is not assignable to type 'string | Record<string, string | QueryParamConfig | undefined>'.
      Type '{ category: { type: string; }; }' is not assignable to type 'Record<string, string | QueryParamConfig | undefined>'.
        Property 'category' is incompatible with index signature.
          Type '{ type: string; }' is not assignable to type 'string | QueryParamConfig | undefined'.
            Type '{ type: string; }' is not assignable to type 'QueryParamConfig'.
              Types of property 'type' are incompatible.
                Type 'string' is not assignable to type '"string" | "number" | "boolean" | "array" | undefined'.ts(2416)
```

This is because TS currently infers the type of `type: "array"` as `type: string`. You can work around this by supplying [`as const`][const-assertions] after the declaration:

```typescript {data-filename="app/controllers/my.ts", data-diff="-6,+7"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  queryParams = [
    {
      category: { type: 'array' },
      category: { type: 'array' as const },
    },
  ];
}
```

Now it will type-check.

## Working with Route Models

We often use routes' models throughout our application, since they're a core ingredient of our application's data. As such, we want to make sure that we have good types for them!

We can start by defining a type utility to let us get the resolved value returned by a route's model hook:

```typescript {data-filename="app/lib/type-utils.ts"}
import type Route from '@ember/routing/route';

/** Get the resolved model value from a route. */
export type ModelFrom<R extends Route> = Awaited<ReturnType<R['model']>>;
```

How that works:

- [`Awaited<P>`][awaited] says "if this is a promise, the type here is whatever the promise resolves to; otherwise, it's just the value"
- [`ReturnType<T>`][return-type] gets the return value of a given function
- `R['model']` (where `R` has to be `Route` itself or a subclass) says "the property named `model` on Route `R`"

`ModelFrom<Route>` ends up giving you the resolved value returned from the `model` hook for a given route. We can use this functionality to guarantee that the `model` on a `Controller` is always exactly the type returned by `Route::model` by writing something like this:

```typescript {data-filename="app/controllers/controller-with-model.ts"}
import Controller from '@ember/controller';
import MyRoute from 'my-app/routes/my-route';
import { ModelFrom } from 'my-app/lib/type-utils';

export default class ControllerWithModel extends Controller {
  declare model: ModelFrom<MyRoute>;
}
```

Now, our controller's `model` property will _always_ stay in sync with the corresponding route's model hook.

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

## Controller Injections and Lookups

If you are using controller injections via the `@inject` decorator from `@ember/controller`, see the ["Decorators"][decorators] documentation.

If you need to lookup a controller with `Owner.lookup`, you'll need to first register your controller in Ember's TypeScript Controller registry as described in ["Registries"][registries]:

```typescript {data-filename="app/controllers/my.ts"}
import Controller from '@ember/controller';

export default class MyController extends Controller {
  //...
}

declare module '@ember/controller' {
  interface Registry {
    my: MyController;
  }
}
```

<!-- Internal links -->

[controllers]: ../../../routing/controllers/
[decorators]: ../../additional-resources/gotchas/#toc_decorators
[registries]: ../../additional-resources/gotchas/#toc_registries
[routes]: ../../../routing/defining-your-routes/

<!-- External links -->

[awaited]: https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype
[const-assertions]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions
[return-type]: https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
