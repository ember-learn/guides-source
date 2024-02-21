Autotracking is how Ember's _reactivity_ model works - how it decides what to
rerender, and when. This guide covers tracking in more depth, including how it
can be used in various types of classes, and how it interacts with arrays and
POJOs.

## Autotracking Basics

When Ember first renders a component, it renders the initial _state_ of that
component - the state of the instance, and state of the arguments that are
passed to it:

```handlebars {data-filename=app/components/hello.hbs}
{{this.greeting}}, {{@name}}!
```

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';

export default class HelloComponent extends Component {
  language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

```handlebars {data-filename=app/templates/application.hbs}
<Hello @name="Jen Weber">
```

When Ember renders this template, we get:

```html
Hello, Jen Weber!
```

By default, Ember assumes that none of the values that are rendered will ever
change. In some cases this is clearly true - for instance, the punctuation in
the template will always be the same, so Ember doesn't need to do anything to
update it. These are static, state-less parts of the template. In other cases,
like `this.greeting` or `@name` argument, that's less clear. It appears
`language` might be something we want to update, and if we do, then `greeting`
should probably change, right? At the least, we should _check_ to see if it
should change.

In order to tell Ember a value might change, we need to mark it as _trackable_.
Trackable values are values that:

1. Can change over their component’s lifetime and
2. Should cause Ember to rerender if and when they change

We can do this by marking the field with the `@tracked` decorator:

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class HelloComponent extends Component {
  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

When Ember renders a value like `{{this.greeting}}` in the template, it takes
note of any tracked properties that it encounters, in this case `language`. If
these values change in the future, it schedules a rerender, and then updates
_only_ the values that could have changed. This means that when `language`
changes, only the `Hello` text in the browser will rerender - Ember leaves the
`, Jen Weber!` portion completely alone!

Arguments, like `{{@name}}`, are automatically tracked, so if they change and
are used somewhere in your component, the component will update accordingly.

## Updating Tracked Properties

Tracked properties can be updated like any other property, using standard
JavaScript syntax. For instance, we could update a tracked property via an
action, as in this example component.

```handlebars {data-filename=app/components/hello.hbs}
{{this.greeting}}, {{@name}}!

<select {{on "change" this.updateLanguage}}>
  <option value="en">English</option>
  <option value="de">German</option>
  <option value="sp">Spanish</option>
</select>
```

```js {data-filename=app/components/hello.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }

  @action
  updateLanguage(event) {
    this.language = event.target.value;
  }
}
```

Now, whenever we change the value of the `select`, it'll call the action method,
which will set the value of `language`. Since `language` is marked as tracked,
and was used in rendering `greeting`, Ember will know that `greeting` needs to
be re-rendered in the template, and will update.

Another way that a tracked property could be updated is asynchronously, if
you're sending a request to the server. For instance, maybe we would want to
load the user's preferred language:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  constructor() {
    super(...arguments);

    fetch('/api/preferences')
      .then(r => r.json()) // convert the response to a JS object
      .then(response => {
        this.language = response.preferredLanguage;
      });
  }

  @tracked language = 'en';

