Components are the building blocks of the user interface (UI) in your application, and they play two major roles. One is that they help you structure your application in a way that is easy to understand, since you can organize the UI into bite-sized pieces. Two, they make it possible to create UI elements that you can reuse multiple times throughout your application.

## Creating a component

To make a new component in your application, use the Ember CLI:

```bash
ember generate glimmer-component my-component-name
```

This will create a template file, a JavaScript file containing a component class, and a test.
The template file ends in `.hbs`, and it holds HTML markup and Ember-specific template features.
The JavaScript file holds the interactivity like click handlers and state.

<!-- TODO - possibly revise this to reflect template-only component defaults, RFC 481  -->

## Example

Components can do a lot, but let's start with a small example.For this `HelloButton` component shows how a component's template and class work together to create a click handler for the button:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button {{on "click" this.sayHello}}>
  Say Hello!
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

<!-- TODO change filepaths when template co-location is in Octane blueprints RFC 481 -->

## Using a Component

Here is how a Component can be used within other templates:

```handlebars {data-filename=app/templates/application.hbs}
<HelloButton />
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
"Hello, world!" to the console.

However, this example is not reusable, because the button's label is hard-coded and it logs the same message every time.
Next, we will show how we can render the button multiple times with different labels.

## Arguments



and we can even change the text via the value that we pass to it,
`@buttonText`, which is known as an _argument_:

```handlebars {data-filename=app/templates/application.hbs}
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

## Component state

<!-- computed props/tracked, static vals -->


## Bringing it all together

Now that we have introduced templates, arguments, actions, and state, let's look at an example that brings them all together.



------

We'll talk more about [arguments](../arguments-and-attributes/) and [actions](../actions-and-events/) later on.

You can also use template helpers, modifiers, and other components within your
component template:

```handlebars {data-filename=app/templates/components/hello-button.hbs}
<button {{action this.sayHello}}>
  {{#if @iconType}}
    <Icon @type={{@iconType}} />
  {{/if}}
  {{concat @buttonText "!"}}
</button>
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
<button {{action this.sayHello}}>
  {{yield}}
</button>
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


<!-- 
Rationale and scope:
This page should introduce just enough information that someone can create a component that renders data and updates in response to interaction. It should also 
Because people often struggle with how each individual feature fits together, the goal is to give a big picture mental model of the foundational concepts.
-->