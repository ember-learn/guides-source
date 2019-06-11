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
- [Octane-style components](../../components/component-basics/), including
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

## Prerequisites

Before using any of the new Octane features make sure that your application is using the latest version of Ember.

We recommend that you use [ember-cli-update](https://github.com/ember-cli/ember-cli-update) for updating your application.

<!--TODO: On release specify the specific version needed above -->


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

Tracked properties are fully backwards compatible with computed properties and `get`/`set`. computed properties
that use tracked properties will automatically update without any need to add
them to the dependencies:

```js
import { tracked } from '@glimmer/tracking';
import { computed } from '@ember/object';

class Person {
  @tracked firstName;

  @computed('lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

And vice-versa, computed properties used in native getters will update
correctly:

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

Likewise, properties that you get using `get` will update later on when you use
`set` to update them:

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

Additionally, certain Ember objects still require the use of `get` and `set`,
such as `ObjectProxy` and `ArrayProxy`. These will continue to function with
tracked, but you _must_ use `get` and `set`. Likewise, KVO functions on Ember's
`Enumerable` class and the various implementations of it will _generally_
continue to be tracked.

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

## Components in Octane

There's a new component API in Octane! 
For this section, we'll
be focusing on the differences between the new style and classic components, and how to upgrade.
"Classic" components refer to older-style components that do not use native classes.

These new types of Components _require_ native class syntax. You can define one like this:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Todo extends Component {
  @tracked completed;
}
```

You might notice that the import comes from a package named `@glimmer`, not `@ember`.
Behind the scenes, Ember's rendering engine comes from Glimmer, and now the Components do too, however, you don't need to worry about learning Glimmer separately.

### Benefits of Components in Octane

Components imported from `'@glimmer/component'` have a some huge benefits

- These new components give you all the benefits described in Native Classes above
- They don't extend from `EmberObject` at all, which means that they
don't need `EmberObject` APIs, such as `reopenClass`,
`extend`. You can safely use `constructor` for all setup code.
- Lifecycle hooks are greatly simplified and easier to use
- They don't have that wrapping HTML element that got in the way of CSS styling and layout
- Bindings are one-way, so there can be no unintended side effects of changing an argument's value

### Getting used to Components in Octane

#### Lifecycle and Properties

These components have exactly 2 lifecycle hooks:

- `constructor`
- `willDestroy`

These can be used to setup the class and tear it down, respectively. Other
lifecycle hooks, like `didInsertElement` and `didUpdate` don't have equivalents. Instead, you should use _modifiers_ to fill their use
cases. These are discussed in more detail later on.

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
<!-- template.hbs -->
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
way. This means that when converting a classic component,
you will need to add the wrapping element that was there previously to the
template (unless it was a tagless component, e.g. `tagName: ''`).

#### Mixins

These components do _not_ support Ember mixins.
Before Native Classes were available in JavaScript, Mixins gave Ember developers some powers that are similar to class inheritance.
For apps that use Mixins, the recommended path is to refactor the Mixins to be native classes instead, which the other parts of your app can inherit from.

#### `...attributes`

When you pass standard HTML attributes to a component (like `class`, `alt`, `role`, etc), you need to tell the template where to put them.
Remember, there's no wrapping element anymore!
The way you show where to apply the attributes is by using `...attributes` in the template.

For example, here we pass a `class` to a component:

```handlebars
<MyComponent class="my-class" />
```

And in that component, we can apply the class to the paragraph using `...attributes`:

```handlebars
<!--
  The paragraph gets the attributes, and not the h1
-->
<h1>
  Hello, world!
</h1>
<p ...attributes>
  Lorem Ipsum...
</p>
```

Attributes can be applied to multiple elements as well:

```handlebars
<!-- Both elements get the attributes -->
<h1 ...attributes>
  Hello, world!
</h1>
<p ...attributes>
  Lorem Ipsum...
</p>
```

Finally, if you don't apply `...attributes` to _any_ elements, then Ember will
throw an error if someone tries to use attributes when invoking your component.
This allows you to maintain control over the component if you want:

```handlebars
<!-- components/uncustomizable-button.hbs -->
<button class="btn">Do a thing!</button>
```

```handlebars
<!-- This throws an error -->
<UncustomizableButton class="customized-button-class"/>
```

Attributes are also available to classic components, but they apply it to
the wrapper element. If you're converting a component from classic components, you should be sure to add `...attributes` to the wrapper
element.

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
<!-- Usage -->
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
<!-- Usage -->
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
<!-- templates/components/parent.hbs -->
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
<!-- templates/components/child.hbs -->
<button>
  Change value
</button>
```

In this setup, when we click the child component's button, it'll update the
value in both the child component _and_ the parent component. This feature led
to many problematic data patterns in classic components, where mutations would
occur seemingly randomly. It was hard to figure out what was causing changes,
and to debug them.

For components imported from `'@glimmer/component'`, arguments are _one-way bound_. There is no way to
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
<!-- templates/components/parent.hbs -->
<Child @value={{this.value}} @onClick={{this.updateValue}} />
```

```js
// components/child.js
import Component from '@ember/component';

export default class Child extends Component {}
```

```handlebars
<!-- templates/components/child.hbs -->
<button onclick={{action @onClick 'Hello, moon!'}}>
  Change value
</button>
```

In our new setup, the parent component has an action which sets the new value.
We pass this action to the child component, and the child component directly
assigns it to the `onclick` of the button, using the `{{action}}` helper to pass
the value we want to call the `@onClick` action with. We don't need any
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
<!-- templates/components/form.hbs -->
<Text
  @value={{this.text}}
  @disabled={{this.disabled}}
  @onchange={{this.updateText}}
/>
<button onclick={{action this.updateDisabled (not this.disabled)}}>
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

```js
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

```handlebars
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
functionality that lifecycle hooks contained. APIs for writing your _own_
modifiers are currently being stabilized, and these will allow you to make
specific modifiers that target your use cases.

### Template-Only Components

In Octane, template-only components have only an `hbs` file and no `JavaScript` file.
Behind the scenes, template-only components inherit from `'@glimmer/component'`.

They can be thought of as _functional_ components,
in the sense that their output (the rendered template) is a pure function of
their inputs (their arguments). The fact that they can't have state makes them
much easier to reason about in general, and less prone to errors.

They are stateless, so attempting to change a component's state through
bindings will not work:

```handlebars
<!--
  This does not work, since @value is
  an argument and is immutable
-->
<label for="title">Title</label>
<Input @value={{@value}} id="title" />

<!--
  Instead, we should update the value
  by passing an _action_ to the component
-->
<label for="title">Title</label>
<Input @value={{@value}} @key-up={{@updateValue}} id="title" />
```

Additionally, the `mut` helper generally can't be used for the same reason:

```handlebars
<!-- This does not work -->
<input
  value={{@value}}
  onkeyup={{action (mut @value) target="value"}}
/>

<!-- Do this instead -->
<input value={{@value}} onkeyup={{@updateValue}}/>
```

## Conclusion

There's a lot to learn here, but remember, you can gradually adopt these features
in existing apps. Everything you used to do will work all the way through the rest of Ember 3, since Ember follows SemVer strictly.

If you need any help, check out the [chat and forums](https://emberjs.com/community/). If you spot something to improve in this guide, you can help out by [filing an issue or a PR](https://github.com/ember-learn/guides-source). Thank you!
