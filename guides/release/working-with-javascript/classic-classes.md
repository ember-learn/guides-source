If you are working in older Ember projects, or you are exploring addons in the
Ember ecosystem, you may see code that looks something like this:

```js
export default Controller.extend({
  completedItems: computed({
    get() {
      // ...
    },
  }),

  actions: {
    onClick() {
      // ...
    },
  },
});
```

These are classes defined using Ember's _classic class_ system. This system was
developed in the early versions of Ember, when native JavaScript classes did not
yet exist, and was used up until the Ember Octane edition.

Native class syntax should be preferred to classic classes whenever possible,
since they leverage the platform and standards of the language. In addition, you
should _avoid_ extending `EmberObject` with native class syntax, and prefer
writing classes that don't extend _any_ base class instead.

However, this primer covers their usage in case you need to continue working with them.

## Defining Classic Classes

To define a new classic Ember _class_, call the static [`extend()`][1] method on
the [`EmberObject`][2] base class:

[1]: https://emberjs.com/api/ember/3.7/functions/@ember%2Fobject/extend
[2]: https://www.emberjs.com/api/ember/release/classes/EmberObject

```javascript
import EmberObject from '@ember/object';

const Person = EmberObject.extend();
```

Classic classes are always assigned to variables like this, and they abide by
the same rules as variables, similar to native classes. Because of this, it's
not possible to give "names" to classes in the same way as native classes,
particularly for default exports:

```js
// This is not valid 🛑
export default const Person = EmberObject.extend();

// These are ✅
export const Person = EmberObject.extend();
export default EmberObject.extend();
```

You can create a new _instance_ of the class by calling its static `create()`
method.

```js
let tom = Person.create();
```

Unlike native classes, you _cannot_ use the `new` keyword to create instances of
classic classes. Attempting to do so will throw an error. Otherwise, instances
are very similar, they can be assigned values like you would on Plain Old
JavaScript Objects (POJOs):

```js
let tom = Person.create();
let yehuda = {};

tom.name = 'Tom Dale';
yehuda.name = 'Yehuda Katz';

console.log(tom); // Class {name: "Tom Dale"}
console.log(yehuda); // {name: "Yehuda Katz"}
```

You can also provide properties to the `create` method directly which will be
assigned on the instance:

```js
let tom = Person.create({ name: 'Tom Dale' });
console.log(tom.name); // Tom Dale
```

The key difference between POJOs and classic class instances, like native
class instances, is that classic classes inherit the elements defined in the
class definition.

```js
const Person = EmberObject.extend({
  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  },
});

let tom = Person.create();
tom.name = 'Tom Dale';
tom.helloWorld(); // Tom Dale says: Hello, world!
```

There are 4 major types of elements that can be defined in a classic class:

- The `init` function
- Methods
- Properties
- Accessors (via `descriptor()`)
- Classic Decorators (e.g. `tracked()`)

Along with the ability to add static class fields and methods using
`reopenClass`.

### `Init`

Unlike native classes, classes defined with classic class syntax have no way to
define a `constructor` function. Instead, when a new instance is created, its
[`init`][3] lifecycle hook method is invoked automatically after it has been
fully constructed. This is generally the ideal place to implement setup that you
would have done in the `constructor`:

[3]: https://www.emberjs.com/api/ember/release/classes/EmberObject/methods/init?anchor=init

```js
import EmberObject from '@ember/object';

const Person = EmberObject.extend({
  init() {
    this._super(...arguments);
    console.log(`Stefan Penner, reporting for duty!`);
  },
});

Person.create(); // Stefan Penner, reporting for duty!
```

Like the `constructor` in native classes, if you define an `init` hook in your
component it is _required_ that you call the super method with
`this._super(...arguments)` before any of your own code (calling `_super()` will
be covered in more detail below). After calling `_super()`, any values passed to
the `create` will be available on the instance:

```js
const Person = EmberObject.extend({
  init() {
    this._super(...arguments);
    console.log(`${this.name}, reporting for duty!`);
  },
});

Person.create({ name: 'Stefan Penner' }); // Stefan Penner, reporting for duty!
```

### Methods

Methods are functions that are defined on the class using [object method
syntax][4], and that usable by instances:

