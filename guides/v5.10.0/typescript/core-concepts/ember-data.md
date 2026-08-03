In this section, we cover how to use TypeScript effectively with specific EmberData APIs (anything you'd find under the `@ember-data` package namespace).

We do _not_ cover general usage of EmberData; instead, we assume that as background knowledge. Please see the [EmberData Guides][ED-guides] and [API docs][ED-api-docs]!

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          These guides currently assume you are using the EmberData <code>@types</code> packages in conjunction with the Ember <code>@types</code> packages.
        </p>
        <p>
          For improved (albeit less stable) types, you can switch to <a href="https://github.com/emberjs/data/blob/main/guides/typescript/index.md">EmberData's alpha native types, documented at this link</a>. Using the EmberData alpha native types will also require <a href="https://blog.emberjs.com/stable-typescript-types-in-ember-5-1/">switching to the Ember native types</a>, which are guaranteed to always be 100% correct and 100% up to date!
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Models

EmberData models are normal TypeScript classes, but with properties decorated to define how the model represents an API resource and relationships to other resources. The decorators the library supplies "just work" with TypeScript at runtime, but require type annotations to be useful with TypeScript. Additionally, you must register each model with the [`ModelRegistry`][ED-registry] as shown in the examples below.

### `@attr`

The type returned by the `@attr` [decorator][] is whatever [Transform][transform-api-docs] is applied via the invocation. See our [overview of Transforms][transforms] for more information.

If you supply no argument to `@attr`, the value is passed through without transformation.

If you supply one of the built-in transforms, you will get back a corresponding type:

- `@attr('string')` → `string`
- `@attr('number')` → `number`
- `@attr('boolean')` → `boolean`
- `@attr('date')` → `Date`

If you supply a custom transform, you will get back the type returned by your transform.

So, for example, you might write a class like this:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from '@ember-data/model';
import CustomType from '../transforms/custom-transform';

export default class User extends Model {
  @attr
  declare name?: string;

  @attr('number')
  declare age: number;

  @attr('boolean')
  declare isAdmin: boolean;

  @attr('custom-transform')
  declare myCustomThing: CustomType;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: User;
  }
}
```

#### Type Safety for Model Attributes

Even more than with decorators in general, you should be careful when deciding whether to mark a property as [optional `?`][optional] or definitely present (no annotation): EmberData will default to leaving a property empty if it is not supplied by the API or by a developer when creating it. That is: the _default_ for EmberData corresponds to an optional field on the model.

The _safest_ type you can write for an EmberData model, therefore, leaves every property optional: this is how models _actually_ behave. If you choose to mark properties as definitely present by leaving off the `?`, you should take care to guarantee that this is a guarantee your API upholds, and that ever time you create a record from within the app, _you_ uphold those guarantees.

One way to make this safer is to supply a default value using the `defaultValue` on the options hash for the attribute:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from '@ember-data/model';

export default class User extends Model {
  @attr
  declare name?: string;

  @attr('number', { defaultValue: 13 })
  declare age: number;

  @attr('boolean', { defaultValue: false })
  declare isAdmin: boolean;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: User;
  }
}
```

### Relationships

Relationships between models in EmberData rely on importing the related models, like `import User from './user';`. This, naturally, can cause a recursive loop, as `/app/models/post.ts` imports `User` from `/app/models/user.ts`, and `/app/models/user.ts` imports `Post` from `/app/models/post.ts`. Recursive importing triggers an [`import/no-cycle`][import-no-cycle] error from ESLint.

To avoid these errors, use [type-only imports][type-only-imports]:

```typescript
import type User from './user';
```

#### `@belongsTo`

The type returned by the `@belongsTo` decorator depends on whether the relationship is `{ async: true }` (which it is by default).

- If the value is `true`, the type you should use is `AsyncBelongsTo<Model>`, where `Model` is the type of the model you are creating a relationship to.
- If the value is `false`, the type is `Model`, where `Model` is the type of the model you are creating a relationship to.

So, for example, you might define a class like this:

```typescript {data-filename="app/models/post.ts"}
import Model, { belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type User from './user';
import type Site from './site';

export default class Post extends Model {
  @belongsTo('user')
  declare user: AsyncBelongsTo<User>;

  @belongsTo('site', { async: false })
  declare site: Site;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    post: Post;
  }
}
```

These are _type_-safe to define as always present, that is to leave off the `?` optional marker:

