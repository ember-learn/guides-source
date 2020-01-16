As you're developing your Ember app, you'll likely run into common scenarios that aren't addressed by Ember itself,
such as authentication or using SASS for your stylesheets.
Ember CLI provides a common format called [Ember Addons](#toc_addons) for distributing reusable libraries
to solve these problems.
Additionally, you may want to make use of front-end dependencies like a CSS framework
or a JavaScript datepicker that aren't specific to Ember apps.

## Addons

Ember Addons can be installed using [Ember CLI](http://ember-cli.com/extending/#developing-addons-and-blueprints)
(e.g. `ember install ember-cli-sass`).
Addons may bring in other dependencies by modifying your project's `bower.json` file automatically.

You can find listings of addons on [Ember Observer](http://emberobserver.com).

## Other assets

Third-party JavaScript not available as an addon or Bower package should be placed in the `vendor/` folder in your project.

Your own assets (such as `robots.txt`, `favicon`, custom fonts, etc) should be placed in the `public/` folder in your project.

## Compiling Assets

When you're using dependencies that are not included in an addon,
you will have to instruct Ember CLI to include your assets in the build.
This is done using the asset manifest file `ember-cli-build.js`.
You should only try to import assets located in the `bower_components` and `vendor` folders.

### Globals provided by JavaScript assets

The globals provided by some assets (like `moment` in the below example) can be used in your application
without the need to `import` them.
Provide the asset path as the first and only argument.

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/moment/moment.js');
```

You will need to add `"moment"` to the `globals` section in `.eslintrc.js` to prevent ESLint errors
about using an undefined variable.

### AMD JavaScript modules

Provide the asset path as the first argument, and the list of modules and exports as the second.

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/ic-ajax/dist/named-amd/main.js', {
  exports: {
    'ic-ajax': [
      'default',
      'defineFixture',
      'lookupFixture',
      'raw',
      'request'
    ]
  }
});
```

You can now `import` them in your app. (e.g. `import { raw as icAjaxRaw } from 'ic-ajax';`)

### Environment-Specific Assets

If you need to use different assets in different environments, specify an object as the first parameter.
That object's key should be the environment name, and the value should be the asset to use in that environment.

```javascript {data-filename=ember-cli-build.js}
app.import({
  development: 'bower_components/ember/ember.js',
  production:  'bower_components/ember/ember.prod.js'
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
  app.import(app.bowerDirectory + '/sinonjs/sinon.js', { type: 'test' });
  app.import(app.bowerDirectory + '/sinon-qunit/lib/sinon-qunit.js', { type: 'test' });
}
```

### CSS

Provide the asset path as the first argument:

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/foundation/css/foundation.css');
```

All style assets added this way will be concatenated and output as `/assets/vendor.css`.

### Other Assets

All assets located in the `public/` folder will be copied as is to the final output directory, `dist/`.

For example, a `favicon` located at `public/images/favicon.ico` will be copied to `dist/images/favicon.ico`.

All third-party assets, included either manually in `vendor/` or via a package manager like Bower, must be added via `import()`.

Third-party assets that are not added via `import()` will not be present in the final build.

By default, `import`ed assets will be copied to `dist/` as they are, with the existing directory structure maintained.

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf');
```

This example would create the font file in `dist/font-awesome/fonts/fontawesome-webfont.ttf`.

You can also optionally tell `import()` to place the file at a different path.
The following example will copy the file to `dist/assets/fontawesome-webfont.ttf`.

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', {
  destDir: 'assets'
});
```

If you need to load certain dependencies before others,
you can set the `prepend` property equal to `true` on the second argument of `import()`.
This will prepend the dependency to the vendor file instead of appending it, which is the default behavior.

```javascript {data-filename=ember-cli-build.js}
app.import('bower_components/es5-shim/es5-shim.js', {
  type: 'vendor',
  prepend: true
});
```

<!-- eof - needed for pages that end in a code block  -->
