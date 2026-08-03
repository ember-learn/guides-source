There's a new component API in Octane! For this section, we'll be focusing on
the differences between the new style, known as Glimmer components, and classic
components, and how to upgrade. "Classic" components refer to older-style
components that do not use native classes.

These new types of Components _require_ native class syntax. You can define one
like this:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TodoComponent extends Component {
  @tracked completed;
}
```

You might notice that the import comes from a package named `@glimmer`, not
`@ember`. Behind the scenes, Ember's rendering engine comes from Glimmer, and
now the components do too. However, Glimmer is a low-level integration with
Ember, and you don't need to worry about learning it separately.

## Benefits of Glimmer Components

Glimmer components have some huge benefits:

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
- There is no confusing two-way data binding for arguments via the component
  class, data can only flow in one direction.

## Getting used to Glimmer Components

### Lifecycle and Properties

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

### Outer HTML

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
    }
  });
  ```

  ```handlebars
  {{this.text}}
  ```

  After:

  ```js
  import Component from '@glimmer/component';
  import { action } from '@ember/object';

  export default class HelloButtonComponent extends Component {
    text = 'Hello, world!';

    @action
    sayHello() {
      console.log('Hello, world!');
    }
  }
  ```

  ```handlebars
    <button type="button" {{on "click" this.sayHello}}>
      {{this.text}}
    </button>
  ```

- `classNames`

  Before:

  ```js
  import Component from '@ember/component';

  export default Component.extend({
    classNames: ['hello-world'],
    text: 'Hello, world!'
  });
  ```

  ```handlebars
  {{this.text}}
  ```

  After:

  ```js
  import Component from '@glimmer/component';

  export default class HelloComponent extends Component {
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
    text: 'Hello, world!'
  });
  ```

  ```handlebars
    {{this.text}}
  ```

  After:

  ```js
  import Component from '@glimmer/component';
  import { tracked } from '@glimmer/tracking';

  export default class HelloComponent extends Component {
    text = 'Hello, world!';
    @tracked darkMode = false;
  }
  ```

  ```handlebars
    <div class={{if this.darkMode "dark-mode"}}>
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
    text: 'Hello, world!'
  });
  ```

  ```handlebars
    {{this.text}}
  ```

  After:

  ```js
  import Component from '@glimmer/component';

  export default class HelloComponent extends Component {
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

### `...attributes`

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
<button type="button" class="btn">Do a thing!</button>
```

```handlebars
{{!-- This throws an error --}}
<UncustomizableButton class="customized-button-class" />
```

Attributes are also available to classic components, and `...attributes` is
applied automatically to the wrapping element. If you're converting a component
from classic components, you should be sure to add `...attributes` to the
wrapper element.

Before:

```js
import Component from '@ember/component';

export default Component.extend({
  text: 'Hello, world!'
});
```

```handlebars
{{this.text}}
```

After:

```js
import Component from '@glimmer/component';

export default class HelloComponent extends Component {
  text = 'Hello, world!';
}
```

```handlebars
<div ...attributes>
  {{this.text}}
</div>
```

### Arguments

In classic components, arguments are assigned _directly_ to the class instance.
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
  width: 0,
  height: 0,

  aspectRatio: computed('width', 'height', function() {
    return this.width / this.height;
  })
});
```

```handlebars
{{!-- Usage --}}
<Image @width="1920" @height="1080" />
```

After:

```js
import Component from '@glimmer/component';

export default class ImageComponent extends Component {
  get aspectRatio() {
    return this.args.width / this.args.height;
  }
}
```

```handlebars
{{!-- Usage --}}
<Image @width="1920" @height="1080" />
```

`args` and its values are automatically tracked, so there is no need to annotate
them, the `aspectRatio` getter will invalidate properly when they change and the
component will rerender (if `aspectRatio` is used in the template).

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
  width: 0,
  height: 0,

  aspectRatio: computed('width', 'height', function() {
    return this.width / this.height;
  })
});
```

