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

  no-implicit-route-model (Default: true)
    Removes the default record loading behavior on Ember's Route.
    More information: https://rfcs.emberjs.com/id/0774-implicit-record-route-loading
```

## Features

Once you see a feature that you would like to toggle for your project you can run one of two commands, `ember feature:enable <feature>` and `ember feature:disable <feature>`.

Let us disable an optional feature to see what happens. Substitute `some-example-feature`
for a real feature name when you run this command.

```bash
$ ember feature:disable no-implicit-route-model
Disabled no-implicit-route-model. Be sure to commit config/optional-features.json to source control!
```

As we can see from the warning, `@ember/optional-features` has created a file in `config/optional-features.json` to store the configuration for your project.
We commit it to our repository and we are off to the races!

### no-implicit-route-model

This feature is related to esoteric features of route model loading that you likely do not use, or know exist, and [have been deprecated](https://deprecations.emberjs.com/id/deprecate-implicit-route-model/) in `5.3.0`. They are due to be removed in `6.0.0`. To clear the deprecation, you can enable this feature.

With this feature disabled, Ember will automatically load a route's model if the `model` hook has not been implemented. In this case, Ember will attempt to try a few things before rendering this route's template.

1. If there is a `store` property on your route, it will attempt to call its `find` method. Assuming you have ember-data installed, you may be expecting this. The arguments will be extracted from the params. For example, if a dynamic segment is `:post_id`, there exists logic to split on the underscore and find a record of type post.

2. As a fallback, it will attempt to define a `find` method and use your Model instance's `find` method to fetch. If a Model cannot be found or if the found Model does not have a find method, an assertion is thrown.

Enabling this optional feature will remove this implicit model loading behavior and leave it to you to implement if and when you need it.

