**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

This guide covers the common details and "gotchas" of using TypeScript with Ember. Note that we do _not_ cover the use of TypeScript _or_ Ember in general—for those, you should refer to the corresponding documentation:

- [TypeScript docs](https://www.typescriptlang.org/docs/index.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Ember docs](https://emberjs.com/learn/)

## Outline

- [Using TypeScript With Ember Effectively](using-ts-effectively.md)
- [Decorators](decorators.md)
- [Current limitations](current-limitations.md)
- [Building Addons in TypeScript](with-addons.md)
- [Understanding the `@types` Package Names](package-names.md)

<!-- FIXME: This is copy-pasta from ember-cli-typescript docs and needs updates -->

## Using TypeScript With Ember Effectively

### String-keyed lookups

Ember makes heavy use of string-based APIs to allow for a high degree of dynamicism. With some limitations, you can nonetheless use TypeScript very effectively to get auto-complete/IntelliSense as well as to accurately type-check your applications.

A few of the most common speed-bumps are listed here to help make this easier:

#### Classic `get` or `set` methods

<!-- FIXME: Mention gotchas about classic patterns, period. -->

In general, the `this.get` and `this.set` methods on `EmberObject` subclasses and the standalone `get` and `set` functions will work as you'd expect _if_ you're doing lookups only a single layer deep. We do not provide support for deep key lookups like `get(someObj, 'a.b.c')`, because normal property access can works correctly across the whole Ember ecosystem since at least Ember and Ember Data 3.28.

Since regular property access “just works”, and has for a very long time, you should migrate to using normal property access instead. TypeScript will help make this a smooth process by identifying where you need to handle null and undefined intermediate properties.

#### Service and controller injections

Ember looks up services with the `@service` decorator at runtime, using the name of the service being injected up as the default value—a clever bit of metaprogramming that makes for a nice developer experience. TypeScript cannot do this, because the name of the service to inject isn't available at compile time in the same way. (These same considerations apply to controller injections using the `@inject` decorator from `@ember/controller`.)

Since decorators do not currently have access to enough information to produce an appropriate type by themselves, we need to import and name the type explicitly. For example, we might have `MySession` service which defines a `login` method, defined as usual:

```typescript {data-filename="app/services/my-session.ts"}
import Service from '@ember/service';
import RSVP from 'rsvp';

export default class MySession extends Service {
  login(email: string, password: string): RSVP.Promise<string> {
    // login and return the confirmation message
  }
}

declare module '@ember/service' {
  interface Registry {
    'my-session': MySession;
  }
}
```

Then we can use the service as we usually would with a decorator, but adding a type annotation to it so TypeScript knows what it's looking at:

```typescript {data-filename="app/components/user-profile.ts"}
import Component from '@ember/component';
import { inject as service } from '@ember/service';

import type MySession from 'my-app/services/my-session';

export default class UserProfile extends Component {
  @service declare mySession: MySession;

  login(email: string, password: string) {
    this.mySession.login(email, password);
  }
}
```

Note that we need the `MySession` type annotation this way, but we _don't_ need the string lookup (unless we're giving the service a different name than the usual on the class, as in Ember injections in general). Without the type annotation, the type of `session` would just be `any`. This is because decorators are not allowed to modify the types of whatever they decorate. As a result, we wouldn't get any type-checking on that `session.login` call, and we wouldn't get any auto-completion either. Which would be really sad and take away a lot of the reason we're using TypeScript in the first place!

Also notice [the `declare` property modifier](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier). This tells TypeScript that the property will be configured by something outside the class (in this case, the decorator), and guarantees it emits spec-compliant JavaScript.

(This also holds true for all other service injections, computed property macros, and Ember Data model attributes and relationships.)

Finally, you may have noticed the `declare module` at the bottom of the example `MySession` definition:

```typescript {data-filename="app/services/my-session.ts"}
// ...
declare module '@ember/service' {
  interface Registry {
    'my-session': MySession;
  }
}
```

This definition allows for type-safe lookups with other Ember dependency injection APIs. For example, [the `Owner.lookup` method](https://api.emberjs.com/ember/5.2/classes/Owner#2-method) uses this "registration"—a mapping from the string `'my-session'` to the service type, `MySession`—to provide the correct type:

```typescript
function dynamicLookup(owner: Owner) {
  let mySession = owner.lookup('service:my-session');
  mySession.login('tom@example.com', 'password123');
}
```

#### Ember Data lookups

<!-- FIXME: Move to Ember Data section? -->

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

##### Opt-in unsafety

Also notice that unlike with service and controller injections, there is no unsafe fallback method by default, because there isn't an argument-less variant of the functions to use as there is for `Service` and `Controller` injection. If for some reason you want to opt _out_ of the full type-safe lookup for the strings you pass into methods like `findRecord`, `adapterFor`, and `serializerFor`, you can add these declarations somewhere in your project:

```typescript {data-filename="types/ember-data.d.ts"}
import Model from '@ember-data/model';
import Adapter from '@ember-data/adapter';
import Serializer from '@ember-data/serializer';

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

Ember makes heavy use of decorators, and TypeScript does not currently support deriving type information from decorators.

As a result, there are three important points that apply to _all_ decorator usage in Ember:

1. Whenever using a decorator to declare a class field the framework sets up for you, you should mark it with `declare`. That includes all service and controller injections as well as all Ember Data attributes and relationships.

   Normally, TypeScript determines whether a property is definitely not `null` or `undefined` by checking what you do in the constructor. In the case of service injections, controller injections, or Ember Data model decorations, though, TypeScript does not have visibility into how instances of the class are _initialized_. The `declare` annotation informs TypeScript that a declaration is defined somewhere else, outside its scope.

2. For Ember Data Models, you will need to use the optional `?` operator on field declarations if the field is optional (`?`). See the Ember Data section of the guide for more details!

3. You are responsible to write the type correctly. TypeScript does not currently use decorator information at all in its type information. If you write `@service foo` or even `@service('foo') foo`, _Ember_ knows that this resolves at runtime to the service `Foo`, but TypeScript does not and—for now—_cannot_.

   This means that you are responsible to provide this type information, and that you are responsible to make sure that the information remains correct and up to date

For examples, see the detailed discussions of the two main places decorators are used in the framework:

- [Services](../ember/services.md)
- [Ember Data Models](../ember-data/models.md)

## Current Limitations

While TS already works nicely for many things in Ember, there are a number of corners where it _won't_ help you out. Some of them are just a matter of further work on updating the [existing typings](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/ember); others are a matter of further support landing in TypeScript itself, or changes to Ember's object model.

### Some `import`s don't resolve

You'll frequently see errors for imports which TypeScript doesn't know how to resolve. **These won't stop the build from working;** they just mean TypeScript doesn't know where to find those.

Writing these missing type definitions is a great way to pitch in! Jump in `#topic-typescript` on the [Ember Community Discord server](https://discord.gg/zT3asNS) and we'll be happy to help you.

### Templates

Templates are currently totally non-type-checked. This means that you lose any safety when moving into a template context, even if using a Glimmer `Component` in Ember Octane.

<!-- FIXME: Glint mention -->

### Invoking actions

<!-- FIXME: Glint mention -->

TypeScript won't detect a mismatch between this action and the corresponding call in the template:

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

### Hook Types

Let’s imagine a component which just logs the names of its arguments when it is first constructed. First, we must define the Signature and pass it into our component, then we can use the `Args` member in our Signature to set the type of `args` in the constructor:

```typescript {data-filename="app/components/args-display.ts"}
import Component from '@glimmer/component';
import

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
