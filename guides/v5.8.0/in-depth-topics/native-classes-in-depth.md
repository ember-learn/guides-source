Native classes were first added to JavaScript in ES2015 (also known as ES6).
They are defined using the `class` keyword, and look like this:

```js
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

This guide will go over the basics of classes, along with two new features that
are still in development in JavaScript: [class fields][5] and [decorators][6].
We use these features in Ember because they are very useful and make writing
class code much easier, and they have made it far enough along the process of
being added to JavaScript to depend on in production applications.

[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
[6]: https://github.com/tc39/proposal-decorators

## Defining Classes

Classes are defined using the `class` keyword:

```js
class Person {}
```

Once defined, a class exists like a variable does in the current scope:

```js
function definePerson() {
  class Person {}
  console.log(Person);
}

definePerson(); // class Person {}
console.log(Person); // Error: Person is not defined
```

You can choose not to give your class a name, making it an _anonymous_ class.
For instance, you could do a default export like this, but it is not
recommended:

```js
// Not recommended 🛑
export default class {}
```

The reasons being:

1. Giving your class a name makes it easier to search for in general, and is
   better for code editors and documentation tools.
2. Giving your class a name gives it a name in the debugger, making your life
   easier later on.

You can create a new _instance_ of the class using the `new` keyword:

```js
let tom = new Person();
```

Instances are like Plain Old JavaScript Objects (POJOs) in many ways. You can
assign values to them however you like, and generally treat them the same:

```js
let tom = new Person();
let yehuda = {};

tom.name = 'Tom Dale';
yehuda.name = 'Yehuda Katz';

console.log(tom); // Person {name: "Tom Dale"}
console.log(yehuda); // {name: "Yehuda Katz"}
```

The difference is that instances of classes _inherit_ elements that are defined
in the class definition. For instance, we can define a _method_ on the person
class, and then call it from the instance:

```js
class Person {
  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  }
}

let tom = new Person();
tom.name = 'Tom Dale';
tom.helloWorld(); // Tom Dale says: Hello, world!
```

This allows you to define different _kinds_ of objects, which have their own
methods, properties, fields, and more. This is essentially Object Oriented
Programming - you define different types of objects that handle different
problems and concerns, keeping your code organized.

> _Note: Object Oriented Programming is a fundamental part of JavaScript, but it's not the only part -
> JavaScript is a multi-paradigm language, and supports Object Oriented Programming patterns along with
> Functional Programming, Event Driven programming, and imperative
> programming. You may see strong adherents to different styles both inside and
> outside of the Ember ecosystem, and that's OK! JavaScript is flexible, and
> allows you to choose the patterns that work well for you, so don't feel like
> all of your code needs to be written in a class, and likewise, don't feel like
> everything needs to be a function._

There are 4 major types of elements that can be defined in a class:

- The `constructor` function
- Methods
- Fields
- Accessors, also known as getters and setters

Along with two types of modifiers that can be applied to methods, accessors,
and fields:

- `static`
- Decorators

### Constructor

The `constructor` method is a special method in classes. It's run when you
create a new instance of the class, and can be used to setup the class:

```js
class Person {
  constructor() {
    this.name = 'Tom Dale';
  }
}

let tom = new Person();
console.log(tom.name); // 'Tom Dale'
```

You can also pass arguments to the `constructor` when creating instances with
`new`:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

let tom = new Person('Tom Dale');
console.log(tom.name); // 'Tom Dale'
```

The `constructor` can't be called in any other way. It doesn't exist on the
class or instances:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

let tom = new Person('Tom Dale');
console.log(tom.constructor()); // Error: undefined is not a function
```

### Methods

Methods are functions that are defined on the class, and usable by instances:

```js
class Person {
  constructor(name) {
    this.name = name;
  }

  helloWorld() {
    console.log(`${this.name} says: Hello, world!`);
  }
}

let stefan = new Person('Stefan Penner');
stefan.helloWorld(); // Stefan Penner says: Hello, world!
```

Like functions declared on objects, they can access the instance using `this`,
so they can store and access variables on the instance.

Methods do _not_ exist on the class itself by default:

```js
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}

Person.helloWorld(); // Error: undefined is not a function
```

They exist on the class's _prototype_, and are only readily callable by
instances. However, they can be added to the class directly using the `static`
keyword, which is described in more detail below.

> _Note: if you don't know what a "prototype" is, don't worry - it's how
> JavaScript does inheritance. Most of the details of prototypes are made
> simpler by native class syntax, and while it's useful to know, you don't need
> to dig into them to continue learning Ember or to be productive. If you are
> curious about them, you can check out the [MDN docs for more details][4]._

[4]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes

### Fields

Class fields allow you to assign properties to an instance of the class on
construction. You can define a field like this:

```js
class Person {
  name = 'Yehuda Katz';
}
```

This is the very similar to defining the `Person` class with a constructor like
this:

```js
class Person {
  constructor() {
    this.name = 'Yehuda Katz';
  }
}
```

Class fields are somewhat like object properties, but they have some key
differences. They are created and assigned to every instance of the class,
meaning that instance gets a _unique_ version of the field. This doesn't matter
if the field is a primitive, like a string or a number, but does matter if it's
an object or an array:

```js
class Person {
  friends = [];
}

