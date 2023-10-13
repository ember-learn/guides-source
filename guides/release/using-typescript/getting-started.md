**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

## Create a New TypeScript Application

To start a new Ember project with TypeScript, add the `--typescript` flag when you run [`ember new`](../../getting-started/quick-start):

```shell
ember new my-typescript-app --typescript
```

Using the `--typescript` flag changes the output of `ember new` in a few ways:

### TypeScript Project Files

Project files will be generated with `.ts` extensions instead of `.js`.

### Packages to Support TypeScript

In addition to the usual packages added with `ember new`, the following packages will be added at their current "latest" value:

- `typescript`
- `@tsconfig/ember`
- `@typescript-eslint/*`
- `@types/ember`
- `@types/ember-data`
- `@types/ember__*` – `@types/ember__object` for `@ember/object`, etc.
- `@types/ember-data__*` – `@types/ember-data__model` for `@ember-data/model`, etc.
- `@types/qunit`
- `@types/rsvp`

The `typescript` package provides tooling to support TypeScript type checking and compilation. The `@types` packages from [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) provide TypeScript type definitions for all of the Ember and EmberData modules.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Ember also publishes its own native types compiled directly from its source code, as described <a href="https://blog.emberjs.com/stable-typescript-types-in-ember-5-1/">in this blog post</a>. For now, we continue to use the <code>@types</code> packages by default for the sake of compatibility with EmberData, because EmberData is not yet compatible with Ember’s native official types. However, if you do not use EmberData, we <i>highly</i> recommend following the instructions in that blog post to switch to the native types, which are guaranteed to always be 100% correct and 100% up to date!
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Files and Config to Support TypeScript

In addition to the usual files added with `ember new`, we also add:

- [`tsconfig.json`](../application-development/configuration/#toc_tsconfig)
<!-- FIXME: Link -->
- `types/global.d.ts` – the location for any global type declarations you need to write for your own application; see [**Using TS Effectively: Global types for your package**](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/getting-started/docs/ts/using-ts-effectively/README.md#global-types-for-your-package) for information on its default contents and how to use it effectively
<!-- FIXME: Link -->
- `app/config/environment.d.ts` – a basic set of types defined for the contents of the `config/environment.js` file in your app; see [Environment and configuration typings](installation.md#environment-and-configuration-typings) for details

Additionally:

- `package.json` will have a `lint:types` script to check types with the command line.
- `ember-cli-build.js` will be configured to transform TypeScript at build-time.
- `.ember-cli` has `isTypeScriptProject` set to true, which will force the blueprint generators to generate TypeScript rather than JavaScript by default.
- `.eslintrc.js` will be configured for TypeScript.

## Convert an Existing App to TypeScript

To convert an existing app to TypeScript, you'll need to make the changes described above manually (for now). To facilitate this, we've included a guide [here][converting].

[converting]: ../application-development/converting-an-app/
