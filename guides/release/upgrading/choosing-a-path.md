When an application is a bit behind, it can be hard to know where to start an efficient modernization.
Below is a proposal to choose your upgrade path to modern Ember.
It's not infallible, you may be working in a specific context that makes it hard to apply as is, but it represents the most generic "easier path".

To use this guide, **follow the sections in the proposed order** and "stop and do" each time your app fulfills the condition.

## 1. My app still uses Ember < 3.28

👉 Upgrade Ember to 3.28.
This version is important because the tooling for GJS and Embroider-Vite was backported to work with it.

📙 [Version Upgrade Guide](../ember-version)

From the moment your app is at least in Ember 3.28, you are in a good place to start modernizing; even if you have the overwhelming feeling that 3.28 to 7 is just too much to catch-up with, the state of your app is better than you think it is.
Ember never leaves anyone behind, all the tools are there to help you adopt modern practices at your own pace.

## 2. My Ember ≥ 3.28 app still uses `.hbs` and `.js` files

👉 Start using `.gjs` format instead. Convert your components, route, and render tests.

📙 [Polaris Upgrade Guide](../polaris-edition), [template-tag-codemod](https://github.com/embroider-build/embroider/tree/main/packages/template-tag-codemod) for guidance and automation

GJS is more performant than separate `.hbs` and `.js` files, so your build will be faster.
The explicit imports of the invokables used in the template make the code easier to understand.
Also, from the moment a GJS component is functional, you can be sure it's compatible with Vite.
That means that if you are still building with Broccoli, doing the GJS migration first will ensure you don't have any component that will later block your move to Embroider-Vite.

## 3. My 3.28 ≤ Ember app still uses EmberData < 5.3

👉 Update to WarpDrive 5.8.
Your current version of EmberData is a v1 addon that is incompatible with Vite, while 5.8 is a compatible v2 addon.

📙 [WarpDrive Upgrade Guide](../warp-drive)

EmberData becomes a v2 addon in 5.3, but the advantage of 5.8 is that you will have all the deprecation warnings that guide you to WarpDrive legacy mode.
Version 5.8 also re-introduces the compatibility with Ember < 5. It will behave fine when building with Embroider-Vite.

## 4.  My Ember ≥ 3.28 app still builds with Broccoli 

👉 Start building with Embroider-Vite.

📙 [Polaris Upgrade Guide](../polaris-edition), [ember-vite-codemod](https://github.com/mainmatter/ember-vite-codemod) for guidance and automation

Embroider-Vite is a significant improvement for your build system.
By adopting Vite and ensure your application is Vite-compatible, you also pave the way to more recent Ember versions.
It's easier to modernize Ember in general when you're already using the modern build system.

## 5.  My Ember ≥ 3.28 app still uses EmberData Models

👉 Migrate EmberData Models to WarpDrive Schemas.
There is a codemod under development to automate this migration. Meanwhile.

📙 [WarpDrive Upgrade Guide](../warp-drive)

Once your Models are migrated to schema using the legacy mode tools, you are using WarpDrive legacy mode in its strictest definition.
The future WarpDrive update will enable a more truely framework-agnostic data layer.

## 6. My 3.28 ≤ Ember < 6.0 app is not typed

👉  Update Ember to at least 6.0.
This version will ease TypeScript introduction because it provides native types.

📙 [Version Upgrade Guide](../ember-version)

Before Ember 6.0, you need to rely on the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) package for Ember to type your app.
Starting Ember 6.0, native types are provided, so TypeScript configuration is lighter.

## 7. My Ember ≥ 6.0 app is not typed

👉  Introduce TypeScript.

📙 [TypeScript: Converting an Existing Ember App](../../typescript/application-development/converting-an-app/)

Typing can be introduced progressively.
The parts of your code that provide an API to the rest of the app can legitimately be considered more relevant, since they can effectively improve the code robustness and also make the APIs easier to read.