[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions

```js
const Person = EmberObject.extend({
  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  },
});

let stefan = Person.create({ name: 'Stefan Penner' });
stefan.helloWorld(); // Stefan Penner says: Hello, world!
```

Like functions declared on objects, they can access the instance using `this`,
so they can store and access variables on the instance.

Methods do _not_ exist on the class itself by default:

```js
const Person = EmberObject.extend({
  helloWorld() {
    console.log('Hello, world!');
  },
});

Person.helloWorld(); // Error: undefined is not a function
```

They exist on the class's _prototype_, and are only readily callable by
instances. However, they can be added to the class directly using `reopenClass`,
which is described in more detail below.

### Properties

Properties are values that are defined on the class like so:

```js
const Person = EmberObject.extend({
  name: 'Robert Jackson',
});
```

Properties are then available on instances of the class:

```js
let rob = Person.create();
console.log(rob.name); // Robert Jackson
```

They can also be overwritten:

```js
rob.name = 'Rob Jackson';
console.log(rob.name); // Rob Jackson
```

Properties that are defined on classic classes do _not_ have initializers,
unlike native class fields. In fact, the value is defined _directly_ on the
prototype, which means that it is shared between all instances of the class.
This is a common source of bugs when users define properties that are arrays or
objects:

```js
import EmberObject from '@ember/object';

const Person = EmberObject.extend({
  // Avoid this 🛑
  shoppingList: ['eggs', 'cheese'],
});

let stefan = Person.create({
  name: 'Stefan Penner',
  addItem() {
    this.shoppingList.push('bacon');
  },
});

let robert = Person.create({
  name: 'Robert Jackson',
  addItem() {
    this.shoppingList.push('sausage');
  },
});

stefan.addItem();
robert.addItem();

// They both end up with: ['eggs', 'cheese', 'bacon', 'sausage']
```

If you have values objects or other stateful values that you wish to define on
each instance, you should define them in the class's `init` method, discussed
in more detail below:

```js
const Person = EmberObject.extend({
  init() {
    // This is ok ✅
    this.shoppingList = ['eggs', 'cheese'];
  },
});
```

### Accessors

Accessors, also known as getters/setters, allow you to define a special function
that is _accessed_ like a property. They can be defined using the `descriptor`
function, for example:

```js
import EmberObject, { descriptor } from '@ember/object';

const Person = EmberObject.extend({
  name: descriptor({
    get() {
      return 'Mel Sumner';
    },
  }),
});

let mel = Person.create();
console.log(mel.name); // 'Mel Sumner'
```

Now, whenever we try to access the `name` property it calls the `get` method we
provided to `descriptor`. However, if we try to set the name property to a new
value, we get an error:

```js
mel.name = 'Melanie Sumner'; // Cannot set property name of #<Class> which has only a getter
```

We need to add a _setter_ in order to be able to set it. Generally, the setter
function stores the value somewhere, and the getter function retrieves it:

```js
const Person = EmberObject.extend({
  _name: 'Mel Sumner',

  name: descriptor({
    get() {
      return this._name;
    },

    set(newName) {
      this._name = newName;
    },
  }),
});

let mel = Person.create();
console.log(mel.name); // 'Mel Sumner'
console.log(mel._name); // 'Mel Sumner'

mel.name = 'Melanie Sumner';
console.log(mel.name); // 'Melanie Sumner'
console.log(mel._name); // 'Melanie Sumner'
```

Getters can also be used on their own to calculate values dynamically:

```js
const Person = EmberObject.extend({
  firstName: 'Mel',
  lastName: 'Sumner',

  fullName: descriptor({
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

These values are recalculated every time the property is accessed:

```js
const Counter = EmberObject.extend({
  _count: 0,

  count: descriptor({
    get count() {
      return this._count++;
    },
  }),
});

let counter = new Counter();
console.log(counter.count); // 0
console.log(counter.count); // 1
console.log(counter.count); // 2
```

This is why getters should generally _avoid_ mutating state on the instance, and
you should be aware of their performance cost since they'll rerun the code every
time.

Like methods, accessors do _not_ exist on the class itself, and instead are on
the class prototype. As such, they are only readily accessible on _instances_ of
the class. However, they can be added to the class directly using `reopenClass`,
which is described in more detail below.

### Classic Decorators

While decorator functions cannot be applied using decorator syntax in classic
classes, Ember's decorators have been designed so that they can still be used
with classic classes. In fact, the `descriptor` function from the last section
on accessors _is_ in fact such a decorator.

Decorators in classic classes are assigned directly to fields, and usually are
called like a function and passed extra values:

```js
const Person = EmberObject.extend({
  firstName: tracked({ value: 'Ricardo' }),
  lastName: tracked({ value: 'Mendes' }),

  fullName: descriptor({
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

Ember provides a number of decorators, such as the `tracked()` decorator, that
will be described in greater detail later on in the guides.

### Static Elements with `reopenClass`

There is no equivalent to the `static` modifier in native classes for classic
classes. Instead, you must call the [`reopenClass`][5] method on the class _after_
it has been defined:

[5]: https://emberjs.com/api/ember/3.7/functions/@ember%2Fobject/reopenClass

```js
const Vehicle = EmberObject.extend({
  init() {
    Vehicle.incrementCount();
  },
});

Vehicle.reopenClass({
  count: 0,

  incrementCount() {
    this.count++;
  },
});

console.log(Vehicle.count); // 0

let car = Vehicle.create();

console.log(Vehicle.count); // 1
```

Static class elements are _not_ available on instances, and are only available
directly on the class itself.

```js
const Alert = EmberObject.extend();

Alert.reopenClass({
  helloWorld() {
    alert('Hello, world!');
  },
});

console.log(Alert.helloWorld()); // Hello, world!

let alert = Alert.create();

console.log(alert.helloWorld()); // Error: undefined is not a function
```

## Extending Classic Classes

You can create classes that extend existing classes, inheriting all of their
elements, by calling `extend()` on any existing class:

```js
const Vehicle = EmberObject.extend({
  move() {
    console.log('moving!');
  },
});

const Aircraft = Vehicle.extend({
  fly() {
    console.log('flying!');
  },
});

let airbus = new Aircraft();
airbus.move(); // moving!
airbus.fly(); // flying!
```

Static class elements are also inherited this way:

```js
const Vehicle = EmberObject.extend();

Vehicle.reopenClass({
  count: 0,
});

const Aircraft = Vehicle.extend();

Aircraft.reopenClass({
  id: 1,
});

console.log(Aircraft.count); // 0
console.log(Aircraft.id); // 1
```

Defining subclasses is otherwise exactly the same as extending from
`EmberObject`. Class elements that are redefined by the child class will be
_overridden_, and their values will be fully replaced on the child:

```js
const Vehicle = EmberObject.extend({
  move() {
    console.log('moving!');
  },
});

const Aircraft = Vehicle.extend({
  move() {
    console.log('flying!');
  },
});

let airbus = Aircraft.create();
airbus.move(); // flying!
```

However, child classes can use the `_super()` method keyword to access the
parent, and use its methods.

### Using `_super`

The `_super()` method will call the method with the same name as it is being
executed from in the parent class, if it exists:

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

Unlike native classes, there is no way to specify a different method if you want
to.

In certain cases, you will want to pass arguments to the super method before or
after overriding. This allows the super class method to continue operating as it
normally would.

One common example is when overriding the [`normalizeResponse()`][4] hook in one
of Ember-Data's serializers.

A handy shortcut for this is to use a "spread operator", like `...arguments`:

[4]: https://www.emberjs.com/api/ember-data/release/classes/DS.JSONAPISerializer/methods/normalizeResponse?anchor=normalizeResponse

```javascript
normalizeResponse(store, primaryModelClass, payload, id, requestType)  {
  // Customize my JSON payload for Ember-Data
  return this._super(...arguments);
}
```

The above example returns the original arguments (after your customizations)
back to the parent class, so it can continue with its normal operations.

### Extending Classic Classes with Native Syntax

It is possible to extend classic classes with native syntax, and to toggle back
and forth between the two:

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

When doing this, you should keep the following in mind:

1. It's recommended that you use `init` instead of `constructor` even in native
   class definitions, since it works better with any classic class
   definitions, and because the properties passed to `create()` will not be
   available in the `constructor`:

   ```js
   class Person extends EmberObject {
     constructor() {
       super(...arguments);
       console.log('constructor: ', this.name);
     }

     init() {
       console.log('init: ', this.name);
     }
   }

   Person.create({ name: 'Kris Selden' });
   // constructor: undefined
   // init: Kris Selden
   ```

2. You _must_ still use `create()` to create new instances. `new` does not work.
3. Otherwise, when using native class syntax, native class rules and behaviors
   apply, and when using classic class syntax, classic class rules apply.
