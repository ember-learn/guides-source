<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
<em>Not</em> disabling prototype extensions is deprecated at Ember 5.10 and will be removed at Ember 6.0. See <a href="https://deprecations.emberjs.com/id/deprecate-array-prototype-extensions">the deprecation guide</a> for more detail.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Historically, Ember.js extended the prototypes of native JavaScript arrays to
implement the `Ember.Enumerable`, `Ember.MutableEnumerable`,
`Ember.MutableArray` and `Ember.Array` interfaces. This is the default behavior
up until 6.0, at which point it will no longer be supported.

To prepare for 6.0, you can disable prototype extensions immediately. To do so,
set the `EmberENV.EXTEND_PROTOTYPES` flag to `false`:

```javascript {data-filename=config/environment.js}
ENV = {
  EmberENV: {
    EXTEND_PROTOTYPES: false
  }
}
```

## Life Without Array Prototype Extension

There are two major differences to how arrays will behave after you disable array prototype extensions.

### No more non-standard methods

Arrays no longer have the non-standard methods listed in the [deprecation guide](https://deprecations.emberjs.com/id/deprecate-array-prototype-extensions) like `pushObject`, etc. Follow the deprecation guide to replace each usage with a standard JavaScript alternative.

### Tracking of Changes in Arrays

If you disable prototype extensions and attempt to use
native arrays with things like a template's `{{#each}}` helper, Ember.js
will have no way to detect changes to the array and the template will
not update as the underlying array changes.

You can restore automatic tracking of changes by replacing your native array with a `TrackedArray` from the 'tracked-built-ins' library.

```javascript
import { TrackedArray } from '@glimmer/tracking';

class Ocean {
  islands = new TrackedArray(['Oahu', 'Kauai']);
  
  addIsland(newIsland) {
    this.islands.push(newIsland);
  }
}
```

Alternatively, you can refactor your code to use an "immutable update" style with tracked properties:

```javascript
import { tracked } from '@glimmer/tracking';

class Ocean {
  @tracked islands = ['Oahu', 'Kauai'];
  
  addIsland(newIsland) {
    this.islands = this.islands.concat(newIsland);
  }
}
```

<!-- eof - needed for pages that end in a code block  -->
