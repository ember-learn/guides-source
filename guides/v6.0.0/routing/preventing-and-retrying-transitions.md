During a route transition, the Ember Router passes a transition
object to the various hooks on the routes involved in the transition.
Any hook that has access to this transition object has the ability
to immediately abort the transition by calling `transition.abort()`,
and if the transition object is stored, it can be re-attempted at a
later time by calling `transition.retry()`.

### Preventing Transitions via `routeWillChange`

When a transition is attempted, whether via `<LinkTo />`, `transitionTo`,
or a URL change, a `routeWillChange` event is fired on the [`RouterService`](https://api.emberjs.com/ember/6.0.0/classes/RouterService/events). This gives each active route, starting with the leaf-most
route, the opportunity to decide whether or not the transition should occur.

Imagine your app is in a route that's displaying a complex form for the user
to fill out and the user accidentally navigates backwards. Unless the
transition is prevented, the user might lose all of the progress they
made on the form, which can make for a pretty frustrating user experience.

Here's one way this situation could be handled:

```javascript {data-filename=app/routes/form.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class FormRoute extends Route {
  @service router;

  constructor() {
    super(...arguments);
    
    this.router.on('routeWillChange', (transition) => {
      if (!transition.to.find(route => route.name === this.routeName) && 
        !confirm('Are you sure you want to abandon progress?')) {
        transition.abort();
      }
    });
  }
};
```

When the user clicks on a `<LinkTo />` component, or when the app initiates a
transition by using `transitionTo`, the transition will be aborted and the URL
will remain unchanged. However, if the browser back button is used to
navigate away from `route:form`, or if the user manually changes the URL, the
new URL will be navigated to before the `routeWillChange` action is
called. This will result in the browser displaying the new URL, even if
`routeWillChange` calls `transition.abort()`.

### Aborting Transitions Within `model`, `beforeModel`, `afterModel`

The `model`, `beforeModel`, and `afterModel` hooks described in
[Asynchronous Routing](../asynchronous-routing/)
each get called with a transition object. This makes it possible for
destination routes to abort attempted transitions.

```javascript {data-filename=app/routes/disco.js}
import Route from '@ember/routing/route';

export default class DiscoRoute extends Route {
  beforeModel(transition) {
    if (new Date() > new Date('January 1, 1980')) {
      alert('Sorry, you need a time machine to enter this route.');
      transition.abort();
    }
  }
}
```

### Storing and Retrying a Transition

Aborted transitions can be retried at a later time. A common use case
for this is having an authenticated route redirect the user to a login
page, and then redirecting them back to the authenticated route once
they've logged in.

```javascript {data-filename=app/routes/some-authenticated.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SomeAuthenticatedRoute extends Route {
  @service router;

  beforeModel(transition) {
    if (!this.controllerFor('auth').userIsLoggedIn) {
      let loginController = this.controllerFor('login');
      loginController.previousTransition = transition;
      this.router.transitionTo('login');
    }
  }
}
```

```javascript {data-filename=app/controllers/login.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service router;

  @action
  login() {
    // Log the user in, then reattempt previous transition if it exists.
    let previousTransition = this.previousTransition;
    if (previousTransition) {
      this.previousTransition = null;
      previousTransition.retry();
    } else {
      // Default back to homepage
      this.router.transitionTo('index');
    }
  }
}
```

<!-- eof - needed for pages that end in a code block  -->
