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

Then the equivalent Ember template would be something like the following:

```javascript {data-filename=app/components/hello-world.js}
import Component from '@ember/component';

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

```javascript
export default class extends Controller {
  name = "World";
}
```

```handlebars
Hello {{this.name}}!
```

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

Local variables are variables that are "created" inside the template.
A common example would be when iterating an array using [`each`](https://emberjs.com/api/ember/3.7/classes/Ember.Templates.helpers/methods/let?anchor=each),
a local variable is created for the current element being iterated:

```javascript
// my-component.js
export default Component.extend({
  names: null,

  init() {
    this.names = ["Tomster", "Zoey"]
  }
})
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


### Displaying Properties

Templates are backed by a context. A context is an object from which
Handlebars expressions read their properties. In Ember this is often a component. For templates rendered by a route (like `application.hbs`), the context is a controller.

For example, this `application.hbs` template will render a first and last name:

```handlebars {data-filename=app/templates/application.hbs}
Hello, <strong>{{this.firstName}} {{this.lastName}}</strong>!
```

The `firstName` and `lastName` properties are read from the
context (the application controller in this case), and rendered inside the
`<strong>` HTML tag.

To provide a `firstName` and `lastName` to the above template, properties
must be added to the application controller. If you are following along with
an Ember CLI application, you may need to create this file:

```javascript {data-filename=app/controllers/application.js}
import Controller from '@ember/controller';

export default Controller.extend({
  firstName: 'Trek',
  lastName: 'Glowacki'
});
```

The above template and controller render as the following HTML:

```html
Hello, <strong>Trek Glowacki</strong>!
```

Remember that `{{this.firstName}}` and `{{this.lastName}}` are bound data. That means
if the value of one of those properties changes, the DOM will be updated
automatically.

As an application grows in size, it will have many templates backed by
controllers and components.

### Helpers

Ember Helpers are functions that can compute values and can be used in any template.

Ember gives you the ability to [write your own helpers](../writing-helpers/), to bring a minimum of logic into Ember templating.

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

Ember ships with several built-in helpers, which you will learn more about in the following guides.

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
