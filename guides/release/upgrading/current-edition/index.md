This guide is for developers who already know Ember, and who want to learn the new concepts introduced
by Octane, Ember's first Edition.

If you're new to Ember, we recommend starting with the [Quick start and Tutorials](https://emberjs.com/learn).

## What is Ember Octane?

Over the past few years, many new features have been added to Ember with the goal of introducing a new programming model for the framework.
This new model brings major gains in productivity and performance, incrementally via a series of minor (non-breaking) releases.
This allows for new apps to have the best features enabled automatically, while teams working on existing apps can migrate over time, while still keeping their apps up-to-date with the latest release.

Here are some of the core features in Octane:

- [Native JavaScript classes](../../working-with-javascript/native-classes/), unlocking simpler syntax, faster performance,
  and better interop with the wider ecosystem.
- [Decorators](../../working-with-javascript/native-classes/#toc_decorators) for customizing the behavior of components and other classes.
- [Tracked properties](../../state-management/tracked-properties/), a type of decorator that simplifies keeping the DOM
  up-to-date with JavaScript changes.
- **Async functions** (`async`/`await`) for authoring asynchronous code.
- [Importing npm packages](../../addons-and-dependencies/managing-dependencies/#toc_regular-npm-packages) with zero additional configuration.
- [Glimmer components](../../components/component-basics/), including
  - **"Outer HTML" templates** that support fragments and easily customizing the
    root element.
  - **Customizable DOM attributes** with `...attributes`.
  - **`<AngleBracket>` syntax** for better readability.
- [Modifiers](../../components/glimmer-components-dom/), which unify the experience of writing code that interacts with the DOM.

Just as important is what we're removing from the Ember experience. These
features below will keep working, but you won't have to use them if you don't
want to.

These have been replaced or made optional in Octane:

- **jQuery**. For DOM interaction, developers should use templates or native DOM
  APIs.
- **Non-native classes**. Octane apps say goodbye to `extend()`, `create()`, and
  mixins, and use Native Classes instead.
- **Computed properties and observers**, and other legacy features of the Ember
  object model are replaced by `@tracked`.
- **Curly component invocation** of components, eliminating the ambiguity in templates between
  values and DOM creation. Use Angle Brackets instead.
- **The run loop**. App developers should never have to write code that interacts
  with the Ember run loop, even in tests.
- **"inner HTML" components**, and the confusing JavaScript API used to
  configure a component's root element, like `tagName`, `classNameBindings`,
  etc. Now, there's no wrapping element.

Again, note that these features will continue to work for apps that need them.
An edition is not a breaking change, just a minor release. But for someone starting
a new Ember app today, this is complexity they can safely skip learning.

## Creating a New App

To create a new app that uses the default features for Octane:

```sh
ember new octane-app -b @ember/octane-app-blueprint
```

Once Octane is released, the default blueprint will be updated to reflect the
Octane defaults and specifying this blueprint will no longer be necessary.

<!-- replace-on-release - remove the contents above and replace with:

To create a new app that has every Octane feature enabled, first make sure you have the latest Ember CLI version installed:

```sh
npm uninstall ember-cli
npm install -g ember-cli
```

Then, create your app:

```sh
ember new my-app-name
```
-->

The remaining sections in this guide will go into details about how to upgrade
each individual feature. There's a lot to learn here, but remember, you can
gradually adopt these features in existing apps. Everything you used to do will
also work all the way through the rest of Ember 3, since Ember follows SemVer
strictly.

If you need any help, check out the [chat and forums](https://emberjs.com/community/).
If you spot something to improve in this guide, you can help out by
[filing an issue or a PR](https://github.com/ember-learn/guides-source). Thank you!
