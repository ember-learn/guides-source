Helper functions are JavaScript functions that you can call from your template.

Ember's template syntax limits what you can express to keep the structure of your application clear at a glance. When you need to compute something using JavaScript, you can use helper functions.

For instance, let's take a look at a generic message component from a messaging app.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

```handlebars
<Message
  @username="Tomster"
  @userIsActive={{true}}
  @userLocalTime="4:56pm"

  @avatarTitle="Tomster's avatar"
  @avatarInitial="T"
>
  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</Message>
```

By looking at how we use the `<Message>` component, we can see that some of the arguments are fairly repetitive. Both `@avatarTitle` and `@avatarInitial` are based on the user's `@username`, but the title has more text, and the initial is only the first letter of the name. We'd rather just pass a username to the `<Message>` component and _compute_ the value of the title and initial.

Let's update the component to do that. It'll take a `@username` argument and calculate the title and initial.

Since the title is just the `@username` plus some extra stuff, we can replace `@avatarTitle` by _interpolating_ the `@username` argument in a string literal passed to `<Message::Avatar>`.

```handlebars {data-filename="app/components/message.hbs" data-diff="-2,+3"}
<Message::Avatar
  @title={{@avatarTitle}}
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

However, to get the first initial of the string, we'll need to use JavaScript. To do that, we'll write a helper function.

## Writing a Helper Function

We define helper functions in the `app/helpers` folder.

In this case we want a helper function that takes three arguments: a string, a starting position, and a length. The function will return a substring of the original string.

To implement the helper, we write a JavaScript function that takes its arguments as an _array_. This is because helpers can also receive _named_
arguments, which we'll discuss next.

```js {data-filename="app/helpers/substring.js"}
import { helper } from "@ember/component/helper";

function substring(args) {
  let [string, start, length] = args;
  return string.substr(start, length);
}

export default helper(substring);
```

We can tighten up the implementation by moving the [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) into the function's signature.

```js {data-filename="app/helpers/substring.js" data-diff="+3,-4,-5"}
import { helper } from "@ember/component/helper";

function substring([string, start, length]) {
function substring(args) {
  let [string, start, length] = args;
  return string.substr(start, length);
}

export default helper(substring);
```

**This is how we normally write helpers in Ember**.

We can then use this helper in the component's template to get the first letter of the username.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarTitle}}
  @initial={{substring @username 0 1}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

### Named Arguments

The syntax `{{substring @username 0 1}}` is a little hard to read. We see some numbers at the end but can't tell what exactly they mean. We can use _named arguments_ to make the `substring` helper easier to read.

Using named arguments, we could make our template a lot clearer.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4,+5"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{substring @username 0 1}}
  {{! This won't work yet! We need to update the substring helper }}
  @initial={{substring @username start=0 length=1}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

In addition to taking _positional arguments_ as an array, helpers take _named arguments_ as a JavaScript object. Here's what that looks like using [destructuring syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_function_parameter).

```js {data-filename="app/helpers/substring.js"}
import { helper } from "@ember/component/helper";

function substring([string], { start, length }) {
  return string.substr(start || 0, length);
}

export default helper(substring);
```

You can mix positional and named arguments to make your templates easy to read.

### Nested Helpers

Sometimes, you might see helpers invoked by placing them inside parentheses,
`()`. This means that a Helper is being used inside of another Helper or
Component. This is referred to as a "nested" Helper Invocation. Parentheses must
be used because curly braces `{{}}` cannot be nested.

```handlebars {data-filename=app/templates/application.hbs}
{{sum (multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing
the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can
be used anywhere a normal value can be used.

Many of Ember's built-in helpers (as well as your custom helpers) can be used in
nested form.

## Advanced: Class Helpers

Helpers can also be defined using class syntax. For instance, we could define
the substring helper using classes instead.

```js {data-filename="app/helpers/substring.js" data-diff="-1,+2,-4,+5,+6,+8"}
import { helper } from "@ember/component/helper";
import Helper from "@ember/component/helper";

function substring([string], { start, length }) {
export default class Substring extends Helper {
  compute([string], { start, length }) {
    return string.substr(start || 0, length);
  }
}
```

Class helpers are useful when the helper logic is fairly complicated, requires
fine-grained control of the helper lifecycle, or is _stateful_ (we'll be
discussing state in the next chapter).

## Built-in Helpers

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

We mentioned above that helpers can be nested. This can be
combined with different dynamic helpers. For example, the
[`{{concat}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
helper makes it easy to dynamically send a number of parameters to a component
or helper as a single parameter in the format of a concatenated string.

```handlebars
{{get this.foo (concat "item" this.index)}}
```

This will display the result of `this.foo.item1` when index is 1, and
`this.foo.item2` when index is 2, etc.

### The `let` helper

Now let's say your template is starting to get a bit cluttered and you want
to clean up the logic in your templates. This can be achieved with the `let`
block helper.
The [`{{let}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/let?anchor=let)
helper lets you create new bindings (or temporary variables) in your template.

Say your template now looks like this:

```handlebars
Welcome back {{concat (capitalize this.person.firstName) ' ' (capitalize this.person.lastName)}}

Account Details:
First Name: {{capitalize this.person.firstName}}
Last Name: {{capitalize this.person.lastName}}
```

As mentioned in the previous section, we use the `concat` helper to render both
`person.firstName` and `person.lastName` in one go. But we also want to make
sure that the names are capitalized. It gets a bit repetitive to keep writing
`capitalize` and honestly, we might just forget it at some point. Thankfully, we
can use the `{{let}}` helper to fix this:

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

Now, as long as your template is wrapped in the `let` helper, you can access the
capitalized first name and last name as `firstName` and `lastName` instead of
`(capitalize this.person.firstName)`.

### The `array` helper

Using the [`{{array}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/array?anchor=array) helper,
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

<!-- eof - needed for pages that end in a code block  -->
