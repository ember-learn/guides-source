Not all modules need to be declared in the package.json, but for the most part

> [!important]
> If you import it, you must declare it (in `dependencies` or `peerDependencies` in your package.json)


## Available via build tools

The following packages are provided by the `ember()` vite plugin from `@embroider/vite`, via the V2 Addon Format's spec feature: `renamed-modules` (and are public API). 

### `@ember/*`

- `@ember/application`
- `@ember/array`
- `@ember/component`
- `@ember/controller`
- `@ember/debug`
- `@ember/destroyable`
- `@ember/engine`
- `@ember/enumerable`
- `@ember/helper`
- `@ember/modifier`
- `@ember/object`
- `@ember/owner`
- `@ember/reactive`
- `@ember/routing`
- `@ember/runloop`
- `@ember/service`
- `@ember/template-compilation`
- `@ember/template-compiler`
- `@ember/template-factory`
- `@ember/template`
- `@ember/test`
- `@ember/utils`
- `@ember/version`

### `@glimmer/*`

- `@glimmer/tracking` 


### Other / Supporting

- `@embroider/macros` (requires babel)
- `ember-testing`
- `rsvp`



## Must be present in package.json

These packages are not provided automatic by any build tooling, and exist as standalone packages on npm. 
All of these packages only consume public APIs from `ember-source`

- `@ember/string`
- `@ember/test-helpers`
- `@ember/test-waiters`
- `@glimmer/component`
- `@glint/template`



