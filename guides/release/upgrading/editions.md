This guide is for developers who already know Ember, and who want to learn the new concepts introduced
by Octane, Ember's first Edition.

If you're new to Ember, we recommend starting with the [Quick start and Tutorials](https://emberjs.com/learn).

## What is Ember Octane?

Over the past few years, many new features have been added to Ember with the goal of introducing a new programming model for the framework.
This new model brings major gains in productivity and performance, incrementally via a series of minor (non-breaking) releases.
This allows for new apps to have the best features enabled automatically, while teams working on existing apps can migrate over time, while still keeping their apps up-to-date with the latest release.

Here are some of the core features in Octane:

- [Native JavaScript classes](../../working-with-javascript/native-classes/), unlocking simpler syntax, faster performance,
  and better interop with the wider ecosystem.
- [Decorators](../../working-with-javascript/native-classes/#toc_decorators) for customizing the behavior of components and other classes.
- [Tracked properties](../../state-management/tracked-properties/), a type of decorator that simplifies keeping the DOM
  up-to-date with JavaScript changes.
- **Async functions** (`async`/`await`) for authoring asynchronous code.
- [Importing npm packages](../../addons-and-dependencies/managing-dependencies/#toc_regular-npm-packages) with zero additional configuration.
- [Glimmer components](../../components/component-basics/), including
  - **"Outer HTML" templates** that support fragments and easily customizing the
    root element.
  - **Customizable DOM attributes** with `...attributes`.
  - **`<AngleBracket>` syntax** for better readability.

Just as important is what we're removing from the Ember experience. These
features below will keep working, but you won't have to use them if you don't
want to.

These have been replaced or made optional in Octane:

- **jQuery**. For DOM interaction, developers should use templates or native DOM
  APIs.
- **Non-native classes**. Octane apps say goodbye to `extend()`, `create()`, and
  mixins, and use Native Classes instead.
- **Computed properties and observers**, and other legacy features of the Ember
  object model are replaced by `@tracked`.
- **Curly component invocation** of components, eliminating the ambiguity in templates between
  values and DOM creation. Use Angle Brackets instead.
- **The run loop**. App developers should never have to write code that interacts
  with the Ember run loop, even in tests.
- **"inner HTML" components**, and the confusing JavaScript API used to
  configure a component's root element, like `tagName`, `classNameBindings`,
  etc. Now, there's no wrapping element.

Again, note that these features will continue to work for apps that need them.
An edition is not a breaking change, just a minor release. But for someone starting
a new Ember app today, this is complexity they can safely skip learning.

## Creating a New App

To create a new app that uses the default features for Octane:

```sh
ember new octane-app -b @ember/octane-app-blueprint
```

Once Octane is released, the default blueprint will be updated to reflect the
Octane defaults and specifying this blueprint will no longer be necessary.

<!-- replace-on-release - remove the contents above and replace with:

To create a new app that has every Octane feature enabled, first make sure you have the latest Ember CLI version installed:

```sh
npm uninstall ember-cli
npm install -g ember-cli
```

Then, create your app:

```sh
ember new my-app-name
```
-->

<!-- TODO how should someone upgrade an existing app? -->

## Templates

There are three major changes to templates in Octane compared to classic Ember:

1. Angle Bracket Syntax
2. Named Arguments
3. Required `this`

### Angle Bracket Syntax

When you are using a component in a template, you can invoke it using Angle Brackets (`<...>`) instead of curly braces (`{{...}}`).
The component itself will work the same as it did before.

```handlebars
{{!-- Before --}}
{{#todo-list as |item|}}
  {{to-do item=item}}
{{/todo-list}}

{{!-- After --}}
<TodoList as |item|>
  <Todo @item={{item}} />
</TodoList>
```

#### Benefits of Angle Brackets

Angle Brackets have a number of benefits:

- Single word component names are completely OK in angle bracket form.

- It is clear to your collaborators you are using a component and not a helper in a template.

- Standard attribute values applied to the component are treated like _plain-old
  HTML attributes_. This means you can assign any valid HTML attribute, and it
  will be reflected onto the component directly:

```handlebars
  <Todo
    role="list-item"
    data-test-todo-item
    data-test-id={{this.todo.id}}
    class="todo {{this.todoClass}}"
  />
```

As you can see, both literal and bound values can be set on attributes, and
attributes can be used _without_ setting a value at all, just like HTML
attributes. The component you are invoking decides where to put these attributes
by using the special `...attributes` syntax. This will be discussed later in
the section on components.

For classic components, only attributes that were explicitly listed by the component
you are invoking would be placed on the component's wrapper element.

- _Arguments_ and _attributes_ are distinguished from each other when using a
  component. With curly brace style components, every value you pass to the
  component is an _argument_ - a JS value that is passed to the component class
  so it can be used in the component's template:

  ```handlebars
  {{!-- In this example, `value` is an argument --}}
  {{custom-input value=this.text}}
  ```

  With angle brackets, since you can pass standard HTML attributes to the
  component directly, we need a way to distinguish between those and the
  component's arguments. To do this, we use the `@` symbol:

  ```handlebars
  <CustomInput @value={{this.text}}/>
  ```

  This allows you to see at a glance whether a value is an argument, which will
  likely affect the JS of a component, or an attribute, which will likely affect
  the HTML of a component.

#### Getting used to Angle Brackets

Here are the main differences between angle bracket and curly syntax:

- The component name is in `CapitalCase` instead of `kebab-case`.
  `{{my-component}}` becomes `<MyComponent />`.

- Components open and close in the same way as HTML elements. Components that do
  not accept a block can use the self closing syntax (a trailing slash) just
  like `<img />` or other tags.

- _Arguments_ are passed by adding `@` to the front of the argument name:

  ```handlebars
    {{!-- Before --}}
    {{todo-item item=item}}

    {{!-- After --}}
    <Todo @item={{this.item}}/>
  ```

- When you pass a bound value to a component, remember that it needs to be
  wrapped in curly braces:

  ```handlebars
    <Todo @done={{this.isDone}}/>
  ```

  Like HTML, all values for attributes that are not wrapped in strings are
  coerced to strings. If you want to pass a boolean or number to a component and
  _not_ have it coerced to a string, wrap it in curly braces:

  ```handlebars
    <Todo @done={{false}} maxItems={{10}} />
  ```

- Yielded values work the same as in curly invocation:

  ```handlebars
    <TodoList as |item|>
      <Todo @item={{item}} />
    </TodoList>
  ```

- Yielded components can also be invoked with angle bracket syntax:

  ```handlebars
  <TodoList as |Item|>
    <Item />
  </TodoList>
  ```

- Positional arguments (e.g. `{{my-component this.someValue}}`) are _not_
  available in angle bracket invocation, since there is some ambiguity between
  their behavior and the behavior of standard HTML attributes (HTML attributes
  without `=` default to truthy). If you still need positional arguments, you
  _must_ use the component with curly bracket syntax.

- You can use either angle bracket or curly brackets invocation for a given
  component within the same app, and even within the same template. This allows
  for gradual migration.

- Angle bracket syntax works for invoking components of any type, whether they
  are classic components, Glimmer components, or any other type of component.

### Named Arguments

With angle brackets, there is a new syntax for passing arguments to a component:

```handlebars {data-filename=application.hbs}
{{!-- Passing the argument to the BlogPost component --}}
<BlogPost @title="Hello, world!"/>
```

Within the component, you can now access these arguments _directly_ with the
same syntax:

```handlebars {data-filename=blog-post.hbs}
{{!-- inside the BlogPost component --}}
<h1>{{@title}}</h1>
```

Collectively, this is referred to as _named arguments_.

#### Benefits of Named Arguments

Named Arguments have a number of benefits:

- When you see a named argument used in a component's template, you can tell
  immediately that it is a value that was passed to the component, without
  looking at the component's class.

- Named arguments always refer to the original value that was passed to the
  component, so you can also be sure that the value was never mutated by the
  component's class.

- Teams can gradually refactor an app to use named arguments, separately from
  upgrading to angle bracket invocation. You don't need to worry about whether
  the parent used angle brackets or curly brackets. For example, this works just
  fine:

  ```handlebars {data-filename=application.hbs}
    {{blog-post title="Hello, world!"}}
  ```

  ```handlebars {data-filename=blog-post.hbs}
    {{!-- This still works --}}
    <h1>{{@title}}</h1>
  ```

#### Getting used to Named Arguments

The most important thing to know about named argument syntax is that an argument
with an `@` _always_ refers to the _original_ value that was passed when the
component was invoked. If you change that value in a classic component, it will
_not_ update:

```js {data-filename=blog-post.js}
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('title', this.title.toUpperCase());
  },
});
```

```handlebars {data-filename=blog-post.hbs}
{{!-- This is still the original title, "Hello, world!" --}}
<h1>{{@title}}</h1>

{{!-- This is the uppercased title, "HELLO, WORLD!" --}}
<h1>{{this.title}}</h1>
```

If you need to provide a default value, you'll have to do it via a getter:

```js {data-filename=blog-post.js}
import Component from '@glimmer/component';

export default class BlogPost extends Component {
  get title() {
    return this.args.title || 'Untitled';
  }
}
```

```handlebars {data-filename=blog-post.hbs}
<h1>{{this.title}}</h1>
```

> Note: The above sample uses Glimmer components - we'll be covering these in
> detail later on.

Or by using a helper in the template:

```handlebars {data-filename=blog-post.hbs}
{{!-- using {{or}} from ember-truth-helpers --}}
<h1>{{or @title "Untitled"}}</h1>
```

If you find yourself forgetting to add the `@` symbol before named arguments, it
may be helpful to think of how the child template mirrors argument being passed
into a component via angle bracket invocation.

### Required `this` in templates

Finally, one thing you may have noticed in the above examples is a lot more
references to `this` in the template. Values that are rendered from the local
component or controller instance that backs the template must now have `this`
prepended at the beginning of the path:

```handlebars
{{!-- Before --}}
{{title}}

{{!-- After --}}
{{this.title}}
```

#### Benefits of `this` in templates

The reason for this change is to provide extra clarity to both users reading
templates, and the compiler. Without explicitly referring to `this`, a lot of
handlebars statements are pretty ambiguous - for instance, `{{title}}` could be
a helper, a local variable, or a component property.

#### Getting used to `this` in templates

You can think of `this` as meaning, an argument came from `this` component or
controller, not a parent context.

Local variables, introduced via a yield, can still be referred to directly
(without `this`) since they're unambiguous:

```handlebars
{{#let "Title" as |title|}}
  {{!-- This works, because it's a local variable and unambiguous --}}
  {{title}}
{{/let}}
```

If you forget to use `this` when you are supposed to, it will fall back to the
context of the component or controller context that backs the template. However,
the fallback behavior is deprecated and will be removed in future major versions
of Ember (4+).

## Native Classes

Native classes are a feature of JavaScript. They are officially supported in
Ember Octane for use with:

- Components (except classic components)
- Ember Data Models
- Routes
- Controllers
- Services
- Helpers
- General utility classes

For developers who are not already familiar with native classes, check out
[Ember's native class guide](../../working-with-javascript/native-classes/),
which provides a thorough breakdown of native class functionality and usage.
This section of the upgrade guide will focus on the differences between classic
Ember classes and native classes. You can also reference the [Native vs. Classic
Cheatsheet](../../working-with-javascript/native-vs-classic-class-cheatsheet/)
as a quick reference for these differences.

### Benefits of Native Classes

For existing Ember users, Native Classes might seem a bit strange, but for
developers coming from general JavaScript backgrounds or other frameworks, it
might be hard for them to imagine Ember any other way.

Before classes were available in JavaScript, Ember developers still got to use
some class-like features thanks to `@ember/object`. Now that classes are
available in JavaScript, we can do away with some of the `@ember/object` quirks.

### Getting used to Native Classes

The only class that is _not_ supported is the _classic Ember component_ class,
imported from `@ember/component`. This is mainly because it requires additional
decorators that are not available in Ember.js directly. You can instead use
external addons like [ember-decorators](https://ember-decorators.github.io/ember-decorators)
if you want to convert these to native classes, and refer to their documentation
as a guide.

#### `constructor` instead of `init`

When using native classes, you should use `constructor` instead of the `init`
function:

```js
// Before
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),

  init() {
    this._super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
  },
});
```

```js
// After
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service store;

  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
  }
}
```

The `init` hook still exists on many existing classes, and runs _after_
`constructor`, so you can generally convert to native class syntax without
rewriting your `init` methods. However, in the future `init` will be removed,
so you should eventually transition to `constructor`.

It's important to note that only _explicit_ injections are available during
class construction (e.g. injections added using `@service`). If you still rely
on _implicit_ injections, like Ember Data automatically injecting the `store`
service, you will need to add it explicitly instead:

```js
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);

    this.featureFlags = this.store.findAll('feature-flag');
    // Error: store is undefined, so this will break
  }
}
```

Adding explicit injections in general is a highly recommended practice.

#### Fields vs. Properties

Native classes have _fields_ instead of properties:

```js
// Before
import Controller from '@ember/controller';

export default Controller.extend({
  title: 'hello-world.app',
});
```

```js
// After
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  title = 'hello-world.app';
}
```

Fields are syntactic sugar for assigning the value in the constructor, like so:

```js
import Controller from '@ember/controller';

export default class ApplicationController extends Controller {
  constructor() {
    super(...arguments);
    this.title = 'hello-world.app';
  }
}
```

This means that the field created is assigned for every _instance_, instead of
once on the prototype like properties. This has a few important implications:

1. It is now _safe_ to assign objects to fields! You can assign an array or an
   object to your field, and it won't be shared between instances of the class:

   ```js
   import Component from '@glimmer/component';

   export default class ShoppingList extends Component {
     // This is completely ok!
     items = ['milk', 'potatoes'];
   }
   ```

2. Performance can be a concern with fields, since they eagerly create new
   values for _every_ instance of the component. This is generally not a
   problem, but is something to be aware of.

3. If you are mixing native and classic class definitions, then class fields
   from a parent class can override class properties:

   ```js
   import Controller from '@ember/controller';

   class BaseController extends Controller {
     title = 'default';
   }

   export default BaseController.extend({
     // this title property will be overridden by the
     // class field in the parent class
     title: 'My Title',
   });
   ```

Other than that, fields can generally safely replace properties.

#### Getters and Setters

Getters and setters can be defined directly on native classes:

```js
export default class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

It's important to note that these are _not_ the same as computed properties,
they don't have caching by default or have dependencies, and they rerun
every time they are used. In order to have getters and setters _rerender_ when
values have changed, you must either decorate them with the `@computed`
decorator, or use _tracked properties_.

Classic classes didn't have an equivalent for native getters and setters until
recently, but you can define them now with the standard JavaScript getter syntax:

```js
export default EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
});
```

#### Decorators

Decorators are a new concept in _JavaScript_, but if you've never seen them
before, don't worry, they've been used in Ember for _years_. `computed()` is in
fact a type of decorator:

```js
import EmberObject, { computed } from '@ember/object';

export default EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  fullName: computed('firstName', 'lastName', {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

The native decorator version functions the same, just with a slightly different
syntax:

```js
import { computed } from '@ember/object';

export default class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Notice that you don't need to pass in the `get` function to the decorator
itself. Instead, the decorator gets _applied_ to the getter function, modifying it
in place. Existing computed properties and computed property macros, including
custom ones you've defined, can be used with this new syntax:

```js
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

function join(...keys) {
  return computed(...keys, {
    get() {
      return keys.map(key => this[key]).join(' ');
    },
  });
}

// Before
const ClassicPerson = EmberObject.extend({
  firstName: 'Katie',
  lastName: 'Gengler',

  fullName: join('firstName', 'lastName'),
  name: alias('fullName'),
});

// After
class Person {
  firstName = 'Katie';
  lastName = 'Gengler';

  @join('firstName', 'lastName') fullName;
  @alias('fullName') name;
}
```

Other decorators exist, including `@tracked` which will be discussed later on,
and the `@action` decorator. The `@action` decorator replaces the `actions` hash
on routes, controllers, and components:

```js
// Before
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    helloWorld() {
      console.log('Hello, world!');
    },
  },
});
```

```js
// After
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @action
  helloWorld() {
    console.log('Hello, world!');
  }
}
```

The action decorator also _binds_ actions, so you can refer to them directly in
templates without the `{{action}}` helper:

```handlebars
{{!-- Before --}}
<OtherComponentHere @update={{action 'helloWorld'}} />
```

```handlebars
{{!-- After --}}
<OtherComponentHere @update={{this.helloWorld}} />
```

#### `super`

In native classes, there is a dedicated `super` keyword that replaces the
`_super()` method:

```js
// Before
const Person = EmberObject.extend();

