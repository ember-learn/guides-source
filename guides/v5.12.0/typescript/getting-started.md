## Create a New TypeScript Application

To start a new Ember project with TypeScript, add the `--typescript` flag when you run [`ember new`][ember-new]:

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

The `typescript` package provides tooling to support TypeScript type checking and compilation. The `@types` packages from [DefinitelyTyped][] provide TypeScript type definitions for all of the Ember and EmberData modules.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Ember also publishes its own native types compiled directly from its source code. For now, we continue to use the <code>@types</code> packages in these guides for the sake of compatibility with EmberData, because the EmberData <code>@types</code> packages are not compatible with Ember's native official types.
        </p>
        <p>
          If you do not use EmberData, or if you use <a href="https://github.com/emberjs/data/blob/main/guides/typescript/index.md">EmberData's alpha native types</a>, we <i>highly</i> recommend following the instructions <a href="https://blog.emberjs.com/stable-typescript-types-in-ember-5-1/">in this blog post</a> to switch to the native types, which are guaranteed to always be 100% correct and 100% up to date!
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Files and Config to Support TypeScript

In addition to the usual files added with `ember new`, we also add:

- [`tsconfig.json`][tsconfig] – configuration to set up TypeScript for your project
- [`types/global.d.ts`][global-types] – the location for any global type declarations you need to write
- [`app/config/environment.d.ts`][environment-types] – a basic set of types defined for the contents of your `config/environment.js` file

Additionally:

- `package.json` will have a `lint:types` script to check types with the command line.
- `ember-cli-build.js` will be configured to transform TypeScript at build-time.
- `.ember-cli` has `isTypeScriptProject` set to true, which will force the blueprint generators to generate TypeScript rather than JavaScript by default.
- `.eslintrc.js` will be configured for TypeScript.

## Convert an Existing App to TypeScript

To convert an existing app to TypeScript, you'll need to make the changes described above manually (for now). To facilitate this, we've included a guide [here][converting].

<!-- Internal links -->

[converting]: ../application-development/converting-an-app/
[ember-new]: ../../getting-started/quick-start/
[environment-types]: ../additional-resources/faq/#toc_environment-configuration-typings
[global-types]: ../additional-resources/faq/#toc_global-types-for-your-project
[tsconfig]: ../application-development/configuration/#toc_tsconfigjson

<!-- External links -->

[DefinitelyTyped]: https://github.com/DefinitelyTyped/DefinitelyTyped
