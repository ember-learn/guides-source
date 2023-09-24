**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

We emphasize the happy path of working with Ember in the [Octane Edition](https://emberjs.com/editions/octane/). However, there are times you’ll need to understand these details:

1. Most existing applications make heavy use of the pre-Octane (“legacy”) Ember programming model, and we support that model—with caveats.
2. Several parts of Ember Octane (specifically: routes, controllers, services, and class-based helpers) continue to use these concepts under the hood, and our types support that—so understanding them may be important at times.

The rest of this guide is dedicated to helping you understand how `ember-cli-typescript` and the classic Ember system interact.

## Classic Ember components

Many of the some considerations as discussed in the [TypeScript Guides for Ember Components](../core-concepts/invokables.md#toc_components) apply to classic Ember components. However, there are several additional considerations:

- Classic components support both named and positional arguments, so the signature for an Ember component must specify which kind of arguments something is when using both together. If you supply `Args` as an object shape the same way you would for a Glimmer component, those will be treated as named arguments.

- Classic components' arguments are merged with the properties on the class, rather than being supplied separately. As a result, they require more boilerplate to incorporate: we must use [interface merging][merge] to represent that the arguments and the properties of the class are the same. This also means that there is no support for type-powered completion with JSDoc for classic Ember components, because TypeScript does not support interface merging with JSDoc.

- The `Element` for a classic Ember component should be the same as [the `tagName`][tagName] for the component—but this is not type checked by Glint.

[merge]: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
[tagName]: https://api.emberjs.com/ember/5.2/classes/Component#43-property

If the `AudioPlayer` component shown above were a classic component, we would define its signature and backing class like this:

```typescript
import Component from '@ember/component';

import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface AudioPlayerArgs {
  /** The url for the audio to be played */
  srcUrl: string;
}

interface AudioPlayerSignature {
  Args: AudioPlayerArgs;
  Blocks: {
    fallback: [srcUrl: string];
    title: [];
  };
  Element: HTMLAudioElement;
}

export default interface AudioPlayer extends AudioPlayerArgs {}
export default class AudioPlayer extends Component<AudioPlayerSignature> {
  @tracked isPlaying = false;

  @action
  play() {
    this.isPlaying = true;
  }

  @action
  pause() {
    this.isPlaying = false;
  }
}
```

In general, while we do support classic Ember components for the sake of backwards compatibility and migration, we strongly recommend that you move to Glimmer components.

## EmberObject

When working with the legacy Ember object model, `EmberObject`, there are a number of caveats and limitations you need to be aware of. For today, these caveats and limitations apply to any classes which extend directly from `EmberObject`, or which extend classes which _themselves_ extend `EmberObject`:

- `Component` – meaning _classic_ Ember components, which imported from `@ember/component`, _not_ Glimmer components which are imported from `@glimmer/component` and do _not_ extend the `EmberObject` base class.
- `Controller`
- `Helper` – note that this applies only to the _class_ form. Function-based helpers do not involve the `EmberObject` base class.
- `Route`
- `Router`
- `Service`
- Ember Data’s `Model` class

Additionally, Ember’s mixin system is deeply linked to the semantics and implementation details of `EmberObject`, _and_ it has the most caveats and limitations.

{% hint style="info" %}
In the future, some of these may be able to drop their `EmberObject` base class dependency, but that will not happen till at least the next major version of Ember, and these guides will be updated when that happens.
{% endhint %}

### Mixins and classic class syntax

The Ember mixin system is the legacy Ember construct TypeScript supports _least_ well, as described in [Mixins](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/legacy/mixins/README.md). While this may not be intuitively obvious, the classic class syntax simply _is_ the mixin system. Every classic class creation is a case of mixing together multiple objects to create a new base class with a shared prototype. The result is that any time you see the classic `.extend({ ... })` syntax, regardless of whether there is a named mixin involved, you are dealing with Ember's legacy mixin system. This in turn means that you are dealing with the parts of Ember which TypeScript is _least_ able to handle well.

While we describe here how to use types with classic (mixin-based) classes insofar as they _do_ work, there are many failure modes. As a result, we strongly recommend moving away from both classic classes and mixins, and as quickly as possible. This is the direction the Ember ecosystem as a whole is moving, but it is _especially_ important for TypeScript users.

{% hint style="info" %}
The [Ember Atlas](https://emberatlas.com) includes guides for migrating [from classic classes to native classes](https://www.notion.so/Native-Classes-55bd67b580ca49f999660caf98aa1897), along with [a variety of patterns](https://www.notion.so/Converting-Classes-with-Mixins-5dc68c0ac3044e51a218fa7aec71c2db) for dealing with specific kinds of mixins in your codebase.
{% endhint %}

#### Failure modes

You often need to define `this` in actions hashes, computed properties, etc. That in turn often leads to problems with self-referential `this`: TypeScript simply cannot figure out how to stop recursing through the definitions of the type.

Additionally, even when you get past the endlessly-recursive type definition problems, when enough mixins are resolved TypeScript will occasionally just give up because it cannot resolve the property or method you're interested in across the many shared base classes.

Finally, when you have "zebra-striping" of your classes between classic classes and native classes, your types will often stop resolving.

### Native classes

#### `EmberObject`

In general, we recommend (following the Ember Octane guides) that any class which extends directly from the `EmberObject` base class eliminate any use of `EmberObject`-specific API and convert to standalone class, with no base class at all. You can follow the [ember-classic-decorator](https://github.com/emberjs/ember-classic-decorator) workflow to eliminate the base class—switching from `init` to `constructor`, getting rid of uses of methods like `this.set` and `this.get` in favor of using standalone `set` and `get`, and so on.

#### `EmberObject`-descended classes

The framework base classes which depend on `EmberObject` cannot follow the exact same path. However, as long as you are using native class syntax, all of these (`Component`, `Controller`, `Helper`, etc.) work nicely and safely with TypeScript. In each of these cases, the same caveats apply as with `EmberObject` itself, and you should follow the [ember-classic-decorator](https://github.com/emberjs/ember-classic-decorator) workflow with them as well if you are converting an existing app or addon. However, because these base classes themselves descend from `EmberObject`, you will not be able to remove the base classes as you can with your _own_ classes which descend _directly_ from `EmberObject`. Instead, you will continue to extend from the Ember base classes:

```typescript
import Component from '@ember/component';
export default class Profile extends Component {}
```

```typescript
import Controller from '@ember/controller';
export default class IndexController extends Controller {}
```

```typescript
import Helper from '@ember/component/helper';
export default class Localize extends Helper {}
```

```typescript
import Route from '@ember/routing/route';
export default class ApplicationRoute extends Route {}
```

```typescript
import EmberRouter from '@ember/routing/router';
export default class AppRouter extends EmberRouter {}
```

```typescript
import Service from '@ember/service';
export default class Session extends Service {}
```

```typescript
import Model from '@ember-data/model';
export default class User extends Model {}
```

## Computed Properties

There are two variants of Ember’s computed properties you may encounter:

- the decorator form used with native (ES6) classes
- the callback form used with classic classes (based on EmberObject)

### Decorator form

```typescript
import Component from '@ember/component';
import { computed } from '@ember/object/computed';

export default class UserProfile extends Compoennt {
  name = 'Chris';
  age = 33;

  @computed('name', 'age')
  get bio() {
    return `${this.name} is `${this.age}` years old!`;
  }
}
```

Note that it is impossible for `@computed` to know whether the keys you pass to it are allowed or not. Migrating to Octane eliminates this issue, since you mark reactive root state with `@tracked` and leave getters undecorated, rather than vice versa.

### Callback form

Computed properties in the classic object model take a callback instead:

```typescript
import Component from '@ember/component';
import { computed } from '@ember/object/computed';

const UserProfile = Component.extend({
  name: 'Chris',
  age: 32,

  bio: computed('name', 'age', function() {
    return `${this.get('name')} is `${this.get('age')}` years old!`;
  }),
})

export default UserProfile;
```

This definition will not type-check, however. You will need to explicitly write out a `this` type for computed property callbacks for `get` and `set` to type-check correctly:

```typescript
import Component from '@ember/component';
import { computed } from '@ember/object/computed';

const UserProfile = Component.extend({
  name: 'Chris',
  age: 32,

  bio: computed('name', 'age', function(this: UserProfile) {
    //                                  ^---------------^
    // `this` tells TS to use `UserProfile` for `get` and `set` lookups;
    // otherwise `this.get` below would not know the types of `'name'` or
    // `'age'` or even be able to suggest them for autocompletion.
    return `${this.get('name')} is `${this.get('age')}` years old!`;
  }),
})

export default UserProfile;
```

Note that this _does not always work_: you may get warnings from TypeScript about the item being defined in terms of itself.

**Accordingly, we strongly recommend migrating classic classes to ES native classes** _**before**_ **adding TypeScript!**

## Mixins

Mixins are fundamentally hostile to robust typing with TypeScript. While you can supply types for them, you will regularly run into problems with self-referentiality in defining properties within the mixins.

As a stopgap, you can refer to the type of a mixin using the `typeof` operator.

In general, however, prefer to use one of the following four strategies for migrating _away_ from mixins before attempting to convert code which relies on them to TypeScript:

1. For functionality which encapsulates DOM modification, rewrite as a custom modifier using [ember-modifier](https://github.com/emeber-modifier/ember-modifier).
2. If the mixin is a way of supplying shared behavior (not data), extract it to utility functions, usually just living in module scope and imported and exported as needed.
3. If the mixin is a way of supplying non-shared state which follows the lifecycle of a given object, replace it with a utility class instantiated in the owning class's `constructor` (or `init` for legacy classes).
4. If the mixin is a way of supplying long-lived, shared state, replace it with a service and inject it where it was used before. This pattern is uncommon, but sometimes appears when mixing functionality into multiple controllers or services.

You can also use inheritance and class decorators to accomplish some of the same semantics as mixins classically supplied. However, these patterns are more fragile and therefore not recommended.

## Classic `get` or `set` methods

In general, the `this.get` and `this.set` methods on `EmberObject` subclasses and the standalone `get` and `set` functions will work as you'd expect _if_ you're doing lookups only a single layer deep. We do not provide support for deep key lookups like `get(someObj, 'a.b.c')`, because normal property access can works correctly across the whole Ember ecosystem since at least Ember and Ember Data 3.28.

Since regular property access “just works”, and has for a very long time, you should migrate to using normal property access instead. TypeScript will help make this a smooth process by identifying where you need to handle null and undefined intermediate properties.
