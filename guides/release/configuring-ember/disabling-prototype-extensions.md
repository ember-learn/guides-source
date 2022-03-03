By default, Ember.js will extend the prototypes of native JavaScript
arrays to implement the `Ember.Enumerable`, `Ember.MutableEnumerable`,
`Ember.MutableArray` and `Ember.Array` interfaces. This polyfills
ECMAScript 5 array methods in browsers that do not implement them, adds
convenience methods and properties to built-in arrays, and makes array
mutations observable.

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
      Array: false
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

You can also use an "immutable update" style with tracked properties:

```javascript
import { tracked } from '@glimmer/tracking';

class Ocean {
  @tracked islands = ['Oahu', 'Kauai'];
  
  addIsland(newIsland) {
    this.islands = this.islands.concat(newIsland);
  }
}

const ocean = new Ocean();
ocean.addIsland('Maui');
ocean.islands; // => ['Oahu', 'Kauai', 'Maui'];
```

Alternatively, you can use the community library `tracked-built-ins`
to get a natively tracked version of `Array`, and use native `Array`
methods with auto-tracking reactivity:

```javascript
import { TrackedArray } from 'tracked-built-ins';

let islands = new TrackedArray(['Oahu', 'Kauai']);
islands.push('Maui');
// => ['Oahu', 'Kauai', 'Maui'];
```

<!-- eof - needed for pages that end in a code block  -->
