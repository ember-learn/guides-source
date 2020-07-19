Ember provides several configuration options that can help you debug problems
with your application.

## Routing

### Log router transitions

```javascript {data-filename=app/app.js}
import Application from '@ember/application';

export default class App extends Application {
  // Basic logging, e.g. "Transitioned into 'post'"
  LOG_TRANSITIONS = true,

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  LOG_TRANSITIONS_INTERNAL = true
}
```
## Views / Templates

### Log view lookups

```javascript {data-filename=config/environment.js}
ENV.APP.LOG_VIEW_LOOKUPS = true;
```

## Controllers

### Log generated controller

```javascript {data-filename=config/environment.js}
ENV.APP.LOG_ACTIVE_GENERATION = true;
```

## Observers / Binding

### See all observers for an object, key

```javascript
Ember.observersFor(comments, keyName);
```

### Log object bindings

```javascript {data-filename=config/environments.js}
ENV.APP.LOG_BINDINGS = true;
```

## Miscellaneous

### Turn on resolver resolution logging

This option logs all the lookups that are done to the console. Custom objects
you've created yourself have a tick, and Ember generated ones don't.

It's useful for understanding which objects Ember is finding when it does a lookup
and which it is generating automatically for you.

```javascript {data-filename=app/app.js}
import Application from '@ember/application';

export default class App extends Application {
  LOG_RESOLVER = true
}
```
### Dealing with deprecations

In addition to what is described in the [Handling Deprecations guide](./handling-deprecations),
you can turn on the following settings:

```javascript
Ember.ENV.RAISE_ON_DEPRECATION = true;
Ember.ENV.LOG_STACKTRACE_ON_DEPRECATION = true;
```

### Implement an Ember.onerror hook to log all errors in production

```javascript
import fetch from 'fetch';

Ember.onerror = function(error) {
  fetch('/error-notification', {
    method: 'POST',
    body: JSON.stringify({
      stack: error.stack,
      otherInformation: 'exception message'
    })
  });
}
```

### Import the console

If you are using imports with Ember, be sure to import the console:

```javascript
Ember = {
  imports: {
    Handlebars: Handlebars,
    jQuery: $,
    console: window.console
  }
};
```

### Errors within `Ember.run.later` Backburner

[Backburner.js](https://github.com/ebryn/backburner.js) has support for stitching the stacktraces together so that you can
track down where an error thrown by `Ember.run.later` is being initiated from. Unfortunately,
this is quite slow and is not appropriate for production or even normal development.

To enable full stacktrace mode in Backburner, and thus determine the stack of the task
when it was scheduled onto the run loop, you can set:

```javascript
Ember.run.backburner.DEBUG = true;
```

Once the `DEBUG` value is set to `true`, when you are at a breakpoint you can navigate
back up the stack to the `flush` method in and check the `errorRecordedForStack.stack`
value, which will be the captured stack when this job was scheduled.
