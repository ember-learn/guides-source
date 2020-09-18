Ember provides a few helpful components out-of-the-box for common tasks,
including:

* [`<Input />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Input?anchor=Input)
* [`<Textarea />`](https://api.emberjs.com/ember/release/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)

Using these components, you can create form controls that are almost identical to
the native HTML `<input>` or `<textarea>` elements, and which automatically
update the state of their values.

## `<Input/>`

```handlebars
<label for="site">Ember Question</label>
<Input id="site" @value="How do text fields work?" />
```

Will become:

```html
<label for="site">Ember Question</label>
<input id="site" type="text" value="How do text fields work?"/>
```
### Ways to associate labels and inputs

Every input should be associated with a label. Within HTML, there are several different ways to do this.  In this section, we will show how to apply those strategies for Ember inputs.

You can nest the input inside the label:

```handlebars
<label>
    Ask a question about Ember:
    <Input type="text" @value={{this.val}} />
</label>
```

You can associate the label using `for` and `id`:

```handlebars
<label for={{this.myUniqueId}}>
    Ask a question about Ember:
</label>
<Input id={{this.myUniqueId}} type="text" @value={{this.val}} />
```

The `aria-label` attribute enables developers to label an input element with a string that is not visually rendered, but still available to assistive technology. 

```handlebars
<Input id="site" @value="How do text fields work?" aria-label="Ember Question"/>
```

While it is more appropriate to use a `<label>` element, the `aria-label` attribute can be used in instances where visible text content is not possible.

### Setting attributes on Input

Just like a native `<input>` element, there are many different types of attributes that you can apply to Ember's `<Input />` component, such as the `aria-*` attributes or `required`. 
For example, the `aria-labelledby` property is useful for situations like a search input, where the search button can serve as the label for the input element:

```handlebars
<Input aria-labelledby="button-search" />
<button id="button-search" type="button">Search</button>
```

Here are some other standard `<input>` attributes and arguments that are supported:

<table>
  <tr><td><code>readonly</code></td><td><code>required</code></td><td><code>autofocus</code></td></tr>
  <tr><td><code>@value</code></td><td><code>placeholder</code></td><td><code>disabled</code></td></tr>
  <tr><td><code>size</code></td><td><code>tabindex</code></td><td><code>maxlength</code></td></tr>
  <tr><td><code>name</code></td><td><code>min</code></td><td><code>max</code></td></tr>
  <tr><td><code>pattern</code></td><td><code>accept</code></td><td><code>autocomplete</code></td></tr>
  <tr><td><code>autosave</code></td><td><code>formaction</code></td><td><code>formenctype</code></td></tr>
  <tr><td><code>formmethod</code></td><td><code>formnovalidate</code></td><td><code>formtarget</code></td></tr>
  <tr><td><code>height</code></td><td><code>inputmode</code></td><td><code>multiple</code></td></tr>
  <tr><td><code>step</code></td><td><code>width</code></td><td><code>form</code></td></tr>
  <tr><td><code>selectionDirection</code></td><td><code>spellcheck</code></td><td><code>@type</code></td></tr>
</table>

If these attributes are set to a quoted string, their values will be set
directly on the element, as in the previous example. However, when left
unquoted, these values will be bound to a property on the template's current
rendering context. For example:

```handlebars
<label for="input-name">Name:</label>
<Input id="input-name" name="name" @value={{this.name}} size="50" disabled={{this.entryNotAllowed}} />
```

Will bind the `disabled` attribute to the value of `entryNotAllowed` in the
current context.

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
