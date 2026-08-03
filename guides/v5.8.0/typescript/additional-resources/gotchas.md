This section covers the common details and "gotchas" of using TypeScript with Ember.

## Registries

Ember makes heavy use of string-based APIs to allow for a high degree of dynamicness. With some [limitations][get-set], you can nonetheless use TypeScript very effectively to get auto-complete/IntelliSense as well as to accurately type-check your applications by using **registries**.

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

This registry definition allows for type-safe lookups in string-based APIs. For example, [the `Owner.lookup` method][owner-lookup] uses this "registration"—a mapping from the string `'shopping-cart'` to the service type, `ShoppingCartService`—to provide the correct type:

```typescript
import type Owner from '@ember/owner';

function dynamicLookup(owner: Owner) {
  let cart = owner.lookup('service:shopping-cart');
  cart.add('hamster feed');
}
```

For examples, see:

- [Service][service] registry
- [Controller][controller] registry
- EmberData [Model][model] registry
- EmberData [Transform][transform] registry
- EmberData [Serializer][serializers-and-adapters] registry
- EmberData [Adapter][serializers-and-adapters] registry

## Decorators

Ember makes heavy use of decorators, and TypeScript does not support deriving type information from Ember's legacy decorators.

As a result, whenever using a decorator to declare a class field the framework sets up for you, you should mark it with [`declare`][declare]. That includes all service injections (`@service`), controller injections (`@inject`) as well as all EmberData attributes (`@attr`) and relationships (`@belongsTo` and `@hasMany`).

Normally, `TypeScript` determines whether a property is definitely not `null` or `undefined` by checking what you do in the constructor. In the case of legacy decorators, though, TypeScript does not have visibility into how the decorated properties are initialized. The `declare` annotation informs TypeScript that a declaration is defined somewhere else, outside its scope.

Additionally, _you_ are responsible to write the type correctly. TypeScript does not use legacy decorator information at all in its type information. If you write `@service foo` or even `@service('foo') foo`, _Ember_ knows that this resolves at runtime to the service `Foo`, but TypeScript does not and—for now—_cannot_.

This means that you are responsible to provide this type information, and that you are responsible to make sure that the information remains correct and up-to-date.

For examples, see:

- [`@service`][service]
- [`@inject`][controller]
- EmberData [`@attr`][model-attr]
- EmberData [`@belongsTo`][model-belongsto]
- EmberData [`@hasMany`][model-hasmany]

## Templates

Templates are currently totally non-type-checked. This means that you lose any safety when moving into a template context, even if using a Glimmer `Component` in Ember Octane. (Looking for type-checking in templates? Try [Glint][]!)

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

## Hook Types and Autocomplete

Let's imagine a component which just logs the names of its arguments when it is first constructed. First, we must define the [Signature][] and pass it into our component, then we can use the `Args` member in our Signature to set the type of `args` in the constructor:

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

Notice that we have to start by calling `super` with `owner` and `args`. This may be a bit different from what you're used to in Ember or other frameworks, but is normal for sub-classes in TypeScript today. If the compiler just accepted any `...arguments`, a lot of potentially _very_ unsafe invocations would go through. So, instead of using `...arguments`, we explicitly pass the _specific_ arguments and make sure their types match up with what the super-class expects.

The types for `owner` here and `args` line up with what the `constructor` for Glimmer components expects. The `owner` is specified as `unknown` because this is a detail we explicitly _don't_ need to know about. The `args` are the `Args` from the Signature we defined.

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

## Fixing the EmberData `error TS2344` problem

If you're developing an Ember app or addon and _not_ using EmberData (and accordingly not even have the EmberData types installed), you may see an error like this and be confused:

```text
node_modules/@types/ember-data/index.d.ts(920,56): error TS2344: Type 'any' does not satisfy the constraint 'never'.
```

This happens because the types for Ember's _test_ tooling includes the types for EmberData because the `this` value in several of Ember's test types can include a reference to the EmberData `Store` class.

**The fix:** add a declaration like this in a new file named `ember-data.d.ts` in your `types` directory:

```typescript {data-filename="types/ember-data.d.ts"}
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    [key: string]: unknown;
  }
}
```

This works because (a) we include things in your types directory automatically and (b) TypeScript will merge this module and interface declaration with the main definitions for EmberData from DefinitelyTyped behind the scenes.

If you're developing an addon and concerned that this might affect consumers, it won't. Your types directory will never be referenced by consumers at all!

<!-- Internal links -->

[controller]: ../../core-concepts/routing/#toc_controller-injections-and-lookups
[get-set]: ../../additional-resources/legacy/#toc_classic-get-or-set-methods
[model-attr]: ../../core-concepts/ember-data/#toc_attr
[model-belongsto]: ../../core-concepts/ember-data/#toc_belongsto
[model-hasmany]: ../../core-concepts/ember-data/#toc_hasMany
[model]: ../../core-concepts/ember-data/#toc_models
[owner-lookup]: https://api.emberjs.com/ember/5.8.0/classes/Owner/methods/lookup?anchor=lookup
[serializers-and-adapters]: ../../core-concepts/ember-data/#toc_serializers-and-adapters
[service]: ../../core-concepts/services/#toc_using-services
[signature]: ../../core-concepts/invokables/#toc_signature-basics
[transform]: ../../core-concepts/ember-data/#toc_transforms

<!-- External links -->

[declare]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier
[glint]: https://typed-ember.gitbook.io/glint/
