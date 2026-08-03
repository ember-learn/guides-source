Building addons in TypeScript offers many of the same benefits as building apps in TypeScript: it puts an extra tool at your disposal to help document your code and ensure its correctness. For addons, though, there's one additional bonus: publishing type information for your addons enables autocomplete and inline documentation for your consumers, even if they're not using TypeScript themselves.

## Create a New TypeScript Addon

To start a new Ember addon with TypeScript, add the `--typescript` flag when you run [`ember addon`][ember-addon]:

```shell
ember addon my-typescript-addon --typescript
```

Using the `--typescript` flag changes the output of `ember addon` in a few ways:

### TypeScript Project Files

Project files will be generated with `.ts` extensions instead of `.js`.

### Packages to Support TypeScript

In addition to the usual packages added with `ember addon`, the following packages will be added at their current "latest" value:

- `typescript` – tooling to support TypeScript type checking and compilation.
- `@tsconfig/ember` – a shared TypeScript configuration for Ember apps.
- `@typescript-eslint/*` – ESLint support for TypeScript.
- `@types/qunit` - TypeScript type definitions for QUnit.
- `@types/rsvp` - TypeScript type definitions for RSVP.
- `@warp-drive/core-types` - shared core types, type utilities and constants for the WarpDrive and EmberData packages.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Ember and EmberData publish their own native types compiled directly from their source code, so you do not need to install any <code>@types/ember</code> or <code>@types/ember-data</code> packages. These packages should be considered legacy, are only lightly maintained, and will conflict with the native types.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Files and Config to Support TypeScript

In addition to the usual files added with `ember addon`, we also add:

- [`tsconfig.json`][tsconfig] – configuration to set up TypeScript for your project
- `tsconfig.declarations.json` (v1 addons only) – configures the compiler options for emitting declaration files as described below in ["Publishing Notes for V1 Addons"][publishing-v1]
- [`types/global.d.ts`][global-types] (v1 addons only) or `unpublished-development-types/index.d.ts` (v2 addons only) – the location for any global type declarations you need to write

Additionally:

- `package.json` will have a `lint:types` script to check types with the command line.
- (v1 addons only) `package.json` will also have a `prepack` script, a `postpack` script, and a default entry for `typesVersions` as described below in ["Publishing Notes for V1 Addons"][publishing-v1].
- `ember-cli-build.js` (v1 addons) or `babel.config.json` (v2 addons) will be configured to transform TypeScript at build-time.
- `.ember-cli` has `isTypeScriptProject` set to true, which will force the blueprint generators to generate TypeScript rather than JavaScript by default.
- `.eslintrc.js` will be configured for TypeScript.

## Publishing

When you publish an addon written in TypeScript, the `.ts` files will be consumed and transpiled by Babel as part of building the host application the same way `.js` files are, in order to meet the requirements of the application's `config/targets.js`. This means that no special steps are required for your source code to be consumed by users of your addon.

### Publishing Notes for V1 Addons

Even though you publish the source `.ts` files, by default your consumers who also use TypeScript won't be able to benefit from those types, because the TS compiler isn't aware of how `ember-cli` resolves import paths for addon files. For instance, if you write `import { foo } from 'my-addon/bar';`, the typechecker has no way to know that the actual file on disk for that import path is at `my-addon/addon/bar.ts`.

Because addons have no control over how files in `app/` are transpiled, **you cannot have `.ts` files in your addon's `app/` folder**.

In order for your addon's users to benefit from type information from your addon, you need to put [`.d.ts` _declaration files_][dts] at the location on disk where the compiler expects to find them. This addon provides two scripts to help with that: `prepack` and `postpack`. Additionally, the entry for [`typesVersions`][typesVersions] added to your `package.json` tell consuming apps where to find the types for the addon.

The `prepack` script will populate the overall structure of your package with `.d.ts` files laid out to match their import paths. For example, `addon/index.ts` would produce an `index.d.ts` file in the root of your package.

