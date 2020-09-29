Out of the box, Ember provides 2 components for building a form:

* [`<Input>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

These components are similar in HTML markup to the native `<input>` or `<textarea>` elements. In contrast to the native elements, `<Input>` and `<Textarea>` automatically update the state of their bound values.


## `<Input>`

We mentioned that the built-in components are similar in HTML markup to their native counterparts. What does this mean?

Consider the following example in a template file.

```handlebars
<label for="user-question">Ask a question about Ember:</label>
<Input id="user-question" @type="text" @value="How do text fields work?" />
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

2. You can create an ID (globally unique within the webpage), then associate the label to the input with `for` and `id` attributes.

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

To dispatch an action on specific events such as `key-down`, use the following

```handlebars
<label for="input-name">Name:</label>
<Input id="input-name" name="name" @type="text" @value={{this.name}} @key-down={{this.updateName}} />
```

The following event types are supported (dasherized format):

* `@enter`
* `@insert-newline`
* `@escape-press`
* `@focus-in`
* `@focus-out`
* `@key-down`
* `@key-press` ([Deprecated Web API](https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event))
* `@key-up`


More [event types](https://api.emberjs.com/ember/release/classes/Component#event-handler-methods) are also supported but these events need to be written in camelCase format, such `mouseEnter`. Note, there are events of the same type in both the list above and linked. Event names listed above must be dasherized. Additional work is performed on these events.

### Checkboxes

You can also use the
[`<Input />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
component to create a checkbox by setting its `@type`:

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input id="admin-checkbox" @type="checkbox" name="isAdmin" @checked={{this.isAdmin}} />
```

Checkboxes support the following properties:

* `@checked`
* `disabled`
* `tabindex`
* `indeterminate`
* `name`
* `autofocus`
* `form`


Which can be bound or set as described in the previous section.


Checkboxes are a special input type.  If you want to dispatch an action on a certain [event](https://api.emberjs.com/ember/release/classes/Component#event-handler-methods),
you will always need to either define the event name in camelCase format (e.g. `@keyDown`), or
use an `on` helper with the [Web-API event name](https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event) (e.g. `on 'keydown'`):

```handlebars
<label for="input-name">Name:</label>
{{!-- This works: uses camelCase event name --}}
<Input @type="checkbox" @keyDown={{this.updateName}} id="input-name" />
{{!-- This works: uses 'on' with actual event name --}}
<Input @type="checkbox" {{on "keydown" this.updateName}} id="input-name" />
{{!-- This does not work: uses dasherized event name --}}
<Input @type="checkbox" @key-down={{this.updateName}} id="input-name" />
{{!-- This does not work: uses actual event name --}}
<Input @type="checkbox" @keydown={{this.updateName}} id="input-name" />
```

Internally, `<Input @type="checkbox" />` creates an instance of Checkbox. Do *not* use `Checkbox` directly.

## `<Textarea />`

```handlebars
<label for="textarea-post">Post:</label>
<Textarea @value={{this.post}} name="post" cols="80" rows="6" id="textarea-post" />
```

Will bind the value of the text area to `post` on the current context.

[`<Textarea>`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea) supports binding and/or setting the following properties:

* `@value`
* `name`
* `rows`
* `cols`
* `placeholder`
* `disabled`
* `maxlength`
* `tabindex`
* `selectionEnd`
* `selectionStart`
* `selectionDirection`
* `wrap`
* `readonly`
* `autofocus`
* `form`
* `spellcheck`
* `required`

### Binding dynamic attribute

You might need to bind a property dynamically to an input if you're building a
flexible form, for example. To achieve this you need to use the
[`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut)
in conjunction like shown in the following example:

```handlebars
<label for="input-name">Name:</label>
<Input @value={{mut (get this.person this.field)}} id="name" name="input-name" />
```

The `{{get}}` helper allows you to dynamically specify which property to bind,
while the `{{mut}}` helper allows the binding to be updated from the input. See
the respective helper documentation for more detail:
[`{{get}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
and [`{{mut}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/mut?anchor=mut).