const Firefighter = Person.extend({
  init() {
    this._super(...arguments);
    this.firstName = 'Rob';
    this.lastName = 'Jackson';
  },

  saveKitten() {
    this._super(...arguments);
    console.log('kitten saved!');
  }
});

// After
class Person {}

class Firefighter extends Person {
  constructor() {
    super();
    this.firstName = 'Rob';
    this.lastName = 'Jackson';
  }

  saveKitten() {
    if (super.saveKitten) {
      super.saveKitten(...arguments);
    }

    console.log('kitten saved!');
  }
}
```

As you can see, it functions a little bit differently that the `_super()`
method. When used in a constructor, you call it directly like a function. You
_must_ do this before using `this` in the constructor, otherwise it's a syntax
error. However, when used in any other method, you must _explicitly_ specify
the function you are calling on the parent class.

Another difference is that unlike `_super()`, if the method doesn't exist on the
parent class then an error will be thrown. In most cases, the method should
exist or not, and you shouldn't need to guard it one way or the other.

#### `static`

In classic classes, if you wanted to add values to the _class_ itself, you had
to use the `reopenClass` method:

```js
const Vehicle = EmberObject.extend({
  init() {
    this._super();
    this.id = Vehicle.count;
    Vehicle.incrementCount();
  },
});

