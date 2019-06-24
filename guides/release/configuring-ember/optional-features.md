One of the ways that Ember releases guarantee stability is by following [Semantic Versioning](https://semver.org/) (SemVer).
For the Ember project this means that any feature that is to be removed must first be deprecated,
and only removed when a major version is released.
It also means that new features are introduced in a backwards compatible way.

To give the project a path forward when a breaking change is mandatory, we've released the [`@ember/optional-features`](https://github.com/emberjs/ember-optional-features) addon.

This addon does nothing by default, but provides a command-line interface to enable and disable breaking changes in Ember.

## Installation

To get started with optional features, you must install the addon:

```bash
ember install @ember/optional-features
```

This will make three new commands available to Ember CLI within your project, `feature:list`, `feature:enable`, and `feature:disable`.

## Listing features

The optional features available to your project will depend on the Ember version your project is using.

To see which optional features are available, you can run the following command:

```bash
$ ember feature:list
Usage:

  To list all available features, run ember feature:list.
  To enable a feature, run ember feature:enable some-feature.
  To disable a feature, run ember feature:disable some-feature.

Available features:

  application-template-wrapper (Default: true)
    Wrap the top-level application template (application.hbs) with a `<div class="ember-view">` element.
    More information: https://github.com/emberjs/rfcs/pull/280

  jquery-integration (Default: true)
    Adds jQuery to the Ember application.
    More information: https://github.com/emberjs/rfcs/pull/294
```

## Features

Once you see a feature that you would like to toggle for your project you can run one of two commands, `ember feature:enable <feature>` and `ember feature:disable <feature>`.

Let us disable `jquery-integration` to see what happens:

```bash
$ ember feature:disable jquery-integration
Disabled jquery-integration. Be sure to commit config/optional-features.json to source control!
```

As we can see from the warning, `@ember/optional-features` has created a file in `config/optional-features.json` to store the configuration for your project.
We commit it to our repository and we are off to the races!

### jquery-integration

jQuery is commonly used for event handling and many popular libraries for charting and UI components.
With the release of [Octane](https://emberjs.com/editions), Ember does not include [jQuery](https://jquery.com/) by default.
However, you may choose to install and use it in your app!

#### Including jQuery

To include jQuery in your Ember app, follow the instructions above to install `@ember/optional-features`. 
Next, enable the feature:

```bash
ember feature:enable jquery-integration
```

Then, install the `@ember/jquery` addon:

```bash
ember install @ember/jquery
```

Now, almost anywhere in your app, you can use `this.$()` to use jQuery methods.

#### Removing jQuery

If you are working on an application that already has jQuery installed, and would like to remove it, follow these steps.

First, refactor your own code to not depend on jQuery.
Keep in mind that if any of your app's dependencies use jQuery,
you will need to find an alternative for them.

Next, follow the instructions above to install `@ember/optional-features`, and run the following command to change `@ember/optional-features`:

```bash
ember feature:disable jquery-integration
```

Then, remove `@ember/jquery` from your `package.json`.

This will remove jQuery from your `vendor.js` bundle and disable any use of jQuery in Ember itself.
Now your app will be about 30KB lighter!

#### Caveats

Without jQuery, any code that still relies on it will break, especially the following usages:

- [`this.$()`](https://www.emberjs.com/api/ember/release/classes/Component/methods/$?anchor=%24) in components
- `jQuery` or `$` directly as a global, through `Ember.$()` or by importing it (`import jQuery from jquery;`)
- global acceptance test helpers like `find()` or `click()`
- `this.$()` in component tests

Note that this also applies to all addons that your app uses, so make sure they support being used without jQuery.
