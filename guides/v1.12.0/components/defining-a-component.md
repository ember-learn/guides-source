To define a component, create a template whose name starts with
`components/`. To define a new component, `{{blog-post}}` for example,
create a `components/blog-post` template.

**Note:** Components must have a dash in their name. So `blog-post` is an acceptable name,
but `post` is not. This prevents clashes with current or future HTML element names, and
ensures Ember picks up the components automatically.

A sample component template would look like this:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<h1>Blog Post</h1>
<p>Lorem ipsum dolor sit amet.</p>
```

Having a template whose name starts with `components/` creates a
component of the same name. Given the above template, you can now use the
`{{blog-post}}` custom element:

<!--- <a class="jsbin-embed" href="http://jsbin.com/tikenoniku/1/edit?output">JS Bin</a><script src="http://static.jsbin.com/js/embed.js"></script> -->
<!--- The example above uses `<script>` tags to work inside of JSBin.-->
```handlebars {data-filename=app/templates/index.hbs}
{{#each model as |post|}}
  {{#blog-post title=post.title}}
    {{post.body}}
  {{/blog-post}}
{{/each}}
```

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<article class="blog-post">
  <h1>{{title}}</h1>
  <p>{{yield}}</p>
  <p>Edit title: {{input type="text" value=title}}</p>
</article>
```

```javascript {data-filename=app/routes/index.js}
var posts = [{
    title: "Rails is omakase",
    body: "There are lots of à la carte software environments in this world."
  }, {
    title: "Broken Promises",
    body: "James Coglan wrote a lengthy article about Promises in node.js."
}];

export default Ember.Route.extend({
  model: function() {
    return posts;
  }
});
```

```javascript {data-filename=app/components/blog-post.js}
export default Ember.Component.extend({
});
```

Each component, under the hood, is backed by an element. By default
Ember will use a `<div>` element to contain your component's template.
To learn how to change the element Ember uses for your component, see
[Customizing a Component's Element](./customizing-a-components-element/).


### Defining a Component Subclass

Often times, your components will just encapsulate certain snippets of
Handlebars templates that you find yourself using over and over. In
those cases, you do not need to write any JavaScript at all. Just define
the Handlebars template as described above and use the component that is
created.

If you need to customize the behavior of the component you'll
need to define a subclass of `Ember.Component`. For example, you would
need a custom subclass if you wanted to change a component's element,
respond to actions from the component's template, or manually make
changes to the component's element using JavaScript.

Ember knows which subclass powers a component based on its name. For
example, if you have a component called `blog-post`, you would create a
file at `app/components/blog-post.js`. If your component was called
`audio-player-controls`, the file name would be at
`app/components/audio-player-controls.js`

In other words, Ember will look for a class with the camelized name of
the component, followed by `Component`.

<table>
  <thead>
  <tr>
    <th>Component Name</th>
    <th>Component Class</th>
  </tr>
  </thead>
  <tr>
    <td><code>blog-post</code></td>
    <td><code>App.BlogPostComponent</code></td>
  </tr>
  <tr>
    <td><code>audio-player-controls</code></td>
    <td><code>App.AudioPlayerControlsComponent</code></td>
  </tr>
</table>
