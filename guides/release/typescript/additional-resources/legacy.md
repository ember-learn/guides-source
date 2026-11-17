In the rest of this guide, we emphasize the happy path of working with Ember in the [Octane Edition][octane]. However, there are times you'll need to understand these details:

1. Most existing applications make heavy use of the pre-Octane (“legacy”) Ember programming model, and we support that model—with caveats.
2. Several parts of Ember Octane (specifically: routes, controllers, services, and class-based helpers) continue to use these concepts under the hood, and our types support that—so understanding them may be important at times.

The rest of this page is dedicated to helping you understand how Ember's types and the classic Ember system interact.

## EmberObject

When working with the legacy Ember object model, `EmberObject`, there are a number of caveats and limitations you need to be aware of. For today, these caveats and limitations apply to any classes which extend directly from `EmberObject`, or which extend classes which _themselves_ extend `EmberObject`.

Additionally, Ember's mixin system is deeply linked to the semantics and implementation details of `EmberObject`, and it has the most caveats and limitations.

### Failure Modes

When using mixins and classic class syntax, you will often need to define `this` in actions hashes, computed properties, etc. That in turn often leads to problems with self-referential `this`: TypeScript simply cannot figure out how to stop recursing through the definitions of the type.

Additionally, even when you get past the endlessly-recursive type definition problems, when enough mixins are resolved, TypeScript will occasionally just give up because it cannot resolve the property or method you're interested in across the many shared base classes.

Finally, when you have "zebra-striping" of your classes between classic classes and native classes, your types will often stop resolving.

### Mixins

The Ember mixin system is the legacy Ember construct TypeScript supports _least_ well. Mixins are fundamentally hostile to robust typing with TypeScript. While you can supply types for them, you will regularly run into problems with self-referentiality in defining properties within the mixins.

As a stopgap, you can refer to the type of a mixin using the `typeof` operator. In general, however, we strongly recommend you [migrate away from mixins][migrate-from-mixins] before attempting to convert code which relies on them to TypeScript.

### Classic Class Syntax

While this may not be intuitively obvious, the classic class syntax simply _is_ the mixin system. Every classic class creation is a case of mixing together multiple objects to create a new base class with a shared prototype. The result is that any time you see the classic `.extend({ ... })` syntax, regardless of whether there is a named mixin involved, you are dealing with Ember's legacy mixin system. This in turn means that you are dealing with the parts of Ember which TypeScript is _least_ able to handle well.

While we describe here how to use types with classic (mixin-based) classes insofar as they _do_ work, there are many failure modes. As a result, we strongly recommend you [migrate away from classic classes][migrating-from-classic-classes] as quickly as possible. This is the direction the Ember ecosystem as a whole is moving, but it is _especially_ important for TypeScript users.

## Computed Properties

You may encounter Ember's computed properties in the decorator form on native classes:

```typescript {data-filename="app/utils/user-profile.ts"}
import { computed } from '@ember/object';

export default class UserProfile {
  name = 'Chris';
  age = 33;

  @computed('name', 'age')
  get bio() {
    return `${this.name} is ${this.age} years old!`;
  }
}
```

Note that it is impossible for `@computed` to know whether the keys you pass to it are allowed or not. For this reason, we recommend you [migrate away from computed properties][migrate-from-computed] and [migrate away from classic classes][migrating-from-classic-classes] before converting to TypeScript.

## Classic `get` or `set` methods

In general, the `this.get` and `this.set` methods on `EmberObject` subclasses and the standalone `get` and `set` functions will work as you'd expect _if_ you're doing lookups only a single layer deep. We do not provide support for deep key lookups like `get(someObj, 'a.b.c')`, because normal property access works correctly across the whole Ember ecosystem since at least Ember and EmberData 3.28.

Since regular property access “just works”, you should migrate to using normal property access instead. TypeScript will help make this a smooth process by identifying where you need to handle null and undefined intermediate properties.

In the few cases where you _do_ need to use `get`, you can chain `get` calls instead of using deep key lookups. So `this.get('a.b.c')` becomes `this.get('a').get('b').get('c')`. In reality, though, it's unlikely you've got that many nested proxies, so the code might end up looking more like `this.get('a').b.c`.


<!-- Internal links -->

[migrate-from-computed]: ../../../upgrading/current-edition/tracked-properties/
[migrate-from-mixins]: ../../../upgrading/current-edition/native-classes/#toc_mixins
[migrating-from-classic-classes]: ../../../upgrading/current-edition/native-classes/

<!-- External links -->

[octane]: https://emberjs.com/editions/octane/
