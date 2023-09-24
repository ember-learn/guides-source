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

#### Environment configuration typings

Along with the @types/ files mentioned above, ember-cli-typescript adds a starter interface for `config/environment.js` in `app/config/environment.d.ts`. This interface will likely require some changes to match your app.

We install this file because the actual `config/environment.js` is (a) not actually identical with the types as you inherit them in the content of an application, but rather a superset of what an application has access to, and (b) not in a the same location as the path at which you look it up. The actual `config/environment.js` file executes in Node during the build, and Ember CLI writes its result as `<my-app>/config/environment` into your build for consumption at runtime.

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
