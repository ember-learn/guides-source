**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

In this section, we cover how to use TypeScript effectively with specific Ember APIs \(anything you'd find under the `@ember` package namespace\).

We do _not_ cover general usage of Ember; instead, we assume that as background knowledge. Please see the Ember [Guides](https://guides.emberjs.com/release/) and [API docs](https://api.emberjs.com/ember/release)!

## Outline

- [Components](./components.md)
- [Services](./services.md)
- [Routes](./routes.md)
- [Controllers](./controllers.md)
- [Helpers](./helpers.md)
- [Testing](./testing.md)

## Components

{% hint style="info" %}
New to Ember or the Octane edition specifically? You may want to read [the Ember Guides’ material on `Component`s](https://guides.emberjs.com/release/components/) first!
{% endhint %}

Glimmer Components are defined in one of three ways: with templates only, with a template and a backing class, or with only a backing class \(i.e. a `yield`-only component\). When using a backing class, you get a first-class experience using TypeScript! For type-checking Glimmer templates as well, see [Glint](https://typed-ember.gitbook.io/glint/).

### A simple component

A _very_ simple Glimmer component which lets you change the count of a value might look like this:

```text
<button {{on "click" this.minus}}>&minus;</button>
{{this.count}}
<button {{on "click" this.plus}}>+</button>
```

```typescript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Counter extends Component {
  @tracked count = 0;

  @action plus() {
    this.count += 1;
  }

  @action minus() {
    this.count -= 1;
  }
}
```

Notice that there are no type declarations here – but this _is_ actually a well-typed component. The type of `count` is `number`, and if we accidentally wrote something like `this.count = "hello"` the compiler would give us an error.

### Adding arguments and giving them a type

So far so good, but of course most components aren’t quite this simple! Instead, they’re invoked by other templates and they can invoke other components themselves in their own templates.

Glimmer components can receive both _arguments_ and _attributes_ when they are invoked. When you are working with a component’s backing class, you have access to the arguments but _not_ to the attributes. The arguments are passed to the constructor, and then available as `this.args` on the component instance afterward.

Since the implementation of [RFC 748], Glimmer and Ember components accept a `Signature` type parameter as part of their definition. This parameter is expected to be an object type with (up to) three members: `Args`, `Element` and `Blocks`.

[rfc 748]: https://github.com/emberjs/rfcs/pull/748

`Args` represents the arguments your component accepts. Typically this will be an object type mapping the names of your args to their expected type. For example:

```
export interface MySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  }
}
```

If no `Args` key is specified, it will be a type error to pass any arguments to your component. You can read more about `Element` and `Block` in the Glint [Component Signatures documentation](https://typed-ember.gitbook.io/glint/using-glint/ember/component-signatures).

Let’s imagine a component which just logs the names of its arguments when it is first constructed. First, we must define the Signature and pass it into our component, then we can use the `Args` member in our Signature to set the type of `args` in the constructor:

```typescript
import Component from '@glimmer/component';

const log = console.log.bind(console);

export interface ArgsDisplaySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  }
}

export default class ArgsDisplay extends Component<ArgsDisplaySignature> {
  constructor(owner: unknown, args: ArgsDisplaySignature['Args]) {
    super(owner, args);

    Object.keys(args).forEach(log);
  }
}
```

{% hint style="info" %}
If you’re used to the classic Ember Object model, there are two important differences in the constructor itself:

- we use `super` instead of `this._super`
- we _must_ call `super` before we do anything else with `this`, because in a subclass `this` is set up by running the superclass's constructor first \(as implied by [the JavaScript spec](https://tc39.es/ecma262/#sec-runtime-semantics-classdefinitionevaluation)\)
  {% endhint %}

Notice that we have to start by calling `super` with `owner` and `args`. This may be a bit different from what you’re used to in Ember or other frameworks, but is normal for sub-classes in TypeScript today. If the compiler just accepted any `...arguments`, a lot of potentially _very_ unsafe invocations would go through. So, instead of using `...arguments`, we explicitly pass the _specific_ arguments and make sure their types match up with what the super-class expects.

{% hint style="info" %}
This might change in the future! If TypeScript eventually adds [support for “variadic kinds”](https://github.com/Microsoft/TypeScript/issues/5453), using `...arguments` could become safe.
{% endhint %}

The types for `owner` here and `args` line up with what the `constructor` for Glimmer components expect. The `owner` is specified as `unknown` because this is a detail we explicitly _don’t_ need to know about. The `args` are the `Args` from the Signature we defined.

The `args` passed to a Glimmer Component [are available on `this`](https://github.com/glimmerjs/glimmer.js/blob/2f840309f013898289af605abffe7aee7acc6ed5/packages/%40glimmer/component/src/component.ts#L12), so we could change our definition to return the names of the arguments from a getter:

```typescript
import Component from '@glimmer/component';

export interface ArgsDisplaySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  };
}

export default class ArgsDisplay extends Component<ArgsDisplaySignature> {
  get argNames(): string[] {
    return Object.keys(this.args);
  }
}
```

```text
<p>The names of the <code>@args</code> are:</p>
<ul>
  {{#each this.argNames as |argName|}}
    <li>{{argName}}</li>
  {{/each}}
</ul>
```

#### Understanding `args`

Now, looking at that bit of code, you might be wondering how it knows what the type of `this.args` is. In the `constructor` version, we explicitly _named_ the type of the `args` argument. Here, it seems to just work automatically. This works because the type definition for a Glimmer component looks roughly like this:

```typescript
export default class Component<Args extends {} = {}> {
  readonly args: Args;

  constructor(owner: unknown, args: Args);
}
```

{% hint style="info" %}
Not sure what’s up with `<Args>` _at all_? We highly recommend the [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/) book’s [chapter on generics](https://basarat.gitbooks.io/typescript/docs/types/generics.html) to be quite helpful in understanding this part.
{% endhint %}

The type signature for Component, with `Args extends {} = {}`, means that the component _always_ has a property named `args` —

- with the type `Args`
- which can be anything that extends the type `{}` – an object
- and _defaults_ to being just an empty object – `= {}`

This is analogous to the type of `Array` : since you can have an array of `string` , or an array of `number` or an array of `SomeFancyObject` , the type of array is `Array<T>` , where `T` is the type of thing in the array, which TypeScript normally figures out for you automatically at compile time:

```typescript
let a = [1, 2, 3]; // Array<number>
let b = ['hello', 'goodbye']; // Array<string>
```

In the case of the Component, we have the types the way we do so that you can’t accidentally define `args` as a string, or `undefined` , or whatever: it _has_ to be an object. Thus, `Component<Args extends {}>` . But we also want to make it so that you can just write `extends Component` , so that needs to have a default value. Thus, `Component<Args extends {} = {}>`.

#### Giving `args` a type

Now let’s put this to use. Imagine we’re constructing a user profile component which displays the user’s name and optionally an avatar and bio. The template might look something like this:

```text
<div class='user-profile' ...attributes>
  {{#if this.avatar}}
    <img src={{this.avatar}} class='user-profile__avatar'>
  {{/if}}
  <p class='user-profile__bio'>{{this.userInfo}}</p>
</div>
```

Then we could capture the types for the profile with an interface representing the _arguments_:

```typescript
import Component from '@glimmer/component';
import { generateUrl } from '../lib/generate-avatar';

interface User {
  name: string;
  avatar?: string;
  bio?: string;
}

export default class UserProfile extends Component<User> {
  get userInfo(): string {
    return this.args.bio
      ? `${this.args.name} ${this.args.bio}`
      : this.args.name;
  }

  get avatar(): string {
    return this.args.avatar ?? generateUrl();
  }
}
```

Assuming the default `tsconfig.json` settings \(with `strictNullChecks: true`\), this wouldn't type-check if we didn't _check_ whether the `bio` argument were set.

### Generic subclasses

If you'd like to make your _own_ component subclass-able, you need to make it generic as well.

{% hint style="warning" %}
Are you sure you want to provide an inheritance-based API? Oftentimes, it's easier to maintain \(and involves less TypeScript hoop-jumping\) to use a compositional API instead. If you're sure, here's how!
{% endhint %}

```typescript
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

{% hint style="info" %}
If you are not familiar with Services in Ember, first make sure you have read and understood the [Ember Guide on Services](https://guides.emberjs.com/release/services/)!
{% endhint %}

### A basic service

Let's take this example from the [Ember Guide](https://guides.emberjs.com/release/services/):

```typescript
import { A } from '@ember/array';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = A([]);

  add(item) {
    this.items.pushObject(item);
  }

  remove(item) {
    this.items.removeObject(item);
  }

  empty() {
    this.items.clear();
  }
}
```

Just making this a TypeScript file gives us some type safety without having to add any additional type information. We'll see this when we use the service elsewhere in the application.

{% hint style="info" %}
When working in Octane, you're better off using a `TrackedArray` from [tracked-built-ins](https://github.com/pzuraq/tracked-built-ins) instead of the classic EmberArray:

```typescript
import { TrackedArray } from 'tracked-built-ins';
import Service from '@ember/service';

export default class ShoppingCartService extends Service {
  items = new TrackedArray();

  add(item) {
    this.items.push(item);
  }

  remove(item) {
    this.items.splice(
      1,
      this.items.findIndex((i) => i === item)
    );
  }

  empty() {
    this.items.clear();
  }
}
```

Notice that here we are using only built-in array operations, not Ember's custom array methods.
{% endhint %}

### Using services

You can use a service in any container-resolved object such as a component or another service. Services are injected into these objects by decorating a property with the `inject` decorator. Because decorators can't affect the type of the property they decorate, we must manually type the property. Also, we must use `declare` modifier to tell the TypeScript compiler to trust that this property will be set up by something outside this component—namely, the decorator.

Here's an example of using the `ShoppingCartService` we defined above in a component:

```typescript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
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

```typescript
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
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

```typescript
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

Here we need to cast the lookup result to `ShoppingCartService` in order to get any type-safety because the lookup return type is `any` \(see caution below\).

{% hint style="danger" %}
This type-cast provides no guarantees that what is returned by the lookup is actually the service you are expecting. Because TypeScript cannot resolve the lookup micro-syntax \(`service:<name>`\) to the service class, a typo would result in returning something other than the specified type. It only gurantees that _if_ the expected service is returned that you are using it correctly.

There is a merged \(but not yet implemented\) [RFC](https://emberjs.github.io/rfcs/0585-improved-ember-registry-apis.html) which improves this design and makes it straightforward to type-check. Additionally, TypeScript 4.1's introduction of [template types](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#template-literal-types) may allow us to supply types that work with the microsyntax.

For now, however, remember that _the cast is unsafe_!
{% endhint %}

## Routes

Working with Routes is in general just working normal TypeScript classes. Ember's types supply the definitions for the various lifecycle events available within route subclasses, which will provide autocomplete and type-checking along the way in general.

However, there is one thing to watch out for: the types of the arguments passed to methods will _not_ autocomplete as you may expect. This is because in _general_ a subclass may override a superclass method as long as it calls its superclass's method correctly. This is very bad practice, but it is legal JavaScript! This is never a concern for lifecycle hooks in Ember, because they are called by the framework itself. However, TypeScript does not and cannot know that, so we have to provide the types directly.

Accordingly, and because the `Transition` type is not currently exported as a public type, you may find it convenient to define it using TypeScript's `ReturnType` utility type, which does exactly what it sounds like and gives us a local type which is the type returned by some function. The `RouterService.transitionTo` returns a `Transition`, so we can rely on that as stable public API to define `Transition` locally ourselves:

```typescript
import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
type Transition = ReturnType<RouterService['transitionTo']>;

export default class MyRoute extends Route {
  beforeModel(transition: Transition) {
    // ...
  }
}
```

This inconsistency will be solved in the future. For now, this workaround gets the job done, and also shows the way to using this information to provide the type of the route's model to other consumers: see [Working with Route Models](../cookbook/working-with-route-models.md) for details!

```typescript
import Route from '@ember/routing/route';

type Resolved<P> = P extends Promise<infer T> ? T : P;

export type MyRouteModel = Resolved<ReturnType<MyRoute['model']>>;

export default class MyRoute extends Route {
  model() {
    // ...
  }
}
```

The `Resolved<T>` utility type takes in any type, and if the type is a `Promise` it transforms the type into whatever the `Promise` resolves to; otherwise it just returns the same type. (If you’re using TypeScript 4.5 or later, you can use the built-in `Awaited<T>` type, which does the same thing but more robustly: it also handles nested promises.) As we saw above, `ReturnType` gets us the return type of the function. So our final `MyRouteModel` type takes the return type from our `model` hook, and uses the `Resolved` type to get the type the promise will resolve to—that is, exactly the type we will have available as `@model` in the template and as `this.model` on a controller.&#x20;

This in turn allows us to use the route class to define the type of the model on an associated controller.

```typescript
import Controller from '@ember/controller';
import type { MyRouteModel } from '../routes/my-route';

export default class MyController extends Controller {
  declare model?: MyRouteModel;

  // ...
}
```

Notice here that the `model` is declared as optional. That’s intentional: the `model` for a given controller is _not_ set when the controller is constructed (that actually happens _either_ when the page corresponding to the controller is created _or_ the first time a `<LinkTo>` which links to that page is rendered). Instead, the `model` is set on the controller when the corresponding route is successfully entered, via its `setupController` hook.

## Working with route models

We often use routes’ models throughout our application, since they’re a core ingredient of our application’s data. As such, we want to make sure that we have good types for them!

We can start by defining some type utilities to let us get the resolved value returned by a route’s model hook:

```typescript
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
- `ReturnType<T>` gets the return value of a given function
- `R['model']` \(where `R` has to be `Route` itself or a subclass\) uses TS's mapped types to say "the property named `model` on `R`

Putting those all together, `ModelFrom<Route>` ends up giving you the resolved value returned from the `model` hook for a given route:

```typescript
type MyRouteModel = ModelFrom<MyRoute>;
```

### `model` on the controller

We can use this functionality to guarantee that the `model` on a `Controller` is always exactly the type returned by `Route::model` by writing something like this:

```typescript
import Controller from '@ember/controller';
import MyRoute from '../routes/my-route';
import { ModelFrom } from '../lib/type-utils';

export default class ControllerWithModel extends Controller {
  declare model: ModelFrom<MyRoute>;
}
```

Now, our controller’s `model` property will _always_ stay in sync with the corresponding route’s model hook.

**Note:** this _only_ works if you do not mutate the `model` in either the `afterModel` or `setupController` hooks on the route! That's generally considered to be a bad practice anyway. If you do change the type there, you'll need to define the type in some other way and make sure your route's model is defined another way.

## Controllers

Like [routes](./routes.md), controllers are just normal classes with a few special Ember lifecycle hooks and properties available.

The main thing you need to be aware of is special handling around query params. In order to provide type safety for query param configuration, Ember's types specify that when defining a query param's `type` attribute, you must supply one of the allowed types: `'boolean'`, `'number'`, `'array'`, or `'string'` \(the default\). However, if you supply these types as you would in JS, like this:

```typescript
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

<!-- FIXME: Re-add diff -->

```typescript
import Controller from "@ember/controller";

export default class HeyoController extends Controller {
  queryParams = [
    {
-     category: { type: "array" },
+     category: { type: "array" as const },
    },
  ];
}
```

Now it will type-check.

## Helpers

Helpers in Ember are just functions or classes with a well-defined interface, which means they largely Just Work™ with TypeScript. However, there are a couple things you’ll want to watch out for.

{% hint style="info" %}
As always, you should start by reading and understanding the [Ember Guide on Helpers](https://guides.emberjs.com/release/templates/writing-helpers/)!
{% endhint %}

### Function-based helpers

The basic type of a helper function in Ember is:

```typescript
type FunctionBasedHelper = (
  positional: unknown[],
  named: Record<string, unknown>
) => string | void;
```

This represents a function which _may_ have an arbitrarily-long list of positional arguments, which _may_ be followed by a single dictionary-style object containing any named arguments.

There are three important points about this definition:

1. `positional` is an array of `unknown`, of unspecified length.
2. `named` is a `Record`.
3. Both arguments are always set, but may be empty.

Let’s walk through each of these.

#### Handling `positional` arguments

The type is an array of `unknown` because we don’t \(yet!\) have any way to make templates aware of the information in this definition—so users could pass in _anything_. We can work around this using [type narrowing](https://microsoft.github.io/TypeScript-New-Handbook/chapters/narrowing/)—TypeScript’s way of using runtime checks to inform the types at runtime.

```typescript
function totalLength(positional: unknown[]) {
  // Account for case where user passes no arguments
  assert(
    'all positional args to `total-length` must be strings',
    positional.every((arg) => typeof arg === 'string')
  );

  // safety: we can cast `positional as string[]` because we asserted above
  return (positional as string[]).reduce((sum, s) => sum + s.length, 0);
}
```

#### Handling `named` arguments

We specified the type of `named` as a `Record<string, unknown>`. `Record` is a built-in TypeScript type representing a fairly standard type in JavaScript: an object being used as a simple map of keys to values. Here we set the values to `unknown` and the keys to `string`, since that accurately represents what callers may actually pass to a helper.

\(As with `positional`, we specify the type here as `unknown` to account for the fact that the template layer isn’t aware of types yet.\)

#### `positional` and `named` presence

Note that even if the user passes _no_ arguments, both `positional` and `named` are always present. They will just be _empty_ in that case. For example:

```typescript
import { helper } from '@ember/component/helper';

const describe = (entries: string): string =>
  entries.length > 0 ? entries : '(none)';

export function showAll(positional: unknown[], named: Record<string, unknown>) {
  // pretty print each item with its index, like `0: { neat: true }` or
  // `1: undefined`.
  const positionalEntries = positional
    .reduce<string[]>(
      (items, arg, index) => items.concat(`${index}: ${JSON.stringify(arg)}`),
      []
    )
    .join(', ');

  // pretty print each item with its name, like `cool: beans` or
  // `answer: 42`.
  const namedEntries = Object.keys(named)
    .reduce<string[]>(
      (items, key) =>
        items.concat(`${key}: ${JSON.stringify(named[key], undefined, 2)}`),
      []
    )
    .join(', ');

  return `positional: ${describe(positionalEntries)}\nnamed: ${describe(
    namedEntries
  )}`;
}

export default helper(showAll);
```

#### Putting it all together

Given those constraints, let’s see what a \(very contrived\) actual helper might look like in practice. Let’s imagine we want to take a pair of strings and join them with a required separator and optional prefix and postfixes:

```typescript
import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { is } from '../../type-utils';

export function join(positional: [unknown, unknown], named: Dict<unknown>) {
  assert(
    `'join' requires two 'string' positional parameters`,
    is<[string, string]>(
      positional,
      positional.length === 2 &&
        positional.every((el) => typeof el === 'string')
    )
  );
  assert(
    `'join' requires argument 'separator'`,
    typeof named.separator === 'string'
  );

  const joined = positional.join(named.separator);
  const prefix = typeof named.prefix === 'string' ? named.prefix : '';

  return `${prefix}${joined}`;
}

export default helper(join);
```

### Class-based helpers

The basic type of a class-based helper function in Ember is:

```typescript
interface ClassBasedHelper {
  compute(
    positional?: unknown[],
    named?: Record<string, unknown>
  ): string | void;
}
```

Notice that the signature of `compute` is the same as the signature for the function-based helper! This means that everything we said above applies in exactly the same way here. The only differences are that we can have local state and, by extending from Ember’s `Helper` class, we can hook into the dependency injection system and use services.

```typescript
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import Authentication from 'my-app/services/authentication';

export default class Greet extends Helper {
  @service authentication: Authentication;

  compute() {
    return this.authentication.isAuthenticated
      ? `Welcome back, ${authentication.userName}!`
      : 'Sign in?';
}
```

For more details on using decorators, see our [guide to using decorators](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/ember/%28../ts/decorators/%29/README.md). For details on using services, see our [guide to services](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/ember/%28./services/%29/README.md).

## Testing

Testing with TypeScript mostly works just the same as you'd expect in a non-TypeScript Ember application—so if you're just starting out with Ember, we recommend you read the official Ember [Testing Guides](https://guides.emberjs.com/release/testing/) first. The rest of this guide assumes you're already comfortable with testing in Ember!

When working with TypeScript in Ember tests, there are a few differences in your experience, and there are also differences in how you should handle testing app code vs. addon code.

### App tests

One major difference when working with TypeScript in _app_ code is that once your app is fully converted, there are a bunch of kinds of tests you just don't need to write any more: things like testing bad inputs to functions. We'll use an admittedly silly and contrived example here, an `add` function to add two numbers together, so that we can focus on the differences between JavaScript and TypeScript, rather than getting hung up on the details of this particular function.

First, the function we're testing might look like this.

{% hint style="info" %}
Here we’re using the `assert` from `@ember/debug`. If you’re not familiar with it, you might want to take a look at its [API docs](https://api.emberjs.com/ember/3.14/functions/@ember%2Fdebug/assert)! It’s a development-and-test-only helper that gets stripped from production builds, and is very helpful for this kind of thing!
{% endhint %}

```javascript
// app/utils/math.js

export function add(a, b) {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Then the test for it might look something like this:

```javascript
// tests/unit/utils/math-test.js

import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.equal('2 + 2 is 4', add(2, 2), 4);
    assert.notEqual('2 + 2 is a number', add(2, 2), NaN);
    assert.notEqual('2 + 2 is not infinity', add(2, 2), Infinity);
  });

  test('throws an error with strings', function (assert) {
    assert.throws('when the first is a string and the second is a number', () =>
      add('hello', 1)
    );
    assert.throws('when the first is a number and the second is a string', () =>
      add(0, 'hello')
    );
    assert.throws('when both are strings', () => add('hello', 'goodbye'));
  });
});
```

In TypeScript, that wouldn't make any sense at all, because we'd simply add the types to the function declaration:

```typescript
// app/utils/math.ts

export function add(a: number, b: number): number {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

We might still write tests to make sure what we actually got back was what we expected—

```typescript
// tests/unit/utils/math-test.ts

import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.equal('2 + 2 is 4', add(2, 2), 4);
    assert.notEqual('2 + 2 is a number', add(2, 2), NaN);
    assert.notEqual('2 + 2 is not infinity', add(2, 2), Infinity);
  });
});
```

—but there are a bunch of things we _don't_ need to test. All of those special bits of handling for the case where we pass in a `string` or `undefined` or whatever else? We can drop that. Notice, too, that we can drop the assertion from our function definition, because the _compiler_ will check this for us:

```typescript
// app/utils/math.ts

export function add(a: number, b: number): number {
  return a + b;
}
```

### Addon tests

Note, however, that this _only_ applies to _app code_. If you're writing an Ember addon \(or any other library\), you cannot assume that everyone consuming your code is using TypeScript. You still need to account for these kinds of cases. This will require you to do something that probably feels a bit gross: casting a bunch of values `as any` for your tests, so that you can test what happens when people feed bad data to your addon!

Let's return to our silly example with an `add` function. Our setup will look a lot like it did in the JavaScript-only example—but with some extra type coercions along the way so that we can invoke it the way JavaScript-only users might.

First, notice that in this case we’ve added back in our `assert` in the body of the function. The inputs to our function here will get checked for us by any TypeScript users, but this way we are still doing the work of helping out our JavaScript users.

```typescript
function add(a: number, b: number): number {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Now, back in our test file, we’re similarly back to testing all those extra scenarios, but here TypeScript would actually stop us from even having these tests work _at all_ if we didn’t use the `as` operator to throw away what TypeScript knows about our code!

```javascript
// tests/unit/utils/math-test.js

import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function(hooks) {
  test('adds numbers correctly', function(assert) {
    assert.equal('2 + 2 is 4', add(2, 2), 4);
    assert.notEqual('2 + 2 is a number', add(2, 2), NaN);
    assert.notEqual('2 + 2 is not infinity', add(2, 2), Infinity);
  });

  test('throws an error with strings', function(assert) {
    assert.throws(
      'when the first is a string and the second is a number',
      () => add('hello' as any, 1)
    );
    assert.throws(
      'when the first is a number and the second is a string',
      () => add(0, 'hello' as any)
    );
    assert.throws(
      'when both are strings',
      () => add('hello' as any, 'goodbye' as any)
    );
  })
});
```

### Gotchas

#### The `TestContext`

A common scenario in Ember tests, especially integration tests, is setting some value on the `this` context of the tests, so that it can be used in the context of the test. For example, we might need to set up a `User` type to pass into a `Profile` component.

We’re going to start by defining a basic `User` and `Profile` so that we have a good idea of what we’re testing.

The `User` type is very simple, just an `interface`:

```typescript
// app/types/user.ts

export default interface User {
  displayName: string;
  avatarUrl?: string;
}
```

Then our component might be defined like this:

```text
{{! app/components/profile.hbs }}

<div class='user-profile' ...attributes>
  <img
    src={{this.avatar}}
    alt={{this.description}}
    class='avatar'
    data-test-avatar
  />
  <span class='name' data-test-name>{{@displayName}}</span>
</div>
```

```typescript
import Component from '@glimmer/component';
import User from 'app/types/user';
import { randomAvatarURL } from 'app/utils/avatar';

export default class Profile extends Component<User> {
  get avatar() {
    return this.args.avatar ?? randomAvatarURL();
  }

  get description() {
    return this.args.avatar
      ? `${this.args.displayName}'s custom profile picture`
      : 'a randomly generated placeholder avatar';
  }
}
```

{% hint style="info" %}
Not familiar with how we define a Glimmer `Component` and its arguments? Check out [our guide](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/ember/components/README.md)!
{% endhint %}

Now, with that setup out of the way, let’s get back to talking about the text context! We need to set up a `User` to pass into the test. With TypeScript on our side, we can even make sure that it actually matches up to the type we want to use!

```typescript
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import User from 'app/types/user';

module('Integration | Component | Profile', function(hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function(assert) {
    this.user: User = {
      displayName: 'Rey',
      avatar: 'https://example.com/star-wars/rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);

    assert.dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatar);
    assert.dom('[data-test-avatar]')
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function(assert) {
    this.user: User = {
      displayName: 'Rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);

    assert.dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/);
    assert.dom('[data-test-avatar]')
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

This is a decent test, and TypeScript actually makes the experience of writing certain parts of it pretty nice. Unfortunately, though, it won’t type-check. TypeScript reports that the `user` field doesn't exist on the `TestContext`. Now, TypeScript _does_ know that QUnit sets up that helpfully-named `TestContext`—so a lot of the things we can do in tests work out of the box—but we haven’t told TypeScript that `this` now has a `user` property on it.

To inform TypeScript about this, we need to tell it that the type of `this` in each test assertion includes the `user` property, of type `User`. We’ll start by importing the `TestContext` defined by Ember’s test helpers, and extending it:

```typescript
import { TestContext } from '@ember/test-helpers';

import User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}
```

Then, in every `test` callback, we need to [specify the `this` type](https://www.typescriptlang.org/docs/handbook/functions.html#this):

```typescript
test('...', function (this: Context, assert) {});
```

Putting it all together, this is what our updated test definition would look like:

```typescript
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}

module('Integration | Component | Profile', function(hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function(this: Context, assert) {
    this.user: User = {
      displayName: 'Rey',
      avatar: 'https://example.com/star-wars/rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);

    assert.dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatar);
    assert.dom('[data-test-avatar]')
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function(this: Context, assert) {
    this.user: User = {
      displayName: 'Rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);

    assert.dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/);
    assert.dom('[data-test-avatar]')
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

Now everything type-checks again, and we get the nice auto-completion we’re used to when dealing with `this.user` in the test body.

{% hint style="info" %}
If you’ve been around TypeScript a little, and you look up the type of the `TestContext` and realize its an interface, you might be tempted to reach for declaration merging here. Don’t! If you do that, _every single test in your entire application_ will now have a `user: User` property on it!
{% endhint %}

There are still a couple things to be careful about here, however. First, we didn’t specify that the `this.user` property was _optional_. That means that TypeScript won’t complain if you do `this.user` _before_ assigning to it. Second, every test in our module gets the same `Context`. Depending on what you’re doing, that may be fine, but you may end up needing to define multiple distinct test context extensions. If you _do_ end up needing to define a bunch of different test context extension, that may be a sign that this particular set of tests is doing too much. That in turn is probably a sign that this particular _component_ is doing too much!
