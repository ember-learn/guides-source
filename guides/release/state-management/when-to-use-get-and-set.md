Ember's classic change tracking system used two methods to ensure that all data
was accessed properly and updated correctly: `get` and `set`.

```js
import { get, set } from '@ember/object';

let person = {};

set(person, 'firstName', 'Amy');
set(person, 'lastName', 'Lam');

get(person, 'firstName'); // 'Amy'
get(person, 'lastName'); // 'Lam'
```

In classic Ember, all property access had to go through these two methods. Over
time, these rules have become less strict, and now they have been minimized to
just a few cases. In general, in a modern Ember app, you shouldn't need to use
them all that much. As long as you are marking your properties as `@tracked`,
Ember should automatically figure out what needs to change, and when.

However, there still are two cases where you _will_ need to use them:

- When accessing and updating plain properties on objects without decorators
- When using Ember's `ObjectProxy` class, or a class that implements the
  `unknownProperty` function (which allows objects to intercept `get` calls)

Additionally, you will have to continue using _accessor_ functions for arrays if
you want arrays to update as expected. These functions are covered in more
detail in the guide on arrays (LINK TO ARRAY GUIDES HERE).

Importantly, you do _not_ have to use `get` or `set` when reading or updating
computed properties, as was noted in the computed property section.

## Plain Properties

In general, if a value in your application could update, and that update should
trigger rerenders, then you should mark that value as `@tracked`. This
oftentimes may mean taking a POJO and turning it into a class, but this is
usually better because it forces us to _rationalize_ the object - think about
what its API is, what values it has, what data it represents, and define that in
a single place.

However, there are times when data is _too_ dynamic. As noted below, proxies are
often used for this type of data, but usually they're overkill. Most of the
time, all we want is a POJO.

In those cases, you can still use `get` and `set` to read and update state from
POJOs within your getters, and these will track automatically and trigger
updates.

```js
class Profile {
  person = {
    firstName: 'Chris',
    lastName: 'Thoburn',
  };

  get profileName() {
    return `${get(this.person, 'firstName')} ${get(this.person, 'lastName')}`;
  }
}

let profile = new Profile();

// render the page...

set(profile.person, 'firstName', 'Christopher'); // triggers an update
```

This is also useful when working with older Ember code which has not yet
been updated to tracked properties. If you're unsure, you can use `get` and
`set` to be safe.

## `ObjectProxy`

Ember has and continues to support an implementation of a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
which is a type of object that can _wrap around_ other objects and _intercept_
all of your gets and sets to them. Native JavaScript proxies allow you to do
this without any special methods or syntax, but unfortunately they are not
available in IE11. Since many Ember users must still support IE11, Ember's
`ObjectProxy` class allows us to accomplish something similar.

The use cases for proxies are generally cases where some data is very dynamic,
and its not possible to know ahead of time how to create a class that is
decorated. For instance, [`ember-m3`](https://github.com/hjdivad/ember-m3) is an
addon that allows Ember Data to work with dynamically generated models instead
of models defined using `@attr`, `@hasMany`, and `@belongsTo`. This cuts back on
code shipped to the browser, but it means that the models have to _dynamically_
watch and update values. A proxy allows all accesses and updates to be
intercepted, so `m3` can do what it needs to do without predefined classes.

Most `ObjectProxy` classes have their own `get` and `set` method on them, like
`EmberObject` classes. This means you can use them directly on the class
instance:

```js
proxy.get('firstName');
proxy.set('firstName', 'Amy');
```

If you're unsure whether or not a given object will be a proxy or not, you can
still use Ember's `get` and `set` functions:

```js
get(maybeProxy, 'firstName');
set(maybeProxy, 'firstName', 'Amy');
```
