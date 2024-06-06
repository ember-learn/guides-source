Native classes are a feature of JavaScript. They are officially supported in
Ember Octane for use with:

- Components (except classic components)
- EmberData Models
- Routes
- Controllers
- Services
- Helpers
- General utility classes

The [`ember-native-class-codemod`](https://github.com/ember-codemods/ember-native-class-codemod) will help you convert your existing code to Native Classes.

For developers who are not already familiar with native classes, check out
[Ember's native class guide](../../../in-depth-topics/native-classes-in-depth/),
which provides a thorough breakdown of native class functionality and usage.
This section of the upgrade guide will focus on the differences between classic
Ember classes and native classes. You can also reference the [Octane vs. Classic
Cheatsheet](https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/) as a quick reference for these differences.

## Benefits of Native Classes

For existing Ember users, Native Classes might seem a bit strange, but for
developers coming from general JavaScript backgrounds or other frameworks, it
might be hard for them to imagine Ember any other way.

Before classes were available in JavaScript, Ember developers still got to use
some class-like features thanks to `@ember/object`. Now that classes are
available in JavaScript, we can do away with some of the `@ember/object` quirks.

## Native Classes for classic component

The only class that is _not_ supported out of the box is the _classic Ember component_ class,
i.e. one imported from `@ember/component`. However, you can instead use
external addons like [ember-decorators](https://ember-decorators.github.io/ember-decorators)
if you want to convert these to native classes, and refer to their documentation
as a guide.

### `constructor` instead of `init`

When using native classes, you should use `constructor` instead of the `init`
function:

```js
// Before
import Controller from '@ember/controller';
import { service } from '@ember/service';

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
import { service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service store;

  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
  }
}
```

The `init` hook still exists on many existing classes, and runs _after_
`constructor`, so you can generally convert to native class syntax without
rewriting your `init` methods. However, in the future `init` will be removed,
so you should eventually transition to `constructor`.

It's important to note that only _explicit_ injections are available during
class construction (e.g. injections added using `@service`). If you still rely
on _implicit_ injections, like EmberData automatically injecting the `store`
service, you will need to add it explicitly instead:

```js
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
    // Error: store is undefined, so this will break
  }
}
```

Adding explicit injections in general is a highly recommended practice.

### Fields vs. Properties

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
once on the prototype like properties. This has a few important implications:

1. It is now _safe_ to assign objects to fields! You can assign an array or an
   object to your field, and it won't be shared between instances of the class:

   ```js
   import Component from '@glimmer/component';

   export default class ShoppingListComponent extends Component {
     // This is completely ok!
     items = ['milk', 'potatoes'];
   }
   ```

2. Performance can be a concern with fields, since they eagerly create new
   values for _every_ instance of the component. This is generally not a
   problem, but is something to be aware of.

3. If you are mixing native and classic class definitions, then class fields
   from a parent class can override class properties:

   ```js
   import Controller from '@ember/controller';

   class BaseController extends Controller {
     title = 'default';
   }

   export default BaseController.extend({
     // this title property will be overridden by the
     // class field in the parent class
     title: 'My Title',
   });
   ```

Other than that, fields can generally safely replace properties.

### Getters and Setters

Getters and setters can be defined directly on native classes:

```js
export default class Image {
  width = 0;
  height = 0;

  get aspectRatio() {
    return this.width / this.height;
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
  width: 0,
  height: 0,

  get aspectRatio() {
    return this.width / this.height;
  },
});
```

### Decorators

Decorators are a new concept in _JavaScript_, but if you've never seen them
before, don't worry, they've been used in Ember for _years_. `computed()` is in
fact a type of decorator:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  width: 0,
  height: 0,

  aspectRatio: computed('width', 'height', {
    get() {
      return this.width / this.height;
    },
  }),
});
```

The native decorator version functions the same, just with a slightly different
syntax:

```js
import { computed } from '@ember/object';

export default class Image {
  width = 0;
  height = 0;

  @computed('width', 'height')
  get aspectRatio() {
    return this.width / this.height;
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
  nickname: 'Tom',
  title: 'Prof.',
  name: 'Tomster',

  fullName: join('title', 'name'),
  displayName: alias('nickname'),
});

// After
class Person {
  nickName = 'Tom';
  title = 'Prof.';
  name = 'Tomster';

  @join('title', 'name') fullName;
  @alias('nickname') displayName;
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
{{!-- Before --}}
<OtherComponentHere @update={{action 'helloWorld'}} />
```

```handlebars
{{!-- After --}}
<OtherComponentHere @update={{this.helloWorld}} />
```

### `super`

In native classes, there is a dedicated `super` keyword that replaces the
`_super()` method:

```js
// Before
const Person = EmberObject.extend();

const Firefighter = Person.extend({
  init() {
    this._super(...arguments);
    this.name = 'Rob Jackson';
  },

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
    this.name = 'Rob Jackson';
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

### `static`

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

### Mixins

Native class syntax does not directly have an equivalent for the Ember mixin
system. If you want to continue using mixins as you convert, you can do so by
mixing classic class extension syntax with native class syntax:

```js
export default class Vehicle extends EmberObject.extend(MotorMixin) {
  // ...
}
```

In addition, some new framework classes, such as Glimmer components, do _not_
support Ember mixins at all. In the future, mixins will be removed from the
framework, and will not be replaced directly. For apps that use mixins, the
recommended path is to refactor the mixins to other patterns, including:

1. For functionality which encapsulates DOM modification, rewrite as a custom modifier using [ember-modifier](https://github.com/ember-modifier/ember-modifier).
1. If the mixin is a way of supplying shared behavior (not data), extract the behavior to utility functions, usually just living in module scope and imported and exported as needed.
1. If the mixin is a way of supplying long-lived, shared state, replace it with a service and inject it where it was used before. This pattern is uncommon, but sometimes appears when mixing functionality into multiple controllers or services.
1. If the mixin is a way of supplying non-shared state which follows the lifecycle of a given object, replace it with a utility class instantiated in the owning class's `constructor` (or `init` for legacy classes).
1. If none of the above, extract to pure native classes, sharing functionality via class inheritance.

## Cheatsheet

This cheatsheet is a quick reference for the best practices and differences in
native and classic classes. Remember, you should _prefer_ using native class
syntax and _not_ extending from `EmberObject` at all in your apps.

### Definitions

**Native**

- Use `class` when defining a class, and `class ... extends` when extending a
  class.

    ```js
    class Person {}

    class Actress extends Person {}
    ```

- Always give your class a name, e.g. ✅ `class MyClass {}` and not 🛑 `class {}`

**Classic**

- Use the [`extend`][1] static method to define a class, with
  [`EmberObject`][2] as the root base class.

    ```js
    const Person = EmberObject.extend({});

    const Actress = Person.extend({});
    ```

[1]: https://api.emberjs.com/ember/5.8.0/functions/@ember%2Fobject/extend
[2]: https://api.emberjs.com/ember/5.8.0/classes/EmberObject

### Instantiation

**Native**

- Use the `new` keyword to create instances of the class

    ```js
    class Person {}

    let jen = new Person();
    ```

- Arguments passed when using `new` will be accessible in the `constructor` of
  the class:

    ```js
    class Person {
      constructor(name) {
        this.name = name;
      }
    }

    let jen = new Person('Jen Weber');
    console.log(jen.name); // Jen Weber
    ```

- Prefer the `constructor` function, unless the class extends `EmberObject`,
  in which case prefer `init`.

**Classic**

- Use the [`create`][3] static method to create instances of the class:

    ```js
    const Person = EmberObject.extend({});

    let jen = Person.create();
    ```

- You can pass an object of values to `create`, and they'll be assigned to the
  instance:

    ```js
    const Person = EmberObject.extend({});

    let jen = Person.create({ name: 'Jen Weber' });
    console.log(jen.name); // Jen Weber
    ```

- Use the `init` method instead of the `constructor`.

[3]: https://api.emberjs.com/ember/5.8.0/functions/@ember%2Fobject/create

### Methods

Mostly the same between native and classic:

**Native**

```js
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

**Classic**

```js
const Person = EmberObject.extend({
  helloWorld() {
    console.log('Hello, world!');
  },
});
```

### Properties and Fields

**Native**

- Native classes have _fields_. Fields are created and assigned for every
  instance:

    ```js
    class Person {
      name = 'Chad Hietala';
    }
    ```

- It is okay to assign objects and arrays in class fields:

    ```js
    // ok ✅
    class Person {
      shoppingList = [];
    }
    ```

- Avoid using class state in field definitions, use the constructor instead:

    ```js
    // bad 🛑
    class Image {
      width = 0;
      height = 0;

      aspectRatio = this.width / this.height;
    }

    // good ✅
    class Image {
      constructor() {
        this.aspectRatio = this.width / this.height;
      }

      width = 0;
      height = 0;
    }
    ```

- Fields are assigned before any constructor code is run, so you can access
  their values in the `constructor` function.

**Classic**

- Classic classes have _properties_. Properties are created and assigned once to
  the _prototype_ of the class, and are shared between every instance:

    ```js
    const Person = EmberObject.extend({
      name: 'Chad Hietala',
    });
    ```

- It is _not_ okay to assign objects or arrays as properties, because they are
  shared between instances:

    ```js
    // not ok 🛑
    const Person = EmberObject.extend({
      shoppingList: [],
    });
    ```

### Accessors

These are also mostly the same between native and classic classes.

- Accessors can be defined with the `get` and `set` keywords:

    ```js
    class Person {
      _name = 'Mel Sumner';

      get name() {
        return this._name;
      }

      set name(newName) {
        this._name = newName;
      }
    }
    ```

- Getters run every time the property is read, setters run every time the
  property is set.
- Getters should not mutate state, and should be idempotent (they return the
  same value every time if nothing else has changed).

### Decorators

**Native**

- Decorators are _modifiers_ that change the behavior of a field, method, or
  class.
- Native decorators are functions that get applied using the `@` symbol:

    ```js
    import { tracked } from '@glimmer/tracking';

    class Person {
      @tracked name = 'Ed Faulkner';
    }
    ```

- Native decorators can be applied to class fields, methods, accessors, or
  classes themselves. Generally, specific decorators are only meant to be
  applied to one or two of these types of things.
- Decorators can also receive arguments, and some decorators must receive them.
- Every decorator is unique! See the documentation for each decorator to see how
  it should be used.

**Classic**

- Classic decorators are assigned like properties in classic class definitions:

    ```js
    import EmberObject from '@ember/object';
    import { tracked } from '@glimmer/tracking';

    const Person = EmberObject.extend({
      name: tracked({ value: 'Ed Faulkner' }),
    });
    ```

- Only specific decorators provided by Ember can be applied this way in classic
  classes.

### Static Elements

**Native**

- Adding the `static` keyword to a class element definition puts it on the
  _class_ itself, instead of instances:

    ```js
    class Person {
      static name = 'Ed Faulkner';
    }

    console.log(Person.name); // Ed Faulkner

    let person = new Person();

    console.log(person.name); // undefined
    ```

**Classic**

- Use `reopenClass` to add static elements to the constructor:

    ```js
    const Person = EmberObject.extend();

    Person.reopenClass({
      name: 'Ed Faulkner',
    });
    ```

### Super

**Native**

- Use the `super` keyword
- In constructors, use the keyword by itself (this is required). Generally pass
  any arguments along as well:

    ```js
    class TodoComponent extends Component {
      constructor() {
        super(...arguments);

        // setup the component...
      }
    }
    ```

- In all other cases, specify the _method_ you want to call when using `super`:

    ```js
    class Vehicle {
      moveType = 'moving';

      move() {
        console.log(`${this.moveType}!`);
      }
    }

    class Aircraft extends Vehicle {
      moveType = 'flying';

      fly() {
        super.move();
      }
    }

    let airbus = new Aircraft();
    airbus.fly(); // flying!
    ```

- If the method does not exist on the parent class, it will throw an error.

**Classic**

- Use the `_super()` function to call the super method with the same name as the
  current method that is executing:

    ```js
    const Vehicle = EmberObject.extend({
      move() {
        console.log(`moving!`);
      },
    });

    const Aircraft = Vehicle.extend({
      move() {
        this._super();
        console.log('flying!');
      },
    });

    let airbus = new Aircraft();
    airbus.move(); // moving! flying!
    ```

- Calling `_super()` is _required_ for `init` to function properly. It should
  generally be done before you do anything else in `init`.
- It will _not_ error if the method does not exist on the parent class.

### Extending Classic Classes with Native Syntax

- It is possible to extend classic classes with native syntax, and to toggle
  back and forth between the two:

    ```js
    class Vehicle extends EmberObject {
      move() {
        // ...
      }
    }

    const Aircraft = Vehicle.extend({
      fly() {
        // ...
      },
    });

    class Helicopter extends Aircraft {
      hover() {
        // ...
      }
    }

    let blackHawk = Helicopter.create();
    ```

- Use `init` instead of `constructor`
- Use `create` instead of `new`
- Otherwise, when using native class syntax, native class rules and behaviors
  apply, and when using classic class syntax, classic class rules apply.