Vehicle.reopenClass({
  count: 0,
  incrementCount() {
    this.count++;
  },
});
```

In native classes this can be done with the `static` keyword instead:

```js
class Vehicle {
  static count = 0;
  static incrementCount() {
    this.count++;
  }

  constructor() {
    this.id = Vehicle.count;
    Vehicle.incrementCount();
  }
}
```

The `static` keyword can be applied to all class elements.

### Tracked Properties

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

#### Backwards Compatibility

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

## Glimmer Componentts

There's a new component API in Octane! For this section, we'll be focusing on
the differences between the new style, known as Glimmer components, and classic
components, and how to upgrade. "Classic" components refer to older-style
components that do not use native classes.

These new types of Components _require_ native class syntax. You can define one
like this:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Todo extends Component {
  @tracked completed;
}
```

You might notice that the import comes from a package named `@glimmer`, not
`@ember`. Behind the scenes, Ember's rendering engine comes from Glimmer, and
now the components do too. However, Glimmer is a low-level integration with
Ember, and you don't need to worry about learning it separately.

### Benefits of Glimmer Components

Glimmer components have a some huge benefits

- These new components give you all the benefits described in Native Classes
  above
- They don't extend from `EmberObject` at all, which means that they don't need
  `EmberObject` APIs, such as `reopenClass`, `extend`. You can safely use
  `constructor` for all setup code.
