Ember supports two different build environments:

 - Our [Vite integration](./vite) works on all Ember versions back to 3.28. It became the default for newly-generated apps at Ember 6.8.
 - The legacy [ember-cli based build](https://cli.emberjs.com/release/) is also still supported on all Ember versions.

You can tell which one you're using based on the presence of `@embroider/vite` in your `package.json` file.

Existing apps can use [Ember Vite Codemod](https://github.com/mainmatter/ember-vite-codemod) to switch from the ember-cli based build to the Vite based build.

On Ember versions after 6.8, you can optionally choose to generate a new app using the older build environment via:

```sh
npx ember-cli@ new my-app-name -b @ember-tooling/classic-build-app-blueprint
```



