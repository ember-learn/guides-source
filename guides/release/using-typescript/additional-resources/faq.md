**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

## What about missing types?

There are two schools of thought on how to handle things you don't have types for as you go:

- Liberally use `any` for them and come back and fill them in later. This will let you do the strictest strictness settings but with an escape hatch that lets you say "We will come back to this when we have more idea how to handle it." This approach lets you move faster, but means you will still have lots of runtime type errors: `any` just turns the type-checker _off_ for anything touching those modules. You’ll have to come back later and clean those up, and you’ll likely have more difficult refactorings to do at that time.

- Go more slowly, but write down at least minimally accurate types as you go. (This is easier if you follow the leaves-first strategy recommended above.) This is much slower going, and can feel harder because you can’t just skip over things. Once you complete the work for any given module, though, you can be confident that everything is solid and you won’t have to revisit it in the future.

There is an inherent tradeoff between these two approaches; which works best will depend on your team and your app.

### Install other types

You'll want to use other type definitions as much as possible. Many packages ship their own type definitions, and many others have community-maintained definitions from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped), available in the `@types` name space. The first thing you should do is to look for types from other addons: it will mean writing `any` a lot less and getting a lot more help both from your editor and from the compiler.

### The `types` directory

During installation, we create a `types` directory in the root of your application and add a `"paths"` mapping that includes that directory in any type lookups TypeScript tries to do. This is convenient for a few things:

- global types for your package (see the next section)
- writing types for third-party/`vendor` packages which do not have any types
- developing types for an addon which you intend to upstream later

These are all fallbacks, of course, you should use the types supplied directly with a package

#### Global types for your package

At the root of your application or addon, we include a `types/<your app>` directory with an `index.d.ts` file in it. Anything which is part of your application but which must be declared globally can go in this file. For example, if you have data attached to the `Window` object when the page is loaded (for bootstrapping or whatever other reason), this is a good place to declare it.

In the case of applications (but not for addons), we also automatically include declarations for Ember's prototype extensions in this `index.d.ts` file, with the `Array` prototype extensions enabled and the `Function` prototype extensions commented out. You should configure them to match your own config (which we cannot check during installation). If you are [disabling Ember's prototype extensions](https://guides.emberjs.com/v2.18.0/configuring-ember/disabling-prototype-extensions/), you can remove these declarations entirely; we include them because they're enabled in most Ember applications today.

We also automatically configure this to support [Glint], which makes type checking work with Ember's templates. The default configuration only supports Ember's classic pairing of separate `.ts` and `.hbs` files, but Glint also supports the `<template>` format with `.gts` files. See the [corresponding package README][glint-environment-ember-template-imports] for more details. (Once Ember enables `<template>` by default, so will our Glint configuration!)

[glint]: https://typed-ember.gitbook.io/glint
[glint-environment-ember-template-imports]: https://github.com/typed-ember/glint/tree/main/packages/environment-ember-template-imports#readme

#### Environment configuration typings

Along with the @types/ files mentioned above, ember-cli-typescript adds a starter interface for `config/environment.js` in `app/config/environment.d.ts`. This interface will likely require some changes to match your app.

We install this file because the actual `config/environment.js` is (a) not actually identical with the types as you inherit them in the content of an application, but rather a superset of what an application has access to, and (b) not in a the same location as the path at which you look it up. The actual `config/environment.js` file executes in Node during the build, and Ember CLI writes its result as `<my-app>/config/environment` into your build for consumption at runtime.

## Type Narrowing with Ember Debug Assert

<!-- TODO: assert from @ember/debug -->

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
