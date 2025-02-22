In this section, we cover how to use TypeScript effectively with specific EmberData APIs (anything you'd find under the `@ember-data` package namespace).

We do _not_ cover general usage of EmberData; instead, we assume that as background knowledge. Please see the [EmberData Guides][ED-guides] and [API docs][ED-api-docs]!

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        The following content applies to the native EmberData types, which are currently considered "unstable" (though in practice, they've been pretty stable as of late). These guides may change as the EmberData types are finalized.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Models

EmberData models are normal TypeScript classes, but with properties decorated to define how the model represents an API resource and relationships to other resources. The decorators the library supplies "just work" with TypeScript at runtime, but require type annotations to be useful with TypeScript. Additionally, you must include the model's ["brand"][brand] to ensure that the EmberData store APIs return the correct types.

For example, here we add the `Type` brand to the `user` model:

```ts {data-filename="app/models/user.ts" data-diff="+2,+5"}
import Model from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  declare [Type]: "user";
}
```

EmberData will never access Type as an actual value, these brands are _purely_ for type inference.

### Attributes

The type returned by the `@attr` [decorator][] is determined by whatever [Transform][transform-api-docs] is applied via the invocation. See our [overview of Transforms][transforms] for more information.

If you supply no argument to `@attr`, the value is passed through without transformation.

If you supply one of the built-in transforms, you will get back a corresponding type:

- `@attr('string')` → `string | null`
- `@attr('number')` → `number | null`
- `@attr('boolean')` → `boolean | null`
- `@attr('date')` → `Date | null`

If you supply a custom transform, you will get back the type returned by your transform.

So, for example, you might write a class like this:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";
import CustomType from "@my-app/transforms/custom-transform";

export default class User extends Model {
  @attr declare name?: string;

  @attr("number") declare age?: number | null;

  @attr("boolean") declare isAdmin?: boolean | null;

  @attr("custom-transform") declare myCustomThing?: CustomType;

  declare [Type]: "user";
}
```

Even more than with decorators in general, you should be careful when deciding whether to mark a property as [optional `?`][optional] or definitely present (no annotation): EmberData will default to leaving a property empty if it is not supplied by the API or by a developer when creating it. That is: the _default_ for EmberData corresponds to an optional field on the model.

The _safest_ type you can write for an EmberData model, therefore, leaves every property optional: this is how models _actually_ behave. If you choose to mark properties as definitely present by leaving off the `?`, you should take care to guarantee that this is a guarantee your API upholds, and that ever time you create a record from within the app, _you_ uphold those guarantees.

One way to make this safer is to supply a default value using the `defaultValue` on the options hash for the attribute:

```typescript {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { Type } from "@warp-drive/core-types/symbols";
import CustomType from "@my-app/transforms/custom-transform";

export default class User extends Model {
  @attr declare name?: string;

  @attr("number", { defaultValue: 13 }) declare age: number;

  @attr("boolean", { defaultValue: false }) declare isAdmin: boolean;

  declare [Type]: "user";
}
```

### Async BelongsTo Relationships

If the `@belongsTo` is `{ async: true }` (the default), the type is `AsyncBelongsTo<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@belongsTo` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { belongsTo, AsyncBelongsTo } from "@ember-data/model";
import type Address from "./address";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @belongsTo<Address>("address", { async: true, inverse: null })
  declare address: AsyncBelongsTo<Address>;

  declare [Type]: "user";
}
```

Async BelongsTo relationships are type-safe to define as always present. Accessing an async relationship will _always_ return an `AsyncBelongsTo<Model>` object, which itself may or may not ultimately resolve to a value—depending on the API response—but will always be present itself.

### Sync BelongsTo Relationships

If the `@belongsTo` is `{ async: false }`, the type you should use is `Model | null`, where `Model` is the type of the model you are creating a relationship to. Again, you should pass the `Model` type as a generic to the `@belongsTo` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { belongsTo } from "@ember-data/model";
import type Address from "./address";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @belongsTo<Address>("address", { async: false, inverse: null })
  declare address: Address | null;

  declare [Type]: "user";
}
```

### Async HasMany Relationships

If the `@hasMany` is `{ async: true }` (the default), the type is `AsyncHasMany<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@hasMany` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, AsyncHasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: true, inverse: "author" })
  declare posts: AsyncHasMany<Post>;

  declare [Type]: "user";
}
```

### Sync HasMany Relationships

If the `@hasMany` is `{ async: false }`, the type is `HasMany<Model>`, where `Model` is the type of the model you are creating a relationship to. Additionally, pass the `Model` type as a generic to the `@hasMany` decorator to ensure that the inverse relationship is validated.

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, HasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: false, inverse: "author" })
  declare posts: HasMany<Post>;

  declare [Type]: "user";
}
```

### A Note About Recursive Imports

Relationships between models in EmberData rely on importing the related models, like `import User from './user';`. This, naturally, can cause a recursive loop, as `/app/models/post.ts` imports `User` from `/app/models/user.ts`, and `/app/models/user.ts` imports `Post` from `/app/models/post.ts`. Recursive importing triggers an [`import/no-cycle`][import-no-cycle] error from ESLint.

To avoid these errors, use [type-only imports][type-only-imports]:

```typescript
import type User from "./user";
```

### A Note About Open Types

When accessing `this.belongsTo` or `this.hasMany` from within a model, you'll need to pass the relationship `Model` type and the string key as generics, like so:

```ts {data-filename="app/models/user.ts"}
import Model, { hasMany, AsyncHasMany } from "@ember-data/model";
import type Post from "./post";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @hasMany<Post>("post", { async: true, inverse: "author" })
  declare posts: AsyncHasMany<Post>;

  get postIdList(): string[] {
    return this.hasMany<Post, "posts">("posts").ids();
  }

  declare [Type]: "user";
}
```

The reason is that `this.belongsTo` and `this.hasMany` will infer an 'open' type for `this`, meaning that `this` can still be modified. For this reason, it's not able to index the keys of the model. As a workaround, pass in the 'concrete' or `closed` type for proper resolution.

## Transforms

In EmberData, `@attr` defines an [attribute on a Model][model-attrs]. By default, attributes are passed through as-is, however you can specify an optional type to have the value automatically transformed. EmberData ships with four basic transform types: `string`, `number`, `boolean` and `date`.

EmberData [Transforms][transform-guides] are normal TypeScript classes. The return type of `deserialize` method becomes type of the model class property.

Transforms with a `Type` brand will have their type and options validated.

### Example: Typing a Transform

```ts {data-filename="app/transforms/big-int.ts"}
import type { Type } from "@warp-drive/core-types/symbols";

