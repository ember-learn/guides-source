## What about missing types?

### Gradually typing your app

See ["Gradual Typing Hacks"][gradual-typing-hacks] for strategies for incrementally adding types to your app.

### Install types for libraries

You'll want to use library type definitions as much as possible. Many packages ship their own type definitions, and many others have community-maintained definitions from [DefinitelyTyped][], available in the `@types` name space. The first thing you should do is to look for types from other libraries: it will mean using fewer ["Gradual Typing Hacks"][gradual-typing-hacks] and getting a lot more help both from your editor and from the compiler.

### The `types` directory

During installation, we create a `types` directory in the root of your application and add a [`"paths"`][tsconfig-paths] mapping to your `tsconfig.json` that includes that directory in any type lookups TypeScript tries to do. This is convenient for a few things:

- global types for your project (see the next section)
- writing types for libraries that do not have any types

These are all fallbacks, of course, you should use the types supplied directly with a package when possible.

#### Global types for your project

At the root of your application or addon, we include a `types/<your project>` directory with an `index.d.ts` file in it. Anything which is part of your project but which must be declared globally can go in this file. For example, if you have data attached to the `Window` object when the page is loaded (for bootstrapping or whatever other reason), this is a good place to declare it.

We automatically configure `index.d.ts` to be ready for [Glint][], which will make type checking work with Ember's templates. The default configuration only supports Ember's classic pairing of separate `.ts` and `.hbs` files, but Glint also supports the `<template>` format with `.gts` files. See the [corresponding package README][glint-environment-ember-template-imports] for more details. (Once Ember enables `<template>` by default, so will our Glint configuration!)

### Environment configuration typings

Along with the `@types/` files mentioned above, we add a starter interface for `config/environment.js` in `app/config/environment.d.ts`. This interface will likely require some changes to match your app.

We install this file because the actual `config/environment.js` is (a) not actually identical with the types as you inherit them in the content of an application, but rather a superset of what an application has access to, and (b) not in the same location as the path at which you look it up. The actual `config/environment.js` file executes in Node during the build, and Ember CLI writes its result as `<my-app>/config/environment` into your build for consumption at runtime.

## Type Narrowing with Ember Debug Assert

Ember's `assert` function from `@ember/debug` is super useful for ["type narrowing"][type-narrowing]—TypeScript's process of refining types to more specific types than originally declared. If you're not familiar with `assert`, you might want to take a look at its [API docs][debug-assert]! It's a development-and-test-only helper that gets stripped from production builds, and is very helpful for this kind of thing!

For example, let's pretend we're writing an addon that provides a `totalLength` helper to tally up the total length of an array of strings passed to it. Because addon authors cannot guarantee that their users will be using TypeScript, we've typed the positional arguments as an array of `unknown` so that TypeScript will ensure we've handled every possible valid or invalid argument a user might pass.

We can use `assert` to ensure that if a user passes an array containing non-string values, our addon will error in tests and development.

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

And, the types for `assert` ensure that TypeScript can use the condition you pass to properly narrow the types, because `assert` is typed as an [assertion function][assertion-function].

```typescript
export interface AssertFunc {
  (desc: string, condition: unknown): asserts condition;
  (desc: string): never;
}
```

## Strictness

You can enable TypeScript's current strictest configuration by including the `@tsconfig/strictest` base _before_ the `@tsconfig/ember` base in your `tsconfig.json`:

```json5 {data-filename="tsconfig.json" data-diff="+3"}
{
  extends: [
    '@tsconfig/strictest/tsconfig.json',
    '@tsconfig/ember/tsconfig.json',
  ],
  // ...
}
```

<!-- Internal links -->

[gradual-typing-hacks]: ../../application-development/converting-an-app/#toc_gradual-typing-hacks

<!-- External links -->

[assertion-function]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
[debug-assert]: https://api.emberjs.com/ember/6.0.0/functions/@ember%2Fdebug/assert
[DefinitelyTyped]: https://github.com/DefinitelyTyped/DefinitelyTyped
[glint-environment-ember-template-imports]: https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports#readme
[glint]: https://typed-ember.gitbook.io/glint
[tsconfig-paths]: https://www.typescriptlang.org/tsconfig#paths
[type-narrowing]: https://www.typescriptlang.org/docs/handbook/2/narrowing.html
