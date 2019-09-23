Tracked properties replace computed properties. Unlike computed properties, which require you to annotate
every getter with the values it depends on, tracked properties only require you to
annotate the values that are _trackable_, that is values that:

1. Change over the lifetime of their owner (such as a component) and
2. May cause the DOM to update in response to those changes

For example, a computed property like this:

```js
import EmberObject, { computed } from '@ember/object';

const Person = EmberObject.extend({
  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

Could be rewritten as:

```js
import { tracked } from '@glimmer/tracking';

class Person {
  @tracked firstName;
  @tracked lastName;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Notice how `fullName` doesn't require _any_ annotation at all - it's a plain old
native getter, and it'll still work and invalidate if it's used anywhere in a
template, directly or indirectly.

An additional benefit is that you no longer have to use `set` to update these
values, you can use standard JavaScript syntax instead!

```js
// Before
let chad = Person.create();
chad.set('firstName', 'Chad');
chad.set('lastName', 'Hietala');
```

```js
// After
let chad = new Person();
chad.firstName = 'Chad';
chad.lastName = 'Hietala';
```

`@tracked` installs a native setter that tracks updates to these properties,
allowing you to treat them like any other JS value.

Tracked properties have subtler benefits as well:

- They enforce that all of the trackable properties in your classes are
  annotated, making them easy to find. With computed properties, it was common
  to have properties be "implicit" in a class definition, like in the example
  above; the classic class version of `Person` doesn't have `firstName` and
  `lastName` properties defined, but they are _implied_ by their existence as
  dependencies in the `fullName` computed property.
- They enforce a "public API" of all values that are trackable in your class.
  With computed properties, it was possible to watch _any_ value in a class for changes, and
  there was nothing you as the class author could do about it. With tracked
  properties, only the values you _want_ to be trackable will trigger updates
  to anything external to your class.

Most computed properties should be fairly straightforward to convert to tracked
properties. It's important to note that in these new components, arguments are
automatically tracked, but in classic components they are _not_. This is because
arguments are put on the `args` hash, which is tracked
property. Since they are assigned to arbitrary properties on classic components,
they can't be instrumented ahead of time, so you must decorate them manually.

#### Plain Old JavaScript Objects (POJOs)

It's not uncommon to use POJOs in Ember code for storing state, representing
some models, etc. This works because `get` and `set` can be used for any path,
on any object, whether or not its an `EmberObject`, and whether or not the
property was declared in advance. This is part of what lead to the "implicit"
property problem - you `set` any property you wanted on an existing object and it
would work.

With tracked properties this is _not_ possible, since each property must be
instrumented ahead of time, and decorators can only be applied in classes. In
general, the recommendation here is to convert usages of POJOs to native classes
wherever possible:

```js
// Before
import EmberObject, { computed } from '@ember/object';

const Person = EmberObject.extend({
  init() {
    this.address = {};
  },

  fullAddress: computed('address.{street,city,region,country}', function() {
    let { street, city, region, country } = this.address;

    return `${street}, ${city}, ${state}, ${country}`;
  }),
});
```

```js
// After
import { tracked } from '@glimmer/tracking';

class Address {
  @tracked street;
  @tracked city;
  @tracked region;
  @tracked country;
}

class Person {
  address = new Address();

  get fullAddress() {
    let { street, city, region, country } = this.address;

    return `${street}, ${city}, ${state}, ${country}`;
  }
}
```

In some cases, if your usage of properties on POJOs is too dynamic, you may not
be able to enumerate every single property that could be tracked. There could be
a prohibitive number of possible properties, or there could be no way to know
them in advance. In this case, it's recommended that you _reset_ the value
wherever it is updated:

```js
class SimpleCache {
  @tracked _cache = {};

  set(key, value) {
    this._cache[key] = value;

    // trigger an update
    this._cache = this._cache;
  }

  get(key) {
    return this._cache[key];
  }
}
```

Triggering an update like this will cause any getters that used the `_cache` to
recalculate. Note that we can use the `get` method to access the cache, and it
will still push the `_cache` tracked property.

#### Arrays

Arrays are another example of a type of object where you can't enumerate every
possible value - after all, there are an infinite number of integers (though you
_may_ run out of bits in your computer at some point!) Like with POJOs with
dynamic keys, it is recommended that you _reset_ the array after changing it in
order to trigger changes:

```js
class ShoppingList {
  @tracked items = [];

  addItem(item) {
    this.items.push(item);

    // trigger an update
    this.items = this.items;
  }
}
```

### Data Down, Actions Up: A Single Owner for Every Object

The pattern of resetting a POJO or array may seem pretty strange, and may be
difficult to refactor to in some applications. After all, it's possible that the
array or object is referenced in multiple places. Does this mean you have to
reset it in _all_ of those locations in order for it to update properly? That
would quickly become a maintenance nightmare!

In order to make tracked properties work effectively, you must follow the
_single owner_ principle - every piece of state, every object or array, should
have a _single_, canonical "owner". This could be a component, or a controller,
or a service - but ultimately, this will be the object that owns and updates
that state, and all other values should _derive_ from that state via getters,
component arguments, or other _trackable_ means.

This is what is meant by the Data Down, Actions Up pattern. The data should flow
downward, along with _actions_ that can be used to update the data. For
instance, you might have an array of people in a controller, and an action which
updates those people:

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  people = [];

