The [`<Input>`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.components/methods/Input?anchor=Input)
and [`<Textarea>`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea)
components are the easiest way to create common form controls.
Using these helpers, you can create form controls that are almost identical to the native HTML `<input>` or `<textarea>` elements, but are aware of Ember's two-way bindings and can automatically update.

## Text fields

```handlebars
<label for="facebook">Facebook</label>
<Input @id="facebook" @value="http://www.facebook.com" />
```

Will become:

```html
<label for="facebook">Facebook</label>
<input id="facebook" type="text" value="http://www.facebook.com"/>
```

You can pass the following standard `<input>` attributes within the input
helper:

<table>
  <tr><td>`readonly`</td><td>`required`</td><td>`autofocus`</td></tr>
  <tr><td>`value`</td><td>`placeholder`</td><td>`disabled`</td></tr>
  <tr><td>`size`</td><td>`tabindex`</td><td>`maxlength`</td></tr>
  <tr><td>`name`</td><td>`min`</td><td>`max`</td></tr>
  <tr><td>`pattern`</td><td>`accept`</td><td>`autocomplete`</td></tr>
  <tr><td>`autosave`</td><td>`formaction`</td><td>`formenctype`</td></tr>
  <tr><td>`formmethod`</td><td>`formnovalidate`</td><td>`formtarget`</td></tr>
  <tr><td>`height`</td><td>`inputmode`</td><td>`multiple`</td></tr>
  <tr><td>`step`</td><td>`width`</td><td>`form`</td></tr>
  <tr><td>`selectionDirection`</td><td>`spellcheck`</td><td>`type`</td></tr>
</table>

If these attributes are set to a quoted string, their values will be set
directly on the element, as in the previous example. However, when left
unquoted, these values will be bound to a property on the template's current
rendering context. For example:

```handlebars
<label for="firstname">First Name</label>
<Input @id="firstname" @type="text" @value={{this.firstName}} @size="50" disabled={{this.entryNotAllowed}} />
```

Will bind the `disabled` attribute to the value of `entryNotAllowed` in the
current context.

## Actions

To dispatch an action on specific events such as `key-press`, use the following

```handlebars
<label for="firstname">First Name</label>
<Input @id="firstname" @value={{this.firstName}} @key-press={{action "updateFirstName"}} />
```

The following event types are supported (dasherized format):

* `enter`
* `insert-newline`
* `escape-press`
* `focus-in`
* `focus-out`
* `key-press`
* `key-up`


More [event types](https://api.emberjs.com/ember/3.11/classes/Component#event-handler-methods) are also supported but these events need to be written in camelCase format, such `mouseEnter`. Note, there are events of the same type in both the list above and linked. Event names listed above must be dasherized. Additional work is performed on these events.

## Checkboxes

You can also use the
[`<Input>`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.components/methods/Input?anchor=Input)
helper to create a checkbox by setting its `type`:

```handlebars
<label for="admin-checkbox">Is Admin?</label>
<Input @id="admin-checkbox" @type="checkbox" @name="isAdmin" @checked={{this.isAdmin}} />
```

Checkboxes support the following properties:

* `checked`
* `disabled`
* `tabindex`
* `indeterminate`
* `name`
* `autofocus`
* `form`


Which can be bound or set as described in the previous section.


Checkboxes are a special input type. If you want to dispatch an action on a certain [event](https://api.emberjs.com/ember/3.11/classes/Component#event-handler-methods), you will always need to define the event name in camelCase format:

```handlebars
<Input @type="checkbox" @keypress={{action "updateName"}} />
```


## Text Areas

```handlebars
<Textarea @value={{this.name}} @cols="80" @rows="6" />
```

Will bind the value of the text area to `name` on the current context.

[`<Textarea>`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.components/methods/Textarea?anchor=Textarea) supports binding and/or setting the following properties:

* `value`
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

You might need to bind a property dynamically to an input if you're building a flexible form, for example. To achieve this you need to use the [`{{get}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/get?anchor=get) and [`{{mut}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/mut?anchor=mut) in conjunction like shown in the following example:

```handlebars
<Input @value={{mut (get this.person this.field)}} />
```

The `{{get}}` helper allows you to dynamically specify which property to bind, while the `{{mut}}` helper allows the binding to be updated from the input. See the respective helper documentation for more detail: [`{{get}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/get?anchor=get) and [`{{mut}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/mut?anchor=mut).
