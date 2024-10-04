Ember applications utilize the [dependency injection](https://en.wikipedia.org/wiki/Dependency_injection)
("DI") design pattern to declare and instantiate classes of objects and dependencies between them.

Generally, [Services](../../services/) are Ember's primary method for sharing
state via dependency injection. In most cases, you shouldn't need to learn about
how to work with Ember's DI system directly, or how to manually register and
setup dependencies. However, there are times when it may be necessary. This
guide covers the details of the system, and how to use it when needed.

## Overview

Applications and application instances each serve a role in Ember's DI implementation.

An [`Application`](https://api.emberjs.com/ember/5.11.0/classes/Application) serves as a "registry" for dependency declarations.
Factories (i.e. classes) are registered with an application,
as well as rules about "injecting" dependencies that are applied when objects are instantiated.

An [`ApplicationInstance`](https://api.emberjs.com/ember/5.11.0/classes/ApplicationInstance) serves as the "owner" for objects that are instantiated from registered factories.
Application instances provide a means to "look up" (i.e. instantiate and / or retrieve) objects.

> _Note: Although an `Application` serves as the primary registry for an app,
> each `ApplicationInstance` can also serve as a registry.
> Instance-level registrations are useful for providing instance-level customizations,
> such as A/B testing of a feature._

## Factory Registrations

A factory can represent any part of your application, like a _route_, _template_, or custom class.
Every factory is registered with a particular key.
For example, the index template is registered with the key `template:index`,
and the application route is registered with the key `route:application`.

Registration keys have two segments split by a colon (`:`).
The first segment is the framework factory type, and the second is the name of the particular factory.
Hence, the `index` template has the key `template:index`.
Ember has several built-in factory types, such as `service`, `route`, `template`, and `component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might ask, how can I find the name of a factory?
        </p>
        <p>
          Factories are kebab-cased and directories are followed by a forward slash. For example, a controller <code>app/controllers/users/primary-teachers</code> is registered as <code>controller:users/primary-teachers</code>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can create your own factory type by simply registering a factory with the new type.
For example, to create a `user` type,
you'd simply register your factory with `application.register('user:user-to-register')`.

Factory registrations must be performed either in application
or application instance initializers (with the former being much more common).

For example, an application initializer could register a `Logger` factory with the key `logger:main`:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Registering Already Instantiated Objects

By default, Ember will attempt to instantiate a registered factory when it is looked up.
When registering an already instantiated object instead of a class,
use the `instantiate: false` option to avoid attempts to re-instantiate it during lookups.

In the following example, the `logger` is a plain JavaScript object that should
be returned "as is" when it's looked up:

```javascript {data-filename=app/initializers/logger.js}
export function initialize(application) {
  let logger = {
    log(m) {
      console.log(m);
    }
  };

  application.register('logger:main', logger, { instantiate: false });
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Registering Singletons vs. Non-Singletons

By default, registrations are treated as "singletons".
This simply means that an instance will be created when it is first looked up,
and this same instance will be cached and returned from subsequent lookups.

When you want fresh objects to be created for every lookup,
register your factories as non-singletons using the `singleton: false` option.

In the following example, the `Message` class is registered as a non-singleton:

```javascript {data-filename=app/initializers/notification.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Message = EmberObject.extend({
    text: ''
  });

  application.register('notification:message', Message, { singleton: false });
}

export default {
  name: 'notification',
  initialize: initialize
};
```

## Factory Injections

Once a factory is registered, it can be "injected" where it is needed.

Factories can be injected into whole "types" of factories with _type injections_. For example:

```javascript {data-filename=app/initializers/logger.js}
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
  application.inject('route', 'logger', 'logger:main');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

As a result of this type injection,
all factories of the type `route` will be instantiated with the property `logger` injected.
The value of `logger` will come from the factory named `logger:main`.

Routes in this example application can now access the injected logger:

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  activate() {
    // The logger property is injected into all routes
    this.logger.log('Entered the index route!');
  }
}
```

Injections can also be made on a specific factory by using its full key:

```javascript
application.inject('route:index', 'logger', 'logger:main');
```

In this case, the logger will only be injected on the index route.

Injections can be made into any class that requires instantiation.
This includes all of Ember's major framework classes, such as components, helpers, routes, and the router.

### Ad Hoc Injections

Dependency injections can also be declared directly on Ember classes using `inject`.
Currently, `inject` supports injecting controllers (via `import { inject } from '@ember/controller';`)
and services (via `import { service } from '@ember/service';`).

The following code injects the `shopping-cart` service on the `cart-contents` component as the property `cart`:

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service('shopping-cart') cart;
}
```

If you'd like to inject a service with the same name as the property,
simply leave off the service name (the dasherized version of the name will be used):

```javascript {data-filename=app/components/cart-contents.js}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class CartContentComponent extends Component {
  @service shoppingCart;
}
```

## Factory Instance Lookups

To fetch an instantiated factory from the running application you can call the
[`lookup`](https://api.emberjs.com/ember/5.11.0/classes/ApplicationInstance/methods/lookup?anchor=lookup) method on an application instance. This method takes a string
to identify a factory and returns the appropriate object.

```javascript
applicationInstance.lookup('factory-type:factory-name');
```

The application instance is passed to Ember's instance initializer hooks and it
is added as the "owner" of each object that was instantiated by the application
instance.

### Using an Application Instance Within an Instance Initializer

Instance initializers receive an application instance as an argument, providing
an opportunity to look up an instance of a registered factory.

```javascript {data-filename=app/instance-initializers/logger.js}
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');

  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

### Getting an Application Instance from a Factory Instance

[`Ember.getOwner`](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) will retrieve the application instance that "owns" an
object. This means that framework objects like components, helpers, and routes
can use [`Ember.getOwner`](https://api.emberjs.com/ember/5.11.0/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) to perform lookups through their application
instance at runtime.

For example, this component plays songs with different audio services based
on a song's `audioType`.

```javascript {data-filename=app/components/play-audio.js}
import Component from '@glimmer/component';
import { getOwner } from '@ember/application';

// Usage:
//
// <PlayAudio @song=this.song />
//
export default class PlayAudioComponent extends Component {
  get audioService() {
    if (!this.args.song) {
      return null;
    }

    let applicationInstance = getOwner(this);
    let { audioType } = this.args.song;

    return applicationInstance.lookup(`service:audio-${audioType}`);
  }

  click() {
    let player = this.audioService;
    player.play(this.args.song.file);
  }
}
```

<!-- eof - needed for pages that end in a code block  -->