let tom = new Person();
let yehuda = new Person();

tom.friends === yehuda.friends;
// false, they're different arrays
```

Fields can also access the class instance using `this` when they are being
assigned:

```js
class Child {
  constructor(parent) {
    this.parent = parent;
  }
}

class Parent {
  child = new Child(this);
}
```

However, relying on state should generally be avoided in field initializers,
since it can make your classes brittle and error prone, especially when
refactoring:

```js
// Avoid this 🛑
class Person {
  title = 'Prof.';
  name = 'Tomster';

  fullName = `${this.title} ${this.name}`;
}

// because it breaks if you change the order
class Person {
  fullName = `${this.title} ${this.name}`;

  title = 'Prof.';
  name = 'Tomster';
}

let yehuda = new Person();
console.log(yehuda.fullName); // undefined undefined

// This is ok, works no matter what the order is ✅
class Person {
  constructor() {
    this.fullName = `${this.title} ${this.name}`;
  }

  title = 'Prof.';
  name = 'Tomster';
}
```

Fields are assigned before any code in the `constructor` method is run, which is
why we can rely on them being assigned correctly by the time it runs. As with
methods, fields do _not_ exist on the class itself, nor do they exist on the
class's prototype, they only exist on the _instance_ of the class. However, they
can be added to the class directly using the `static` keyword, which is
described in more detail below.

### Accessors

Accessors, also known as getters/setters, allow you to define a special function
that is _accessed_ like a property. For example:

```js
class Person {
  get name() {
    return 'Melanie Sumner';
  }
}

let melanie = new Person();
console.log(melanie.name); // 'Melanie Sumner'
```

Even though `get name` is a method, we can treat it like a normal property.
However, if we try to set the name property to a new value, we get an error:

```js
melanie.name = 'Melanie Sumner';
// Cannot set property name of #<Person> which has only a getter
```

We need to add a _setter_ in order to be able to set it. Generally, the setter
function stores the value somewhere, and the getter function retrieves it:

```js
class Person {
  _name = 'Melanie Sumner';

  get name() {
    return this._name;
  }

  set name(newName) {
    this._name = newName;
  }
}

let melanie = new Person();
console.log(melanie.name); // 'Melanie Sumner'
console.log(melanie._name); // 'Melanie Sumner'

melanie.name = 'Melanie Autumn';
console.log(melanie.name); // 'Melanie Autumn'
console.log(melanie._name); // 'Melanie Autumn'
```

Getters can also be used on their own to calculate values dynamically:

```js
class Person {
  title = 'Dr.';
  name = 'Zoey';

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

These values are recalculated every time the property is accessed:

```js
class Counter {
  _count = 0;

  get count() {
    return this._count++;
  }
}

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
the class. However, they can be added to the class directly using the `static`
keyword, which is described in more detail below.

### `static`

As we mentioned above, for all intents and purposes the methods, fields, and
accessors are only usable on _instances_ of the class. However, sometimes you
may want to place them _directly_ on the class, for instance if you want to
share some state between all instances of the class. You can do this by adding
the `static` keyword in front of the definition:

```js
class Vehicle {
  constructor() {
    Vehicle.incrementCount();
  }

  static incrementCount() {
    this.count++;
  }

  static count = 0;
}

console.log(Vehicle.count); // 0

let car = new Vehicle();

console.log(Vehicle.count); // 1
```

Static class elements are _not_ available on instances, and are only available
directly on the class itself.

```js
class Alert {
  static helloWorld() {
    return 'Hello, world!';
  }
}

console.log(Alert.helloWorld()); // Hello, world!

let alert = new Alert();

console.log(alert.helloWorld()); // Error: undefined is not a function
```

### Decorators

Decorators are user defined modifiers that can be applied to a class or class
element such as a field or method to change its behavior. For instance, you
could create a `@cache` decorator that caches the return value of a getter the
first time it is calculated:

```js
import { cache } from 'my-cache-decorator';

class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}

let counter = new Counter();

console.log(counter.count); // 0
console.log(counter.count); // 0
```

Decorators are _normal_ JavaScript functions that get applied with a special
syntax, which is why you import them like any other function, but you use the
`@` symbol when applying them. Decorators come in a variety of flavors, and some
can be applied to classes directly as well:

```js
@observable
class Person {}
```

Some decorators can also receive arguments:

```js
class Person {
  fullName = 'Matthew Beale';

  @alias('fullName') name;
}

