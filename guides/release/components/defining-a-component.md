To define a component, run:

```bash
ember generate component my-component-name
```

Ember components are used to turn markup text and styles into reusable content. 
Components consist of two parts: a JavaScript component file that defines behavior, and its accompanying Handlebars template that defines the markup for the component's UI.

A sample component template could look like this:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<article class="blog-post">
  <h1>{{this.title}}</h1>
  <p>{{yield}}</p>
  <p>Edit title: {{input type="text" value=this.title}}</p>
</article>
```

Given the above template, you can now use the `<BlogPost />` component:

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.model as |post|}}
  <BlogPost @title={{post.title}}>
    {{post.body}}
  </BlogPost>
{{/each}}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
In Ember templates there are different ways to invoke a Component. The syntax above is referred to as angle bracket invocation syntax, and it might not look familiar if you are looking at older code samples that use the classic invocation syntax. For more examples of ways to use Components in a template, see the <a href="../../reference/syntax-conversion-guide">Syntax Conversion Guide</a>, a <a href="https://guides.emberjs.com/v3.6.0/components/defining-a-component/">previous version of the Guides</a> or <a href="https://emberjs.com/api/ember/3.6/classes/Component">Ember.js API documentation</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>

Its model is populated in `model` hook in the route handler:

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('post');
  }
});
```

Each component is backed by an element under the hood. By default,
Ember will use a `<div>` element to contain your component's template.
To learn how to change the element Ember uses for your component, see
[Customizing a Component's
Element](./customizing-a-components-element/).


## Defining a Component Subclass

Often times, your components will contain reused Handlebar templates. In
those cases, you do not need to write any JavaScript at all. Handlebars 
allows you to define templates and reuse them as components.

If you need to customize the behavior of the component you'll
need to define a subclass of [`Component`](https://www.emberjs.com/api/ember/release/classes/Component). For example, you would
need a custom subclass if you wanted to change a component's element,
respond to actions from the component's template, or manually make
changes to the component's element using JavaScript.

Ember knows which subclass powers a component based on its filename. For
example, if you have a component called `blog-post`, you would create a
file at `app/components/blog-post.js`. If your component was called
`audio-player-controls`, the file name would be at
`app/components/audio-player-controls.js`.

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

```handlebars {data-filename=app/templates/components/foo-component.hbs}
<h3>Hello from foo!</h3>
<p>{{this.post.body}}</p>
```

```handlebars {data-filename=app/templates/components/bar-component.hbs}
<h3>Hello from bar!</h3>
<div>{{this.post.author}}</div>
```

```javascript {data-filename=app/routes/index.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('post');
  }
});
```

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.model as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{component post.componentName post=post}}
{{/each}}
```

or 

```handlebars {data-filename=app/templates/index.hbs}
{{#each this.model as |post|}}
  {{!-- either foo-component or bar-component --}}
  {{#let (component this.componentName) as |Post|}}
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
