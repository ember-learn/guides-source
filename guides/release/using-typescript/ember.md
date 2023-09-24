**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

In this section, we cover how to use TypeScript effectively with specific Ember.js APIs.

We do _not_ cover general usage of Ember; instead, we assume that as background knowledge. Please see the [Ember Guides](../..) and [API docs](https://api.emberjs.com)!

## Components

Glimmer Components are defined in one of three ways:

- with templates only,
- with a template and a backing class,
- or with only a backing class (i.e. a [provider component][provider-component]).

[provider-component]: ../../tutorial/part-2/provider-components/

When using a backing class, you get a first-class experience using TypeScript! For type-checking Glimmer templates as well, see [Glint](https://typed-ember.gitbook.io/glint/).

### A simple component

A _very_ simple Glimmer component which lets you change the count of a value might look like this:

```handlebars {data-filename="app/components/counter.hbs"}
<button {{on 'click' this.minus}}>&minus;</button>
{{this.count}}
<button {{on 'click' this.plus}}>+</button>
```

```typescript {data-filename="app/components/counter.ts"}
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

To track this sort of information, Glimmer and Ember components accept a [`Signature`][signatures] type parameter as part of their definition. This parameter is expected to be an object type with (up to) three members: `Args`, `Element` and `Blocks`.

[signatures]: ../signatures

`Args` represents the arguments your component accepts. Typically this will be an object type mapping the names of your args to their expected type. For example:

```typescript
export interface MySignature {
  Args: {
    arg1: string;
    arg2: number;
    arg3: boolean;
  };
}
```

If no `Args` key is specified, it will be a type error to pass any arguments to your component. You can read more about `Element` and `Block` in the [Signatures documentation][signatures].

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

The `args` passed to a Glimmer Component [are available on `this`](https://github.com/glimmerjs/glimmer.js/blob/2f840309f013898289af605abffe7aee7acc6ed5/packages/%40glimmer/component/src/component.ts#L12), so we could change our definition to return the names of the arguments from a getter:

```typescript {data-filename="app/components/args-display.ts"}
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

```handlebars {data-filename="app/components/args-display.hbs"}
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

```handlebars {data-filename="app/components/user-profile.hbs"}
<div class='user-profile' ...attributes>
  {{#if this.avatar}}
    <img src={{this.avatar}} class='user-profile__avatar' />
  {{/if}}
  <p class='user-profile__bio'>{{this.userInfo}}</p>
</div>
```

Then we could capture the types for the profile with an interface representing the _arguments_:

```typescript {data-filename="app/components/user-profile.ts"}
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

Assuming the default `tsconfig.json` settings (with `strictNullChecks: true`), this wouldn't type-check if we didn't _check_ whether the `bio` argument were set.

### Generic subclasses

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

## Helpers

Helpers in Ember are just functions or classes with a well-defined interface, which means they largely Just Work™ with TypeScript. However, there are a couple things you’ll want to watch out for.

(As always, you should start by reading and understanding the [Ember Guide on Helpers](../../templates/writing-helpers/)!)

### Function-based helpers

<!-- FIXME: This section can be largely replaced with the Helper section in the Signatures chapter -->

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

#### Handling `named` arguments

We specified the type of `named` as a `Record<string, unknown>`. [`Record`][record] is a built-in TypeScript type representing a fairly standard type in JavaScript: an object being used as a simple map of keys to values. Here we set the values to `unknown` and the keys to `string`, since that accurately represents what callers may actually pass to a helper.

[record]: https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type

\(As with `positional`, we specify the type here as `unknown` to account for the fact that, without Glint, the template layer isn’t aware of types.)

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

Given those constraints, let’s see what a (very contrived) actual helper might look like in practice. Let’s imagine we want to take a pair of strings and join them with a required separator and optional prefix and postfixes:

```typescript {data-filename="app/helpers/join.ts"}
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

```typescript {data-filename="app/helpers/greet.ts"}
import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import Authentication from 'my-app/services/authentication';

export default class Greet extends Helper {
  @service authentication: Authentication;

  compute() {
    return this.authentication.isAuthenticated
      ? `Welcome back, ${authentication.userName}!`
      : 'Sign in?';
}
```

For more details on using decorators, see our [guide to using decorators](../gotchas/#toc_decorators). For details on using services, see our [guide to services](../ember#toc_services).

<!-- TODO: assert from @ember/debug -->
