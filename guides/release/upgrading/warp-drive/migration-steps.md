In this guide, we'll go through the main steps to convert an application using EmberData to WarpDrive LegacyMode, based on [Super Rentals tutorial](../../tutorial) features.
WarpDrive LegacyMode allows you to _use WarpDrive the way you used EmberData_, which makes it a reasonable step to target to modernize your data layer.

If your application doesn't use EmberData as a data layer and you want to start using WarpDrive directly, this guide is not for you.
Instead, refer to WarpDrive documentation and follow [the TodoMVC tutorial](https://canary.warp-drive.io/guides/tutorials/todomvc/) to start using WarpDrive in an Ember app.


## Before starting, let's clarify the example

[Super Rentals for Ember 5.8](https://guides.emberjs.com/v5.8.0/tutorial/part-2/ember-data/) represents "EmberData as it used to be".
It relies on a store, and the tutorial teaches you how to configure the requests based on Adapters and Serializers.
In the paragraphs below, we will see the shortest way to move from this to WarpDrive LegacyMode.

[Super Rentals for Ember 5.9](https://guides.emberjs.com/v5.9.0/tutorial/part-2/ember-data/) replaces the concept of configuration through Adapters with the concept of RequestManager and the new store API.
This is an intermediate state between EmberData as it used to be and WarpDrive Legacy mode as it should be implemented nowadays.
**You don't need this intermediate state if your app looks more like 5.8 version**.
In the paragraphs below, we will see how to move from this to WarpDrive LegacyMode.

[Super Rentals for Ember 6.10](https://guides.emberjs.com/v6.10.0/tutorial/part-2/ember-data/) corresponds to the first time the Super Rentals tutorial relied on `@warp-drive` packages and implements a state that can be called WarpDrive LegacyMode.
It still has legacy `Model` classes, but the possibility to upgrade to `Schema` is unblocked.
This is the implementation we will target in this guide.

## 1. Update EmberData <= 5.3 to EmberData 5.8

EmberData 5.3 is the latest EmberData LTS in which the code has nothing to do with WarpDrive.
Looking closely at the `.pnpm` folder, you would notice the presence of `warp-drive+build-config` and `warp-drive+core-types`, but there's nothing in the code that uses something called "warp-drive".

Assuming all the deprecations have been managed correctly, then an app using EmberData 5.3 has an explicit `Store` service in the application, whose minimal possible implementation is just `export { default } from 'ember-data/store';` – but you may have something more complex in your own app.

Whatever the older version of EmberData you are currently using, updating to EmberData 5.8 is a good first target because it has all the deprecation warnings that guide you to WarpDrive LegacyMode. Version 5.8 also re-introduces the compatibility with Ember < 5, and behaves fine when building with Embroider-Vite.

## 1. Setup WarpDrive

Once your app depends on EmberData 5.8, EmberData internals now rely on WarpDrive packages, and a bunch of new deprecations appear. Start with this one:
⚠️ _Using WarpDrive with EmberJS requires configuring it to use Ember's reactivity system. (...)_

It essentially asks you to setup WarpDrive.
To do so, you need to install new dependencies and change two files:

```sh
pnpm add -D @warp-drive/ember@5.8 @warp-drive/build-config@5.8
```

At the top of `app.js`:

```diff
+ import '@warp-drive/ember/install';
```

In `ember-cli-build.js`:

```diff
- module.exports = function(defaults) {
+ module.exports = async function(defaults) {
    const app = new EmberApp(defaults, {...});

+   const { setConfig } = await import("@warp-drive/build-config");
+   setConfig(app, __dirname, {
+     deprecations: {
+       DEPRECATE_TRACKING_PACKAGE: false,
+     },
+   });

    // ...
  };
```

## 2. Prepare the ground to use the new `store.request` API

If your app is already using the new `store.request` API with a `RequestManager` (e.g. Super Rental 5.9), you can skip this paragraph.

If you are still using the old store API (`store.findAll`, etc), then the next step is to manage this deprecation:
⚠️ _store.[findAll|adapterFor|serializerFor...] is deprecated. Use store.request instead. (...) See_ https://docs.warp-drive.io/api/@warp-drive/core/build-config/deprecations/variables/ENABLE_LEGACY_REQUEST_METHODS _for more details._

However, before you can use `store.request`, there are a few things to change to prepare the ground.
In EmberData as it used to be (e.g. Super Rentals 5.8), the requests are configured through the Adapter.
For instance, in Super Rentals 5.8, the rental resources are fetched from `[host]/api/rentals.json`, which is configured in `app/adapters/application.js`:

```js
import JSONAPIAdapter from "@ember-data/adapter/json-api";

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = "api";
  buildURL(...args) {
    return `${super.buildURL(...args)}.json`;
  }
}
```

- The `api` part of the URL is the namespace, and it is configured with the `namespace` property of the Adapter.
- The `.json` part of the URL is a prefix added to the resource name, and it's configured by modifying the default behavior of `buildURL`.

If you were to remove the adapter, you would see the app trying to fetch from `[host]/rentals` instead of `[host]/api/rentals.json`, and the request would fail because it would look for the resources in the wrong place...

Which is exactly what would happen if you were to introduce the new `store.request` right away!
The new `store.request` API no longer relies on the Adapter to work; it comes with an entirely different way to configure the requests.
Therefore, before you can use it, you need to re-implement all the pieces your Adapters had to build your URLs. 

### 2.1 Configure the API namespace

To get back the `api` namespace when using `store.request` API, configure the namespace either in your store file or app file:

```diff
  export default class App extends Application { ... }
  import '@warp-drive/ember/install';
+ import { setBuildURLConfig } from '@warp-drive/utilities/json-api';

  loadInitializers(App, config.modulePrefix);

+ setBuildURLConfig({
+   namespace: 'api',
+ });
```

### 2.2 Implement a request Handler

To get the `.json` extension back when using `store.request` API, implement a request Handler; literally something that modifies _how the request should be handled_.
Below is the implementation of a Handler that adds the `.json` extension to the request URL. Then, it passes over to the next Handler, whatever it is (in Super Rentals, the next Handler is the default one that calls fetch).

In `app/services/store.js`:

```diff
  export { default } from 'ember-data/store';

+ const JsonSuffixHandler = {
+   request(context, next) {
+     const { request } = context;
+     const updatedRequest = Object.assign({}, request, {
+       url: request.url + '.json',
+     });
+     return next(updatedRequest);
+   },
+ };
```

We'll see in the next paragraph how the Handler should be used.

## 3. Introduce the Legacy Store

To implement properly WarpDrive LegacyMode, replace your former EmberData store with a WarpDrive "Legacy Store".
The Legacy Store handles correctly both old APIs (`store.findAll`, etc) and the new `store.request` API.
In other words, you can start using the Legacy Store and keep yours requests exactly as they are.

The Legacy Store requires two more dependencies:

```sh
pnpm add -D @warp-drive/legacy@5.8 @warp-drive/json-api@5.8
```

The Legacy Store's options also include a `handlers` array that we can use to pass our custom handlers and ensure they are applies to the requests, like the Super Rentals' `JsonSuffixHandler` from above:

In `app/services/store.js`:

```diff
- export { default } from 'ember-data/store';
+ import { useLegacyStore } from '@warp-drive/legacy';
+ import { JSONAPICache } from '@warp-drive/json-api';

  const JsonSuffixHandler = {
    request(context, next) {
      const { request } = context;
      const updatedRequest = Object.assign({}, request, {
        url: request.url + '.json',
      });
      return next(updatedRequest);
    },
  };

+ export default useLegacyStore({
+   linksMode: false,
+   cache: JSONAPICache,
+   handlers: [JsonSuffixHandler],
+   schemas: [],
+ });
```

If your app uses EmberData as it used to be (e.g. Super Rentals 5.8), modify your store implementation based on the snippet above.

If your app already uses the `store.request` API with a `RequestManager`, you should still introduce the Legacy Store based on the snippet above.
The `RequestManager` service loses the responsibility of the handlers since they are passed to the Legacy Store.
In other words, to move from [Super Rentals for 6.9](https://guides.emberjs.com/v6.9.0/tutorial/part-2/ember-data/) to [Super Rentals for 6.10](https://guides.emberjs.com/v6.10.0/tutorial/part-2/ember-data/), the `RequestManager` is completely removed (since its only function was to get the Handler being used) and the `JsonSuffixHandler` is passed the the Legacy Store handlers directly.
Additionally, if you imported from `@ember-data/json-api/request`, it's time to move to `@warp-drive/utilities/json-api`.
Same for all the imports coming next.

## 4. Use `store.request` API

You can now progressively replace the old store API with `store.request` to fix the corresponding deprecations.
For instance, in Super Rentals, here is how to change the the `index.js` route in `app/routes/rental.js` that shows the list of available rentals.

In `app/routes/index.js`:

```diff
  import Route from '@ember/routing/route';
  import { service } from '@ember/service';
+ import { query } from '@warp-drive/utilities/json-api';

  export default class IndexRoute extends Route {
    @service store;

    async model() {
-     return this.store.findAll('rental');
+     const { content } = await this.store.request(query('rental'));
+     return content.data;
    }
  }
```

Which requires:

```sh
pnpm add -D @warp-drive/utilities@5.8
```

The Super Rentals app is now in a state where the list of rentals is fetched with the new `request` API, and the details of one rental still relies on the old store API.
Both approach work together, so this migration can be managed at a controlled pace.

The Rentals route that displays the details of one rental now looks like this:

```diff
  import Route from '@ember/routing/route';
  import { service } from '@ember/service';
+ import { findRecord } from '@warp-drive/utilities/json-api';

  export default class RentalRoute extends Route {
    @service store;

    async model(params) {
-     return this.store.findRecord('rental', params.rental_id);
+     const { content } = await this.store.request(
+       findRecord('rental', params.rental_id)
+     );
+     return content.data;
    }
  }
```

Once the old API is no longer used in the entire app, `app/adapters/applications.js` can be deleted.

## 5. Import `Model` from `@warp-drive` packages

The last thing to do to claim you use WarpDrive LegacyMode is to replace the imports in the `Model` class:

```diff
- import Model, { attr, belongsTo } from '@ember-data/model';
+ import Model, { attr, belongsTo } from '@warp-drive/legacy/model';

  const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

  export default class RentalModel extends Model {
    @attr title;
    // ...
  }
```

When all the legacy features are imported from `@warp-drive/legacy` rather that `@ember-data`, you can remove `ember-data` from the `package.json`. You are now using WarpDrive LegacyMode 🎉

## 6. Convert `Model` to `Schema`

To go further and implement WarpDrive LegacyMode in the strictest sense, we could replace our `Model` classes with new WarpDrive `Schema`, relying on `@warp-drive/legacy/model/migration-support`.

// TODO
