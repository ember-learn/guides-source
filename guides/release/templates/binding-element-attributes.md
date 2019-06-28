In addition to normal text,
you may also want to have your templates contain HTML elements whose attributes are bound to the respective controller or component.

For example, imagine your controller has a property that contains a URL to an image:

```handlebars
<div id="logo">
  <img src={{this.logoUrl}} alt="Logo">
</div>
```

This generates the following HTML:

```html
<div id="logo">
  <img src="http://www.example.com/images/logo.png" alt="Logo">
</div>
```

If you use data binding with a Boolean value, it will add or remove the specified attribute.
For example, given this template:

```handlebars
<input type="checkbox" disabled={{this.isAdministrator}}>
```

If `isAdministrator` is `true`, the rendered HTML will be:

```html
<input type="checkbox" disabled>
```

If `isAdministrator` is `false`, the rendered HTML will be:

```html
<input type="checkbox">
```

### Passing HTML attributes to components

There are two kinds of things you can pass to components, named arguments and HTML attributes.
For named arguments, you can consult [Passing Properties to a Component](../components/passing-properties-to-a-component/).
Let's discuss HTML attributes.

If you want your component to be able to receive HTML attributes when it is being used in a template,
you have two ways to do it: you can specify it in `attributeBindings`,
or you can use `...attributes` in the component's template.

#### `attributeBindings`

By default, components that you have created will not apply HTML attributes you pass to them when using them in templates.
This means that the following:

```handlebars {data-filename="app/templates/application.hbs"}
<NameEditor data-test-my-custom-attribute />
```

Will not apply `data-test-my-custom-attribute` unless you have specified an attribute binding for it in the component class:

```javascript {data-filename="app/components/name-editor.js"}
import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['data-test-my-custom-attribute']
});
```

After specifying the attribute binding, Ember will apply it to the wrapper element of the component.
There is another way, in case you want to apply the attributes to an element _inside_ your template.

#### `...attributes`

You can apply arbitrary HTML attributes to an element inside your template via a special syntax, `...attributes`.
Building on top of the previous example, let us say we have the following `NameEditor` class and template:

```javascript {data-filename="app/components/name-editor.js"}
import Component from '@ember/component';

export default Component.extend({
  enteredName: null
});
```

```handlebars {data-filename="app/components/templates/name-editor.hbs"}
<p>Hello User, please enter your name:</p>

<label for="name-editor">
<Input @value={{this.enteredName}} id="name-editor" />
```

Now we want to be able to pass HTML attributes to `NameEditor` so that it auto-focuses,
as well as passing a custom data attribute so we can easily get to it when testing.
To do that, we update the template to the following:

```handlebars {data-filename="app/components/templates/name-editor.hbs"}
<p>Hello User, please enter your name:</p>

<label for="name-editor">
<Input @value={{this.enteredName}} id="name-editor" ...attributes />
```

And now we can call our `NameEditor` component with our desired HTML attributes:

```handlebars {data-filename="app/templates/application.hbs"}
<NameEditor autofocus data-test-name-editor />
```

We can see that `autofocus` and `data-test-name-editor` were applied to the rendered output.
This will work for any HTML attribute that you try to pass to the component.

You can read more about attributes and which are available at MDN's [HTML attribute reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes).
