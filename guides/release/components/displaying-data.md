In a component template you can display two types of value,
properties of the component object,
or values passed into the component.

To use a property you prefix it with `this`, like so:

```handlebars
<p>I'm {{this.name}}!</p>
```

And to use a named argument you prefix it with `@`, like so:

```handlebars
<p>Hello {{@friend}}!</p>
```

Since properties and named arguments are visually different,
this syntax allows you to know where a value comes from when you are reading the template.
If you encounter the `{{this.name}}` syntax,
you know you should check the JavaScript file of the component.
If you encounter the `{{@friend}}` syntax,
you know that the value is passed to the component when it is used in another template.

## Properties

To display a component property in the template, you prefix it with `this`,
like you would in JavaScript.

For the example, we will build a `Greeting` component with a hard-coded name.
Then, we will use that property in the component template:

```javascript {data-filename=src/ui/components/greeting/component.js}
import Component from '@glimmer/component';

export default class Greeting extends Component {
  constructor() {
    super(...arguments);

    this.name = "Tomster";
  }
}
```

```handlebars {data-filename=src/ui/components/greeting/template.hbs}
<p>Hello World, I'm {{this.name}}!</p>
```

This renders:

```
<p>Hello World, I'm Tomster!</p>
```

## Named arguments

A named argument is a value passed to the component when invoking it.
If you see:

```javascript
<Greeting @friend="Zoey" />
```

Then you know that the `Greeting` component is being invoked.
We are passing `friend` (named argument) to it with the value `Zoey`.

We will use the component from the previous example:

```javascript
import Component from '@glimmer/component';

export default class Greeting extends Component {
  constructor() {
    super(...arguments);

    this.name = "Tomster";
  }
}
```

But change the template so that instead of having `Hello World` hard-coded,
we will display the `friend` named property:

```handlebars
<p>Hello {{@friend}}, I'm {{this.name}}!</p>
```

Now, when we call the `Greeting` component like so:

```handlebars
<Greeting @friend="Zoey" />
```

The output will be:

```html
<p>Hello Zoey, I'm Tomster!</p>
```

For more detailed information see [Passing arguments and HTML attributes](./passing-arguments-and-html-attributes).