  get greeting() {
    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

This will also trigger a rerender. No matter where the update occurs, updating
a tracked property will let Ember know to rerender any affected portion of the
app.

### Tracking Through Methods

So far we've only shown tracked properties working through getters, but tracking
works through _methods_ or _functions_ as well:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HelloComponent extends Component {
  @tracked language = 'en';
  @tracked supportedLanguages = ['en', 'de', 'es'];

  isSupported(language) {
    return this.supportedLanguages.includes(language);
  }

  get greeting() {
    if (!this.isSupported(this.language)) {
      return 'Unsupported Language';
    }

    switch (this.language) {
      case 'en':
        return 'Hello';
      case 'de':
        return 'Hallo';
      case 'es':
        return 'Hola';
    }
  }
}
```

if `supportedLanguages` changes here, `greeting` will update as well! This
code could likely be refactored to use getters, but in cases where a function or
method makes more sense, tracked properties will still work.

### Tracked Properties in Custom Classes

Tracked properties can also be applied to your own custom classes, and used
within your components and routes:

```js {data-filename=src/utils/person.js}
export default class Person {
  @tracked title;
  @tracked name;

  constructor(title, name) {
    this.title = title;
    this.name = name;
  }

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

```js {data-filename=app/routes/application.js}
import Route from '@ember/routing/route';
import Person from '../../../../utils/person';

export default class ApplicationRoute extends Route {
  model() {
    return new Person('Dr.', 'Zoey');
  }
}
```

```js {data-filename=app/controllers/application.js}
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @action
  updateName(title, name) {
    this.model.title = title;
    this.model.name = name;
  }
}
```

```handlebars {data-filename=app/templates/application.hbs}
{{@model.fullName}}

<button type="button" {{on "click" (fn this.updateName 'Prof.' 'Tomster')}}>
  Update Name
</button>
```

As long as the properties are tracked, and accessed when rendering the template
directly or indirectly, everything should update as expected

### Plain Old JavaScript Objects (POJOs)

Generally, you should try to create classes with their tracked properties
enumerated and decorated with `@tracked`, instead of relying on dynamically
created POJOs. In some cases however, if your usage of properties on POJOs is
too dynamic, you may not be able to enumerate every single property that could
be tracked. There could be a prohibitive number of possible properties, or there
could be no way to know them in advance. In this case, it's recommended that you
_reset_ the value wherever it is updated:

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

Triggering an update like this will cause any getters that used the `cache` to
recalculate. Note that we can use the `get` method to access the cache, and it
will still push the `_cache` tracked property.

#### Arrays

Arrays are another example of a type of object where you can't enumerate every
possible value - after all, there are an infinite number of integers (though you
_may_ run out of bits in your computer at some point!). Instead, you can
continue to use `EmberArray`, which will continue to work with tracking and will
cause any dependencies that use it to invalidate correctly.

```js
import { A } from '@ember/array';

class ShoppingList {
  items = A([]);

  addItem(item) {
    this.items.pushObject(item);
  }
}
```

## Caching of tracked properties

In contrast to computed properties from pre-Octane, tracked properties are not
cached. A tracked property can also be recomputed even though its dependencies
haven't changed. The following example shows this behavior:

```js
import { tracked } from '@glimmer/tracking';

let count = 0;

class Photo {
  @tracked width = 600;
  @tracked height = 400;

  get aspectRatio() {
    count++;
    return this.width / this.height;
  }
}

let photo = new Photo();

console.log(photo.aspectRatio); // 1.5
console.log(count); // 1
console.log(photo.aspectRatio); // 1.5
console.log(count); // 2

photo.width = 800;

console.log(photo.aspectRatio); // 2
console.log(count); // 3
```

From the value of `count`, we see that `aspectRatio` was calculated 3 times.

Recomputing is fine in most cases. If the computation that happens in the
getter is very expensive, however, you will want to cache the value and
retrieve it when the dependencies haven't changed. You want to recompute only
if a dependency has been updated.

Ember's [@cached decorator](https://github.com/ember-polyfills/ember-cache-primitive-polyfill) lets
you cache (or "memoize") a getter by simply marking it as `@cached`.

With this in mind, let's introduce caching to `aspectRatio`:

```js
import { cached, tracked } from '@glimmer/tracking';

let count = 0;

class Photo {
  @tracked width = 600;
  @tracked height = 400;

  @cached
  get aspectRatio() {
    count++;
    return this.width / this.height;
  }
}

let photo = new Photo();

console.log(photo.aspectRatio); // 1.5
console.log(count); // 1
console.log(photo.aspectRatio); // 1.5
console.log(count); // 1

photo.width = 800;

console.log(photo.aspectRatio); // 2
console.log(count); // 2
```

From the value of `count`, we see that, this time, `aspectRatio` was calculated
only twice.

In general, you should avoid using @cached unless you have confirmed that the getter you are decorating is computationally expensive, since @cached adds a small amount of overhead to the getter.

The @cached decorator was released in Ember 4.1. If you want to leverage this API between versions 3.13 and 4.1, you can install [ember-cached-decorator-polyfill](https://github.com/ember-polyfills/ember-cached-decorator-polyfill) to your project.

<!-- eof - needed for pages that end in a code block  -->
