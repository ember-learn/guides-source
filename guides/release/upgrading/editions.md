Editions are a new concept that were recently introduced to Ember. An edition
represents a cohesive programming model, and releasing a new edition represents
a _shift_ in the programming model due to new features and concepts being added
to Ember. Ember Octane is the first new edition that was added to Ember, and
this guide covers upgrading your application to use the new concepts introduced
by Octane.

## What is Ember Octane?

Ember Octane is a new _edition_ of Ember, packaging up all the work we've done
over the past few years to improve productivity and performance into a cohesive
whole.

Does this mean that Ember is moving back to "big bang" releases? Not at all.
We're still big believers in incremental improvements that move our community
forward together. You should think of editions as a refinement of the
incremental model, not a replacement.

Before we talk about more editions, let's quickly define a term that gets thrown
around a lot in these discussions: "the programming model."

Applied to Ember, this phrase refers to the idiomatic set of abstractions an
Ember developer uses to build web applications. These abstractions (and the
mental models that go with them) are designed to work together synergistically.
When combined as intended, they should yield code that is fast, consistent, and
maintainable.

Concretely, "Ember's programming model" encompasses how components, templates,
helpers, services, controllers, actions, etc. behave and interact, and how they
should be used in combination to solve common problems.

As we improve our collective understanding of web application architecture, we
sometimes need to change the programming model. Usually these are small tweaks,
but occasionally even the most foundational abstractions need to change. Perhaps
the best example of this is the shift from two-way bindings in Ember 1.x to the
"Data Down, Actions Up" unidirectional data flow of the Ember 2.x era. This
change touched almost every facet of how we build Ember apps.

Ember uses release channels and Semantic Versioning to communicate stability. As
soon as a new API lands in a stable release, it's safe to adopt, in the sense
that we have committed to not making any breaking changes.

Sometimes, though, we introduce new APIs to support a change to the programming
model. Often the new feature isn't very useful until it can be used in
conjunction with other new APIs that haven't landed yet.

Advanced users may try to adopt this new API right away and run into painful
edge cases inter-operating with the older programming model. Even worse, without
the bigger picture, it's easy for people to feel like core teams are
prioritizing unimportant features, or making changes for changes' sake.

Editions are intended to mitigate these problems by give a clear signal to the
community about programming model changes. The build up towards a new edition
helps us put new features in context, ensure APIs work together cohesively, and
update our documentation and marketing material.

The release of an edition signals to users that it's a good time to start
adopting new features, and they'll have a good experience because guides and
other documentation have been updated to put all of these changes into context.

One way we think about editions is their relationship to the "coherence" of
Ember. Over time, we incrementally introduce new APIs that work differently than
previous APIs. As we do this, we say Ember becomes less coherent, because not
everything needed to fully adopt the new programming model has landed yet.

![Coherence example chart](/images/upgrading/editions/coherence-chart.png)

Over time, we land more and more related APIs while deprecating APIs that aren’t
aligned with the new model. As this happens, we say the framework becomes more
coherent.

Editions, then, are regular snapshots of the framework at its most coherent,
when everything needed to adopt the new programming model is in place.

We’ll be ironing out this process with our first edition, Ember Octane.
Hopefully this edition serves to tie together the many initiatives that we’ve
worked on over the past few years, and helps show the world that Ember remains a
modern, competitive framework for getting things done.

## Features overview

The emphasis of Ember Octane is modern performance and productivity. To
accomplish that, we’re cutting away cruft that is no longer needed while
introducing new features that make app development simpler and faster.

Here’s are some of the core features in Octane:

- **Native JavaScript classes**, unlocking simpler syntax, faster performance,
  and better interop with the wider ecosystem.
- **Decorators** for customizing the behavior of components and other classes.
- **Tracked properties**, a type of decorator that simplifies keeping the DOM
  up-to-date with JavaScript changes.
- **Async functions** (`async`/`await`) for authoring asynchronous code.
- **Native JavaScript modules**, including
  - **Distributing Ember as npm packages**.
  - **Importing npm packages** with zero additional configuration.
  - **Treeshaking** to eliminate unused dependencies from the final output.
