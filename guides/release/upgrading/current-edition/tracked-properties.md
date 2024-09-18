Tracked properties replace computed properties. Unlike computed properties, which require you to annotate
every getter with the values it depends on, tracked properties only require you to
annotate the values that are _trackable_, that is values that:

1. Change over the lifetime of their owner (such as a component) and
2. May cause the DOM to update in response to those changes

For example, a computed property like this:

```js
import EmberObject, { computed } from '@ember/object';

const Image = EmberObject.extend({
  aspectRatio: computed('width', 'height', function() {
    return this.width / this.height;
  }),
});
```

Could be rewritten as:

```js
import { tracked } from '@glimmer/tracking';

class Image {
  @tracked width;
  @tracked height;

  get aspectRatio() {
    return this.width / this.height;
  }
}
```

Notice how `aspectRatio` doesn't require _any_ annotation at all - it's a plain old
native getter, and it'll still work and invalidate if it's used anywhere in a
template, directly or indirectly.

An additional benefit is that you no longer have to use `set` to update these
values, you can use standard JavaScript syntax instead!

```js
// Before
let profilePhoto = Image.create();
profilePhoto.set('width', 300);
profilePhoto.set('height', 300);
```

```js
// After
let profilePhoto = new Image();
profilePhoto.width = 300;
profilePhoto.height = 300;
```

`@tracked` installs a native setter that tracks updates to these properties,
allowing you to treat them like any other JS value.

Tracked properties have subtler benefits as well:

- They enforce that all of the trackable properties in your classes are
  annotated, making them easy to find. With computed properties, it was common
  to have properties be "implicit" in a class definition, like in the example
  above; the classic class version of `Image` doesn't have `width` and
  `height` properties defined, but they are _implied_ by their existence as
  dependencies in the `aspectRatio` computed property.
- They enforce a "public API" of all values that are trackable in your class.
  With computed properties, it was possible to watch _any_ value in a class for changes, and
  there was nothing you as the class author could do about it. With tracked
  properties, only the values you _want_ to be trackable will trigger updates
  to anything external to your class.

Most computed properties should be fairly straightforward to convert to tracked
properties. It's important to note that on `@glimmer/component`, arguments are
automatically tracked, but in classic `@ember/component` they are not. 

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

    return `${street}, ${city}, ${region}, ${country}`;
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

    return `${street}, ${city}, ${region}, ${country}`;
  }
}
```

Generally, you should try to create classes with their tracked properties
enumerated and decorated with `@tracked`, instead of relying on dynamically
created POJOs. In some cases however, if your usage of properties on POJOs is
too dynamic, you may not be able to enumerate every single property that could
be tracked. In this case, you can use `TrackedObject` from `tracked-built-ins`:

```js
import { TrackedObject } from 'tracked-built-ins';

let obj = new TrackedObject({
  a: 1,
  b: 2,
})

// This change is tracked
obj.c = 3;
```

All property reading and writing on this object is automatically tracked.
`TrackedObject` is "shallowly" tracked. `obj.c = 4` would be tracked, but
`obj.c.somethingDeeper = 5` would not be tracked unless you've also made sure
that the contents of `obj.c` is itself another `TrackedObject`.


#### Arrays

When you want to track the contents of an Array, you can use `TrackedArray` from
`tracked-built-ins`:

```js
import { TrackedArray } from 'tracked-built-ins';

class ShoppingList {
  items = new TrackedArray([]);

  addItem(item) {
    this.items.push(item);
  }
}
```

`TrackedArray` supports all the normal native `Array` methods, ensuring that
their reads and writes are tracked.

### Backwards Compatibility

Tracked properties are fully backwards compatible with computed properties and
`get`/`set`. Computed properties can depend on tracked properties like any other
dependency:

```js
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

class Image {
  @tracked width;

  @computed('width', 'height')
  get aspectRatio() {
    return this.width / this.height;
  }
}

let profilePhoto = new Image();

// This will correctly invalidate `aspectRatio`
profilePhoto.width = 200;
```

Note, however, that if you want to use a getter as a dependent key, you will
need to use the [`dependentKeyCompat`](https://api.emberjs.com/ember/release/functions/@ember%2Fobject%2Fcompat/dependentKeyCompat) decorator. This allows you to refactor
existing computed properties into getters without breaking existing code that
observes them.

Vice-versa, computed properties used in native getters will autotrack and
cause the getter to update correctly:

```js
class Image {
  @computed('width', 'height')
  get aspectRatio() {
    return this.width / this.height;
  }

