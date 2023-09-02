**Note:** 🚧 This section is under construction! 🏗️ The content here may not be fully up to date!

<!-- FIXME: Merge this section with previous. -->

To start a new Ember project with TypeScript, you can add the `--typescript` flag when you run [`ember new`](../../getting-started/quick-start):

```shell
ember new my-typescript-app --typescript
```

All dependencies will be added to your `package.json`, and you're ready to roll!

Using the `--typescript` flag changes the output of `ember new` in a few ways:

- project files will be generated with `.ts` extensions instead of `.js`
- packages will be installed and files will be generated to make TypeScript work in your project
- We configure Babel to transpile TypeScript files.
- We configure TypeScript to type check your project.

## Packages

When `ember new` is run with the `--typescript` flag set, we install all of the following packages at their current "latest" value:

- `typescript`
- `@types/ember`
- `@types/ember-data`
- `@types/ember__*` – `@types/ember__object` for `@ember/object` etc.
- `@types/ember-data__*` – `@types/ember-data__model` for `@ember-data/model` etc.
- `@types/qunit`
- `@types/rsvp`

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Ember also includes its own types compiled directly from its source code, as described <a href="https://blog.emberjs.com/stable-typescript-types-in-ember-5-1/">in this blog post</a>. We still use the <code>@types</code> packages by default for the sake of compatibility with Ember Data, because Ember Data is not yet compatible with Ember’s native official types. However, if you only do not use Ember Data, we recommend following the instructions in that blog post to switch to the native types, which are guaranteed to always be 100% correct and 100% up to date!
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Files

We also add the following files to your project:

- [`tsconfig.json`](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
<!-- FIXME: Link -->
- `types/<app name>/index.d.ts` – the location for any global type declarations you need to write for you own application; see [**Using TS Effectively: Global types for your package**](https://github.com/typed-ember/ember-cli-typescript/tree/3a434def8b8c8214853cea0762940ccedb2256e8/docs/getting-started/docs/ts/using-ts-effectively/README.md#global-types-for-your-package) for information on its default contents and how to use it effectively
<!-- FIXME: Link -->
- `app/config/environment.d.ts` – a basic set of types defined for the contents of the `config/environment.js` file in your app; see [Environment and configuration typings](installation.md#environment-and-configuration-typings) for details

## Config

<!-- FIXME: todo -->