- **Octane-style components**, including
  - **"Outer HTML" templates** that support fragments and easily customizing the
    root element.
  - **Customizable DOM attributes** with `...attributes`.
  - **`<AngleBracket>` syntax** for better readability.
- **Modernized file system layout** based on the Module Unification design.

Just as important is what we’re removing from the Ember experience. These
features below will keep working, but you won’t have to use them if you don’t
want to:

- **jQuery**. For DOM interaction, developers should use templates or native DOM
  APIs.
- **Non-native classes**. Octane apps say goodbye to `extend()`, `create()`, and
  mixins.
- **Computed properties and observers**, and other legacy features of the Ember
  object model.
- **Curly component invocation**, eliminating the ambiguity in templates between
  values and DOM creation.
- **The runloop**. App developers should never have to write code that interacts
  with the Ember runloop, even in tests.
- **Ember "inner HTML" components**, and the confusing JavaScript API used to
  configure a component’s root element, like `tagName`, `classNameBindings`,
  etc.

Note that these features will continue to work for apps that need them. An
edition is not a breaking change, just a minor release. But for someone starting
a new Ember app today, this is complexity they can safely skip learning.

## Creating a New App

To take Octane for a spin, you can try the preview blueprint:

```sh
ember new octane-app -b @ember/octane
```

Once Octane is released, the default blueprint will be updated to reflect the
Octane defaults and specifying this blueprint will no longer be necessary.

## Migrating an Existing App

TODO: Getting started section. List of addons/codemods/configuration needed to
use features described above Quick description of codemods(?) and a link to
them. Note options for “partial migration”Reminder that linters will help too

### File Layout

TODO

### Templates

There are three major changes to templates in Octane:

1. Angle Bracket Syntax
2. Named Arguments
3. Required `this`

#### Angle Bracket Syntax

#### Named Arguments

#### Required `this`

### Native Classes

Native classes are officially supported in Ember Octane for use with:

- Glimmer Components
- Ember Data Models
- Routes
- Controllers
- Services
- Helpers
- General utility classes

The only class that is _not_ supported is the _classic Ember component_ class,
imported from `@ember/component`. This is mainly because it requires additional
decorators that are not available in Ember.js directly. You can instead use
external addons like [ember-decorators][1] if you want to convert these to
native classes, and refer to their documentation as a guide. This guide will
cover usage of native classes with the other constructs, and the major
differences between them and classic classes.

[1]: https://ember-decorators.github.io/ember-decorators

#### `constructor` instead of `init`

When using native classes, you should use `constructor` instead of the `init`
function:

```js
// Before
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  init() {
    this._super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
  },
});
```

```js
// After
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service store;

  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
  }
}
```

It's important to note that only _explicit_ injections are available during
class construction (e.g. injections added using `@service`). If you still rely
on _implicit_ injections, like Ember Data automatically injecting the `store`
service, you will need to add it explicitly instead:

```js
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
    // Error: store is undefined, so this will break
  }
}
```

Adding explicit injections in general is a highly recommended practice.

#### Fields vs. Properties

Native classes have _fields_ instead of properties:

```js
// Before
import Controller from '@ember/controller';

export default Controller.extend({
  title: 'hello-world.app',
});
```

```js
// After
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  title = 'hello-world.app';
}
```

Fields are syntactic sugar for assigning the value in the constructor, like so:

```js
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);
    this.title = 'hello-world.app';
  }
}
```

This means that the field created is assigned for every _instance_, instead of
once on the prototype like properties. This has two important implications:

1. It is now _safe_ to assign objects to fields! You can assign an array or an
   object to your field, and it won't be shared between instances of the class:

   ```js
   import Component from '@glimmer/component';

   export default class ShoppingList extends Component {
     // This is completely ok!
     items = ['milk', 'potatoes'];
   }
   ```

2. Performance can be a concern with fields, since they eagerly create new
   values for _every_ instance of the component. This is generally not a
   problem, but is something to be aware of.

Other than that, fields can generally replace properties in every case.

