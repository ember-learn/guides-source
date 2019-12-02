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

The Ember framework comes by default with jQuery integration.
It is used for event handling, and to provide some APIs like `this.$()` in components.

With the release of ember-source v3.4.0, an optional feature flag was introduced that allows users to opt out of jQuery.
To enable it, run the following command after setting up `@ember/optional-features`:

```bash
ember feature:disable jquery-integration
```

This will remove jQuery from your `vendor.js` bundle and disable any use of jQuery in Ember itself.
Now your app will be about 30KB lighter!

#### Caveats

Without jQuery, any code that still relies on it will break, especially the following usages:

- [`this.$()`](https://api.emberjs.com/ember/3.11/classes/Component/methods/$?anchor=%24) in components
- `jQuery` or `$` directly as a global, through `Ember.$()` or by importing it (`import jQuery from jquery;`)
- global acceptance test helpers like `find()` or `click()`
- `this.$()` in component tests
- If you use `ember-data`, it automatically falls back to HTML5's [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to make API requests. But, it is recommended to use [`ember-fetch`](https://github.com/ember-cli/ember-fetch), a polyfill for unsupported browsers.

Note that this also applies to all addons that your app uses, so make sure they support being used without jQuery.

### application-template-wrapper

With this feature *enabled* Ember creates a wrapping div around the entire
rendered application. Effectively, it is creating a `<div class="ember-view">`
element which wraps the contents of an application's
`app/templates/application.hbs` file.

When *disabled*, this div will not be output. This is usually desirable, but
may break the styling of an existing application in subtle ways:

- Perhaps the application relied on the root `.ember-view` for styles (CSS).
- Perhaps the `<div>` itself was the target of styles (e.g. `body > div > .some-child`).
- The presence of a wrapping `<div>` means the application is contained in a
  block-layout element. When removed, and depending on if the application
  specifies a `rootElement` in `config/environment.js`, the application may no
  longer be contained in a block-layout element.

If your application relies on those behaviors it is still recommended that
you *disable* this feature, and simply add an appropriate element to
`app/templates/application.hbs` wrapping that template's `{{outlet}}`.

For more information, see [RFC #280](https://github.com/emberjs/rfcs/blob/master/text/0280-remove-application-wrapper.md).

### template-only-glimmer-components

With this feature *disabled* Ember will create an implicit element for
components which have no JavaScript file ("template-only components").

Enabling this feature will result in only the contents of the template being
rendered, and additionally in no classic Ember component instance being
instantiated to provide it context.

Some examples of how *enabling* this feature impacts app code are:

- In template-only component templates statements like `{{this}}`,
  `{{this.foo}}` and `{{foo}}` will be `undefined`. Accessing arguments as
  `{{@foo}}` will continue to work.
- If this feature is enabled in an application with existing template-only
  components, the removal of the wrapping `<div>` will happen to all uses of
  those template-only components. This can impact style and logic in a breaking
  manner.
- Passing classes to an invocation (i.e. `{{my-component class="..."}}`) will
  no longer result in those classes being present on any element. This could
  be a change in behavior which impacts any reflected attribute passed as an
  argument, such as `id=` or `tagName=`.
- Templates can use `...attributes` to target attributes and element modifiers
  passed from an angle bracket invocation.

Enabling this feature makes template-only components more consistent with
angle-bracket invocation and with Glimmer components. Additionally it improves
the performance of template-only components (there is no JS object instantiated
to provide context) and makes them an excellent replacement for use of Ember's
more complex and now discouraged API `{{partial`.

It is recommended that you *enable* this feature. Existing applications adopting
this optional feature should add a `.js` file for any existing template-only
components containing a basic Ember component class. This will maintain
backwards compatibility for existing templates while new template-only
components gain the advantages of this feature.

For more information, see [RFC #278](https://github.com/emberjs/rfcs/blob/master/text/0278-template-only-components.md).