export default class BigIntTransform {
  deserialize(serialized: string): BigInt | null {
    return !serialized || serialized === "" ? null : BigInt(serialized + "n");
  }
  serialize(deserialized: BigInt | null): string | null {
    return !deserialized ? null : String(deserialized);
  }

  declare [Type]: "big-int";

  static create() {
    return new this();
  }
}
```

### Example: Using Transforms

```ts {data-filename="app/models/user.ts"}
import Model, { attr } from "@ember-data/model";
import type { StringTransform } from "@ember-data/serializer/transforms";
import type { Type } from "@warp-drive/core-types/symbols";

export default class User extends Model {
  @attr<StringTransform>("string") declare name: string;

  declare [Type]: "user";
}
```

## Serializers and Adapters

EmberData serializers and adapters are normal TypeScript classes.

```typescript {data-filename="app/serializers/user-meta.ts"}
import Serializer from "@ember-data/serializer";

export default class UserMeta extends Serializer {}
```

```typescript {data-filename="app/adapters/user.ts"}
import Adapter from "@ember-data/adapter";

export default class User extends Adapter {}
```

## Adding EmberData Types to an Existing TypeScript App

The process for adding EmberData types to an existing TypeScript app is a work in progress. You can find the latest docs in the [EmberData repository][ED-ts-guides].

<!-- Internal links -->

[decorator]: ../../additional-resources/gotchas/#toc_decorators
[ED-guides]: ../../../models/
[model-attrs]: ../../../models/defining-models/
[transforms]: ./#toc_transforms
[transform-guides]: ../../../models/defining-models/#toc_custom-transforms

<!-- External links -->

[brand]: https://github.com/emberjs/data/blob/main/guides/typescript/2-why-brands.md
[ED-api-docs]: https://api.emberjs.com/ember-data/release
[ED-ts-guides]: https://github.com/emberjs/data/blob/main/guides/typescript/index.md
[import-no-cycle]: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md
[optional]: https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties
[transform-api-docs]: https://api.emberjs.com/ember-data/release/classes/Transform
[type-only-imports]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html
