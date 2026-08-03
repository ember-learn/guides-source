Out of the box, Ember provides 2 components for building a form:

* [`<Input>`](https://api.emberjs.com/ember/6.8.0/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea>`](https://api.emberjs.com/ember/6.8.0/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

These components are similar in HTML markup to the native `<input>` or `<textarea>` elements. In contrast to the native elements, `<Input>` and `<Textarea>` automatically update the state of their bound values.


## `<Input>`

We mentioned that the built-in components are similar in HTML markup to their native counterparts. What does this mean?

Consider the following example in a component.

```gjs
import { Input } from '@ember/component';

<template>
  <label for="user-question">Ask a question about Ember:</label>
  <Input
    id="user-question"
    @type="text"
    @value="How do text fields work?"
  />
</template>
```

When Ember renders this component, you will see the following HTML code:

```html
<label for="user-question">Ask a question about Ember:</label>
<input id="user-question" type="text" value="How do text fields work?" />
```


### Ways to associate labels and inputs

Every input should be associated with a label. In HTML, there are a few ways to do this. With the built-in `<Input>` component,

1. You can nest the input inside the label.

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked userQuestion = '';

  <template>
    <label>
      Ask a question about Ember:

      <Input
        @type="text"
        @value={{this.userQuestion}}
      />
    </label>
  </template>
}
```

2. You can create an ID (globally unique within the webpage), then associate the label to the input with `for` attribute and `id` attribute.

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked userQuestion = '';
  myUniqueId = "this-is-a-unique-id";

  <template>
    <label for={{this.myUniqueId}}>
      Ask a question about Ember:
    </label>

    <Input
      id={{this.myUniqueId}}
      @type="text"
      @value={{this.userQuestion}}
    />
  </template>
}
```

3. You can use the `aria-label` attribute to label the input with a string that is visually hidden but still available to assistive technology. 

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked userQuestion = '';

  <template>
    <Input
      aria-label="Ask a question about Ember"
      @type="text"
      @value={{this.userQuestion}}
    />
  </template>
}
```

While it is more appropriate to use the `<label>` element, the `aria-label` attribute can be used in instances where visible text content is not possible.


### Setting attributes on `<Input>`

With a few exceptions, you can pass [input attributes](https://developer.mozilla.org/docs/Web/HTML/Element/input#Attributes) as attributes (i.e. do not prepend `@`) to the `<Input>` component.

For example, the `aria-labelledby` attribute may be useful if you have a search input. The search button can serve as the label for the input element:

```gjs
import { Input } from '@ember/component';

<template>
  <Input aria-labelledby="button-search" />
  <button id="button-search" type="button">Search</button>
</template>
```

If an attribute is set to a quoted string (`"button-search"` in the prior example), its value will be set directly on the element.

You can also bind the attribute value to a property that you own.
In the next example, the `disabled` attribute is bound to the value of `isReadOnly` in the current context.

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked isReadOnly = true;
  @tracked name = 'Tomster';

  <template>
    <label for="input-name">Name:</label>
    <Input
      id="input-name"
      @value={{this.name}}
      disabled={{this.isReadOnly}}
      maxlength="50"
    />
  </template>
}
```

Recall that there were a few exceptions. The following input attributes must be passed as arguments (i.e. do prepend `@`) to the `<Input>` component:

- `@checked`
- `@type`
- `@value`


### Actions

We recommend using the `{{on}}` modifier to call an action on specific events such as the [input event](https://developer.mozilla.org/docs/Web/API/HTMLElement/input_event).

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class Example extends Component {
  @tracked name = '';

  validateName = (inputValue) => {
    // Name validation here
  };

  <template>
    <label for="input-name">Name:</label>
    <Input
      id="input-name"
      @value={{this.name}}
      {{on "input" this.validateName}}
    />
  </template>
}
```

[Learn more about the `{{on}}` modifier.](../../upgrading/current-edition/action-on-and-fn/#toc_the-on-modifier)

Lastly, Ember also provides custom input events `@enter`, `@insert-newline` and `@escape-press`. These events do not exist on native input elements, but you may find them to be useful for handling keyboard interactions.

The modern, Octane-style way to handle keyboard events is to [write a modifier](../../upgrading/current-edition/glimmer-components/#toc_writing-your-own-modifiers) to separate concerns: The component manages the state, while the modifier manages interactions with the DOM. Your action will receive an actual `event` object.

There are [community-made addons](https://emberobserver.com/?query=keyboard) to help manage keyboard events. For example, with [ember-keyboard](https://github.com/adopted-ember-addons/ember-keyboard), you can write,

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import onKey from 'ember-keyboard/modifiers/on-key';

export default class Example extends Component {
  doSomething = () => {
    alert('something');
  };

  doSomethingElse = () => {
    alert('something else');
  };

  <template>
    {{!-- Before --}}
    <Input
      @enter={{this.doSomething}}
      @escape-press={{this.doSomethingElse}}
    />

    {{!-- After --}}
    <Input
      {{onKey "Enter" this.doSomething}}
      {{onKey "Escape" this.doSomethingElse event="keydown"}}
    />
  </template>
}
```

Note, the `keydown` event was used for `Escape` because `keypress` is deprecated.


### Checkboxes

You can use the
[`<Input>`](https://api.emberjs.com/ember/6.8.0/classes/Ember.Templates.components/methods/Input?anchor=Input)
component to create a checkbox. Set `@type` to the string `"checkbox"`, and use `@checked` instead of `@value`.

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked isAdmin = false;

  <template>
    <label for="admin-checkbox">Is Admin?</label>
    <Input
      id="admin-checkbox"
      @type="checkbox"
      @checked={{this.isAdmin}}
    />
  </template>
}
```

To call an action on specific events, use the `{{on}}` modifier:

```gjs
import Component from "@glimmer/component";
import { Input } from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class Example extends Component {
  @tracked isAdmin = false;

  validateRole = () => {
    // validate logic
  };

  <template>
    <label for="admin-checkbox">Is Admin?</label>
    <Input
      id="admin-checkbox"
      @type="checkbox"
      @checked={{this.isAdmin}}
      {{on "input" this.validateRole}}
    />
  </template>
  }
```


## `<Textarea>`

The following example shows how to bind `this.userComment` to a text area's value.

```gjs
import Component from "@glimmer/component";
import { Textarea } from '@ember/component';
import { tracked } from '@glimmer/tracking';

export default class Example extends Component {
  @tracked userComment = '';

  <template>
    <label for="user-comment">Comment:</label>
    <Textarea
      id="user-comment"
      @value={{this.userComment}}
      rows="6"
      cols="80"
    />
  </template>
}
```

### Setting attributes on `<Textarea>`

With the exception of `@value` argument, you can use any [attribute](https://developer.mozilla.org/docs/Web/HTML/Element/textarea#Attributes) that `<textarea>` natively supports.
