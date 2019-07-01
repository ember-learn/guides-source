When someone says they are "upgrading" their Ember app, it could mean one of several things, especially if they say that they are "upgrading to Octane."
This Guide will help fill in the blanks about how to upgrade your app's version, get access to the latest and greatest features, and form a strategy for using Octane's features in your existing apps.

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
