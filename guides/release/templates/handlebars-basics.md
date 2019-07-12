Ember uses a templating language based on the [Handlebars templating library](http://www.handlebarsjs.com) to power your application's user interface.

Ember templates contain HTML and dynamic content inside Handlebars expressions, which are invoked with double curly braces: `{{}}`.
In JavaScript, a similar concept is template strings. For example, if you have the following JavaScript:

```javascript
let name = "Zoey";
console.log(`Hello ${name}!}`);
```

Which prints:

```text
Hello Zoey!
```

Ember templates have some superpowers, but let's start with regular HTML.
For any file in an Ember app that has an extension ending in `.hbs`, you can write HTML markup in it as if it was an `.html` file.
HTML is the language that browsers understand for laying out content on a web page.

Every Ember app has a file called `application.hbs`, and you can write regular HTML markup there or in any other `hbs` file:

export default Component.extend({
  name: "World"
});
```

```handlebars {data-filename=app/templates/components/hello-world.hbs}
Hello {{this.name}}!
```

Which renders:

```html
Hello World!
```

### What can be inside curly expressions?

* `{{this.property}}`
* `{{@namedArgument}}`
* `{{local-variable}}`
* `{{helper}}}`
* `{{component-name}}` or `{{#component-name}}{{/component-name}}`
* `<ComponentName />` or `<ComponentName></ComponentName>`
* `{{element-modifier}}`

No argument: `{{this.property}}`
Arguments: `{{if true "Hello World!" "Goodbye World!"}}`

Inline syntax: `{{if true "Hello World!"}}`
Block syntax: `{{#if true}}Hello World!{{/if}}`
Block params: `{{#let "Hello World!" as |greeting|}}{{greeting}}!{{/let}}`
Nested: `{{#let (if true "Hello World!" "Goodbye World!") as |greeting|}}{{greeting}}{{/let}}`

### Properties, named arguments, and local variables

#### Properties

As seen in the example at the beginning of this document, properties are prefixed by `this.`.
When you see `{{this.propertyName}}`,
that means that `propertyName` is being looked up directly in the object that is backing that template.

In the "Hello World" example, we are using a component template,
so the property is looked up in the respective component.
If it were a route template, then the backing object would be the respective controller:

You cannot use script tags directly within a template, and should use [actions](../actions/) or [Component Lifecycle Hooks](../../components/glimmer-components-dom/) to make your app responsive to user interactions and new data.
If you are working with a non-Ember JavaScript library and need to use a `js` file from it, see the Guide section [Addons and Dependencies](../../addons-and-dependencies/managing-dependencies/).

```html
Hello World!
```

#### Named arguments

When you use a component in your template, you can pass it arguments.
These arguments can be used directly in the component template and are prefixed by `@`.
When you see `{{@namedArgument}}` in a template,
that means that `namedArgument` was passed to that component.

Using <code>{{@namedArgument}}</code> gives you the guarantee that the value is exactly what was passed into the component and hasn't been modified!

```handlebars
<HelloWorld @name="Zoey" />
```

```handlebars
// component
<p>Hello {{@name}}</p>
```

```html
<p>Hello Zoey!</p>
```


#### Local variables

```javascript {data-filename=app/components/my-component.js}
import Component from '@glimmer/component';

export default class Profile extends Component {
  firstName = 'Trek';
  lastName = 'Glowacki';
  favoriteFramework = 'Ember';
}
```

```handlebars
{{{#each names as |name|}}
  <p>Hello {{name}}!</p>
{{/each}}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The <code>as |name|</code> syntax is called block arguments. They will be mentioned in more detail further ahead!
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>

In this situation, `name` is a local variable created by the template that only exists inside of the `{{#each}}{{/each}}` block.
If you tried to do the following:

```handlebars
{{{#each names as |name|}}
  <p>Hello {{name}}!</p>
{{/each}}
{{name}}
```

Then `{{name}}` outside of the block would render nothing:

```html
<p>Hello Tomster!<p>
<p>Hello Zoey!<p>
```

You can also introduce local variables yourself by using [`let`](https://emberjs.com/api/ember/3.7/classes/Ember.Templates.helpers/methods/let?anchor=let):

```handlebars
{{#let "Zoey" as |name|}}
  <p>Hello {{name}}!</p>
{{/let}}
```

Which renders:

```html
<p>Hello Zoey!</p>
```

{{!-- outlet determines where a child route's content
should render. Don't delete it until you know more
about it! --}}
<div>
  {{outlet}}
</div>

{{!-- One way to use a component within a template --}}
<MyComponent />

{{!-- A Handlebars comment. These comments, unlike, HTML
    comments, are not rendered in the DOM. They are
    removed when the template is compiled. --}}
```

The `firstName` and `lastName` properties are read from the
context (the application controller in this case), and rendered inside the
`<strong>` HTML tag.

```handlebars {data-filename=app/components/templates/my-component.hbs data-update=true}
{{!-- A property that is defined in a component's
JavaScript file --}}
{{this.numberOfSquirrels}}

{{!-- Some data passed down from a parent component
or controller --}}
{{@weatherStatus}}

{{!-- This button uses Ember Actions to make it interactive.
A method named `plantATree` is called when the button is
clicked. `plantATree` comes from the JavaScript file
associated with the template, like a Component or
Controller --}}
<button {{action this.plantATree}}>
  More trees!
<button>

{{!-- Here's an example of template logic in action.
If the `this.skyIsBlue` property is `true`, the text
inside will be shown --}}
{{#if this.skyIsBlue}}
  If the skyIsBlue property is true, show this message
{{/if}}

{{!-- You can pass a whole block of markup and handlebars
content from one component to another. yield is where
the block shows up when the page is rendered --}}
{{yield}}
```

Remember that `{{this.firstName}}` and `{{this.lastName}}` are bound data. That means
if the value of one of those properties changes, the DOM will be updated
automatically.

As an application grows in size, it will have many templates backed by
controllers and components.

To pass in arguments associated with a Route, define the property from within a [Controller](../../controllers/). Learn more about passing data between Component templates [here](../../components/arguments-and-attributes/).

Ember Helpers are functions that can compute values and can be used in any template.

Ember Helpers are a way to use JavaScript logic in your templates.
For example, you could write a Helper function that capitalizes a word, does some math, converts a currency, or more.
A Helper takes in `parameters`, which is an array of the values passed into the function, and should return a value.

For example, let's say you would like the ability to add a few numbers together, without needing to define a computed property everywhere you would like to do so.

```javascript {data-filename=app/helpers/sum.js}
import { helper } from '@ember/component/helper';

export function sum(params) {
  return params.reduce((a, b) => {
    return a + b;
  });
};

export default helper(sum);
```

The above code will allow you invoke the `sum()` function as a `{{sum}}` handlebars "helper" in your templates:

```handlebars {data-filename=app/templates/application.hbs}
<p>Total: {{sum 1 2 3}}</p>
```

This helper will output a value of `6`.

Ember gives you the ability to [write your own helpers](../writing-helpers/),
and comes with some [helpers built-in](../built-in-helpers/), which you will
learn more about in the following guides.

#### Nested Helpers

Helpers have the ability to be nested within other helper invocations and also component invocations.

This gives you the flexibility to compute a value _before_ it is passed in as an argument or an attribute of another.

It is not possible to nest curly braces `{{}}`, so the correct way to nest a helper is by using parentheses `()`:

```handlebars {data-filename=app/templates/application.hbs}
{{sum (multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

Thus, many of Ember's built-in helpers (as well as your custom helpers) can be used in nested form.
