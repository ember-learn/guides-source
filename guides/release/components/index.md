Components are an essential building block in Ember applications. They allow
developers to package presentation and behavior into a single unit and give it
a name. You can think of them like defining your own custom HTML elements, like
a custom `<input>` or `<select>` tag that has its own behavior, values, and
events that you can hook into in your templates. However, they shouldn't be
confused with [_web components_](https://www.webcomponents.org/), which are a
browser based API that is similar, but not as powerful as Ember components.

Like we mentioned in the section on [Templates](../templates/handlebars-basics/), components
can have both a template and a class definition, like so:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button {{on "click" this.sayHello}}>
  {{@buttonText}}
</button>
```

```javascript {data-filename=app/components/hello-button.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class HelloButton extends Component {
  @action
  sayHello() {
    console.log('Hello, world!');
  }
}
```

And the template file:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
{{yield}}
```

You can use the integration test to test your component. This will be covered later in the guides.

### Creating a Nested Component

Again, you can use Ember CLI to create a nested component:

```bash
ember generate component blog-post/comment

installing component
  create app/components/blog-post/comment.js
  create app/templates/components/blog-post/comment.hbs
installing component-test
  create tests/integration/components/blog-post/comment-test.js
```

## Component Templates

Templates in components use the Handlebars templating language, as discussed in
the [Templates](../templates/handlebars-basics/) section. A component's template is the layout
that is used when rendering the component. If we update the `BlogPost`'s
template to be:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<h1>Fun Facts About Tomster</h1>
<section>
  1. He's a hamster!
  2. But also a Tomster!
</section>
```

And then use the component like so:

```handlebars {data-filename=app/templates/application.hbs}
<HelloButton @buttonText="Say Hello!"/>
```

The syntax for using a component is similar to standard HTML elements, but uses
`<CapitalCase>` for the name of the component instead of lower case. This
_invocation_, as we call it, for the `HelloButton` component results in the
following HTML output wherever it was used:

```html
<button>
  Say Hello!
</button>
```

And when we click on the button, it triggers the `sayHello` action, logging
"Hello, world!" to the console. We can reuse this component as many times as we
like, and we can even change the text via the value that we pass to it,
`@buttonText`, which is known as an _argument_:

```handlebars {data-filename=app/templates/application.hbs}
<HelloButton @buttonText="Say Hello!"/>
<HelloButton @buttonText="Di Hola!"/>
<HelloButton @buttonText="Dis Bonjour!"/>
```

Invoking the component three times like this results in the following HTML:

  ```handlebars
  <BlogPost @title="An Interview With Zoey" />
  <BlogPost @title="Fun Facts About Tomster" />
  ```

  We'll talk more about arguments in [the next
  section](./arguments-and-attributes/). All arguments are prefixed with the `@`
  symbol, so whenever you see `{{@...` you know its referring to any argument.

- `{{this.sectionClass}}` refers to a _property_ of the component _instance_.
  Like we mentioned before, components that have class definitions also get a
  class instance every time they are created. In a component template,
  `{{this}}` always refers to that instance, and allows you to access methods,
  fields, and other properties on the class instance.

It's important to note that arguments and properties can be used
interchangeably, so we could for instance have used an argument for the
`sectionClass`, and a class property for title or post content:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<h1>{{this.title}}</h1>
<section class="{{@sectionClass}}">
  {{this.content}}
</section>
```

For more details on where and how you can invoke values, read through the
[section on templating](../templates/handlebars-basics/).
The reason you would choose an argument or property is based on how you expect
to use the component, and whether or not the value should be based on internal
logic within the component, or values passed to the component where it is used.

You can also use template helpers, modifiers, and other components within your
component template:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<h1>{{capitalize @title}}</h1>

<BlogSection>
  {{@content}}
</BlogSection>
```

We now have:

- The `{{capitalize}}` helper, which we're using to format the `@title`
  argument.
- The `<BlogSection>` component, replaces the `<section>` element and presumably
  has similar semantics, and some custom functionality (the implementation of
  this component is not included).

Using helpers, modifiers, and components allows you to have some logic in your
templates, and to nest components within each other, building up a component
_tree_.

Finally, component templates can use a special helper: `{{yield}}`. We'll cover
this helper in more detail in the [Yields](./yields/) section later on, but this
helper allows us to specify that users can pass the component a _block_ of
children, and where those children should be placed. If we go back to our
`BlogPost` component, we can add a yield like this:

```handlebars {data-filename=app/templates/components/blog-post.hbs}
<h1>{{@title}}</h1>
<section class="{{this.sectionClass}}">
  {{yield}}
</section>
```

We can then invoke this component with a block, like this:

```handlebars
<BlogPost @title="Fun Facts About Tomster">
  1. He's a hamster!
  2. But also a Tomster!
</BlogPost>
```

And this will place the block - the text that is in between `<BlogPost>` and
`</BlogPost>` - where the yield was in the original component when rendered:

```html
<h1>Fun Facts About Tomster</h1>
<section class="blog-post-section">
  1. He's a hamster!
  2. But also a Tomster!
</section>
```

This allows you to have some logic in your templates, and to nest components
within each other, building up a component _tree_. The component tree in Ember
applications is similar to the DOM tree in the HTML - in fact, you can even
inspect it using the [Ember Inspector](../ember-inspector/).

<!-- [TODO: Screenshot of the Component tree in the Ember Inspector] -->

Components can also have blocks and children, just like standard HTML elements.
We could update the `HelloButton` component to render its button text from its
block instead of the `@buttonText` argument, by adding the `{{yield}}` helper
to its template where we want to place its block:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button {{on "click" this.sayHello}}>
  {{yield}}
</section>
```

We'll talk more about attributes in [the next
section](./arguments-and-attributes/). They are values that get applied directly
to elements, and can be used to customize the HTML of a component. Unlike
arguments, they are _not_ prefixed with the `@` symbol:

```handlebars
<BlogPost @title="Fun Facts About Tomster" class="featured">
  <ol>
    <li>He's a hamster!</li>
    <li>But also a Tomster!</li>
  </ol>
</BlogPost>
```

And then invoking the component in block form, with the text we want to be
rendered in the button:

```handlebars {data-filename=app/templates/application.hbs}
<HelloButton>
  Say Hello!
</HelloButton>
```

This is the same as our first example, with the `HelloButton` button component
_yielding_ to the block that was passed to it instead of being passed an
argument. We can put anything inside of that block, including text, HTML, and
other components. This is part of what makes components so powerful and
composable as a whole.

Components can also consist of _just_ a template definition. Components with
just a template are known as Template-Only components, as well as presentational
or functional components. The major difference is that _unlike_ components with
a class, Template-Only components are _stateless_ - they are purely based on the
_arguments_ that they are passed. This makes them much easier to reason about,
and very useful in many circumstances.

In the following guides we'll talk about:

- **Defining a component**, its file structure and its API and lifecycle hooks,
  and how to derive state based on getters.

- **Arguments and Attributes**, how to think about them as parameters to your
  component, and how to use them effectively.

- **Actions**, which are how you can add interactivity to your app.

- **Yields**, block invocation in components, and how to pass values to blocks.

- **Interacting with the DOM**, some libraries require direct DOM manipulation,
  which Ember fully supports

- **Contextual Components**, which can be used dynamically to pass components
  around as values, and allow them to be invoked in different locations.

These are the only hooks and properties that exist on the component, and the
only ones you need to worry about! Now, onto Arguments and Attributes.
