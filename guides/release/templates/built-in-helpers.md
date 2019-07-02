A helper is usually a
simple function that can be used in any template. Ember comes with a few helpers
that can make developing your templates a bit easier. These helpers can allow
you to be more dynamic in passing data to another helper or component.

For a full list of built-in Helpers, see the
[helpers](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/)
API documentation.

## Useful Built-In Helpers

### The `get` helper

The [`{{get}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get)
helper makes it easy to dynamically send the value of a variable to another
helper or component. This can be useful if you want to output one of several
values based on the result of a getter.

```handlebars
{{get this.address this.part}}
```

If the `part` getter returns "zip", this will display the result of `this.address.zip`.
If it returns "city", you get `this.address.city`.

### The `concat` helper

In the last section it was discussed that helpers can be nested. This can be
combined with these sorts of dynamic helpers. For example, the
[`{{concat}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
helper makes it easy to dynamically send a number of parameters to a component
or helper as a single parameter in the format of a concatenated string.

```handlebars
{{get this.foo (concat "item" this.index)}}
```

This will display the result of `this.foo.item1` when index is 1, and
`this.foo.item2` when index is 2, etc.

### The `let` helper

Now let's say your template is starting to get a bit cluttered and you now want
to clean up the logic in your templates. This can be achieved with the `let`
block helper.
The [`{{let}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/let?anchor=let)
helper lets you create new bindings in your template.

Say your template now looks like this:

```handlebars
Welcome back {{concat this.person.firstName ' ' this.person.lastName}}

Account Details:
First Name: {{this.person.firstName}}
Last Name: {{this.person.lastName}}
```

As mentioned in the previous section we use the `concat` helper to render both
`person.firstName` and `person.lastName` in one go. But we also want to make
sure that the names are capitalized. It gets a bit repetitive to keep writing
`capitalize` and honestly, we might just forget it at some point. Thankfully, we
can use the `{{let}}` helper to fix this:

```handlebars
{{#let (concat this.person.firstName this.person.lastName)
  as |fullName|
}}
  Welcome back {{fullName}}

  Account Details:
  First Name: {{this.person.firstName}}
  Last Name: {{this.person.lastName}}
{{/let}}
```

Now, as long as your template is wrapped in the `let` helper you can access the
capitalized first name and last name as `firstName` and `lastName` instead of
`(capitalize this.person.firstName)`.

### The `array` helper

Using the [`{{array}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/array?anchor=array) helper,
you can pass arrays directly from the template as an argument to your components.

```handlebars
<MyComponent 
  @people={{array
    'Tom Dale'
    'Yehuda Katz'
    this.myOtherPerson
  }}
/>
```

In the component's template, you can then use the `people` argument as an array:

```handlebars {data-filename=app/components/my-component/template.hbs}
<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

### The `hash` helper

Using the [`{{hash}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/array?anchor=hash)
helper, you can pass objects directly from the template as an argument to your
components.

```handlebars
<Greeting
  @person={{hash
    firstName='Jen'
    lastName='Weber'
  }}
/>
```

In the component's template, you can then use the `person` object:

```handlebars {data-filename=app/components/greeting/template.hbs}
Hello, {{@person.firstName}} {{@person.lastName}}
```

## Development Helpers

Ember comes with a few helpers that can make developing your
templates a bit easier. These helpers make it simple to output variables into
your browser's console, or activate the debugger from your templates.

### Logging

The [`{{log}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=log) helper makes it easy to output variables or expressions in
the
current rendering context into your browser's console:

```handlebars
{{log 'Name is:' this.name}}
```

The `{{log}}` helper also accepts primitive types such as strings or numbers.

### Adding a breakpoint

The [`{{debugger}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/if?anchor=debugger) helper provides a handlebars equivalent to JavaScript's
`debugger` keyword. It will halt execution inside the debugger helper and give
you the ability to inspect the current rendering context:

```handlebars
{{debugger}}
```

When using the debugger helper you will have access to a `get` function. This
function retrieves values available in the context of the template.
For example, if you're wondering why a value `{{foo}}` isn't rendering as
expected within a template, you could place a `{{debugger}}` statement and,
when the `debugger;` breakpoint is hit, you can attempt to retrieve this value:

```javascript
> get('foo')
```

`get` is also aware of keywords. So in this situation:

```handlebars
{{#each this.items as |item|}}
  {{debugger}}
{{/each}}
```

You'll be able to get the value of the current item:

```javascript
> get('item.name')
```

You can also access the context of the view to make sure it is the object that
you expect:

```javascript
> context
```
