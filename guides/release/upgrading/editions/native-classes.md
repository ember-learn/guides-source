## Native Classes

Native classes are a feature of JavaScript.
They are officially supported in Ember Octane for use with:

- Components (except classic components)
- Ember Data Models
- Routes
- Controllers
- Services
- Helpers
- General utility classes

For developers who are not already familiar with Native Classes, it's helpful to read and experiment a little outside of Ember first. You can see some examples and try interactive code [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/class).

### Benefits of Native Classes

For existing Ember users, Native Classes might seem a bit strange, but for developers coming from general JavaScript backgrounds or other frameworks, it might be hard for them to imagine Ember any other way.

Before classes were available in JavaScript, Ember developers still got to use some class-like features thanks to `@ember/object`.
Now that classes are available in JavaScript, we can do away with some of the 
`@ember/object` quirks.

### Getting used to Native Classes

The only class that is _not_ supported is the _classic Ember component_ class,
imported from `@ember/component`. This is mainly because it requires additional
decorators that are not available in Ember.js directly. You can instead use
external addons like [ember-decorators](https://ember-decorators.github.io/ember-decorators) if you want to convert these to
native classes, and refer to their documentation as a guide.

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
every time they are used. In order to have getters and setters _rerender_ when
values have changed, you must either decorate them with the `@computed`
decorator, or use _tracked properties_.

Classic classes didn't have an equivalent for native getters and setters until
recently, but you can define them now with the standard JavaScript getter syntax:

```js
export default EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
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
itself. Instead, the decorator gets _applied_ to the getter function, modifying it
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
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @action
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

The action decorator also _binds_ actions, so you can refer to them directly in
templates without the `{{action}}` helper:

```handlebars
<!-- Before -->
<OtherComponentHere @update={{action 'helloWorld'}} />
```

```handlebars
<!-- After -->
<OtherComponentHere @update={{this.helloWorld}} />
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
  static count = 0;
  static incrementCount() {
    this.count++;
  }

  constructor() {
    this.id = Vehicle.count;
    Vehicle.incrementCount();
  }
}
```

The `static` keyword can be applied to all class elements.