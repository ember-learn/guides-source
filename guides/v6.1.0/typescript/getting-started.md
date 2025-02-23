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

- `typescript` – tooling to support TypeScript type checking and compilation.
- `@tsconfig/ember` – a shared TypeScript configuration for Ember apps.
- `@typescript-eslint/*` – ESLint support for TypeScript.
- `@types/qunit` - TypeScript type definitions for QUnit.
- `@types/rsvp` - TypeScript type definitions for RSVP.
- `@warp-drive/core-types` - shared core types, type utilities and constants for the WarpDrive and EmberData packages.

<!--
TODO: Uncomment this line when we add Glint docs
- `@glint/*` – a set of packages to support type-checking in templates.
  -->

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Ember and EmberData publish their own native types compiled directly from their source code, so you do not need to install any <code>@types/ember</code> or <code>@types/ember-data</code> packages. These packages should be considered legacy, are only lightly maintained, and will conflict with the native types.
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
