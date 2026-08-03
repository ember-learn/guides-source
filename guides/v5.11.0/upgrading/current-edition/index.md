This guide is for developers who already know Ember, and who want to learn the new concepts introduced
by Octane, Ember's first Edition, which was [released in December 2019](https://blog.emberjs.com/ember-3-15-released).

If you're new to Ember, we recommend starting with the [Quick start and Tutorials](https://emberjs.com/learn).

## What is Ember Octane?

Ember Octane introduced a programming model in Ember that brought major gains in productivity and performance, incrementally via a series of minor (non-breaking) releases.
This allows for new apps to have the best features enabled automatically, while teams working on existing apps can migrate over time and continue updating their app's dependency versions.

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

Just as important is what was removed from the Ember experience. These
features below will keep working through the rest of Ember 4, but you won't have to use them if you don't
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

To create a new app that has every Octane feature enabled, first make sure you have the latest Ember CLI version installed:

```sh
npm uninstall ember-cli
npm install -g ember-cli
```

Then, create your app:

```sh
ember new my-app-name
```

The remaining sections in this guide will go into details about how to upgrade
each individual feature. There's a lot to learn here, but remember, you can
gradually adopt these features in existing apps. Everything you used to do will
also work all the way through the rest of Ember 3, since Ember follows SemVer
strictly.

If you need any help, check out the [chat and forums](https://emberjs.com/community/).
If you spot something to improve in this guide, you can help out by
[filing an issue or a PR](https://github.com/ember-learn/guides-source). Thank you!


## Octane upgrade strategy

There are two areas of focus for upgrading to Octane: learning, and implementing.

### Learning

We recommend that all developers go through the [Quick Start Tutorial](../../getting-started/quick-start/) to learn the fundamentals of Octane, and then the main [Tutorial](../../tutorial/).

Along the way, you might need to study up on [Native JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class) too. Otherwise, it may be confusing about which parts of code are special to Ember, and which are not.

If you work on a team of developers, it may be useful to have one developer go through the tutorials, try doing a small thing, and then demo that to the rest of the team. After everyone has had a chance for hands-on learning, schedule a meeting to plan how you want to proceed.
By design, migrating to Octane can be done in pieces. It doesn't require a big-bang refactor. If you need advice, visit [the forums or the Ember Discord](https://emberjs.com/community/) (in Discord you can use the `#topic-octane-migration` channel).

## Implementing

These steps assume your app is on version 4.x of Ember. If you are on an older
version, please choose it from the dropdown in the sidebar.

1. Make sure you have `@glimmer/component` and `@glimmer/tracking`
installed in your app.
2. Create a new component in your app, and experiment! `ember g component` will give you just a test and a template. Adding `-gc` to the command will generate the JavaScript class to go with it. Try adding a button with an action.
If you need to generate a classic component, you can still make one with `ember g component -cc`
8. Try refactoring one existing component to use Octane style. Check out the [Cheat Sheet](./cheat-sheet/) and [Edition's Deep Dive](../../in-depth-topics/) for some pointers.
9. Review the refactoring checklist below to create a plan for handling existing code. Note that some steps have codemods available!

If you need help along the way, visit [the Ember Community chat and forums](https://emberjs.com/community/).

### Refactoring checklist

Ember Octane introduces new syntax and patterns centered around
using native JavaScript classes and templates that focus on HTML.
While your older style components and templates will keep working,
eventually you should refactor existing code so that your app follows one main programming model, not a mixture of Octane and Classic.
Following a refactoring plan will help with onboarding new developers, and minimize flipping back and forth between different versions of the Ember Guides.

There's no one-size-fits-all strategy, but here is a checklist you can adapt, once you're familiar with what Octane has to offer:

1. Whenever you make new components, use Octane-style components. Create them with `ember generate component my-component -gc`. They can coexist in the same app with older components. Meanwhile, go through the rest of the steps below.
2. Use [Named Arguments](./templates/#toc_named-arguments) and `this` in your templates, by running the [`ember-no-implicit-this-codemod`](https://github.com/ember-codemods/ember-no-implicit-this-codemod). Component behavior should not change.
3. Convert curly bracket components (`{{my-component}}`) to Angle Brackets (`<MyComponent />`), using the [`ember-angle-brackets-codemod`](https://github.com/ember-codemods/ember-angle-brackets-codemod). Angle Brackets are feature of Ember since [3.4](https://blog.emberjs.com/2018/10/07/ember-3-4-released.html) that does not change a component's behavior. Read the [Angle Bracket Syntax guide](./templates/) for some examples and more in-depth information.
4. Use the [`ember-native-class-codemod`](https://github.com/ember-codemods/ember-native-class-codemod) on your non-component JavaScript files.
5. Refactor some components to use [Glimmer Components](../../components/). Good components to refactor first are those that do not rely on two-way bindings, computed properties, or observers. These components will serve as examples that your coworkers can refer back to.
6. Now, you have a choice to make, and the right answer varies based on how your team operates and what your app is like. Consider which path has the least mental overhead for your engineering team, including both experienced and beginner Ember developers.
   1. The first option is, you could leave most older components as-is, and gradually convert them to Octane style components whenever the course of your work requires you to edit those files. The advantage is that it is very easy for everyone to tell whether a component is classic or Octane. The disadvantage is that muscle memory for Objects vs Classes is tough to overcome.
   2. The second option is, you could run the [`ember-native-class-codemod`](https://github.com/ember-codemods/ember-native-class-codemod) for all remaining components. This will turn them into components that import from `@ember/component`, retaining all the same APIs that classic components have, but just represented in a Native Class syntax. Then, following a similar pattern as option number one, you could convert them to import from `@glimmer/component` as you work. The advantage is that everyone gets used to working with Native Classes right away. The disadvantage is that the visual differences between a Native Class `@ember/component` and a `@glimmer/component` are subtle, and time could easily be lost to mistakes like trying to use `didInsertElement` on the `@glimmer/component`.
