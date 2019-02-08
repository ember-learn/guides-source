Components can have properties passed in ([Passing Properties to a Component](../passing-properties-to-a-component/)),
but they can also return output to be used in a block expression.

### Return values from a component with `yield`

```handlebars {data-filename=app/templates/index.hbs}
<BlogPost @post={{this.model}} />
```

```handlebars {data-filename=app/templates/components/blog-post.hbs}
{{yield this.post.title this.post.body this.post.author}}
```

Here an entire blog post model is being passed to the component as a single component property.
In turn the component is returning values using `yield`.
In this case the yielded values are pulled from the post being passed in
but anything that the component has access to can be yielded, such as an internal property or something from a service.

### Consuming yielded values with block params

The block expression can then use block params to bind names to any yielded values for use in the block.
This allows for template customization when using a component,
where the markup is provided by the consuming template,
but any event handling behavior implemented in the component is retained such as `click()` handlers.

```handlebars {data-filename=app/templates/index.hbs}
<BlogPost @post={{this.model}} as |title body author|>
  <h2>{{title}}</h2>
  <p class="author">by {{author}}</p>
  <p class="post-body">{{body}}</p>
</BlogPost>
```

The names are bound in the order that they are passed to `yield` in the component template.

### Supporting both block and inline component usage in one template

It is possible to support both block and inline usage of a component from a single component template
using the `has-block` helper.

```handlebars {data-filename=app/templates/components/blog-post.hbs}
{{#if (has-block)}}
  {{yield this.post.title this.post.body this.post.author}}  
{{else}}
  <h1>{{this.post.title}}</h1>
  <p class="author">Authored by {{this.post.author}}</p>
  <p>{{this.post.body}}</p>
{{/if}}
```

This has the effect of providing a default template when using a component in the inline form
but providing yielded values for use with block params when using a block expression.