- Lifecycle hooks are greatly simplified and easier to use
- They don't have that wrapping HTML element that got in the way of CSS styling
  and layout

Arguments are also namespaced on `this.args` within Glimmer components, which is
an immutable object. This means that:

- It's clear when you are accessing arguments passed to the component, and
  when you are accessing fields and properties of the component itself.
- Arguments always refer to the original value that was passed in, so you
  don't have to track down confusing code in hooks or computed property
  definitions that modifies the value of the argument.
- There is no confusing 2-way-databinding for arguments via the component
  class, data can only flow in one direction.

### Getting used to Glimmer Components

#### Lifecycle and Properties

These components have 2 lifecycle hooks:

- `constructor`
- `willDestroy`

These can be used to setup the class and tear it down, respectively. Other
lifecycle hooks, like `didInsertElement` and `didUpdate` don't have equivalents.
Instead, you should use _modifiers_ to fill their use cases. These are discussed
in more detail later on.

Components also have 3 properties:

- `args` - the arguments that the component receives when invoked. These are
  passed to and assigned in the constructor, so they're available then for any
  setup code that is needed.
- `isDestroying` - Set to true when the component has been marked for
  destruction.
- `isDestroyed` - Set to true when the component has been fully destroyed.

#### Outer HTML

These components don't have a wrapping element. This is referred to as _outer
HTML semantics_, and it means that whatever you see in the template is what you
get in the final rendered DOM:

