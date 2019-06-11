## Templates

There are three major changes to templates in Octane compared to classic Ember:

1. [Angle Bracket Syntax](../editions/#toc_angle-bracket-syntax)
2. [Named Arguments](../editions/#toc_named-arguments)
3. [Required `this`](../editions/#toc_required-this-in-templates)

### Angle Bracket Syntax

When you are using a component in a template, you can invoke it using Angle Brackets (`<...>`) instead of curly braces (`{{...}}`).
The component itself will work the same as it did before.

```handlebars
<!-- Before -->
{{#todo-list as |item|}}
  {{to-do item=item}}
{{/todo-list}}

<!-- After -->
<TodoList as |item|>
  <Todo @item={{item}} />
</TodoList>
```
Here is what is different about using Angle Bracket syntax.

The component name is in `CapitalCase` instead of `kebab-case`. `{{to-}}` becomes `<TodoList />`.

Components open and close in the same way as HTML elements. Components that do not accept
a block can use the self closing syntax (a trailing slash) just like `<img />` or other
tags.

When you pass a bound value to a component, remember that it needs to be wrapped in curly braces:

```handlebars
  <Todo @done={{isDone}}/>
```


Like HTML, all values for attributes that are not wrapped in strings are coerced to strings.
If you want to pass a boolean or number to a component and _not_ have it coerced to a string, wrap it in curly braces:

```handlebars
  <Todo @done={{false}} maxItems={{10}} />
```


#### Benefits of Angle Brackets

Angle Brackets have a number of benefits:

- Single word component names are completely OK in angle bracket form
- It is clear to your collaborators you are using a component and not a helper in a template
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

For more information on how angle bracket syntax works see [the components guide](../../components/component-basics/).

### Named Arguments

How can you tell if a given dynamic value in a template was passed in, or if it is defined on the component itself? Arguments that were passed in should use the `@` symbol. This style is called "named arguments."

```handlebars {data-filename=application.hbs}
<!-- Passing the argument to the child template -->
<BlogPost @title="Hello, world!"/>
```

```handlebars {data-filename=blog-post.hbs}
<!-- inside the child template -->
<h1>{{@title}}</h1>
```

#### Benefits of named arguments

You can know by looking at the template whether an argument came from the same component or a parent context. You can also tell whether or not a value
was ever mutated by the component's class.

Teams can gradually refactor an app to use named arguments, separately from upgrading to angle bracket invocation. You don't need to worry about whether the parent used angle brackets or curly brackets. For example, this works just fine:

```handlebars {data-filename=application.hbs}
{{blog-post title="Hello, world!"}}
```

```handlebars {data-filename=blog-post.hbs}
<!-- This still works -->
<h1>{{@title}}</h1>
```

#### Getting used to Named Arguments

The most important thing to know about named argument syntax is that an argument with an `@`
_always_ refers to the _original_ value that was passed when the component was invoked. If you
change that value in a classic component, it will _not_ update:

```js {data-filename=blog-post.js}
import Component from '@ember/component';

export default Component.extend({
  init() {
    this.set('title', this.title.toUpperCase());
  },
});
```

```handlebars {data-filename=blog-post.hbs}
<!-- This is still the original title, "Hello, world!" -->
<h1>{{@title}}</h1>

<!-- This is the uppercased title, "HELLO, WORLD!" -->
<h1>{{this.title}}</h1>
```

If you need to provide a default value,
you'll have to do it via a getter or by using a helper in the template:

```handlebars {data-filename=blog-post.hbs}
<!-- using {{or}} from ember-truth-helpers -->
<h1>{{or @title "Untitled"}}</h1>
```

<!-- TODO show getter example -->

If you find yourself forgetting to the `@` symbol, it may be helpful to think of how the child template mirrors argument being passed into a component via angle bracket invocation.

### Required `this` in templates

Finally, one thing you may have noticed in the above examples is a lot more
references to `this` in the template.
Values that are rendered from the local context must have a `this` specified in the path.
The local context is the component or controller instance that backs the template.

```handlebars
<!-- Before -->
{{title}}

<!-- After -->
{{this.title}}
```

#### Benefits of `this` in templates

The reason for this change is to provide extra clarity to both users reading
templates, and the compiler. Without explicitly referring to `this`, a lot of
handlebars statements are pretty ambiguous - for instance, `{{title}}` could be
a helper, a local variable, or a component property.


#### Getting used to `this` in templates

You can think of `this` as meaning, an argument came from `this` component or controller, not a parent context.

Local variables,
introduced via a yield, can still be referred to directly (without `this`) since they're
unambiguous:

```handlebars
{{#let "Title" as |title|}}
  <!-- This works, because it's a local variable and unambiguous -->
  {{title}}
{{/let}}
```

If you forget to use `this` when you are supposed to, it will fall back to the context of the component or controller context that backs the template. However, the fallback behavior is deprecated and will be removed
in future major versions of Ember (4+).