  get helloMessage() {
    return `Image aspect ratio is: ${this.aspectRatio}!`;
  }
}
```

Likewise, properties that are not decorated with `@tracked` that you get using
`get` will also autotrack, and update later on when you use `set` to update
them:

```js
import { get, set } from '@ember/object';

class Image {
  get aspectRatio() {
    let width = get(this, 'width');
    let height = get(this, 'height');

    return width / height;
  }
}

let profilePhoto = new Image();
set(profilePhoto, 'width', 300);
set(profilePhoto, 'height', 300);
```

However, you _must_ use `get` for these properties, since they are not tracked
and there is no way to know in advance that they might be changed with `set`.
For instance, this will not work:

```js
import { set } from '@ember/object';

class Image {
  get aspectRatio() {
    return this.width / this.height;
  }
}

let profilePhoto = new Image();
set(profilePhoto, 'width', 250);
set(profilePhoto, 'height', 250);
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

## When to Use `get` and `set`

Here are some cases where you still need to use `get` and `set`:

- When accessing and updating plain properties on objects without decorators
- When using Ember's `ObjectProxy` class, or a class that implements the
  `unknownProperty` function (which allows objects to intercept `get` calls)
- When accessing relationships for EmberData records, e.g. 
`blogPost.get('comments')`. Under the hood, this is a type of `ObjectProxy`.

Additionally, you will have to continue using _accessor_ functions for arrays if
you want arrays to update as expected.
These functions are covered in more detail in the [Looping Through Lists](../../../components/looping-through-lists/) guide.

Importantly, you do _not_ have to use `get` or `set` when reading or updating
computed properties, as was noted in the computed property section.

In the sections below, you will learn why these methods are still needed,
and review some detailed examples of `ObjectProxy` and plain objects.

### Background information

Why do developers still need to use `get` and `set` in some places?

Ember's classic change tracking system used two methods to ensure that all data
was accessed properly and updated correctly: `get` and `set`.

```js
import { get, set } from '@ember/object';

let image = {};

set(image, 'width', 250);
set(image, 'height', 500);

get(image, 'width'); // 250
get(image, 'height'); // 500
```

In classic Ember, all property access had to go through these two methods. Over
time, these rules have become less strict, and now they have been minimized to
just the few cases mentioned in this section.
In general, in a modern Ember app, you shouldn't need to use
them all that much. As long as you are marking your properties as `@tracked`,
Ember should automatically figure out what needs to change, and when.

### Plain Properties

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
  photo = {
    width: 300,
    height: 300,
  };

  get photoAspectRatio() {
    return get(this.photo, 'width') / get(this.photo, 'height');
  }
}

let profile = new Profile();

// render the page...

set(profile.photo, 'width', 500); // triggers an update
```

This is also useful when working with older Ember code which has not yet
been updated to tracked properties. If you're unsure, you can use `get` and
`set` to be safe.

### `ObjectProxy`

Ember has and continues to support an implementation of a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy),
which is a type of object that can _wrap around_ other objects and _intercept_
all of your gets and sets to them. Native JavaScript proxies allow you to do
this without any special methods or syntax, but unfortunately they are not
available in IE11. Since many Ember users must still support IE11, Ember's
`ObjectProxy` class allows us to accomplish something similar.

The use cases for proxies are generally cases where some data is very dynamic,
and its not possible to know ahead of time how to create a class that is
decorated. For instance, [`ember-m3`](https://github.com/hjdivad/ember-m3) is an
addon that allows EmberData to work with dynamically generated models instead
of models defined using `@attr`, `@hasMany`, and `@belongsTo`. This cuts back on
code shipped to the browser, but it means that the models have to _dynamically_
watch and update values. A proxy allows all accesses and updates to be
intercepted, so `m3` can do what it needs to do without predefined classes.

Most `ObjectProxy` classes have their own `get` and `set` method on them, like
`EmberObject` classes. This means you can use them directly on the class
instance:

```js
proxy.get('width');
proxy.set('width', 100);
```

If you're unsure whether or not a given object will be a proxy or not, you can
still use Ember's `get` and `set` functions:

```js
get(maybeProxy, 'width');
set(maybeProxy, 'width', 100);
```

<!-- eof - needed for pages that end in a code block  -->
