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

- Always give your class a name, e.g. `✅ class MyClass {}` and not `🛑 class {}`

**Classic**

- Use the [`extend`][1] static method to define a class, with
  [`EmberObject`][2] as the root base class.

  ```js
  const Person = EmberObject.extend({});

  const Actress = Person.extend({});
  ```

[1]: https://emberjs.com/api/ember/3.7/functions/@ember%2Fobject/extend
[2]: https://www.emberjs.com/api/ember/release/classes/EmberObject

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

- Use the [`create`][3] to create instances of the class:

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

[3]: https://emberjs.com/api/ember/3.7/functions/@ember%2Fobject/create

### Methods

Mostly the same between native and classic:

```js
// Native
class Person {
  helloWorld() {
    console.log('Hello, world!');
  }
}

// Classic
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

- It is OK to assign objects and arrays in class fields:

  ```js
  // ok ✅
  class Person {
    shoppingList = [];
  }
  ```

- Avoid using class state in field definitions, use the constructor instead:

  ```js
  // bad 🛑
  class Person {
    firstName = 'Chad';
    lastName = 'Hietala';

    fullName = `${this.firstName} ${this.lastName}`;
  }

  // good ✅
  class Person {
    constructor() {
      this.fullName = `${this.firstName} ${this.lastName}`;
    }

    firstName = 'Chad';
    lastName = 'Hietala';
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

- It is _not_ ok to assign objects or arrays as properties, because they are
  shared between instances:

  ```js
  // not ok 🛑
  const Person = EmberObject.extend({
    shoppingList: [],
  });
  ```

### Accessors

**Native**

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

**Classic**

- Accessors can be defined using the `descriptor` decorator:

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
  ```

- Otherwise, they are the same as native accessors.

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
      console.log('flying');
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