After:

```js
import Component from '@glimmer/component';

export default class ImageComponent extends Component {
  get width() {
    return this.args.width ?? 0;
  }

  get height() {
    return this.args.height ?? 0;
  }

  get aspectRatio() {
    return this.width / this.height;
  }
}
```

### One-way Data Flow

Classic component's arguments are _two-way bound_. This means that when you
_set_ a value in the component, it also changes the value in the _parent_
component:

```js
// components/parent.js
import Component from '@ember/component';

export default Component.extend({
  value: 'Hello, world!'
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
  }
});
```

```handlebars
{{!-- templates/components/child.hbs --}}
<button type="button">
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

export default class ParentComponent extends Component {
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

export default class ChildComponent extends Component {}
```

```handlebars
{{!-- templates/components/child.hbs --}}
<button type="button" {{on "click" (fn @onClick 'Hello, moon!')}}>
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

### Lifecycle Hooks & Modifiers

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
related to updating component state, or by using _modifiers_. For example, installing the [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers) addon will give you the ability to use `{{did-insert}}` and `{{did-update}}`. You can also write your own modifiers! Keep reading below to learn more.

#### Updating component state

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
  }
});
```

You can instead model this through getters and setters, deriving the value from
the state of your component:

```js
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class TextComponent extends Component {
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

export default class FormComponent extends Component {
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
  @onChange={{this.updateText}}
/>
<button type="button" {{on "click" (fn this.updateDisabled (not this.disabled))}}>
  Toggle Disabled
</button>
```

```js
import Component from '@glimmer/component';

export default class TextComponent extends Component {
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

#### DOM Manipulation

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
  }
});
```

This could be rewritten using the `{{did-insert}}` and `{{will-destroy}}`
modifiers, if you install [@ember/render-modifiers][2] in your app:

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

#### Writing your own modifiers

New Ember apps ship with a dependency on
[ember-modifier](https://github.com/ember-modifier/ember-modifier), which
provides a friendly API for writing your own element modifiers. This library is
in turn based on a low level API named _modifier managers_. Managers are a
framework-development level feature, and not something most developers need to
interact with.

Custom modifiers based on the `ember-modifier` API can be a more expressive
interface for your logic, and can better encapsulate an implementation.

Let's write a modifier that implements adding an event listener.

```js {data-filename=app/modifiers/add-event-listener.js}
import { modifier } from 'ember-modifier';

export default modifier((element, [eventName, listener]) => {
  element.addEventListener(eventName, listener);

  return () => element.removeEventListener(eventName, listener);
});
```

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
}
```

```handlebars {data-filename=app/components/scroll-component.hbs}
<div {{add-event-listener "scroll" this.listener}}>
  ...
</div>
```

The new `add-event-listener` modifier presents a more expressive interface to
the `hbs` template: There is only a single modifier to apply instead of two, the
implementation always tears down after itself upon teardown of the target element,
and the only JavaScript you have to write during re-user is the implementation
of the business logic.

At this point, it is worth noting that the custom `{{add-event-listener}}`
modifier is effectively a re-implementation of the Ember built-in `{{on}}`
modifier (See the
[documentation](https://api.emberjs.com/ember/5.1/classes/Ember.Templates.helpers/methods/on?anchor=on)). Using that built-in looks like:

```handlebars {data-filename=app/components/scroll-component.hbs}
<div {{on "scroll" this.listener}}>
  ...
</div>
```

## Template-Only Components

In Octane, template-only components have only an `hbs` file and no `JavaScript` file.

Template-only components have no backing class instance, so `this` in their
templates is `null`. This means that you can only reference passed in arguments
via named argument syntax (e.g. `{{@arg}}`):

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

Since Octane, a template-only component shares a subset of features that are available
in `@glimmer/component`. Such component can be seamlessly "upgraded" to a Glimmer component,
when you add a JavaScript file alongside the template.
