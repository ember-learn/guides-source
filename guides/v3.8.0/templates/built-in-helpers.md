In the last section you learned how to write a helper.
A helper is usually a simple function that can be used in any template.
Ember comes with a few helpers that can make developing your templates a bit easier.
These helpers can allow you to be more dynamic in passing data to another helper or component.
For a full list of built-in Helpers, see the [Ember.Templates.helpers](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/)
API documentation.

### Using a helper to get a property dynamically

The [`{{get}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=get) helper
makes it easy to dynamically send the value of a variable to another helper or component.
This can be useful if you want to output one of several values based on the result of a computed property.

```handlebars
{{get this.address this.part}}
```

if the `part` computed property returns "zip", this will display the result of `this.address.zip`.
If it returns "city", you get `this.address.city`.

### Nesting built-in helpers

In the last section it was discussed that helpers can be nested.
This can be combined with these sorts of dynamic helpers.
For example, the [`{{concat}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
helper makes it easy to dynamically send a number of parameters to a component or helper as a single parameter in the
format of a concatenated string.

```handlebars
{{get "foo" (concat "item" this.index)}}
```

This will display the result of `this.foo.item1` when index is 1, and `this.foo.item2` when index is 2, etc.

### Built-in block helpers

Now let's say your template is starting to get a bit cluttered and you now want to clean up the logic in your templates.
This can be achieved with the `let` block helper.
The [`{{let}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/let?anchor=let) helper lets you create new bindings in your template.

Say your template now looks like this:

```handlebars
Welcome back {{concat (capitalize this.person.firstName) ' ' (capitalize this.person.lastName)}}

Account Details:
First Name: {{capitalize this.person.firstName}}
Last Name: {{capitalize this.person.lastName}}
```

As mentioned in the previous section we use the `concat` helper to render both `person.firstName` and `person.lastName` in one go.
But we also want to make sure that the names are capitalized.
It gets a bit repetitive to keep writing `capitalize` and honestly, we might just forget it at some point.
Thankfully, we can use the `{{let}}` helper to fix this:

```handlebars
{{#let (capitalize this.person.firstName) (capitalize this.person.lastName)
  as |firstName lastName|
}}
  Welcome back {{concat firstName ' ' lastName}}

  Account Details:
  First Name: {{firstName}}
  Last Name: {{lastName}}
{{/let}}
```

Now, as long as your template is wrapped in the `let` helper you can access the capitalized first name and last name as
`firstName` and `lastName` instead of `(capitalize this.person.firstName)`.

### Array helper

Using the [`{{array}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/array?anchor=array) helper,
you can pass arrays directly from the template as an argument to your components.

```handlebars
<MyComponent @people={{array
    'Tom Dade'
    'Yehuda Katz'
    this.myOtherPerson}}
 />
```

In the component's template, you can then use the `people` argument as an array:

```handlebars {data-filename=app/templates/components/my-component.hbs}
<ul>
  {{#each this.people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```