  @action
  addPerson(person) {
    this.people.push(person);
    this.people = this.people;
  }
}
```

And you could pass this downward into components for use:

```handlebars
<ul>
  {{#each this.people as |person|}}
    <li>{{person.name}}</li>
  {{/each}}
</ul>

<CreatePersonForm @addPerson={{this.addPerson}}/>
```

Following this pattern means that by updating the value in the owner object, you
can be sure that everywhere that the value is used will be updated as well. It
_also_ means that you centralize all mutations to your state in a single
location, which prevents your code from becoming a twisted tangled mess!

### Backwards Compatibility

Tracked properties are fully backwards compatible with computed properties and
`get`/`set`. Computed properties can depend on tracked properties like any other
dependency:

```js
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

class Person {
  @tracked firstName;

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let person = new Person();

// This will correctly invalidate `fullName`
person.firstName = 'Tom';
```

And vice-versa, computed properties used in native getters will autotrack and
cause the getter to update correctly:

```js
class Person {
  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get helloMessage() {
    return `${this.fullName} says hello!`;
  }
}
```

Likewise, properties that are not decorated with `@tracked` that you get using
`get` will also autotrack, and update later on when you use `set` to update
them:

```js
class Person {
  get fullName() {
    let firstName = get(this, 'firstName');
    let lastName = get(this, 'lastName');

    return `${firstName} ${lastName}`;
  }
}

let kris = new Person();
set(kris, 'firstName', 'Kris');
set(kris, 'lastName', 'Selden');
```

However, you _must_ use `get` for these properties, since they are not tracked
and there is no way to know in advance that they might be changed with `set`.
For instance, this will not work:

```js
class Person {
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

let kris = new Person();
set(kris, 'firstName', 'Kris');
set(kris, 'lastName', 'Selden');
```

Additionally, certain Ember objects still require the use of `get` and `set`,
such as `ObjectProxy` and `ArrayProxy`. These will continue to function with
tracked, but you _must_ use `get` and `set`. Likewise, KVO methods on Ember's
`Enumerable` class, such as `objectAt` and `pushObject`, and the various
implementations of it will _generally_ continue to be tracked.

If you have implemented your own version of an Ember `Enumerable`, or the
`EmberArray` mixin, in general, you will need to add an additional step to your
implementation of `objectAt` in order for it to work with tracking:

```js
objectAt() {
  get(this, '[]');

  // your implementation
}
```

This will push the tag for the `[]` property onto the autotrack stack, and that
property is what is invalidated when the array is updated with KVO methods.
