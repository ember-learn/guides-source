You can use `Ember.View` to render a Handlebars template and insert it into the DOM.

To tell the view which template to use, set its `templateName` property. For example
if your project contains this template:

```handlebars {data-filename=app/templates/say-hello.hbs}
Hello, <b>{{view.name}}</b>
```

I would set the `templateName` property to `"say-hello"`.

```javascript {data-filename=app/views/some-view.js}
var view = Ember.View.create({
  templateName: 'say-hello',
  name: "Bob"
});
```

Note: For the remainder of the guide, the `templateName` property will be omitted from most examples. You can assume that if we show a code sample that includes an Ember.View and a Handlebars template, the view has been configured to display that template via the `templateName` property.

You can append views to the document by calling `appendTo`:

```javascript
view.appendTo('#container');
```

As a shorthand, you can append a view to the document body by calling `append`:

```javascript
view.append();
```

To remove a view from the document, call `remove`:

```javascript
view.remove();
```

<!-- eof - needed for pages that end in a code block  -->
