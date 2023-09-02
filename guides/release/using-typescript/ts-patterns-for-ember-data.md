**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

In this section, we cover how to use TypeScript effectively with specific Ember Data APIs \(anything you'd find under the `@ember-data` package namespace\).

We do _not_ cover general usage of Ember Data; instead, we assume that as background knowledge. Please see the Ember Data [Guides](https://guides.emberjs.com/release/models) and [API docs](https://api.emberjs.com/ember-data/release)!

# Models

Ember Data models are normal TypeScript classes, but with properties decorated to define how the model represents an API resource and relationships to other resources. The decorators the library supplies "just work" with TypeScript at runtime, but require type annotations to be useful with TypeScript.

For details about decorator usage, see [our overview of how Ember's decorators work with TypeScript](../ts/decorators.md).

## `@attr`

The type returned by the `@attr` decorator is whatever [Transform](https://api.emberjs.com/ember-data/release/classes/Transform) is applied via the invocation. See [our overview of Transforms for more information](./transforms.md).

- If you supply no argument to `@attr`, the value is passed through without transformation.
- If you supply one of the built-in transforms, you will get back a corresponding type:
  - `@attr('string')` → `string`
  - `@attr('number')` → `number`
  - `@attr('boolean')` → `boolean`
  - `@attr('date')` → `Date`
- If you supply a custom transform, you will get back the type returned by your transform.

So, for example, you might write a class like this:

```typescript
import Model, { attr } from '@ember-data/model';
import CustomType from '../transforms/custom-transform';

export default class User extends Model {
  @attr()
  declare name?: string;

  @attr('number')
  declare age: number;

  @attr('boolean')
  declare isAdmin: boolean;

  @attr('custom-transform')
  declare myCustomThing: CustomType;
}
```

**Very important:** Even more than with decorators in general, you should be careful when deciding whether to mark a property as optional `?` or definitely present \(no annotation\): Ember Data will default to leaving a property empty if it is not supplied by the API or by a developer when creating it. That is: the _default_ for Ember corresponds to an optional field on the model.

The _safest_ type you can write for an Ember Data model, therefore, leaves every property optional: this is how models _actually_ behave. If you choose to mark properties as definitely present by leaving off the `?`, you should take care to guarantee that this is a guarantee your API upholds, and that ever time you create a record from within the app, _you_ uphold those guarantees.

One way to make this safer is to supply a default value using the `defaultValue` on the options hash for the attribute:

```typescript
import Model, { attr } from '@ember-data/model';

export default class User extends Model {
  @attr()
  declare name?: string;

  @attr('number', { defaultValue: 13 })
  declare age: number;

  @attr('boolean', { defaultValue: false })
  declare isAdmin: boolean;
}
```

## Relationships

Relationships between models in Ember Data rely on importing the related models, like `import User from './user';`. This, naturally, can cause a recursive loop, as `/app/models/post.ts` imports `User` from `/app/models/user.ts`, and `/app/models/user.ts` imports `Post` from `/app/models/post.ts`. Recursive importing triggers an [`import/no-cycle`](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md) error from eslint.

To avoid these errors, use [type-only imports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html), available since TypeScript 3.8:

```ts
import type User from './user';
```

### `@belongsTo`

The type returned by the `@belongsTo` decorator depends on whether the relationship is `{ async: true }` \(which it is by default\).

- If the value is `true`, the type you should use is `AsyncBelongsTo<Model>`, where `Model` is the type of the model you are creating a relationship to.
- If the value is `false`, the type is `Model`, where `Model` is the type of the model you are creating a relationship to.

So, for example, you might define a class like this:

```typescript
import Model, { belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type User from './user';
import type Site from './site';

export default class Post extends Model {
  @belongsTo('user')
  declare user: AsyncBelongsTo<User>;

  @belongsTo('site', { async: false })
  declare site: Site;
}
```

These are _type_-safe to define as always present, that is to leave off the `?` optional marker:

- accessing an async relationship will always return an `AsyncBelongsTo<Model>` object, which itself may or may not ultimately resolve to a value—depending on the API response—but will always be present itself.
- accessing a non-async relationship which is known to be associated but has not been loaded will trigger an error, so all access to the property will be safe _if_ it resolves at all.

Note, however, that this type-safety is not a guarantee of there being no runtime error: you still need to uphold the contract for non-async relationships \(that is: loading the data first, or side-loading it with the request\) to avoid throwing an error!

### `@hasMany`

The type returned by the `@hasMany` decorator depends on whether the relationship is `{ async: true }` \(which it is by default\).

- If the value is `true`, the type you should use is `AsyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to.
- If the value is `false`, the type is `SyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to.

So, for example, you might define a class like this:

```typescript
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
```

The same basic rules about the safety of these lookups as with `@belongsTo` apply to these types. The difference is just that in `@hasMany` the resulting types are _arrays_ rather than single objects.

# Transforms

In Ember Data, `attr` defines an attribute on a [Model](https://guides.emberjs.com/release/models/defining-models/).
By default, attributes are passed through as-is, however you can specify an
optional type to have the value automatically transformed.
Ember Data ships with four basic transform types: `string`, `number`, `boolean` and `date`.

You can define your own transforms by subclassing [Transform](https://guides.emberjs.com/release/models/defining-models/#toc_custom-transforms).
Ember Data transforms are normal TypeScript classes.
The return type of `deserialize` method becomes type of the model class property.

You may define your own transforms in TypeScript like so:

```typescript
# app/transforms/coordinate-point.ts
import Transform from '@ember-data/serializer/transform';

declare module 'ember-data/types/registries/transform' {
  export default interface TransformRegistry {
    'coordinate-point': CoordinatePointTransform;
  }
}

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

# app/models/cursor.ts
import Model, { attr } from '@ember-data/model';
import { CoordinatePoint } from 'agwa-data/transforms/coordinate-point';

declare module 'ember-data/types/registries/transform' {
  export default interface ModelRegistry {
    cursor: Cursor;
  }
}

export default class Cursor extends Model {
  @attr('coordinate-point') declare position: CoordinatePoint;
}
```

Note that you should declare your own transform under `TransformRegistry` to make `attr` to work with your transform.
