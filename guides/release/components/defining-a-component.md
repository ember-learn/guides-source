Components are an essential building block in Ember applications.
They allow developers to package presentation and behaviour into a single unit and give it a name.

A component's presentation is defined by its template file,
which uses the Ember template mentioned in [the Template chapter](../../templates/).
The behaviour is defined by its JavaScript file, which we will be covering in this guide.

It is possible to have an Ember component with only a JavaScript file, or with only a template file.
Components with only a JavaScript file are also known as container components,
because their goal is to provide state for other components to use.
You can read more about this in the [nesting components guide]().

Components with only a template file are also known as template-only components,
as well as presentational or functional components.
This is because they do not have state of their own,
and only use values passed to them.
You can read more about passing values to components at the [passing arguments guide]().

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

If you call this component from a route template,
you will see `<p>Hi user!</p>` being rendered when you visit that route:

```handlebars {data-filename=src/ui/routes/application/template.hbs}
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
the helper renders nothing.
When the parameter changes, the currently rendered component is destroyed and the new component is created and brought in.

Picking different components to render in response to the data allows you to
have different template and behavior for each case.
The `{{component}}` helper
is a powerful tool for improving code modularity.

## Template-only components

Template-only components, sometimes known as functional components,
are components that do not have a JavaScript file associated with them.

What this means in practice is that using properties in the template (`{{this.myProperty}}`) will result in an error.
In a template-only component you can only use values that were passed to the component, called named arguments (`{{@myArgument}}`).

A small example would be a greeting component that receives the name of a friend and greets them:

```handlebars {data-filename=src/ui/components/greeting/template.hbs}
<p>Hello {{@friend}}</p>
```

```handlebars {data-filename=src/ui/routes/application/template.hbs}
<Greeting />
```

We will learn more about properties and named arguments in the [displaying data guide]().

## Container component

<!-- TBK -->

Useful when you want a provider-type component, something that does calculations and yields them out as block params.
To make one, delete `component.hbs`.