Because major releases of Ember are not supposed to make breaking changes without prior deprecation, the project has been extremely conservative about changing behaviors that don't have a clear deprecation path. As a result, we've had several quirks of the framework linger into the 3.x series.

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

## Enabling or disabling a feature

Once you see a feature that you would like to toggle for your project you can run one of two commands, `ember feature:enable <feature>` and `ember feature:disable <feature>`.

Let us disable `template-only-glimmer-components` to see what happens:

```bash
$ ember feature:disable template-only-glimmer-components
Disabled template-only-glimmer-components. Be sure to commit config/optional-features.json to source control!
```

As we can see from the warning, `@ember/optional-features` has created a file in `config/optional-features.json` to store the configuration for your project.
We commit it to our repository and we are off to the races!
