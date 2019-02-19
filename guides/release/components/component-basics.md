Components are an essential building block in Ember applications. They allow
developers to package presentation and behaviour into a single unit and give it
a name. You can think of them like defining your own custom HTML elements, like
a custom `<input>` or `<select>` tag that has its own behavior, values, and
events that you can hook into in your templates. However, they shouldn't be
confused with [_web components_](https://www.webcomponents.org/), which are a
browser based API that is similar, but not as powerful as Ember components.

Like we mentioned in the section on [Templates](../../templates/), components
can have both a template and a class definition, like so:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button onclick={{this.sayHello}}>
  {{@buttonText}}
</button>
```

```js {data-filename=app/components/hello-button.js}
import Component from '@glimmer/component';
import action from '@ember/object';

export default class HelloButton extends Component {
  @action
  sayHello() {
    console.log('Hello, world!');
  }
}
```

And they can be used in other templates:

```handlebars
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

And when we click on the button, it triggers its `onclick` handler, logging
"Hello, world!" to the console. We can reuse this component as many times as we
like, and we can even change the text via the value that we pass to it,
`@buttonText`, which is known as an _argument_:

```handlebars
<HelloButton @buttonText="Say Hello!"/>
<HelloButton @buttonText="Di Hola!"/>
<HelloButton @buttonText="Dis Bonjour!"/>
```

Invoking the component three times like this results in the following HTML:

```html
<button>
  Say Hello!
</button>
<button>
  Di Hola!
</button>
<button>
  Dis Bonjour!
</button>
```

However, clicking on each button will still log the same "Hello, world!"
message, since the click handler is defined in the _class_ of the component, and
doesn't use any arguments. We'll talk more about arguments - and their
counterpart, _actions_ - later on.

You can also use template helpers, modifiers, and other components within your
component template:

```hbs
{{#if @useCustomButton}}
  <CustomButton @onClick={{@sayHello}}>
    {{this.buttonText}}
  </CustomButton>
{{else}}
  <button onclick={{@sayHello}}>
    {{this.buttonText}}
  </button>
{{/if}}
```

This allows you to have some logic in your templates, and to nest components
within each other, building up a component _tree_. The component tree in Ember
applications is similar to the DOM tree in the HTML - in fact, you can even
inspect it using the Ember Inspector:

[TODO: Screenshot of the Component tree in the Ember Inspector]

Components can also have blocks and children, just like standard HTML elements.
We could update the `HelloButton` component to render its button text from its
block instead of the `@buttonText` argument, by adding the `{{yields}}` keyword
to its template where we want to place its block:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button onclick={{this.sayHello}}>
  {{yield}}
</button>
```

And then invoking the component in block form, with the text we want to be
rendered in the button:

```handlebars
<HelloButton>
  Say Hello!
</HelloButton>
```

This is the same as our first example, with the `HelloWorld` button component
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

- **Contextual Components**, which can be used dynamically to pass components
  around as values, and allow them to be invoked in different locations.
