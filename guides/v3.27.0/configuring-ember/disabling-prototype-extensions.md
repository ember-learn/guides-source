By default, Ember.js will extend the prototypes of native JavaScript
objects in the following ways:

* `Array` is extended to implement the `Ember.Enumerable`,
  `Ember.MutableEnumerable`, `Ember.MutableArray` and `Ember.Array`
  interfaces. This polyfills ECMAScript 5 array methods in browsers that
  do not implement them, adds convenience methods and properties to
  built-in arrays, and makes array mutations observable.

* `String` is extended to add convenience methods, such as
  `camelize()` and `w()`. You can find a list of these methods with the
  [Ember.String documentation](https://api.emberjs.com/ember/3.27.0/classes/String).

* `Function` is extended with methods to annotate functions as
  computed properties, via the `property()` method, and as observers,
  via the `observes()` method. Use of these methods
  is now discouraged and not covered in recent versions of the Guides.

This is the extent to which Ember.js enhances native prototypes. We have
carefully weighed the trade-offs involved with changing these prototypes,
and recommend that most Ember.js developers use them. These extensions
significantly reduce the amount of boilerplate code that must be typed.

However, we understand that there are cases where your Ember.js
application may be embedded in an environment beyond your control. The
most common scenarios are when authoring third-party JavaScript that is
embedded directly in other pages, or when transitioning an application
piecemeal to a more modern Ember.js architecture.

In those cases, where you can't or don't want to modify native
prototypes, Ember.js allows you to completely disable the extensions
described above.

To do so, simply set the `EmberENV.EXTEND_PROTOTYPES` flag to `false`:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: false
  }
}
```

You can configure which classes to include prototype extensions
for in your application's configuration like so:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: {
      String: false,
      Array: true
    }
  }
}
```

## Life Without Prototype Extension

In order for your application to behave correctly, you will need to
manually extend or create the objects that the native objects were
creating before.

### Arrays

Native arrays will no longer implement the functionality needed to
observe them. If you disable prototype extension and attempt to use
native arrays with things like a template's `{{#each}}` helper, Ember.js
will have no way to detect changes to the array and the template will
not update as the underlying array changes.

You can manually coerce a native array into an array that implements the
required interfaces using the convenience method `Ember.A`:

```javascript
import { A } from '@ember/array';

let islands = ['Oahu', 'Kauai'];
islands.pushObject('Maui');
// => TypeError: Object Oahu,Kauai has no method `pushObject`

// Convert `islands` to an array that implements the
// Ember enumerable and array interfaces
A(islands);

islands.pushObject('Maui');
// => ['Oahu', 'Kauai', 'Maui'];
```

### Strings

Strings will no longer have the convenience methods described in the
[`Ember.String` API reference](https://api.emberjs.com/ember/3.27.0/classes/String).
Instead,
you can use the similarly-named methods of the `Ember.String` object and
pass the string to use as the first parameter:

```javascript
import { camelize } from '@ember/string';

'my_cool_class'.camelize();
// => TypeError: Object my_cool_class has no method 'camelize'

camelize('my_cool_class');
// => "myCoolClass"
```

### Functions

The [Object Model](../../object-model/) section of the Guides describes
how to write computed properties, observers, and bindings without
prototype extensions. Below you can learn about how to convert existing
code to the format now encouraged.

To annotate computed properties, use the `Ember.computed()` method to
wrap the function:

```javascript
import { computed } from '@ember/object';

// This won't work:
aspectRatio: function() {
  return this.width / this.height;
}.property('width', 'height')


// Instead, do this:
aspectRatio: computed('width', 'height', function() {
  return this.width / this.height;
})
```

Observers are annotated using `Ember.observer()`:

```javascript
import { observer } from '@ember/object';

// This won't work:
aspectRatioDidChange: function() {
  console.log('Aspect ratio changed');
}.observes('aspectRatio')


// Instead, do this:
aspectRatioDidChange: observer('aspectRatio', function() {
  console.log('Aspect ratio changed');
})
```

Evented functions are annotated using [`Ember.on()`](https://api.emberjs.com/ember/3.27.0/classes/Evented/methods/on?anchor=on):

```javascript
import { on } from '@ember/object/evented';

// This won't work:
doStuffWhenInserted: function() {
  /* awesome sauce */
}.on('didInsertElement');

// Instead, do this:
doStuffWhenInserted: on('didInsertElement', function() {
  /* awesome sauce */
});
```

<!-- eof - needed for pages that end in a code block  -->
