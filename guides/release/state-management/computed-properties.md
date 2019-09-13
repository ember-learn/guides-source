Computed properties are a pre-Octane concept in Ember. They serve the same
purpose as tracked properties and native getters, allowing users to respond to
changes, derive state, and ultimately update the DOM. They also have built-in
caching to prevent having to perform expensive calculations more than once.

While computed properties are no longer the recommended default, it's likely
that you may encounter them in code that hasn't been updated to tracked
properties just yet, either in existing applications or in the wider Ember
ecosystem, so this guide exists both to describe how they work and can be used,
and how they interoperate with tracked properties.

## Computed Property Usage

You can create a computed property by using the `@computed` decorator to
decorate standard computed property getters and setters:

```javascript
import { computed, set } from '@ember/object';

class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let ironMan = new Person('Tony', 'Stark');

ironMan.fullName; // "Tony Stark"
```

This computed property works just like a normal getter/setter, with two key
differences:

1. It will cache its value by default, and it will only update that value if its
   _dependencies_, in this case the `firstName` and `lastName` properties,
   change.

   ```javascript
   class Counter {
     _count = 0;

     @computed
     get count() {
       console.log('counted!');
       return this._count;
     }
   }

   let counter = new Counter();

   counter.count; // logs 'counted!'
   counter.count; // logs nothing, the values was cached and hasn't updated
   ```

2. It will notify other "watchers", such as other computed properties and
   templates, if any of its dependencies has updated and it needs to be
   recalculated.

### Specifying Dependencies

So far we've seen computed properties with dependencies on properties that are
_local_ to the object, but you can specify a few other types of dependencies:

- **Chain dependencies.** If you need to specify a dependency on an _object_,
  you can use dot notation to do so:

  ```js
  class Profile {
    constructor(user) {
      set(this, 'user', user);
    }

    @computed('user.firstName', 'user.lastName')
    get userName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
  }
  ```

  When doing this for more than one value on the object, you can also use a
  special truncated syntax as shorthand:

  ```js
  class Profile {
    constructor(user) {
      set(this, 'user', user);
    }

    @computed('user.{firstName,lastName}')
    get userName() {
      return `${this.user.firstName} ${this.user.lastName}`;
    }
  }
  ```

  Note that no spaces are allowed in this truncated syntax, Ember will assert if
  you place any inside of it.

- **Array dependencies.** It's possible to depend on an array, and the items in
  the array, by watching the `[]` property on the array:

  ```js
  class Person {
    constructor(friends = []) {
      set(this, 'friends', friends);
    }

    @computed('friends.[]')
    get friendNames() {
      return this.friends.map(friend => friend.name);
    }
  }
  ```

  You can also depend directly on a _property_ of each item in the array using
  `@each` syntax:

  ```js
  class Person {
    constructor(friends = []) {
      set(this, 'friends', friends);
    }

    @computed('friends.@each.name')
    get friendNames() {
      return this.friends.map(friend => friend.name);
    }
  }
  ```

  However, you cannot _chain_ on these properties, as it is a performance
  pitfall. You can only do 1 level of `@each` watching.

### Defining Setters

If you define a setter for your computed property, it'll work just like a normal
setter:

```javascript
import { computed, set } from '@ember/object';

class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value) {
    let [firstName, lastName] = value.split(' ');

    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }
}

let hero = new Person('Tony', 'Stark');

hero.fullName; // 'Tony Stark'

hero.fullName = 'Hope Pym';
hero.firstName; // 'Hope'
```

It's worth noting that we do _not_ need to use `set` to update the computed
property. It wraps the native setter transparently, so there is no need for the
set function. The properties it _depends_ on, however, _do_ need to be updated
with `set`, since they are not marked as `@tracked` and we don't have another
way of knowing they were updated. We will dive into this a bit more below.

The setter will also immediately call the getter for the computed in order to
recalculate the cached value. You can also return the value, as an optimization:

```js
class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value) {
    let [firstName, lastName] = value.split(' ');

    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);

    return value;
  }
}
```

### Computed Property Macros

It's possible to define _macros_ using computed properties. This works because
the `@computed` decorator can receive getter and setter functions, and be
applied to a normal class field instead of a getter/setter:

