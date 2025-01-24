The Ember Router allows you to provide feedback that a route is loading, as well
as when an error occurs in loading a route.

The `error` and `loading` substates exist as a part of each route, so they
should not be added to your `router.js` file. To utilize a substate, the route, controller,
and template may be optionally defined as desired.

## `loading` substates

During the `beforeModel`, `model`, and `afterModel` hooks, data may take some
time to load. Technically, the router pauses the transition until the promises
returned from each hook fulfill.

Consider the following:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('slow-model');
});
```

```javascript {data-filename=app/routes/slow-model.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SlowModelRoute extends Route {
  @service store;

  model() {
    return this.store.findAll('slow-model');
  }
}
```

If you navigate to `slow-model`, in the `model` hook using [EmberData](../../models/),
the query may take a long time to complete.
During this time, your UI isn't really giving you any feedback as to
what's happening. If you're entering this route after a full page
refresh, your UI will be entirely blank, as you have not actually
finished fully entering any route and haven't yet displayed any
templates. If you're navigating to `slow-model` from another
route, you'll continue to see the templates from the previous route
until the model finish loading, and then, boom, suddenly all the
templates for `slow-model` load.

So, how can we provide some visual feedback during the transition?

Simply define a template called `loading` (and optionally a corresponding route)
that Ember will transition to. The
intermediate transition into the loading substate happens immediately
(synchronously), the URL won't be updated, and, unlike other transitions, the
currently active transition won't be aborted.

Once the main transition into `slow-model` completes, the `loading`
route will be exited and the transition to `slow-model` will continue.

For nested routes, like:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('user', function() {
    this.route('about', function() {
      this.route('slow-model');
    });
  });
});
```

Each of the following assumes a transition from the application or index route.

When accessing `user.about.slow-model` route then Ember will alternate trying to
find a `routeName-loading` or `loading` template in the hierarchy starting with
`user.about.slow-model-loading`:

1. `user.about.slow-model-loading`
2. `user.about.loading` or `user.about-loading`
3. `user.loading` or `user-loading`
4. `loading` or `application-loading`

It's important to note that for `slow-model` itself, Ember will not try to
find a `slow-model.loading` template but for the rest of the hierarchy either
syntax is acceptable. This can be useful for creating a custom loading screen
for a leaf route like `slow-model`.

When accessing `user.about` route then Ember will search for:

1. `user.about-loading`
2. `user.loading` or `user-loading`
3. `loading` or `application-loading`

It's important to note that `user.about.loading` template is not considered now.

Ember will *not* look above the common parent in a transition between child
routes. For example, if the user transitions from `user.about.index` to
`user.about.slow-model` the following search for template will happen:

1. `user.about.slow-model-loading`
2. `user.about.loading` or `user.about-loading`

Notice that `user.loading`, `user-loading`, `loading`, and `application-loading`
are not included here, Since `about` is the common parent for `index` and `slow-model`. This means we'll need to handle loading at every level
within the route hierarchy where loading feedback is important.


### The `loading` event

If the various `beforeModel`/`model`/`afterModel` hooks
don't immediately resolve, a [`loading`](https://api.emberjs.com/ember/6.0.0/classes/Route/events/loading?anchor=loading) event will be fired on that route.

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  @service store;
  
  model() {
    return this.store.findAll('slow-model');
  }

  @action
  loading(transition, originRoute) {
    let controller = this.controllerFor('foo');
    controller.set('currentlyLoading', true);
    return true; // allows the loading template to be shown
  }
}
```

If the `loading` handler is not defined at the specific route,
the event will continue to bubble above a transition's parent
route, providing the `application` route the opportunity to manage it.

When using the `loading` handler, we can make use of the transition promise to know when the loading event is over:

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  // ...
  @action
  async loading(transition, originRoute) {
    let controller = this.controllerFor('foo');
    controller.set('currentlyLoading', true);
    transition.promise.finally(function() {
        controller.set('currentlyLoading', false);
    });
  }
};
```

In case we want both custom logic and the default behavior for the loading substate,
we can implement the `loading` action and let it bubble by returning `true`.

```javascript {data-filename=app/routes/user-slow-model.js}
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class UserSlowModelRoute extends Route {
  // ...
  @action
  loading(transition) {
    let start = new Date();
    transition.promise.finally(() => {
      this.notifier.notify(`Took ${new Date() - start}ms to load`);
    });

    return true;
  }
};
```

## `error` substates

Ember provides an analogous approach to `loading` substates in
the case of errors encountered during a transition.

Similar to how the default `loading` event handlers are implemented,
the default `error` handlers will look for an appropriate error substate to
enter, if one can be found.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('articles', function() {
    this.route('overview');
  });
});
```

As with the `loading` substate, on a thrown error or rejected promise returned
from the `articles.overview` route's `model` hook (or `beforeModel` or
`afterModel`) Ember will look for an error template or route in the following
order:

1. `articles.overview-error`
2. `articles.error` or `articles-error`
3. `error` or `application-error`

If one of the above is found, the router will immediately transition into
that substate (without updating the URL). The "reason" for the error
(i.e. the exception thrown or the promise reject value) will be passed
to that error state as its `model`.

The model hooks (`beforeModel`, `model`, and `afterModel`) of an error substate
are not called. Only the `setupController` method of the error substate is
called with the `error` as the model. See example below:

```javascript
setupController(controller, error) {
  console.log(error.message);
  super.setupController(...arguments)
}
```

If no viable error substates can be found, an error message will be
logged.

### The `error` event

If the `articles.overview` route's `model` hook returns a promise that rejects
(for instance the server returned an error, the user isn't logged in,
etc.), an [`error`](https://api.emberjs.com/ember/6.0.0/classes/Route/events/error?anchor=error) event will fire from that route and bubble upward.
This `error` event can be handled and used to display an error message,
redirect to a login page, etc.

```javascript {data-filename=app/routes/articles-overview.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ArticlesOverviewRoute extends Route {
  @service store;
  @service router;

  model(params) {
    return this.store.findAll('privileged-model');
  }

  @action
  error(error, transition) {
    if (error.status === '403') {
      this.router.replaceWith('login');
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
};
```

Analogous to the `loading` event, you could manage the `error` event
at the application level to avoid writing the same code for multiple routes.

In case we want to run some custom logic and have the default behavior of rendering the error template,
we can handle the `error` event and let it bubble by returning `true`.

```javascript {data-filename=app/routes/articles-overview.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ArticlesOverviewRoute extends Route {
  @service store;
  
  model(params) {
    return this.get('store').findAll('privileged-model');
  }

  @action
  error(error) {
    this.notifier.error(error);
    return true;
  }
};
```

<!-- eof - needed for pages that end in a code block  -->
