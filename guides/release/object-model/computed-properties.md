## What are Computed Properties?

In a nutshell, computed properties let you declare functions as properties.
You create one by defining a computed property as a function, which Ember will automatically call when you ask for the property.
You can then use it the same way you would any normal, static property.

It's super handy for taking one or more normal properties and transforming or manipulating their data to create a new value.

### Computed properties in action

We'll start with a simple example.
We have a `Person` object with `firstName` and `lastName` properties, but we also want a `fullName` property that joins the two names when either of them changes:

```javascript
import EmberObject, { computed } from '@ember/object';

Person = EmberObject.extend({
  // these will be supplied by `create`
  firstName: null,
  lastName: null,

  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  })
});

let ironMan = Person.create({
  firstName: 'Tony',
  lastName:  'Stark'
});

ironMan.fullName; // "Tony Stark"
```

This declares `fullName` to be a computed property, with `firstName` and `lastName` as the properties it depends on.
The first time you access the `fullName` property, the function will be called and the results will be cached.
Subsequent access of `fullName` will read from the cache without calling the function.
Changing any of the dependent properties causes the cache to invalidate, so that the computed function runs again on the next access.

### Computed properties only recompute when they are consumed

A computed property will only recompute its value when it is _consumed._ Properties are consumed in two ways:

1. By being accessed, for example `ironMan.fullName`
2. By being referenced in a handlebars template that is currently being rendered, for example `{{ironMan.fullName}}`

Outside of those two circumstances the code in the property will not run, even if one of the property's dependencies are changed.

We'll modify the `fullName` property from the previous example to log to the console:

```javascript
import Ember from 'ember';

…
  fullName: computed('firstName', 'lastName', function() {
    console.log('compute fullName'); // track when the property recomputes
    return `${this.firstName} ${this.lastName}`;
  })
…
```

Using the new property, it will only log after a `fullName` is accessed, and then only if either the `firstName` or `lastName` has been previously changed:

```javascript

let ironMan = Person.create({
  firstName: 'Tony',
  lastName:  'Stark'
});

ironMan.fullName; // 'compute fullName'
ironMan.set('firstName', 'Bruce') // no console output

ironMan.fullName; // 'compute fullName'
ironMan.fullName; // no console output since dependencies have not changed
```


### Multiple dependents on the same object

In the previous example, the `fullName` computed property depends on two other properties of the same object.  
However, you may find that you have to observe the properties of a different object.

For example, look at this computed property:

```javascript
import EmberObject, { computed } from '@ember/object';

let home = EmberObject.extend({
  location: {
    streetName: 'Evergreen Terrace',
    streetNumber: 742
  },

  address: computed('location.streetName', 'location.streetNumber', function() {
    return `${this.location.streetNumber} ${this.location.streetName}`;
  })
});

home.address // 742 Evergreen Terrace
home.set('location.streetNumber', 744)
home.address // 744 Evergreen Terrace
```

It is important to observe an object's properties, not the object itself that has properties nested inside. If the object reference `location` is used as a dependent key, the computed property will not recalculate when the `streetName` or `streetNumber` properties change.

```javascript
import EmberObject, { computed } from '@ember/object';

let home = EmberObject.extend({
  location: {
    streetName: 'Evergreen Terrace',
    streetNumber: 742
  },

  address: computed('location', function() {
    return `${this.location.streetNumber} ${this.location.streetName}`;
  })
});

home.address // 742 Evergreen Terrace
home.set('location.streetNumber', 744)
home.address // 742 Evergreen Terrace
home.set('location', {
  streetName: 'Evergreen Terrace',
  streetNumber: 744
})
home.address // 744 Evergreen Terrace
```

Since both `streetName` and `streetNumber` are properties on the `location` object, we can use a short-hand syntax called _brace expansion_ to declare the dependents keys.
You surround the dependent properties with braces (`{}`), and separate with commas, like so:

```javascript
import EmberObject, { computed } from '@ember/object';

let home = EmberObject.extend({
  location: {
    streetName: 'Evergreen Terrace',
    streetNumber: 742
  },

  address: computed('location.{streetName,streetNumber}', function() {
    return `${this.location.streetNumber} ${this.location.streetName}`;
  })
});
```

### Chaining computed properties

You can use computed properties as values to create new computed properties.
Let's add a `description` computed property to the previous example,
and use the existing `fullName` property and add in some other properties:

```javascript
import EmberObject, { computed } from '@ember/object';

Person = EmberObject.extend({
  firstName: null,
  lastName: null,
  age: null,
  country: null,

  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  }),

  description: computed('fullName', 'age', 'country', function() {
    return `${this.fullName}; Age: ${this.age}; Country: ${this.country}`;
  })
});

let captainAmerica = Person.create({
  firstName: 'Steve',
  lastName: 'Rogers',
  age: 80,
  country: 'USA'
});

captainAmerica.get('description'); // "Steve Rogers; Age: 80; Country: USA"
```

### Dynamic updating

Computed properties, by default, observe any changes made to the properties they depend on and are dynamically updated when they're called.
Let's use computed properties to dynamically update.

```javascript
captainAmerica.set('firstName', 'William');

captainAmerica.description; // "William Rogers; Age: 80; Country: USA"
```

So this change to `firstName` was observed by `fullName` computed property, which was itself observed by the `description` property.

Setting any dependent property will propagate changes through any computed properties that depend on them, all the way down the chain of computed properties you've created.

### Setting Computed Properties

You can also define what Ember should do when setting a computed property.
If you try to set a computed property, it will be invoked with the key (property name), and the value you want to set it to.
You must return the new intended value of the computed property from the setter function.

```javascript
import EmberObject, { computed } from '@ember/object';

Person = EmberObject.extend({
  firstName: null,
  lastName: null,

  fullName: computed('firstName', 'lastName', {
    get(key) {
      return `${this.firstName} ${this.lastName}`;
    },
    set(key, value) {
      let [firstName, lastName] = value.split(/\s+/);
      this.set('firstName', firstName);
      this.set('lastName',  lastName);
      return value;
    }
  })
});


let captainAmerica = Person.create();
captainAmerica.set('fullName', 'William Burnside');
captainAmerica.firstName; // William
captainAmerica.lastName; // Burnside
```

### Computed property macros

Some types of computed properties are very common.
Ember provides a number of computed property macros, which are shorter ways of expressing certain types of computed property.

In this example, the two computed properties are equivalent:

```javascript
import EmberObject, { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

Person = EmberObject.extend({
  fullName: 'Tony Stark',

  isIronManLongWay: computed('fullName', function() {
    return this.fullName === 'Tony Stark';
  }),

  isIronManShortWay: equal('fullName', 'Tony Stark')
});
```

To see the full list of computed property macros, have a look at
[the API documentation](https://www.emberjs.com/api/ember/release/modules/@ember%2Fobject)