```handlebars
{{!-- template.hbs --}}
<div>
  Hello, {{this.worldName}}!
</div>
```

```html
<!-- rendered -->
<div>
  Hello, Earth!
</div>
```

This means that you no longer have to customize your component using any of the
following APIs:

- `tagName`
- `classNames`
- `classNameBindings`
- `attributeBindings`

Instead, you can do these directly in your template. Here are some before and
after examples of each API, converted from classic components:

- `tagName`

  Before:

  ```js
  import Component from '@ember/component';

  export default Component.extend({
    tagName: 'button',
    text: 'Hello, world!',

    click() {
      console.log('Hello, world!');
    },
  });
  ```

  ```handlebars
  {{this.text}}
  ```

  After:

  ```js
  import Component from '@glimmer/component';
  import { action } from '@ember/object';

  export default class HelloButton extends Component {
    text = 'Hello, world!';

    @action
    sayHello() {
      console.log('Hello, world!');
    }
  }
  ```

  ```handlebars
    <button onclick={{this.sayHello}}>
      {{this.text}}
    </button>
  ```

- `classNames`

  Before:

  ```js
    import Component from '@ember/component';

    export default Component.extend({
      classNames: ['hello-world'],
      text: 'Hello, world!',
    });
  ```

  ```handlebars
  {{this.text}}
  ```

  After:

  ```js
    import Component from '@glimmer/component';

    export default class Hello extends Component {
      text = 'Hello, world!';
    }
  ```

  ```handlebars
    <div class="hello-world">
      {{this.text}}
    </div>
  ```

- `classNameBindings`

  Before:

  ```js
    import Component from '@ember/component';

    export default Component.extend({
      classNameBindings: ['darkMode:dark-mode'],
      darkMode: false,
      text: 'Hello, world!',
    });
  ```

  ```handlebars
    {{this.text}}
  ```

  After:

  ```js
    import Component from '@glimmer/component';

    export default class Hello extends Component {
      text = 'Hello, world!';
      darkMode = false;
    }
  ```

  ```handlebars
    <div class="{{if this.darkMode 'dark-mode'}}">
      {{this.text}}
    </div>
  ```

