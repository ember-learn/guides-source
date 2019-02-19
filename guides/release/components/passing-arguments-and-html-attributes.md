There are two kinds of things that you can pass to a component when you use it in a template,
named arguments, and HTML attributes.

If we have the following template:

```handlebars
<MyComponent @arg="Argument" class="error">
```

We can say that we are passing the `arg` named argument
and the `class` HTML property to the `MyComponent` component.

The way to distinguish them is that named arguments are prefixed with `@`,
while HTML attributes are not.

## Named arguments

A named argument is a value passed to the component when invoking it.

We want to greet our friend by passing their name to the component.
The JavaScript file does not need to change,
but we will update the template to reference `friend`:

```javascript
import Component from '@glimmer/component';

export default class Greeting extends Component {
  constructor() {
    super(...arguments);

    this.name = "Tomster";
  }
}
```

```handlebars
<p>Hello {{@friend}}, I'm {{this.name}}!</p>
```

Now when we call the `Greeting` component like so:

```handlebars
<Greeting @friend="Zoey" />
```

The output will be:

```html
<p>Hello Zoey, I'm Tomster!</p>
```

In this example, `{{@friend}}` is referring to a named argument,
a value that is given to the component when it is invoked.
`{{this.name}}` is referring to a property of the component.

This distinction is useful when reading template files.
If you see `{{@}}`, you know the value comes from outside of the component.
If you see `{{this.}}`, you know the value comes from the component's JavaScript object.

If we call the `Greeting` component like so:

```handlebars
<Greeting @friend="Zoey" />
```

The output will be:

```html
<p>Hello Zoey, I'm Tomster!</p>
```

### Optional arguments

You might want to make your component receive an optional argument.
Since you cannot mutate named arguments,
the solution is to define a tracked property in your component that references the named argument,
and then use the tracked property in your JavaScript and template files.

We are going to pick up the `Greeting` component from the previous example and make it possible to optionally pass in the name of the greeter.
To show the usefulness of separating properties from named arguments,
we are going to have both a `name` property and a `name` named argument.

```javascript
import Component from '@glimmer/component';

export default class Greeting extends Component {
  constructor() {
    super(...arguments);
  }

  @tracked
  get name() {
    return this.args.name || "Tomster";
  }
}
```

```handlebars
<p>Hello {{@friend}}, I'm {{this.name}}!</p>
```

Now when called like so:

```handlebars
<Greeting @friend="Ferris" @name="Zoey" />
```

The result will be:

```html
<p>Hello Yehuda, I'm Zoey</p>
```

### HTML attributes



#### Overridable attributes

```handlebars
<p class="friend-greeting" ...attributes>Hello {{@friend}}, I'm {{this.name}}!</p>
```

#### Priority attributes

```handlebars
<UserImage src="{{user.profilePicture}}" alt="This is my image" />
```

```handlebars
<p ...attributes class="friend-greeting">Hello {{@friend}}, I'm {{this.name}}!</p>
```


#### `class` HTML property

Class is special, it will merge passed in with the element classes.

```handlebars
<Greeting @friend="Zoey" class="red-alert" />
```

Either:
```handlebars
<p ...attributes class="friend-greeting">Hello {{@friend}}, I'm {{this.name}}!</p>
```

```html
<p class="red-alert friend-greeting">Hello {{@friend}}, I'm {{this.name}}!</p>
```

Or:
```handlebars
<p class="friend-greeting" ...attributes>Hello {{@friend}}, I'm {{this.name}}!</p>
```

```html
<p class="friend-greeting red-alert">Hello {{@friend}}, I'm {{this.name}}!</p>
```