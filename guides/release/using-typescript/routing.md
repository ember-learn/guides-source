**Note:** 🚧 This section is under construction! 🏗️ The content here may undergo significant revision in the months ahead!

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
