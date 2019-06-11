### Tracked Properties

Tracked properties replace computed properties. Unlike computed properties, which require you to annotate
every getter with the values it depends on, tracked properties only require you to
annotate the values that are _trackable_, that is values that:

1. Change over time and
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
general, the recommendation here to convert usages of POJOs to native classes
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