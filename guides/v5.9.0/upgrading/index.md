When someone says they are "upgrading" their Ember app, it could mean one of several things, especially if they say that they are "upgrading to Octane."
This Guide will help fill in the blanks about how to upgrade your app's version, get access to the latest and greatest features, and form a strategy for using Octane's features in your existing apps.

## Details about recent releases

You can learn about what changed in every release by reading the 
[official Ember blog](https://blog.emberjs.com).

## Routine minor version maintenance upgrades

Let's say you are upgrading an app from `v3.4` to `v3.8`.
Although you heard there are some new features, your main goal is to keep up with security updates.
To do this kind of version upgrade, follow the instructions [here in the CLI Guides](https://cli.emberjs.com/release/basic-use/upgrading/).
That process will make sure that any peer dependencies of the `ember.js` core codebase get upgraded too.
Automated tools will help you make the right changes to `package.json` and other files.
The point of a minor version bump is that you shouldn't need to change anything in your app when you upgrade - it should all keep working, whether or not you choose to adopt new syntaxes and features.

## Using new features

Once you have upgraded an app's version, some new features may be available out of the box.
On the other hand, some features will require that you enable them specifically in your app's configuration, since they may change the app's default behavior.

The best way to discover new features is to read the [release blog posts](https://blog.emberjs.com/tags/releases.html).
If a new feature requires you to opt-in, it's called an optional feature.
Follow [the optional features guide](../configuring-ember/optional-features/) to learn which optional features are available in your app's version of Ember, and how to enable them.
In many cases, codemods will be available to help you make syntax-related updates.
A codemod is a tool that rewrites your existing code into a new syntax.
When they are available, they can save a lot of time that you would spend making edits by hand.

## Managing deprecations

If an API you are using will be going away in the next major version of Ember, you will see a deprecation warning in the developer console.
Sometimes, they will be deprecation warnings caused by code in your app, and other times, they may be caused by an addon.

For more guidance on what to do with deprecations, visit [Handling Deprecations](../configuring-ember/handling-deprecations/), check out the Ember Inspector [tools for deprecations](../ember-inspector/deprecations/), or read about the specifics in the [Deprecations Guides](https://deprecations.emberjs.com/).

## Upgrading to Octane

Octane was a big shift in Ember's syntax, features, and mental models! If you are in the process of upgrading an existing app to use Octane patterns, check out our dedicated [Octane Update Guide](./current-edition/).