let matt = new Person();
console.log(matt.name); // Matthew Beale
```

Ember provides [a number of decorators](https://api.emberjs.com/ember/5.8.0/modules/@ember%2Fobject#functions), such as the [`@tracked` decorator](https://api.emberjs.com/ember/5.8.0/functions/@glimmer%2Ftracking/tracked), that
will be described in greater detail later on in the guides.

> Note: Decorators are still being actively developed in JavaScript, which means
> that there may be small changes in the future. The decorators provided by
> Ember should remain stable through these changes, but it is recommended that
> you exercise caution if using any external decorator libraries which may not
> have the same stability guarantees.

### Using injection

Instances can also make use of injection if they are embedded into the application container. To achieve this, you need to call [`setOwner`](https://api.emberjs.com/ember/3.27/functions/@ember%2Fapplication/setOwner) on the instance and supply the container. You can access the container by calling [`getOwner`](https://api.emberjs.com/ember/3.27/functions/@ember%2Fapplication/getOwner) on any framework object (components, services, routes, etc.).

```js
import { service } from '@ember/service';
import { getOwner, setOwner } from '@ember/application';
 
class Item {
  @service('shopping-cart') cart;

  function addToCart() {
    this.cart.add(this);
  }
}

// On any framework object...
let item = new Item();
setOwner(item, getOwner(this));
item.addToCart();
```

Alternatively, you can call `setOwner` in the class constructor and simply supply the caller as an argument to the constructor.
```js
import { service } from '@ember/service';
import { getOwner, setOwner } from '@ember/application';

class Item {
  @service('shopping-cart') cart;

  constructor(context) {
    setOwner(this, getOwner(context));
  }

  function addToCart() {
    this.cart.add(this);
  }
}

// On any framework object...
let item = new Item(this);
item.addToCart();
```

## Extending Classes

You can create classes that extend existing classes, inheriting all of their
elements, using the `extends` keyword:

```js
class Vehicle {
  move() {
    console.log('moving!');
  }
}

class Aircraft extends Vehicle {
  fly() {
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // moving!
airbus.fly(); // flying!
```

Static class elements are also inherited this way:

```js
class Vehicle {
  static count = 0;
}

class Aircraft extends Vehicle {
  static id = 1;
}

console.log(Aircraft.count); // 0
console.log(Aircraft.id); // 1
```

Defining subclasses is otherwise the same as defining a base class in most ways,
with the exception of the `constructor` function where you _must_ use the
`super` keyword (discussed in more detail below). Class elements that are
redefined by the child class will be _overridden_, and their values will be fully
replaced on the child:

```js
class Vehicle {
  move() {
    console.log('moving');
  }
}

class Aircraft extends Vehicle {
  move() {
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // flying!
```

However, child classes can use the `super` keyword to access the parent, and use
its methods and accessors. Class fields are always overwritten on the instance,
so the values on the parent class cannot be accessed by the child if they are
redefined.

### `constructor` in extends

When extending a class, if you define a `constructor` function you _must_ call
`super` in the constructor, and you must do it _before_ you access the class
with `this`. This will call the parent class's constructor, ensuring that the
class is setup properly:

```js
class Vehicle {
  constructor() {
    console.log('vehicle made!');
  }
}

class Aircraft extends Vehicle {
  constructor() {
    super();
    console.log('aircraft made!');
  }
}

let airbus = new Aircraft();
// vehicle made!
// aircraft made!
```

In general, it's a good idea to pass along any arguments to the parent class in
the call to `super`, since they'll probably be necessary for setting up the
class.

```js
class TodoComponent extends Component {
  constructor() {
    super(...arguments);

    // setup the component...
  }
}
```

### Using `super`

`super` must be used in subclass constructors, but it can also be used in other
class methods or accessors. When being used in any other method, you must
explicitly specify the method you're calling on the super class:

```js
class Vehicle {
  move() {
    console.log(`moving!`);
  }
}

class Aircraft extends Vehicle {
  move() {
    super.move();
    console.log('flying!');
  }
}

let airbus = new Aircraft();
airbus.move(); // moving! flying!
```

You can also call _different_ methods on the super class if you want, allowing
you to change behaviors or alias methods:

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

If the method does not exist on the parent class, it will throw an error:

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
    super.fly();
  }
}

let airbus = new Aircraft();
airbus.fly(); // Error: undefined is not a function
```

In certain cases, you will want to pass arguments to the super method before or
after overriding. This allows the super class method to continue operating as it
normally would.

One common example is when overriding the
[`normalizeResponse()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/normalizeResponse?anchor=normalizeResponse)
hook in one of EmberData's serializers.

A handy shortcut for this is to use a "spread operator", like `...arguments`:

```javascript
normalizeResponse(store, primaryModelClass, payload, id, requestType)  {
  // Customize my JSON payload for Ember-Data
  return super.normalizeResponse(...arguments);
}
```

The above example returns the original arguments (after your customizations)
back to the parent class, so it can continue with its normal operations.