```js
class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  // Just a getter function
  @computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  })
  fullName;

  // With setter and getter
  @computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },

    set(key, value) {
      let [firstName, lastName] = value.split(' ');

      set(this, 'firstName', firstName);
      set(this, 'lastName', lastName);

      return value;
    },
  })
  fullNameWithSetter;
}
```

You can then extract this decorator to create a new decorator definition:

```js
const fullNameMacro = computed('firstName', 'lastName', {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },

  set(key, value) {
    let [firstName, lastName] = value.split(' ');

    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);

    return value;
  },
});

class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @fullNameMacro fullName;
}
```

And we can abstract this further to create a function that generates the
decorator dynamically, which allows us to reuse the macro:

```js
function fullNameMacro(firstNameKey, lastNameKey) {
  return computed(firstNameKey, lastNameKey, {
    get() {
      return `${this[firstNameKey]} ${this[lastNameKey]}`;
    },

    set(key, value) {
      let [firstName, lastName] = value.split(' ');

      set(this, firstNameKey, firstName);
      set(this, lastNameKey, lastName);

      return value;
    },
  });
}

class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @fullNameMacro fullName('firstName', 'lastName');
  @otherFullNameMacro fullName('first', 'last');
}
```

When you provide a getter and setter like this to `@computed`, the getter and
setter receive the `key` of the property they are decorating as the first value,
and the setter receives the actual value second. The setter also **must** return
the value to be cached - the getter will not be rerun if it does not, and the
value will be `undefined`.

### Computed Properties in Classic Classes

Computed properties can be used in classic class syntax as well. This works by
passing the getter and setter to the `computed()` decorator just like we would
for a macro:

```js
const Person = EmberObject.extend({
  fullName: computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },

    set(key, value) {
      let [firstName, lastName] = value.split(' ');

      set(this, 'firstName', firstName);
      set(this, 'lastName', lastName);

      return value;
    },
  }),
});
```

## Computed Property Dependency Types

You may have noticed that in the previous section, our computed properties were
depending on normal, undecorated properties. This is possible in classic Ember
if we always update those properties using Ember's `set` method, which is why
all of the examples use it. Computed properties can depend on other types of
values as well though. Altogether, the types of values are:

- Plain, undecorated object properties
- `@tracked` properties
- `@computed` properties
- `@dependentKeyCompat` getters
- Arrays

We'll talk about each of these individually, and discuss how they are watched
and updated.

### Plain Properties

In all the examples above, we demonstrated computed properties that depended on
plain object properties which hadn't been otherwise decorated. This was the
default in classic Ember, before tracked properties were introduced, and it
still works today - however, to trigger updates on a plain property dependency,
you _must_ use `set`:

```js
import { computed, set } from '@ember/object';

class Person {
  constructor(firstName, lastName) {
    set(this, 'firstName', firstName);
    set(this, 'lastName', lastName);
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let ironMan = new Person('Tony', 'Stark');

ironMan.fullName; // "Tony Stark"
ironMan.firstName = 'Anthony'; // This will throw an error
set(ironMan, 'firstName', 'Anthony'); // This will work, and update `fullName`
```

In general Ember will try to throw an error if you should use `set` to update a
value, but you didn't.

### Tracked Properties

Computed properties can also depend directly on tracked properties, and tracked
properties do _not_ need to be updated with `set`. Updating them with normal
JavaScript update syntax will invalidate them:

```js
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class Person {
  @tracked firstName;
  @tracked lastName;

  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let ironMan = new Person('Tony', 'Stark');

ironMan.fullName; // "Tony Stark"
ironMan.firstName = 'Anthony'; // Now this will work, because 'firstName' is tracked!
```

### Computed Properties

Computed properties can depend on other computed properties. If you depend on a
computed property, it will only trigger updates if _its_ dependencies update, or
if you set it directly:

```js
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class Person {
  @tracked firstName;
  @tracked lastName;

  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value) {
    let [firstName, lastName] = value.split(' ');

    this.firstName = firstName;
    this.lastName = lastName;
  }

  @computed('fullName')
  get legalName() {
    return this.fullName;
  }
}

let hero = new Person('Tony', 'Stark');

hero.legalName; // 'Tony Stark'

hero.fullName = 'Hope Pym'; // Invalidates `legalName`
hero.legalName; // 'Hope Pym'

hero.firstName = 'Hank'; // Invalidates `fullName` _and_ `legalName`
hero.fullName; // 'Hank Pym'
hero.legalName; // 'Hank Pym'
```

