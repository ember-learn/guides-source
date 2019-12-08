This guide is for developers who already know Ember, and who want to learn the new concepts introduced
by Octane, Ember's first Edition.

If you're new to Ember, we recommend starting with the [Quick start and Tutorials](https://emberjs.com/learn).

## What is Ember Octane?

Over the past few years, many new features have been added to Ember with the goal of introducing a new programming model for the framework.
This new model brings major gains in productivity and performance, incrementally via a series of minor (non-breaking) releases.
This allows for new apps to have the best features enabled automatically, while teams working on existing apps can migrate over time, while still keeping their apps up-to-date with the latest release.

Here are some of the core features in Octane:

- [Native JavaScript classes](../../in-depth-topics/native-classes-in-depth/), unlocking simpler syntax, faster performance,
  and better interop with the wider ecosystem.
- [Decorators](../../in-depth-topics/native-classes-in-depth/#toc_decorators) for customizing the behavior of components and other classes.
- [Tracked properties](../../in-depth-topics/autotracking-in-depth/), a type of decorator that simplifies keeping the DOM
  up-to-date with JavaScript changes.
- **Async functions** (`async`/`await`) for authoring asynchronous code.
- [Importing npm packages](../../addons-and-dependencies/managing-dependencies/#toc_regular-npm-packages) with zero additional configuration.
- [Glimmer components](../../components/), including
  - **"Outer HTML" templates** that support fragments and easily customizing the
    root element.
  - **Customizable DOM attributes** with `...attributes`.
  - **`<AngleBracket>` syntax** for better readability.
- [Modifiers](../../components/template-lifecycle-dom-and-modifiers/), which unify the experience of writing code that interacts with the DOM.

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


## Octane upgrade strategy

Octane is Ember's [first Edition](https://emberjs.com/editions/).
An edition is essentially a collection of features that are available in a minor (non-breaking) release of Ember.
Although it's possible to do a big-bang refactor to change an app to use all of Octane's features at once, it's really designed for incremental adoption.
You can make changes at a pace that makes sense for your project or team.

Read on to learn how to begin using Octane's features in an existing application.
In summary:

1. Follow the [regular upgrade steps](https://cli.emberjs.com/release/basic-use/upgrading/) to update your app to at least version `3.x`. <!-- TODO -->
2. Run your tests to make sure everything still works as expected
3. Review the deprecation warnings and make any necessary refactors. Some deprecations will need to be resolved before you can use an Octane feature. Read on to learn what they are.
4. Go through the [Quick Start Tutorial](../getting-started/quick-start/) to learn the fundamentals of Octane. You might need to study up on [Native JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) too.
5. Install `@ember/optional-features` in your app, if it is not already in the `devDependencies` of your `package.json`
6. Turn on optional features one by one, running tests in between to make sure things still work as expected. Read on to learn what an Octane configuration looks like.
7. Create a new component in your app, and experiment!
8. Try refactoring some existing code to use a new feature. Check out the [Cheat Sheet](./cheat-sheet/) and [Editions Deep Dive](./editions/) for some pointers.
8. Schedule a show-and-tell meeting with your coworkers to fill them in about what you learned
9. Review the refactoring checklist below to create a plan for handling existing code

If you need help along the way, visit [the Ember Community chat and forums](https://emberjs.com/community/).

### Deprecations that matter for Octane

- [`jquery-apis`](https://deprecations.emberjs.com/v3.x/#toc_jquery-apis) - By default, Octane does not include jQuery. Continuing to use jQuery in your app will not conflict with Octane features, however you should follow the deprecation instructions to keep using it.

<!-- TODO -->

### Optional features in Octane

A fully-Octane app has the following configuration in `config/optional-features.json`:

```json
{
  "application-template-wrapper": false,
  "jquery-integration": false,
  "template-only-glimmer-components": true
}
```

Use the command `ember feature:list` in your console to learn what each option does.

### Refactoring checklist

For many of the optional features, the thing they affect the most is what you see in your newly-created files, not within your existing code.
Your app will keep working, even if you haven't refactored code to use Octane's features yet.
Making new files in the Octane style is good place to start, but eventually you should refactor existing code so that your app follows one main programming model, not a mixture of Octane and Classic.
Following a refactoring plan will help with onboarding new developers, and minimize flipping back and forth between different versions of the Ember Guides.

There's no one-size-fits-all strategy, but here is a checklist you can adapt, once you're familiar with what Octane has to offer:

1. Convert curly bracket components (`{{my-component}}`) to Angle Brackets (`<MyComponent />`). They are a normal, out-of-the-box feature of Ember since [3.4](https://blog.emberjs.com/2018/10/07/ember-3-4-released.html) that does not change a component's behavior. Follow the [Angle Bracket Syntax guide](../reference/syntax-conversion-guide/) for examples.
2. Use [Named Arguments](./editions/#toc_named-arguments) and `this` in your templates. This also does not change component behavior.
3. Refactor some small, basic components to use [Native Classes](./editions/#toc_native-classes). Good components to refactor first are those that do not rely on two-way bindings, computed properties, or observers. These components will serve as examples that your coworkers can refer back to.
5. Refactor components that have computed properties to use Native Classes and [`@tracked`](./editions/#toc_tracked-properties)
6. Refactor remaining components, such as those with two-way-bindings and Observers.

At any point in this process, you could refactor your Routes, Controllers, Services, and Models to use Native Classes too. However, the strategy above is centered on Components because they are the biggest shift in the mental model of Octane and affect the bulk of the files in an app.
There is more mental overhead to having a blend of Classic and Native Class components, compared to converting all Components and ignoring the other files for a while.
