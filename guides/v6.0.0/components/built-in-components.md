Out of the box, Ember provides 2 components for building a form:

* [`<Input>`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea>`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

These components are similar in HTML markup to the native `<input>` or `<textarea>` elements. In contrast to the native elements, `<Input>` and `<Textarea>` automatically update the state of their bound values.


## `<Input>`

We mentioned that the built-in components are similar in HTML markup to their native counterparts. What does this mean?

Consider the following example in a template file.

```handlebars
<label for="user-question">Ask a question about Ember:</label>
<Input
  id="user-question"
  @type="text"
  @value="How do text fields work?"
/>
```

When Ember renders this template, you will see the following HTML code:

```html
<label for="user-question">Ask a question about Ember:</label>
<input id="user-question" type="text" value="How do text fields work?" />
```


### Ways to associate labels and inputs

Every input should be associated with a label. In HTML, there are a few ways to do this. With the built-in `<Input>` component,

1. You can nest the input inside the label.

   ```handlebars
   <label>
     Ask a question about Ember:

     <Input
       @type="text"
       @value={{this.userQuestion}}
     />
   </label>
   ```

2. You can create an ID (globally unique within the webpage), then associate the label to the input with `for` attribute and `id` attribute.

   ```handlebars
   <label for={{this.myUniqueId}}>
     Ask a question about Ember:
   </label>

   <Input
     id={{this.myUniqueId}}
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

3. You can use the `aria-label` attribute to label the input with a string that is visually hidden but still available to assistive technology. 

   ```handlebars
   <Input
     aria-label="Ask a question about Ember"
     @type="text"
     @value={{this.userQuestion}}
   />
   ```

While it is more appropriate to use the `<label>` element, the `aria-label` attribute can be used in instances where visible text content is not possible.


### Setting attributes on `<Input>`

With a few exceptions, you can pass [input attributes](https://developer.mozilla.org/docs/Web/HTML/Element/input#Attributes) as attributes (i.e. do not prepend `@`) to the `<Input>` component.

For example, the `aria-labelledby` attribute may be useful if you have a search input. The search button can serve as the label for the input element:

```handlebars
<Input aria-labelledby="button-search" />
<button id="button-search" type="button">Search</button>
```

If an attribute is set to a quoted string (`"button-search"` in the prior example), its value will be set directly on the element.

You can also bind the attribute value to a property that you own.
In the next example, the `disabled` attribute is bound to the value of `isReadOnly` in the current context.

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{this.name}}
  disabled={{this.isReadOnly}}
  maxlength="50"
/>
```

Recall that there were a few exceptions. The following input attributes must be passed as arguments (i.e. do prepend `@`) to the `<Input>` component:

- `@checked`
- `@type`
- `@value`


### Actions

Starting with Ember Octane, we recommend using the `{{on}}` modifier to call an action on specific events such as the [input event](https://developer.mozilla.org/docs/Web/API/HTMLElement/input_event).

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{this.name}}
  {{on "input" this.validateName}}
/>
```

[Learn more about the `{{on}}` modifier.](../../upgrading/current-edition/action-on-and-fn/#toc_the-on-modifier)

Lastly, Ember also provides custom input events `@enter`, `@insert-newline` and `@escape-press`. These events do not exist on native input elements, but you may find them to be useful for handling keyboard interactions.

The modern, Octane-style way to handle keyboard events is to [write a modifier](../../upgrading/current-edition/glimmer-components/#toc_writing-your-own-modifiers) to separate concerns: The component manages the state, while the modifier manages interactions with the DOM. Your action will receive an actual `event` object.

There are [community-made addons](https://emberobserver.com/?query=keyboard) to help manage keyboard events. For example, with [ember-keyboard](https://github.com/adopted-ember-addons/ember-keyboard), you can write,

```handlebars
{{!-- Before --}}
<Input
  @enter={{this.doSomething}}
  @escape-press={{this.doSomethingElse}}
/>

{{!-- After --}}
<Input
  {{on-key "Enter" this.doSomething}}
  {{on-key "Escape" this.doSomethingElse event="keydown"}}
/>
```

Note, the `keydown` event was used for `Escape` because `keypress` is deprecated.


### Checkboxes

You can use the
[`<Input>`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.components/methods/Input?anchor=Input)
component to create a checkbox. Set `@type` to the string `"checkbox"`, and use `@checked` instead of `@value`.

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
/>
```

To call an action on specific events, use the `{{on}}` modifier:

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input
  id="admin-checkbox"
  @type="checkbox"
  @checked={{this.isAdmin}}
  {{on "input" this.validateRole}}
/>
```


## `<Textarea>`

The following example shows how to bind `this.userComment` to a text area's value.

```handlebars
<label for="user-comment">Comment:</label>
<Textarea
  id="user-comment"
  @value={{this.userComment}}
  rows="6"
  cols="80"
/>
```


### Setting attributes on `<Textarea>`

With the exception of `@value` argument, you can use any [attribute](https://developer.mozilla.org/docs/Web/HTML/Element/textarea#Attributes) that `<textarea>` natively supports.


<!--
  TODO:
  Move this section to a dedicated page for how to build forms.
  Please present a solution that does not use `{{mut}}`.
-->
## Binding dynamic attribute

You might need to bind a property dynamically to an input if you're building a
flexible form, for example. To achieve this you need to use the
[`{{get}}`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.helpers/methods/mut?anchor=mut)
in conjunction like shown in the following example:

```handlebars
<label for="input-name">Name:</label>
<Input
  id="input-name"
  @value={{mut (get this.person this.field)}}
/>
```

The `{{get}}` helper allows you to dynamically specify which property to bind,
while the `{{mut}}` helper allows the binding to be updated from the input. See
the respective helper documentation for more detail:
[`{{get}}`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.helpers/methods/mut?anchor=mut).