- `attributeBindings`

  Before:

  ```js
    import Component from '@ember/component';

    export default Component.extend({
      attributeBindings: ['role'],
      role: 'button',
      text: 'Hello, world!',
    });
  ```

  ```handlebars
    {{this.text}}
  ```

  After:

  ```js
    import Component from '@glimmer/component';

    export default class Hello extends Component {
      text = 'Hello, world!';
      role = 'button';
    }
  ```

  ```handlebars
    <div role={{this.role}}>
      {{this.text}}
    </div>
  ```

To sum it up, the new mental model is that the "wrapping" element is just like
any other element in your template, and you interact with it in exactly the same
way. This means that when converting a classic component, you will need to add
the wrapping element that was there previously to the template (unless it was a
tagless component, e.g. `tagName: ''`).

#### Mixins

These components do _not_ support Ember mixins. Before native classes were
available in JavaScript, mixins gave Ember developers some powers that are
similar to class inheritance. For apps that use mixins, the recommended path is
to refactor the mixins to be native classes instead, which the other parts of
your app can inherit from.

#### `...attributes`

When you pass standard HTML attributes to a component (like `class`, `alt`,
`role`, etc), you need to tell the template where to put them. Remember, there's
no wrapping element anymore! The way you show where to apply the attributes is
by using `...attributes` in the template.

For example, here we pass a `class` to a component:

```handlebars
<MyComponent class="my-class" />
```

And in that component, we can apply the class to the paragraph using
`...attributes`:

```handlebars
{{!--
  The paragraph gets the attributes, and not the h1
--}}
<h1>
  Hello, world!
</h1>
<p ...attributes>
  Lorem Ipsum...
</p>
```

Attributes can be applied to multiple elements as well:

```handlebars
{{!-- Both elements get the attributes --}}
<h1 ...attributes>
  Hello, world!
</h1>
<p ...attributes>
  Lorem Ipsum...
</p>
```

You can apply `...attributes` to elements that have explicit attributes as well.
If `...attributes` comes _after_ another attribute, then it'll be possible for
the user to override them:

```handlebars
<p
  data-overridable="you can override me"
  ...attributes
  data-non-overridable="but you can't override me!"
>
  ...
</p>
```

Finally, if you don't apply `...attributes` to _any_ elements, then Ember will
throw an error if someone tries to use attributes when invoking your component:

```handlebars
{{!-- components/uncustomizable-button.hbs --}}
<button class="btn">Do a thing!</button>
```

```handlebars
{{!-- This throws an error --}}
<UncustomizableButton class="customized-button-class"/>
```

Attributes are also available to classic components, and `...attributes` is
applied automatically to the wrapping element. If you're converting a component
from classic components, you should be sure to add `...attributes` to the
wrapper element.

Before:

```js
import Component from '@ember/component';

export default Component.extend({
  text: 'Hello, world!',
});
```

```handlebars
{{this.text}}
```

After:

```js
import Component from '@glimmer/component';

export default class Hello extends Component {
  text = 'Hello, world!';
}
```

```handlebars
<div ...attributes>
  {{this.text}}
</div>
```

#### Arguments

In class components, arguments are assigned _directly_ to the class instance.
This has caused a lot of issues over the years, from methods and actions being
overwritten, to unclear code where the difference between internal class values
and arguments is hard to reason about.

New components solve this by placing all arguments in an object available
as the `args` property.

Before:

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: '',
  lastName: '',

  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

```handlebars
{{!-- Usage --}}
<Person @firstName="Kenneth" @lastName="Larsen" />
```

After:

```js
import Component from '@glimmer/component';

export default class Person extends Component {
  get fullName() {
    return `${this.args.firstName} ${this.args.lastName}`;
  }
}
```

```handlebars
{{!-- Usage --}}
<Person @firstName="Kenneth" @lastName="Larsen" />
```

`args` and its values are automatically tracked, so there is no need to annotate
them, the `fullName` getter will invalidate properly when they change and the
component will rerender (if `fullName` is used in the template).

Additionally, `args` is _not_ mutable, and is frozen in development modes. This
is partially to prevent folks from trying to accomplish two-way bindings (which
doesn't work, this is discussed in more detail below) and partially to ensure
that `args` always stays in sync with the arguments passed to the component, so
it can be the canonical "single source of truth". If you want to provide
defaults to an argument, you should use a getter.

Before:

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  firstName: 'Kenneth',
  lastName: 'Larsen',

  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  }),
});
```

After:

```js
import Component from '@glimmer/component';

export default class Person extends Component {
  get firstName() {
    return this.args.firstName || 'Kenneth';
  }

