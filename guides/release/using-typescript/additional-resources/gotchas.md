**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

This section covers the common details and "gotchas" of using TypeScript with Ember.

## Registries

Ember makes heavy use of string-based APIs to allow for a high degree of dynamicism. With some [limitations][get-set], you can nonetheless use TypeScript very effectively to get auto-complete/IntelliSense as well as to accurately type-check your applications by using **registries**.

[get-set]: ../../additional-resources/legacy/#toc_classic-get-or-set-methods

Here's an example defining a Shopping Cart Service in the Ember Service registry:

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

This registry definition allows for type-safe lookups with other Ember dependency injection APIs. For example, [the `Owner.lookup` method][owner-lookup] uses this "registration"—a mapping from the string `'shopping-cart'` to the service type, `ShoppingCartService`—to provide the correct type:

[owner-lookup]: https://api.emberjs.com/ember/release/classes/Owner/methods/lookup?anchor=lookup

```typescript
import type Owner from '@ember/owner';

function dynamicLookup(owner: Owner) {
  let cart = owner.lookup('service:shopping-cart');
  cart.add('hamster feed');
}
```

### Ember Data lookups

<!-- FIXME: Move to Ember Data section? -->
<!-- FIXME: Ensure all examples show registry entries when necessary -->

We use the same basic approach for Ember Data type lookups with string keys as we do for service injections, but here we take advantage of the string "type registration" for the runtime code as well. As a result, once you add the module and interface definitions for each model, serializer, and adapter in your app, you will automatically get type-checking and autocompletion and the correct return types for functions like `findRecord`, `queryRecord`, `adapterFor`, `serializerFor`, etc. No need to try to write out those (admittedly kind of hairy!) types; just write your Ember Data calls like normal and everything _should_ just work. That is, writing `this.store.findRecord('user', 1)` will give you back a `Promise<User | undefined>`.

The declarations and changes you need to add to your existing files are:

- Models

  ```typescript {data-filename="app/models/user-meta.ts"}
  import Model from '@ember-data/model';

  export default class UserMeta extends Model {}

  declare module 'ember-data/types/registries/model' {
    export default interface ModelRegistry {
      'user-meta': UserMeta;
    }
  }
  ```

- Adapters

  ```typescript {data-filename="app/adapters/user-meta.ts"}
  import Adapter from '@ember-data/adapter';

  export default class UserMeta extends Adapter {}

  declare module 'ember-data/types/registries/adapter' {
    export default interface AdapterRegistry {
      'user-meta': UserMeta;
    }
  }
  ```

- Serializers

  ```typescript {data-filename="app/serializers/user-meta.ts"}
  import Serializer from '@ember-data/serializer';

  export default class UserMeta extends Serializer {}

  declare module 'ember-data/types/registries/serializer' {
    export default interface SerializerRegistry {
      'user-meta': UserMeta;
    }
  }
  ```

- Transforms

  ```typescript {data-filename="app/transforms/color.ts"}
  import Transform from '@ember-data/serializer/transform';

  export default class ColorTransform extends Transform {}

  declare module 'ember-data/types/registries/transform' {
    export default interface TransformRegistry {
      color: ColorTransform;
    }
  }
  ```

#### Opt-in unsafety

Also notice that unlike with service and controller injections, there is no unsafe fallback method by default, because there isn't an argument-less variant of the functions to use as there is for `Service` and `Controller` injection. If for some reason you want to opt _out_ of the full type-safe lookup for the strings you pass into methods like `findRecord`, `adapterFor`, and `serializerFor`, you can add these declarations somewhere in your project:

```typescript {data-filename="types/ember-data.d.ts"}
import type Model from '@ember-data/model';
import type Adapter from '@ember-data/adapter';
import type Serializer from '@ember-data/serializer';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    [key: string]: Model;
  }
}

declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    [key: string]: Adapter;
  }
}

declare module 'ember-data/types/registries/serializer' {
  export default interface SerializerRegistry {
    [key: string]: Serializer;
  }
}
```

However, we _**strongly**_ recommend that you simply take the time to add the few lines of declarations to each of your `Model`, `Adapter`, and `Serializer` instances instead. It will save you time in even the short run!

## Decorators

Ember makes heavy use of decorators, and TypeScript does not support deriving type information from Ember's legacy decorators.

As a result, there are three important points that apply to _all_ decorator usage in Ember:

First, whenever using a decorator to declare a class field the framework sets up for you, you should mark it with [`declare`][declare]. That includes all service and controller injections as well as all Ember Data attributes and relationships.

Normally, `TypeScript` determines whether a property is definitely not `null` or `undefined` by checking what you do in the constructor. In the case of service injections, controller injections, or Ember Data model decorations, though, TypeScript does not have visibility into how instances of the class are _initialized_. The `declare` annotation informs TypeScript that a declaration is defined somewhere else, outside its scope.

