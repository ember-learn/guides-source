Components are isolated from their surroundings, so any data that the component
needs has to be passed in.

For example, imagine you have a `blog-post` component that is used to
display a blog post:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<article class="blog-post">
  <h1>{{title}}</h1>
  <p>{{body}}</p>
</article>
```

Now imagine we have the following template and route:

```javascript {data-filename=app/routes/index.js}
import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.get('store').findAll('post');
  }
});
```

If we tried to use the component like this:

```handlebars {data-filename=app/templates/index.hbs}
{{#each model as |post|}}
  {{blog-post}}
{{/each}}
```

The following HTML would be rendered:

```html
<article class="blog-post">
  <h1></h1>
  <p></p>
</article>
```

In order to make a property available to a component, you must pass it
in like this:

```handlebars {data-filename=app/templates/index.hbs}
{{#each model as |post|}}
  {{blog-post title=post.title body=post.body}}
{{/each}}
```

It is important to note that these properties stay in sync (technically
known as being "bound"). That is, if the value of `componentProperty`
changes in the component, `outerProperty` will be updated to reflect that
change. The reverse is true as well.

## Positional Params

In addition to passing parameters in by name, you can pass them in by position.
In other words, you can invoke the above component example like this:

```handlebars {data-filename=app/templates/index.hbs}
{{#each model as |post|}}
  {{blog-post post.title post.body}}
{{/each}}
```

To set the component up to receive parameters this way, you need
set the [`positionalParams`][1] attribute in your component class.

[1]: https://api.emberjs.com/classes/Ember.Component.html#property_positionalParams

```javascript {data-filename=app/components/blog-post.js}
import Ember from 'ember';

const BlogPostComponent = Ember.Component.extend({});

BlogPostComponent.reopenClass({
  positionalParams: ['title', 'body']
});

export default BlogPostComponent;
```

Then you can use the attributes in the component exactly as if they had been
passed in like `{{blog-post title=post.title body=post.body}}`.

Notice that the `positionalParams` property is added to the class as a
static variable via `reopenClass`. Positional params are always declared on
the component class and cannot be changed while an application runs.

Alternatively, you can accept an arbitrary number of parameters by
setting `positionalParams` to a string, e.g. `positionalParams: 'params'`. This
will allow you to access those params as an array like so:

```javascript {data-filename=app/components/blog-post.js}
import Ember from 'ember';

const BlogPostComponent = Ember.Component.extend({
  title: Ember.computed('params.[]', function(){
    return this.get('params')[0];
  }),
  body: Ember.computed('params.[]', function(){
    return this.get('params')[1];
  })
});

BlogPostComponent.reopenClass({
  positionalParams: 'params'
});

export default BlogPostComponent;
```

<!-- eof - needed for pages that end in a code block  -->
