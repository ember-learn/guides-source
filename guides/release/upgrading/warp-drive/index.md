## What is WarpDrive?

WarpDrive is EmberData.
It's not a new library, it's a rebranding.
If you go to [npmjs.com](npmjs.com) and look for the [`ember-data`](https://www.npmjs.com/package/ember-data) package, you will see the corresponding GitHub repository is [warp-drive-data/warp-drive](https://github.com/warp-drive-data/warp-drive).

## Why a rebranding?

Because the name EmberData is entangled with Ember.
The purpose of WarpDrive is to be a framework-agnostic data management layer that you can use with any frontend framework.
It would be a bit weird though, to install a package named `ember-data` in a React or Svelte app.
So the library was renamed, but it's still the same code.
Essentially, if you're using EmberData, you're already using WarpDrive.

## Then why are people talking about "migrating to WarpDrive"?

Differentiating between EmberData and WarpDrive emerged from the nuances surrounding published packages.
WarpDrive builds on EmberData in the sense that it starts with EmberData, extracts the parts tightly coupled with Ember into new framework-agnostic packages, and publishes them as `@warp-drive/*`.
However, the packages named `@ember-data/*` still exist and continue to function.

So, using "WarpDrive" means using the agnostic `@warp-drive/*` packages as designed.
In contrast, using "EmberData" means using the `@ember-data/*` packages, with their `Model` and `Adapter` and whatnot, which remain tightly integrated with Ember.
But the technical reality behind the daunting phrase "migrating from EmberData to WarpDrive" is more about managing a deprecation.
In fact, when you update your `package.json` from `"ember-data": "5.3.13"` to `"ember-data": "5.8.0"`, you'll encounter deprecation warnings guiding you toward your first `import from @warp-drive`.

## `Model` to `Schema`: a telling example

WarpDrive is designed to be framework-agnostic.
However, since it was built from EmberData – and given that WarpDrive represents the future of EmberData – the first users of WarpDrive will be largely Ember developers who already used EmberData, with a codebase filled with `Model` classes.

The `Model` classes from EmberData are tightly coupled with Ember and cannot be used as-is in other frameworks.
WarpDrive introduces a new `Schema` concept, allowing you to model application resources independently of any framework.
Thus, fully migrating from EmberData to WarpDrive requires converting all your old EmberData `Model` classes into new WarpDrive `Schema` definitions.

There are other differences between EmberData and WarpDrive, particularly around the store API, that we'll see in the next guide [Migration steps](../migration-steps).

## WarpDrive LegacyMode: the first target for EmberData users

### A transitional mode

Imagine you have hundreds of `Model` classes in your codebase.
It's impossible to convert all of them to `Schema` in a single major update.
Fortunately, WarpDrive's development includes a cautious approach to untangling Ember: The LegacyMode, which allows WarpDrive to continue handling EmberData's features.
For instance, LegacyMode enables coexisting `Model` and `Schema`.

You can think of LegacyMode as a key transitional phase where you can **"use WarpDrive as you used EmberData".**

### An easy-to-reason-about definition

You can reasonably claim to have reached LegacyMode when:

- You've configured WarpDrive in `app.js` and `ember-cli-build.js` (as indicated by the deprecation warnings in ember-data 5.7).
- Your store relies on `useLegacyStore`.
- You've adopted the new `store.request` API (as indicated by the deprecation warnings in ember-data 5.7).
- All your imports from `@ember-data` packages have been replaced with imports from `@warp-drive` (for example, your `Model` class now comes from `@warp-drive/legacy/model` instead of `@ember-data/model`).
- Your `package.json` no longer includes `ember-data`, but only `@warp-drive` packages, including `@warp-drive/legacy`.

Once these steps are completed, you still have your `Model` classes, and your code hasn't changed much. However, you have **unlocked the ability** to gradually migrate your `Model` classes to `Schema`.

### Other subtleties

Note that there are also ways to gradually reach the LegacyMode – for example, by incrementally introducing the new store APIs. This is why it can sometimes be difficult to navigate and determine which step to target.
The [Super Rentals tutorial for Ember 6.10](https://guides.emberjs.com/v6.10.0/) aligns with the key points described above and represents a clean and clear milestone for defining the LegacyMode to aim for before moving on to converting `Model` classes to `Schema`.

Initially, when you start creating `Schema` classes, the simplest approach is to continue relying on the legacy packages.
By creating `Schema` classes using the tooling provided by `@warp-drive-mirror/legacy/model/migration-support`, they will automatically inherit properties that `Model` classes had, such as fields (`isNew`, `hasDirtyAttributes`, etc) or methods (`rollbackAttributes`, `save`, etc).
Therefore, even after migrating all your models to this iteration of `Schema`, you are still operating in LegacyMode – in its strictest sense: You are "ready to exit legacy mode in the next iteration."

## Coming Codemod

A codemod is currently under development to migrate Ember applications to WarpDrive LegacyMode.
This codemod is expected to include adding WarpDrive packages, configuring them for use, and migrating `Model` classes to `Schema`.

In [the next blog post of the "From EmberData to WarpDrive" series](/blog/2026/04/30/from-ember-data-to-warp-drive-2/), we will see how Super Rentals tutorial was migrated to WarpDrive in practice.