Second, ror Ember Data Models, you will need to use the optional `?` operator on field declarations if the field is optional (`?`). See the Ember Data section of the guide for more details!

Third, _you_ are responsible to write the type correctly. TypeScript does not currently use decorator information at all in its type information. If you write `@service foo` or even `@service('foo') foo`, _Ember_ knows that this resolves at runtime to the service `Foo`, but TypeScript does not and—for now—_cannot_.

This means that you are responsible to provide this type information, and that you are responsible to make sure that the information remains correct and up-to-date.

For examples, see the detailed discussions of the two main places decorators are used in the framework:

- [Services](../ember/services.md)
- [Ember Data Models](../ember-data/models.md)

## Current Limitations

While TS already works nicely for many things in Ember, there are a number of corners where it _won't_ help you out. Some of them are just a matter of further work on updating the existing typings; others are a matter of further support landing in TypeScript itself, or changes to Ember's object model.

### Some `import`s don't resolve

You'll frequently see errors for imports which TypeScript doesn't know how to resolve. **These won't stop the build from working;** they just mean TypeScript doesn't know where to find those.

Writing these missing type definitions is a great way to pitch in! Jump in `#topic-typescript` on the [Ember Community Discord server](https://discord.gg/zT3asNS) and we'll be happy to help you.

### Templates

Templates are currently totally non-type-checked. This means that you lose any safety when moving into a template context, even if using a Glimmer `Component` in Ember Octane. (Looking for type-checking in templates? Try [Glint]!)

[glint]: https://typed-ember.gitbook.io/glint/

For example, TypeScript won't detect a mismatch between this action and the corresponding call in the template:

```typescript {data-filename="app/components/my-game.ts"}
import Component from '@ember/component';
import { action } from '@ember/object';

export default class MyGame extends Component {
  @action turnWheel(degrees: number) {
    // ...
  }
}
```

```handlebars {data-filename="app/components/my-game.hbs"}
<button {{on 'click' (fn this.turnWheel 'potato')}}>
  Click Me
</button>
```

Likewise, it won't notice a problem when you use the `send` method:

```typescript
// TypeScript compiler won't detect this type mismatch
this.send('turnWheel', 'ALSO-NOT-A-NUMBER');
```

### Hook Types and Autocomplete

Let’s imagine a component which just logs the names of its arguments when it is first constructed. First, we must define the Signature and pass it into our component, then we can use the `Args` member in our Signature to set the type of `args` in the constructor:

<!-- FIXME: Link to "Signatures" definition. -->

```typescript {data-filename="app/components/args-display.ts"}
import Component from '@glimmer/component';

const log = console.log.bind(console);

export interface ArgsDisplaySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  };
}

export default class ArgsDisplay extends Component<ArgsDisplaySignature> {
  constructor(owner: unknown, args: ArgsDisplaySignature['Args']) {
    super(owner, args);
    Object.keys(args).forEach(log);
  }
}
```

Notice that we have to start by calling `super` with `owner` and `args`. This may be a bit different from what you’re used to in Ember or other frameworks, but is normal for sub-classes in TypeScript today. If the compiler just accepted any `...arguments`, a lot of potentially _very_ unsafe invocations would go through. So, instead of using `...arguments`, we explicitly pass the _specific_ arguments and make sure their types match up with what the super-class expects.

The types for `owner` here and `args` line up with what the `constructor` for Glimmer components expects. The `owner` is specified as `unknown` because this is a detail we explicitly _don’t_ need to know about. The `args` are the `Args` from the Signature we defined.

Additionally, the types of the arguments passed to subclassed methods will _not_ autocomplete as you may expect. This is because in JavaScript, a subclass may legally override a superclass method to accept different arguments. Ember's lifecycle hooks, however, are called by the framework itself, and thus the arguments and return type should always match the superclass. Unfortunately, TypeScript does not and _cannot_ know that, so we have to provide the types directly.

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

## Fixing the Ember Data `error TS2344` problem

If you're developing an Ember app or addon and _not_ using Ember Data (and accordingly not even have the Ember Data types installed), you may see an error like this and be confused:

```text
node_modules/@types/ember-data/index.d.ts(920,56): error TS2344: Type 'any' does not satisfy the constraint 'never'.
```

This happens because the types for Ember's _test_ tooling includes the types for Ember Data because the `this` value in several of Ember's test types can include a reference to the Ember Data `Store` class.

**The fix:** add a declaration like this in a new file named `ember-data.d.ts` in your `types` directory:

```typescript {data-filename="types/ember-data.d.ts"}
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    [key: string]: unknown;
  }
}
```

This works because (a) we include things in your types directory automatically and (b) TypeScript will merge this module and interface declaration with the main definitions for Ember Data from DefinitelyTyped behind the scenes.

If you're developing an addon and concerned that this might affect consumers, it won't. Your types directory will never be referenced by consumers at all!
