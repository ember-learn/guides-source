## `tsconfig.json`

If you use the `--typescript` flag when generating your Ember app, we generate a good default [`tsconfig.json`][tsconfig], which will usually make everything _Just Work™_:

```json {data-filename="tsconfig.json"}
{
  "extends": "@tsconfig/ember/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "my-app/tests/*": ["tests/*"],
      "my-app/*": ["app/*"],
      "*": ["types/*"]
    }
  }
}
```

The default `tsconfig.json` extends the [`"@tsconfig/ember/tsconfig.json"`][ember-tsconfig] base, which includes TypeScript compiler options to enable TypeScript development in an Ember app plus some useful default configurations for strictness to ensure type-safety and compatibility with Ember's types.

Additionally, the generated `tsconfig.json` includes [`"baseUrl"`][tsconfig-baseUrl] and [`"paths"`][tsconfig-paths] configuration specific to your app. This configuration allows Ember's classic package layout, which is not resolvable with the Node resolution algorithm, to work with TypeScript.

In general, you may customize your TypeScript build process as usual using the `tsconfig.json` file. There are a few things worth noting, however, if you're looking to make further or more advanced customizations (but _most_ users can just ignore this section!):

1. The Ember build pipeline uses Babel's TypeScript support instead of the TypeScript compiler. For this reason, the generated `tsconfig.json` file does not set [`"outDir"`][tsconfig-outDir] and sets [`"noEmit"`][tsconfig-noEmit] to `true`. This configuration allows you to run editors which use the compiler without creating extraneous `.js` files throughout your codebase, leaving the compilation to Babel to manage.

   You _can_ still customize `"outDir"` and `"noEmit"` if your use case requires it, however. For example, to see the output of the compilation in a separate folder you are welcome to set `"outDir"` to some path and set `"noEmit"` to `false`. Then tools which use the TypeScript compiler (e.g. the watcher tooling in JetBrains IDEs) will now generate files at that location.

   Note that any changes you _do_ make to `"outDir"` and `"noEmit"` won't have any effect on how _Ember_ builds your application. The build pipeline will continue to use its own temp folder.

1. Since your application is built by Babel, and only _type-checked_ by TypeScript, we set the [`"target"`][tsconfig-target] key in [`"@tsconfig/ember/tsconfig.json"`][ember-tsconfig] to the current version of the ECMAScript standard so that type-checking uses the latest and greatest from the JavaScript standard library. The Babel configuration in your app's `config/targets.js` and any included polyfills will determine the final build output.

1. If you make changes to the paths included in or excluded from the build via your `tsconfig.json` (using the [`"include"`][tsconfig-include], [`"exclude"`][tsconfig-exclude], or [`"files"`][tsconfig-files] keys), you will need to restart the server to take the changes into account: the build pipeline does not currently watch the `tsconfig.json` file.

## Enabling Sourcemaps

To enable TypeScript sourcemaps, you'll need to add the corresponding configuration for Babel to your `ember-cli-build.js` file:

```javascript {data-filename="ember-cli-build.js" data-diff="+3"}
const app = new EmberApp(defaults, {
  'ember-cli-babel': { enableTypeScriptTransform: true },
  babel: { sourceMaps: 'inline' },
});
```

(Note that this _will_ noticeably slow down your app rebuilds.)

If you are using [Embroider][], you might need to include [`devtool`][devtool] in your webpack configuration:

```javascript {data-filename="ember-cli-build.js" data-diff="+4"}
return require('@embroider/compat').compatBuild(app, Webpack, {
  packagerOptions: {
    webpackConfig: {
      devtool: 'source-map'
    }
  }
}
```

<!-- Internal links -->

<!-- External links -->

[devtool]: https://webpack.js.org/configuration/devtool/
[ember-tsconfig]: https://www.npmjs.com/package/@tsconfig/ember
[embroider]: https://github.com/embroider-build/embroider
[tsconfig-baseUrl]: https://www.typescriptlang.org/tsconfig#baseUrl
[tsconfig-exclude]: https://www.typescriptlang.org/tsconfig#exclude
[tsconfig-files]: https://www.typescriptlang.org/tsconfig#files
[tsconfig-include]: https://www.typescriptlang.org/tsconfig#include
[tsconfig-noEmit]: https://www.typescriptlang.org/tsconfig#noEmit
[tsconfig-outDir]: https://www.typescriptlang.org/tsconfig#outDir
[tsconfig-paths]: https://www.typescriptlang.org/tsconfig#paths
[tsconfig-target]: https://www.typescriptlang.org/tsconfig#target
[tsconfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