### Dependency Compatible Getters

In modern, fully tracked classes, computed properties aren't recommended
anymore. However, if you are working in a legacy codebase and converting to
tracked properties and native getters, there may be a point in time where you
try to convert a computed property that is being depended on by _other_ computed
properties. Native getters normally _cannot_ be depended on, and this will
trigger an error in development mode.

However, this doesn't mean that you need to convert an entire tree of computed
properties every time you try to update a class! Instead, you can mark native
getters that need to be depended on by computed properties with the `@dependentKeyCompat`
decorator:

```js
import { computed } from '@ember/object';
import { dependentKeyCompat } from '@ember/object/compat';
import { tracked } from '@glimmer/tracking';

class Person {
  @tracked firstName;
  @tracked lastName;

  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @dependentKeyCompat
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value) {
    let [firstName, lastName] = value.split(' ');

    this.firstName = firstName;
    this.lastName = lastName;
  }

  @computed('fullName')
  get legalName() {
    return this.fullName;
  }
}
```

This decorator exposes the getter to computed properties, but otherwise leaves
it untouched - it'll operate just like a normal native getter with tracked
properties. When you have removed all computed properties that are depending on the
getter, you can remove the `@dependentKeyCompat` decorator.

In general, you should try to remove `@dependentKeyCompat` decorators as you convert your
app. Making getters compatible with the explicit dependency system means that more computeds can be written to watch
those getters, and the situation can get _worse_ instead of better over time. If
you need to write a service or class that needs to interop with modern and
classic code for some time, try to _minimize_ the number of `@dependentKeyCompat` getters
to just the ones that are the "public API" of the class - the values that are
expected to be depended on from the outside by other classes.

### Arrays

As we mentioned above, computed properties can specify dependencies on arrays.
They can watch for changes in the items of the array by watching the `[]` key of
the array, and they can watch for changes on properties of the items using the
`@each` syntax.

In order to be properly notified of changes to an array, you either use KVO
compliant methods of Ember arrays such as `pushObject` or `popObject`, or `set`
the entire array:

```js
import { computed, set } from '@ember/object';
import { A as emberA } from '@ember/array';

class Person {
  constructor(friends = []) {
    set(this, 'friends', friends);
  }

  @computed('friends.[]')
  get friendNames() {
    return this.friends.map(friend => friend.name);
  }
}

let joey = new Person(
  emberA([
    { name: 'Phoebe' },
    { name: 'Monica' },
    { name: 'Chandler' },
    { name: 'Ross' },
  ])
);

// Using pushObject will cause `friendNames` to update
joey.friends.pushObject({ name: 'Rachel' });

// Alternatively, we can update the whole array:
set(joey, 'friends', [...joey.friends, { name: 'Rachel' }]);
```

If the property is tracked, then `set` is not necessary, and the field can be
updated directly as you would with normal tracked properties:

```js
import { computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

class Person {
  @tracking friends;

  constructor(friends = []) {
    this.friends = friends;
  }

  @computed('friends.[]')
  get friendNames() {
    return this.friends.map(friend => friend.name);
  }
}

let joey = new Person([
  { name: 'Phoebe' },
  { name: 'Monica' },
  { name: 'Chandler' },
  { name: 'Ross' },
]);

joey.friends = [...joey.friends, { name: 'Rachel' }];
```

## Computed Properties and Tracking

Computed properties will autotrack when they are accessed from templates or
through other getters, like tracked properties:

```js
import { computed } from '@ember/object';
import { dependentKeyCompat } from '@ember/object/compat';
import { tracked } from '@glimmer/tracking';

class Person {
  @tracked firstName;
  @tracked lastName;

  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(value) {
    let [firstName, lastName] = value.split(' ');

    this.firstName = firstName;
    this.lastName = lastName;
  }

  // legalName will update whenever `fullName` updates
  get legalName() {
    return this.fullName;
  }
}
```
