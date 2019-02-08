Components are isolated from their surroundings, so any data that the component
needs has to be passed in.

For example, imagine you have a `BlogPost` component that is used to
display a blog post:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<article class="blog-post">
  <h1>{{this.title}}</h1>
  <p>{{this.body}}</p>
</article>
```

Now imagine we have the following template and route:

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('post');
  }
});
```

If we tried to use the component like this:

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.model as |post|}}
  <BlogPost />
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
{{#each this.model as |post|}}
  <BlogPost @title={{post.title}} @body={{post.body}} />
{{/each}}
```

It is important to note that these properties stay in sync (technically
known as being "bound"). That is, if the value of `componentProperty`
changes in the component, `outerProperty` will be updated to reflect that
change. The reverse is true as well.

In addition to making properties available, actions can be made available
to components. This allows data to flow back up to its parent. You pass actions
like this.

```handlebars {data-filename=app/templates/index.hbs}
  <ButtonWithConfirmation
    @text="Click here to unsubscribe."
    @onConfirm={{action "unsubscribe"}}
  />
```

It is important to note that actions can only be passed from a controller or another
component. They cannot be passed from a route. See [passing an action to the component](../triggering-changes-with-actions/#toc_passing-the-action-to-the-component)
for more details on how to pass actions.

## Positional Params

In addition to passing parameters in by name, you can pass them in by position.
In other words, you can invoke the above component example like this:

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.model as |post|}}
  {{blog-post post.title post.body}}
{{/each}}
```

To set the component up to receive parameters this way, you need to
set the [`positionalParams`](https://www.emberjs.com/api/ember/release/classes/Component/properties/positionalParams?anchor=positionalParams) attribute in your component class.

```javascript {data-filename=app/components/blog-post.js}
import Component from '@ember/component';

export default Component.extend({}).reopenClass({
  positionalParams: ['title', 'body']
});
```

Then you can use the attributes in the component exactly as if they had been
passed in like `<BlogPost @title={{post.title}} @body={{post.body}} />`.

Notice that the `positionalParams` property is added to the class as a
static variable via `reopenClass`. Positional params are always declared on
the component class and cannot be changed while an application runs.

Alternatively, you can accept an arbitrary number of parameters by
setting `positionalParams` to a string, e.g. `positionalParams: 'params'`. This
will allow you to access those params as an array like so:

```javascript {data-filename=app/components/blog-post.js}
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  title: computed('params.[]', function(){
    return this.params[0];
  }),
  body: computed('params.[]', function(){
    return this.params[1];
  })
}).reopenClass({
  positionalParams: 'params'
});
```
