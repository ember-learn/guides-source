There are two significant changes to templates in Octane compared to classic Ember:

1. Angle Bracket Syntax
2. Named Arguments

Note that this guide assumes your app is on version 4.x of Ember. If you are on an older
version, please choose it from the dropdown in the sidebar.
## Angle Bracket Syntax

When you are using a component in a template, you can invoke it using Angle Brackets (`<...>`) instead of curly braces (`{{...}}`).
The component itself will work the same as it did before.

```handlebars
{{!-- Before --}}
{{#todo-list as |item|}}
  {{to-do item=item}}
{{/todo-list}}

{{!-- After --}}
<TodoList as |item|>
  <Todo @item={{item}} />
</TodoList>
```

### Benefits of Angle Brackets

Angle Brackets have a number of benefits:

- Single word component names are completely OK in angle bracket form.

- It is clear to your collaborators you are using a component and not a helper in a template.

- Standard attribute values applied to the component are treated like _plain-old
  HTML attributes_. This means you can assign any valid HTML attribute, and it
  will be reflected onto the component directly:

```handlebars
  <Todo
    role="list-item"
    data-test-todo-item
    data-test-id={{this.todo.id}}
    class="todo {{this.todoClass}}"
  />
```

As you can see, both literal and bound values can be set on attributes, and
attributes can be used _without_ setting a value at all, just like HTML
attributes. The component you are invoking decides where to put these attributes
by using the special `...attributes` syntax. This will be discussed later in
the section on components.

For classic components, only attributes that were explicitly listed by the component
you are invoking would be placed on the component's wrapper element.

- _Arguments_ and _attributes_ are distinguished from each other when using a
  component. With curly brace style components, every value you pass to the
  component is an _argument_ - a JS value that is passed to the component class
  so it can be used in the component's template:

  ```handlebars
  {{!-- In this example, `value` is an argument --}}
  {{custom-input value=this.text}}
  ```

  With angle brackets, since you can pass standard HTML attributes to the
  component directly, we need a way to distinguish between those and the
  component's arguments. To do this, we use the `@` symbol:

  ```handlebars
  <CustomInput @value={{this.text}} />
  ```

  This allows you to see at a glance whether a value is an argument, which will
  likely affect the JS of a component, or an attribute, which will likely affect
  the HTML of a component.

### Getting used to Angle Brackets

Here are the main differences between angle bracket and curly syntax:

- The component name is in `CapitalCase` instead of `kebab-case`.
  `{{my-component}}` becomes `<MyComponent />`.

- Components open and close in the same way as HTML elements. Components that do
  not accept a block can use the self closing syntax (a trailing slash) just
  like `<img />` or other tags.

- _Arguments_ are passed by adding `@` to the front of the argument name:

  ```handlebars
    {{!-- Before --}}
    {{todo-item item=item}}

    {{!-- After --}}
    <TodoItem @item={{this.item}} />
  ```

- When you pass a bound value to a component, remember that it needs to be
  wrapped in curly braces:

  ```handlebars
    <Todo @done={{this.isDone}} />
  ```

  Like HTML, all values for attributes that are not wrapped in strings are
  coerced to strings. If you want to pass a boolean or number to a component and
  _not_ have it coerced to a string, wrap it in curly braces:

  ```handlebars
    <Todo @done={{false}} maxItems={{10}} />
  ```

- Yielded values work the same as in curly invocation:

  ```handlebars
    <TodoList as |item|>
      <Todo @item={{item}} />
    </TodoList>
  ```

- Yielded components can also be invoked with angle bracket syntax:

  ```handlebars
    <TodoList as |Item|>
      <Item />
    </TodoList>
  ```

- Positional arguments (e.g. `{{my-component this.someValue}}`) are _not_
  available in angle bracket invocation, since there is some ambiguity between
  their behavior and the behavior of standard HTML attributes (HTML attributes
  without `=` default to truthy). If you still need positional arguments, you
  _must_ use the component with curly bracket syntax.

  If you are updating a classic component to use angle bracket syntax, you can
  also overwrite the parameter array with a named argument instead. For
  instance, if `my-greeting` had the following implementation:

  ```javascript {data-filename="app/components/my-greeting.js"}
    import Component from '@ember/component';

    export default Component.extend({
    }).reopenClass({
      positionalParams: 'params'
    });
  ```

  To invoke it using angle bracket syntax, you would do the following:

  ```handlebars
  <MyGreeting @params={{array "Hello" "World"}}>
  ```

- You can use either angle bracket or curly brackets invocation for a given
  component within the same app, and even within the same template. This allows
  for gradual migration.

- Angle bracket syntax works for invoking components of any type, whether they
  are classic components, Glimmer components, or any other type of component.

- Curly syntax is still appropriate for some types of components! Check out
  [`ember-control-flow-component`](https://github.com/tildeio/ember-control-flow-component)
  for an alternative to Glimmer components and angle bracket syntax for such
  components.

## Named Arguments

With angle brackets, there is a new syntax for passing arguments to a component:

```handlebars {data-filename=application.hbs}
{{!-- Passing the argument to the BlogPost component --}}
<BlogPost @title="Hello, world!"/>
```

Within the component, you can now access these arguments _directly_ with the
same syntax:

```handlebars {data-filename=blog-post.hbs}
{{!-- inside the BlogPost component --}}
<h1>{{@title}}</h1>
```

Collectively, this is referred to as _named arguments_.

### Benefits of Named Arguments

Named Arguments have a number of benefits:

- When you see a named argument used in a component's template, you can tell
  immediately that it is a value that was passed to the component, without
  looking at the component's class.

- Named arguments always refer to the original value that was passed to the
  component, so you can also be sure that the value was never mutated by the
  component's class.

- Teams can gradually refactor an app to use named arguments, separately from
  upgrading to angle bracket invocation. You don't need to worry about whether
  the parent used angle brackets or curly brackets. For example, this works just
  fine:

  ```handlebars {data-filename=application.hbs}
    {{blog-post title="Hello, world!"}}
  ```

  ```handlebars {data-filename=blog-post.hbs}
    {{!-- This still works --}}
    <h1>{{@title}}</h1>
  ```

### Getting used to Named Arguments

The most important thing to know about named argument syntax is that an argument
with an `@` _always_ refers to the _original_ value that was passed when the
component was invoked. If you change that value in a classic component, it will
_not_ update:

```js {data-filename=blog-post.js}
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('title', this.title.toUpperCase());
  },
});
```

```handlebars {data-filename=blog-post.hbs}
{{!-- This is still the original title, "Hello, world!" --}}
<h1>{{@title}}</h1>

{{!-- This is the uppercased title, "HELLO, WORLD!" --}}
<h1>{{this.title}}</h1>
```

If you need to provide a default value, you'll have to do it via a getter:

```js {data-filename=blog-post.js}
import Component from '@glimmer/component';

export default class BlogPostComponent extends Component {
  get title() {
    return this.args.title || 'Untitled';
  }
}
```

```handlebars {data-filename=blog-post.hbs}
<h1>{{this.title}}</h1>
```

> Note: The above sample uses Glimmer components - we'll be covering these in
> detail later on.

Or by using a helper in the template:

```handlebars {data-filename=blog-post.hbs}
{{!-- using {{or}} from ember-truth-helpers --}}
<h1>{{or @title "Untitled"}}</h1>
```

If you find yourself forgetting to add the `@` symbol before named arguments, it
may be helpful to think of how the child template mirrors argument being passed
into a component via angle bracket invocation.
