As you're developing your Ember app, you are likely to run into common scenarios that aren't addressed by Ember itself.
Perhaps you want to use a CSS preprocessor to write your stylesheets, or you want to use a popular JS library, or maybe
you want to import components written by a different department within your organization.

Ember CLI provides a common format called [Ember Addons](#toc_addons) for distributing reusable libraries to solve some
of these problems.  Additionally, you may want to make use of front-end dependencies like a CSS framework or a JavaScript
datepicker that aren't specific to Ember apps.

## Addons

Addons are JavaScript packages that integrate with Ember. For example, [`ember-cli-sass`](https://github.com/adopted-ember-addons/ember-cli-sass)
is an addon that allows you to use SASS/SCSS in your applications. You can install it using the Ember CLI with the following command:

```bash
ember install ember-cli-sass
```

This will modify your `package.json` (and `package-lock.json` or `yarn.lock` or `pnpm-lock.yaml`), typically bringing in other dependencies. Some addons will also add
additional files to your projects when relevant.

There are many addons that cover all kinds of use cases. For more detail, as well as examples of what addons can do,
we invite you to have a look at the [Ember CLI documentation](https://cli.emberjs.com/release/basic-use/using-addons/).

The Ember community publishes and maintains many addons, and it can be difficult to know if one (or many!) exists that covers
your needs. The website [Ember Observer](https://www.emberobserver.com/) keeps an up-to-date index of Ember Addons, sorted by
categories, and rated according to objective metrics. If you are looking for an addon, we recommend that you start there!

## Regular npm packages

While dependencies can be managed in several ways,
it's worth noting that the process can be greatly simplified for new developers by using ember-auto-import,
which offers zero config imports from npm packages. 
It's built into new Ember apps by default and can be installed in older apps by using `ember install ember-auto-import`.
For further usage instructions, please follow the [project README](https://github.com/ef4/ember-auto-import).

## Other assets

Third-party JavaScript not available as an addon or npm package should be placed in the `vendor/` folder in your project.

Your own assets (such as `robots.txt`, `favicon`, custom fonts, etc) should be placed in the `public/` folder in your project.

## Compiling Assets

When you're using dependencies that are not included in an addon,
you will have to instruct Ember CLI to include your assets in the build.
This is done using the asset manifest file `ember-cli-build.js`.
You should only try to import assets located in the `node_modules` and `vendor` folders.

### Globals provided by JavaScript assets

The globals provided by some assets (like `moment` in the below example) can be used in your application
without the need to `import` them.
Provide the asset path as the first and only argument.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/moment/moment.js');
```

You will need to add `"moment"` to the `globals` section in `.eslintrc.js` to prevent ESLint errors
about using an undefined variable.

### Anonymous AMD JavaScript modules

You can transform an anonymous AMD module to a named one by using the `amd` transformation.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/moment/moment.js', {
  using: [
    { transformation: 'amd', as: 'moment' }
  ]
});
```

This transformation allows you to `import` moment in your app. (e.g. `import moment from 'moment';`)

### CommonJS JavaScript modules

[ember-cli-cjs-transform](https://github.com/rwjblue/ember-cli-cjs-transform) allows us to import CommonJS modules into
our Ember app. It also does auto-rollup and some nice caching, so it should pull in all the deps that are pulled in
with `require` for you automatically. It is not yet included with Ember CLI by default, so you will need to install it.

```bash
ember install ember-cli-cjs-transform
```

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/showdown/dist/showdown.js', {
  using: [
    { transformation: 'cjs', as: 'showdown' }
  ]
});
```

You can now `import` them in your app. (e.g. `import showdown from 'showdown';`)

### Environment-Specific Assets

If you need to use different assets in different environments, specify an object as the first parameter.
That object's key should be the environment name, and the value should be the asset to use in that environment.

```javascript {data-filename=ember-cli-build.js}
app.import({
  development: 'node_modules/moment/moment.js',
  production:  'node_modules/moment/min/moment.min.js'
});
```

If you need to import an asset in only one environment you can wrap `app.import` in an `if` statement.
For assets needed during testing, you should also use the `{type: 'test'}` option to make sure they
are available in test mode.

```javascript {data-filename=ember-cli-build.js}
if (app.env === 'development') {
  // Only import when in development mode
  app.import('vendor/ember-renderspeed/ember-renderspeed.js');
}
if (app.env === 'test') {
  // Only import in test mode and place in test-support.js
  app.import('node_modules/sinonjs/sinon.js', { type: 'test' });
  app.import('node_modules/sinon-qunit/lib/sinon-qunit.js', { type: 'test' });
}
```

### CSS

Provide the asset path as the first argument:

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/foundation/css/foundation.css');
```

All style assets added this way will be concatenated and output as `/assets/vendor.css`.

### Other Assets

All assets located in the `public/` folder will be copied as is to the final output directory, `dist/`.

For example, a `favicon` located at `public/images/favicon.ico` will be copied to `dist/images/favicon.ico`.

All third-party assets, included either manually in `vendor/` or via a package manager like npm, must be added via `app.import()`.

Third-party assets that are not added via `app.import()` will not be present in the final build.

By default, `import`ed assets will be copied to `dist/` as they are, with the existing directory structure maintained.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf');
```

This example would create the font file in `dist/font-awesome/fonts/fontawesome-webfont.ttf`.

You can also optionally tell `import()` to place the file at a different path.
The following example will copy the file to `dist/assets/fontawesome-webfont.ttf`.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/font-awesome/fonts/fontawesome-webfont.ttf', {
  destDir: 'assets'
});
```

If you need to load certain dependencies before others,
you can set the `prepend` property equal to `true` on the second argument of `import()`.
This will prepend the dependency to the vendor file instead of appending it, which is the default behavior.

```javascript {data-filename=ember-cli-build.js}
app.import('node_modules/es5-shim/es5-shim.js', {
  type: 'vendor',
  prepend: true
});
```

<!-- eof - needed for pages that end in a code block  -->