The `postpack` script will remove the generated `.d.ts` files, leaving your working directory back in a pristine state.

The TypeScript compiler has very particular rules when generating declaration files to avoid letting private types leak out unintentionally. You may find it useful to run `prepack` yourself as you're getting a feel for these rules to ensure everything will go smoothly when you publish.

## Linking V1 Addons

Often when developing an addon, it can be useful to run that addon in the context of some other host app so you can make sure it will integrate the way you expect, e.g. using [`yarn link`][yarn-link] or [`npm link`][npm-link].

When you do this for a TypeScript addon, the source files will be picked up in the host app build and everything will execute at runtime as you'd expect. If the host app is also using TypeScript, though, it won't be able to resolve imports from your addon by default, for the reasons outlined above in the ["Publishing Notes for V1 Addons"][publishing-v1] section.

You could run `prepack` in your addon any time you change a file, but for development a simpler option is to temporarily update the `paths` configuration in the host application so that it knows how to resolve types from your linked addon.

Add entries for `<addon-name>` and `<addon-name>/*` in your `tsconfig.json` like so:

```json {data-filename="tsconfig.json"}
"compilerOptions": {
  // ...other options
  "paths": {
    // ...other paths, e.g. for your app/ and tests/ trees
    // resolve: import x from 'my-addon';
    "my-addon": [
      "node_modules/my-addon/addon"
    ],
    // resolve: import y from 'my-addon/utils/y';
    "my-addon/*": [
      "node_modules/my-addon/addon/*"
    ]
  }
}
```

## In-Repo V1 Addons

[In-repo addons][] work in much the same way as linked ones. Their `.ts` files are managed automatically by `ember-cli-typescript` in their `dependencies`, and you can ensure imports resolve correctly from the host by adding entries in `paths` in the base `tsconfig.json` file.

```json {data-filename="tsconfig.json"}
{
  // ...other options
  "compilerOptions": {
    // ...other options
    "paths": {
      // ...other paths, e.g. for your tests/ tree
      "my-app": [
        "app/*",
        // add addon app directory that will be merged with the host application
        "lib/my-addon/app/*"
      ],
      // resolve: import x from 'my-addon';
      "my-addon": ["lib/my-addon/addon"],
      // resolve: import y from 'my-addon/utils/y';
      "my-addon/*": ["lib/my-addon/addon/*"]
    }
  }
}
```

One difference as compared to regular published addons: you know whether or not the host app is also using TypeScript, and if it is, **you can safely put `.ts` files in an in-repo addon's `app/` folder**.

## Templates

Templates are _currently_ totally non-type-checked. (Looking for type-checking in templates? Try [Glint][]!) This means that you lose any safety when moving into a template context.

Addons need to import templates from the associated `.hbs` file to bind to the layout of any components they export. The TypeScript compiler will report that it cannot resolve the module, since it does not know how to resolve files ending in `.hbs`. To resolve this, you can provide this set of definitions to `my-addon/types/global.d.ts`, which will allow the import to succeed:

```typescript {data-filename="my-addon/types/global.d.ts"}
declare module '*/template' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}

declare module 'app/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}

declare module 'addon/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars';
  const template: TemplateFactory;
  export default template;
}
```

<!-- Internal links -->

[global-types]: ../../additional-resources/faq/#toc_global-types-for-your-project
[publishing-v1]: ./#toc_publishing-notes-for-v1-addons
[tsconfig]: ../configuration/#toc_tsconfigjson

<!-- External links -->

[dts]: https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
[ember-addon]: https://cli.emberjs.com/release/writing-addons/
[glint]: https://typed-ember.gitbook.io/glint/
[In-repo addons]: https://cli.emberjs.com/release/writing-addons/in-repo-addons/
[npm-link]: https://docs.npmjs.com/cli/link
[typesVersions]: https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html#version-selection-with-typesversions
[yarn-link]: https://classic.yarnpkg.com/en/docs/cli/link