#### Getters and Setters

Getters and setters can be defined directly on native classes:

```js
export default class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

It's important to note that these are _not_ the same as computed properties,
they don't have caching by default or have dependencies, and they rerun
everytime they are used. In order to have getters and setters _rerender_ when
values have changed, you must either decorate them with the `@computed`
decorator, or use _tracked properties_.

Classic classes didn't have an equivalent for native getters and setters until
recently, but you can define them now with the `descriptor` decorator:

```js
export default EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  fullName: descriptor({
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

#### Decorators

Decorators are a new concept in _JavaScript_, but if you've never seen them
before, don't worry, they've been used in Ember for _years_. `computed()` is in
fact a type of decorator:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  fullName: computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

The native decorator version functions the same, just with a slightly different
syntax:

```js
import { computed } from '@ember/object';

export default class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Notice that you don't need to pass in the `get` function to the decorator
itself. Instead, the decorator gets _applied_ to a getter function, modifying it
in place. Existing computed properties and computed property macros, including
custom ones you've defined, can be used with this new syntax:

```js
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

function join(...keys) {
  return computed(...keys, {
    get() {
      return keys.map(key => this[key]).join(' ');
    },
  });
}

// Before
const ClassicPerson = EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  fullName: join('firstName', 'lastName'),
  name: alias('fullName'),
});

// After
class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  @join('firstName', 'lastName') fullName;
  @alias('fullName') name;
}
```

Other decorators exist, including `@tracked` which will be discussed later on,
and the `@action` decorator. The `@action` decorator replaces the `actions` hash
on routes, controllers, and components:

```js
// Before
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    helloWorld() {
      console.log('Hello, world!');
    },
  },
});
```

```js
// After
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  @action
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

The action decorator also _binds_ actions, so you can refer to them directly in
templates without the `{{action}}` helper anymore:

```hbs
<!-- Before -->
<button onclick={{action 'helloWorld'}}></button>
```

```hbs
<!-- After -->
<button onclick={{this.helloWorld}}></button>
```

You should still use the `{{action}}` helper if you need to pass additional
parameters to the action though:

```hbs
<button onclick={{action this.helloWorld "some" "values"}}></button>
```

#### `super`

In native classes, there is a dedicated `super` keyword that replaces the
`_super()` method:

```js
// Before
const Person = EmberObject.extend();

const Firefighter = Person.extend({
  init() {
    this._super(...arguments);
    this.firstName = 'Rob';
    this.lastName = 'Jackson';
  }

  saveKitten() {
    this._super(...arguments);
    console.log('kitten saved!');
  }
});

// After
class Person {}

class Firefighter extends Person {
  constructor() {
    super();
    this.firstName = 'Rob';
    this.lastName = 'Jackson';
  }

  saveKitten() {
    if (super.saveKitten) {
      super.saveKitten(...arguments);
    }

    console.log('kitten saved!');
  }
}
```

As you can see, it functions a little bit differently that the `_super()`
method. When used in a constructor, you call it directly like a function. You
_must_ do this before using `this` in the constructor, otherwise it's a syntax
error. However, when used in any other method, you must _explicitly_ specify
the function you are calling on the parent class.

Another difference is that unlike `_super()`, if the method doesn't exist on the
parent class then an error will be thrown. In most cases, the method should
exist or not, and you shouldn't need to guard it one way or the other.

#### `static`

In classic classes, if you wanted to add values to the _class_ itself, you had
to use the `reopenClass` method:

```js
const Vehicle = EmberObject.extend({
  init() {
    this._super();
    this.id = Vehicle.count;
    Vehicle.incrementCount();
  },
});

Vehicle.reopenClass({
  count: 0,
  incrementCount() {
    this.count++;
  },
});
```

In native classes this can be done with the `static` keyword instead:

```js
class Vehicle {
  constructor() {
    this.id = Vehicle.count;
    Vehicle.incrementCount();
  }

  static count = 0;
  static incrementCount() {
    this.count++;
  }
}
```

The `static` keyword can be applied to all class elements.

### Tracked Properties

### Glimmer Components
