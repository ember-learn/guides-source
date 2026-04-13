Historically, Ember.js extended the prototypes of native JavaScript arrays to implement the Ember.Enumerable, Ember.MutableEnumerable, Ember.MutableArray, and Ember.Array interfaces. This added convenience methods and properties to built-in arrays, and made array mutations observable.

However, as of Ember-cli 4.9.0, prototype extensions are disabled by default in new Ember applications. This change was made to align more closely with standard JavaScript behavior and to avoid potential conflicts with other libraries or future language features.

If you have an existing application that relies on prototype extensions, you can still enable them by setting the `EmberENV.EXTEND_PROTOTYPES` flag to `true` in your `config/environment.js` file:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: true
  }
}
```

You can configure which classes to include prototype extensions
for in your application's configuration like so:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: {
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
