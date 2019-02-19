Ember components are used to turn markup text and styles into reusable content.
Components consist of two parts: a JavaScript component file that defines behavior, and its accompanying template that defines the markup for the component's UI.

Let us create a component to render a blog post using the `ember` command line tool:

```bash
ember generate component blog-post
```

This generates a JavaScript file:

```javascript {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class BlogPostComponent extends Component {
}
```

And a template file:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
{{yield}}
```

We will update the template to greet the user:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<p>Hi user!</p>
```

```handlebars {data-filename=src/ui/routes/index/template.hbs}
<BlogPost />
```

## Dynamically rendering a component

The [`{{component}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component) helper can be used to defer the selection of a component to
run time. The `<MyComponent />` syntax always renders the same component,
while using the `{{component}}` helper allows choosing a component to render on
the fly. This is useful in cases where you want to interact with different
external libraries depending on the data. Using the `{{component}}` helper would
allow you to keep different logic well separated.

The first parameter of the helper is the name of a component to render, as a
string. So `{{component 'blog-post'}}` is the same as using `<BlogPost />`.

The real value of [`{{component}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component) comes from being able to dynamically pick
the component being rendered. Below is an example of using the helper as a
means of choosing different components for displaying different kinds of posts:

```handlebars {data-filename=src/ui/components/foo-component/template.hbs}
<h3>Hello from foo!</h3>
<p>{{this.post.body}}</p>
```

```handlebars {data-filename=src/ui/components/bar-component/template.hbs}
<h3>Hello from bar!</h3>
<div>{{this.post.author}}</div>
```

```handlebars {data-filename=src/ui/routes/index/template.hbs}
{{#each this.myPosts as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{component post.postType post=post}}
{{/each}}
```

or

```handlebars {data-filename=src/ui/routes/index/template.hbs}
{{#each this.myPosts as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{#let (component post.postType) as |Post|}}
    <Post @post={{post}} />
  {{/let}}
{{/each}}
```

When the parameter passed to `{{component}}` evaluates to `null` or `undefined`,
the helper renders nothing. When the parameter changes, the currently rendered
component is destroyed and the new component is created and brought in.

Picking different components to render in response to the data allows you to
have different template and behavior for each case. The `{{component}}` helper
is a powerful tool for improving code modularity.

## Functional component

Can be seen as "functional components". It does not have a JavaScript object backing it up, so can only refer to named arguments.
To make one, delete `component.js`.

## Container component

Useful when you want a provider-type component, something that does calculations and yields them out as block params.
To make one, delete `component.hbs`. By