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

### Adding Attributes to Component Invocations

Components in Ember can also accept attributes to be placed on an element
which they render. A common use for this might be `lang` or `data-*`
attributes. For example, this template passes those two attributes to
a link component:

```handlebars
<LinkTo @route="photos" data-toggle="dropdown" lang="es">
  Fotos
</LinkTo>
```

Which will render the following HTML:

```html
<a href="/photos" data-toggle="dropdown" lang="es" id="ember239" class="ember-view">
  Fotos
</a>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
This API uses a recent and new feature in Ember: Angle bracket invocation
syntax of an Ember component. If this doesn't look familiar you may be
working with classic component invocation syntax (for example <code>{{my-component}}</code>).
For more examples of ways to use components in a template, see the <a href="../../reference/syntax-conversion-guide">Syntax Conversion Guide</a> or the <a href="https://guides.emberjs.com/v3.6.0/templates/binding-element-attributes/">previous version of this Guide entry</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>