  get lastName() {
    return this.args.lastName || 'Larsen';
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

#### One-way Data Flow

Classic component's arguments are _two-way bound_. This means that when you
_set_ a value in the component, it also changes the value in the _parent_
component:

```js
// components/parent.js
import Component from '@ember/component';

export default Component.extend({
  value: 'Hello, world!',
});
```

```handlebars
{{!-- templates/components/parent.hbs --}}
<Child @value={{this.value}} />
```

```js
// components/child.js
import Component from '@ember/component';

export default Component.extend({
  click() {
    this.set('value', 'Hello, moon!');
  },
});
```

```handlebars
{{!-- templates/components/child.hbs --}}
<button>
  Change value
</button>
```

In this setup, when we click the child component's button, it'll update the
value in both the child component _and_ the parent component. This feature led
to many problematic data patterns in classic components, where mutations would
occur seemingly randomly. It was hard to figure out what was causing changes,
and to debug them.

For Glimmer components, arguments are _one-way bound_. There is no way to
directly mutate a value on a parent component from the child component, even if
it is passed as an argument. Instead, you must send an _action_ upward to mutate
the value:

```js
// components/parent.js
import Component from '@glimmer/component';

export default class Parent extends Component {
  value = 'Hello, world!';

  @action
  updateValue(newValue) {
    this.value = newValue;
  }
}
```

```handlebars
{{!-- templates/components/parent.hbs --}}
<Child @value={{this.value}} @onClick={{this.updateValue}} />
```

```js
// components/child.js
import Component from '@ember/component';

export default class Child extends Component {}
```

```handlebars
{{!-- templates/components/child.hbs --}}
<button {{on "click" (fn @onClick 'Hello, moon!')}}>
  Change value
</button>
```

In our new setup, the parent component has an action which sets the new value.
We pass this action to the child component, and the child component directly
assigns it to the click of the button, using the `{{on}}` modifier. It also passes
the value we want to call the `@onClick` using the `fn` helper. We don't need any
additional logic in the child class itself - in fact, this could become a
template-only component at this point.

This pattern is known as _Data-Down, Actions Up_, or _unidirectional data flow_.
For these new components, this pattern is enforced - all mutations must occur
through actions. This clarifies the data flow, because it's immediately possible
to see where all of the mutations are occurring.

#### Lifecycle Hooks & Modifiers

As we mentioned above, components only have two lifecycle hooks,
`constructor` and `willDestroy`. There were a number of other lifecycle hooks
that existed on classic components which were generally related to updating
component state or DOM manipulation:

- `willInsertElement`
- `didInsertElement`
- `willDestroyElement`
- `didDestroyElement`
- `willRender`
- `didRender`
- `willUpdate`
- `didUpdate`
- `didReceiveAttrs`
- `didUpdateAttrs`

These can generally be replaced either by using getters, in cases where they are
related to updating component state, or by using _modifiers_.

##### Updating component state

If you previously did something like this in your `didReceiveAttrs` or
`didUpdateAttrs` hooks:

```js
import Component from '@ember/component';

export default Component.extend({
  didUpdateAttrs() {
    this._super(...arguments);

    if (this.disabled) {
      // clear input value
      this.set('value', '');
    }
  },

  @action
  updateValue(newValue) {
    this.set('value', newValue);

    if (this.onChange) {
      this.onChange(newValue);
    }
  },
});
```

You can instead model this through getters and setters, deriving the value from
the state of your component:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Text extends Component {
  @tracked _value;

  get value() {
    if (this.args.disabled) {
      return (this._value = '');
    }

    return this._value;
  }

  @action
  updateValue(newValue) {
    this._value = newValue;

    if (this.args.onChange) {
      this.args.onChange(newValue);
    }
  }
}
```

You'll notice that this getter is _mutating_ the value when the Text component
is disabled. If this feels like a code smell to you, it probably is, and is a
sign that we're managing state at the wrong level. In this case, for instance,
we should instead consider converting the text component to be a stateless
component, and mutate the value in the same place where the `disabled` is set:
The Parent component.

```js
// components/form.js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Form extends Component {
  @tracked text;
  @tracked disabled;

  @action
  updateText(text) {
    this.text = text;
  }

  @action
  updateDisabled(disabled) {
    this.disabled = disabled;

    if (disabled) {
      this.text = '';
    }
  }
}
```

```handlebars
{{!-- templates/components/form.hbs --}}
<Text
  @value={{this.text}}
  @disabled={{this.disabled}}
  @onchange={{this.updateText}}
/>
<button {{on "click" (fn this.updateDisabled (not this.disabled))}}>
  Toggle Disabled
</button>
```

```js
import Component from '@glimmer/component';

export default class Text extends Component {
  @action
  updateValue(newValue) {
    if (this.args.onChange) {
      this.args.onChange(newValue);
    }
  }
}
```

Now the Text component doesn't have any internal state, it defers to the parent
Form component, and when the Form component toggles its disabled state, it
clears the state of the text. The mutation of state is centralized in the action
where it occurs, making our program easier to reason about as a whole.

##### DOM Manipulation

In cases when you were using the hooks to manipulate the DOM, you can instead
update to use _modifiers_. For instance, let's say you were adding an event
listener to the `element` in your component's `didInsertElement` hook, and
removing it in `willDestroyElement`:

```js
import Component from '@ember/component';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);

    this.listener = e => {
      this.set('scrollOffset', e.clientY);
    };

    this.element.addEventListener(`scroll`, this.listener);
  },

  willDestroyElement() {
    this.element.removeEventListener(`scroll`, this.listener);

    this._super(...arguments);
  },
});
```

This could be rewritten using the `{{did-insert}}` and `{{will-destroy}}`
modifiers from [ember-render-modifiers][2]:

[2]: https://github.com/emberjs/ember-render-modifiers

```js {data-filename=app/components/scroll-component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScrollComponent extends Component {
  @tracked scrollOffset;

  @action
  listener(e) {
    this.scrollOffset = e.clientY;
  }

  @action
  registerListener(element) {
    element.addEventListener('scroll', this.listener);
  }

  @action
  unregisterListener(element) {
    element.removeEventListener('scroll', this.listener);
  }
}
```

```handlebars {data-filename=app/components/scroll-component.hbs}
<div
  {{did-insert this.registerListener}}
  {{will-destroy this.unregisterListener}}
>
  ...
</div>
```

These modifiers run the function passed to them when the _element_ they are
applied to is inserted into or removed from the DOM. This makes the hooks
explicit in the element they are acting on. There is also a `did-update`
modifier, which does not run on insertion, but runs whenever any of its passed
values _change_, allowing you to update the element:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScrollComponent extends Component {
  @action
  setColor(element, color) {
    element.style.color = color;
  }
}
```

```handlebars
<div
  {{did-insert this.setColor @color}}
  {{did-update this.setColor @color}}
>
  ...
</div>
```

These three modifiers are basic modifiers that allow you to cover most of the
functionality that lifecycle hooks contained.

##### Writing your own modifiers

There are also community APIs available for writing your own modifiers, such as
[ember-functional-modifiers](https://github.com/spencer516/ember-functional-modifiers).
Ember itself has low level APIs known as _modifier managers_ which can be used
to write these higher level APIs. In general, it's recommended to use a
community addon to write modifiers, and _not_ to write your own modifier
manager.

Let's see what our first example would look like if we were to write it as a
modifier using `ember-functional-modifiers`:

```js {data-filename=app/modifiers/add-event-listener.js}
import modifier from 'ember-functional-modifiers';

export default modifier((element, [listener]) => {
  element.addEventListener(event, listener);

  return () => element.removeEventListener(event, listener);
});
```

```js {data-filename=app/modifiers/scroll-component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ScrollComponent extends Component {
  @tracked scrollOffset;

  @action
  listener(e) {
    this.scrollOffset = e.clientY;
  }
}
```

```handlebars {data-filename=app/components/scroll-component.hbs}
<div {{add-event-listener "scroll" this.listener}}>
  ...
</div>
```

This modifier generalizes the functionality that the component implemented using
lifecycle hooks before, so we can use this modifier whenever we need to in _any_
component. This is a much better solution than manually managing event listeners
every time we need one! At this point, the modifier is effectively the same as
the `{{on}}` modifier as well, so we could get rid of it altogether and replace
it with `on`:

```handlebars {data-filename=app/components/scroll-component.hbs}
<div {{on "scroll" this.listener}}>
  ...
</div>
```

### Template-Only Components

In Octane, template-only components have only an `hbs` file and no `JavaScript` file.
Behind the scenes, template-only components inherit from `'@glimmer/component'`.

They can be thought of as _functional_ components, in the sense that their
output (the rendered template) is a pure function of their inputs (their
arguments). The fact that they can't have state makes them much easier to reason
about in general, and less prone to errors.

They are stateless, so attempting to change a component's state through
bindings will not work:

```handlebars
{{!--
  This does not work, since `this` does not exist
--}}
<label for="title">Title</label>
<Input @value={{this.value}} id="title" />
```

Additionally, the `mut` helper generally can't be used for the same reason:

```handlebars
{{!-- This does not work --}}
<input
  value={{this.value}}
  onkeyup={{action (mut this.value) target="value"}}
/>
```

## Conclusion

There's a lot to learn here, but remember, you can gradually adopt these features
in existing apps. Everything you used to do will work all the way through the rest of Ember 3, since Ember follows SemVer strictly.

If you need any help, check out the [chat and forums](https://emberjs.com/community/). If you spot something to improve in this guide, you can help out by [filing an issue or a PR](https://github.com/ember-learn/guides-source). Thank you!