- accessing an async relationship will always return an `AsyncBelongsTo<Model>` object, which itself may or may not ultimately resolve to a value—depending on the API response—but will always be present itself.
- accessing a non-async relationship which is known to be associated but has not been loaded will trigger an error, so all access to the property will be safe _if_ it resolves at all.

Note, however, that this type-safety is not a guarantee of there being no runtime error: you still need to uphold the contract for non-async relationships (that is: loading the data first, or side-loading it with the request) to avoid throwing an error!

#### `@hasMany`

The type returned by the `@hasMany` decorator depends on whether the relationship is `{ async: true }` (which it is by default).

- If the value is `true`, the type you should use is `AsyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to.
- If the value is `false`, the type is `SyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to.

So, for example, you might define a class like this:

```typescript {data-filename="app/models/thread.ts"}
import Model, {
  hasMany,
  type AsyncHasMany,
  type SyncHasMany,
} from '@ember-data/model';
import type Comment from './comment';
import type User from './user';

export default class Thread extends Model {
  @hasMany('comment')
  declare comments: AsyncHasMany<Comment>;

  @hasMany('user', { async: false })
  declare participants: SyncHasMany<User>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    thread: Thread;
  }
}
```

The same basic rules about the safety of these lookups as with `@belongsTo` apply to these types. The difference is just that in `@hasMany` the resulting types are _arrays_ rather than single objects.

## Transforms

In EmberData, `@attr` defines an [attribute on a Model][model-attrs]. By default, attributes are passed through as-is, however you can specify an optional type to have the value automatically transformed. EmberData ships with four basic transform types: `string`, `number`, `boolean` and `date`.

You can define your own transforms by sub-classing [Transform][transform-guides]. EmberData transforms are normal TypeScript classes. The return type of `deserialize` method becomes type of the model class property.

You may define your own transforms in TypeScript like so:

```typescript {data-filename="app/transforms/coordinate-point.ts"}
import Transform from '@ember-data/serializer/transform';

export type CoordinatePoint = {
  x: number;
  y: number;
};

export default class CoordinatePointTransform extends Transform {
  deserialize(serialized): CoordinatePoint {
    return { x: value[0], y: value[1] };
  }

  serialize(value): number {
    return [value.x, value.y];
  }
}

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'coordinate-point': CoordinatePointTransform;
  }
}
```

```typescript {data-filename="app/models/cursor.ts"}
import Model, { attr } from '@ember-data/model';
import { CoordinatePoint } from 'my-app/transforms/coordinate-point';

export default class Cursor extends Model {
  @attr('coordinate-point') declare position: CoordinatePoint;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    cursor: Cursor;
  }
}
```

Note that you should declare your own transform under [`TransformRegistry`][ED-registry] to make `@attr` to work with your transform.

## Serializers and Adapters

EmberData serializers and adapters are normal TypeScript classes. The only related gotcha is that you must [register][ED-registry] them with a declaration:

```typescript {data-filename="app/serializers/user-meta.ts"}
import Serializer from '@ember-data/serializer';

export default class UserMeta extends Serializer {}

declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    'user-meta': UserMeta;
  }
}
```

```typescript {data-filename="app/adapters/user.ts"}
import Adapter from '@ember-data/adapter';

export default class User extends Adapter {}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    user: User;
  }
}
```

## EmberData Registries

We use [registry][] approach for EmberData type lookups with string keys. As a result, once you add the module and interface definitions for each model, transform, serializer, and adapter in your app, you will automatically get type-checking and autocompletion and the correct return types for functions like `findRecord`, `queryRecord`, `adapterFor`, `serializerFor`, etc. No need to try to write out those types; just write your EmberData calls like normal and everything _should_ just work. That is, writing `this.store.findRecord('user', 1)` will give you back a `Promise<User | undefined>`.

<!-- Internal links -->

[decorator]: ../../additional-resources/gotchas/#toc_decorators
[ED-guides]: ../../../models/
[ED-registry]: ./#toc_emberdata-registries
[model-attrs]: ../../../models/defining-models/
[registry]: ../../additional-resources/gotchas/#toc_registries
[transforms]: ./#toc_transforms
[transform-guides]: ../../../models/defining-models/#toc_custom-transforms

<!-- External links -->

[ED-api-docs]: https://api.emberjs.com/ember-data/5.3.0
[import-no-cycle]: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
[optional]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[transform-api-docs]: https://api.emberjs.com/ember-data/5.3.0/classes/Transform
[type-only-imports]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
