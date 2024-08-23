Helper functions are JavaScript functions that you can call from your template.

Ember's template syntax limits what you can express to keep the structure of your application clear at a glance. When you need to compute something using JavaScript, you can use helper functions. It's possible to create your own helpers, locally or just [use the built-in ones](./#toc_built-in-helpers).

Let's take a look at a generic message component from a messaging app.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
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
  class={{if @isCurrentUser "current-user"}}
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

In this case we want a helper function that takes three arguments: a string, a starting position, and a length. The function will return a substring of the original string.

## Local Helper Functions

It's possible to use plain functions for helpers and modifiers. A plain helper function can be "local" to or defined on components and controllers.

```js {data-filename="app/components/message.js"}
import Component from '@glimmer/component';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

export default class Message extends Component {
  substring = (string, start, end) => string.substring(start, end);
}
```

We can then use this helper in the component's template to get the first letter of the username.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @initial={{this.substring @username 0 1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
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

Helpers default to using positional arguments, but sometimes it can make the corresponding syntax `{{substring @username 0 1}}` a little hard to read. We see some numbers at the end but can't tell what exactly they mean. We can use _named arguments_ to make the `substring` helper easier to read.

Using named arguments, we could make our template a lot clearer.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4,+5"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{substring @username 0 1}}
  {{! This won't work yet! We need to update the substring helper }}
  @initial={{substring @username start=0 end=1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

Helpers take _named arguments_ as a JavaScript object. All named arguments are grouped into an "options object" as the last parameter.

```js {data-filename="app/components/message.js" data-diff="-6,+7"}
import Component from '@glimmer/component';
import { setComponentTemplate } from '@ember/component';
import { hbs } from 'ember-cli-htmlbars';

export default class Message extends Component {
  substring = (string, start, end) => string.substring(start, end);
  substring = (string, options) => string.substring(options.start, options.end);
}
```

You can mix positional and named arguments to make your templates easy to read:

```handlebars {data-filename="app/components/calculator.hbs"}
{{this.calculate 1 2 op="add"}}
```

```js {data-filename="app/components/calculator.js"}
export default class Calculator extends Component {
  calculate(first, second, options) {
    // ...
  }
}
```

### Nested Helpers

Sometimes, you might see helpers invoked by placing them inside parentheses,
`()`. This means that a Helper is being used inside of another Helper or
Component. This is referred to as a "nested" Helper Invocation. Parentheses must be used because curly braces `{{}}` cannot be nested.

```handlebars {data-filename=app/templates/application.hbs}
{{this.sum (this.multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

Many of Ember's built-in helpers (as well as your custom helpers) can be used in nested form.

## Global Helper Functions

Next to local helpers, ember provides a way to use global helpers. We define global helper functions in the `app/helpers` folder. Once defined, they will be available to use directly inside all templates in your app.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Before Ember 4.5, using global helpers was the only way to define helpers.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

To implement the helper, we define and export a regular JavaScript function:

```js {data-filename="app/helpers/substring.js"}
export default function substring(string, start, end) {
  return string.substring(start, end);
}
```

We can then use this helper in the component's template to get the first letter of the username.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarInitial}}
  @initial={{substring @username 0 1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

### Named arguments

Similar to local helpers, global helpers also can mix positional and named arguments.

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4,+5"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{substring @username 0 1}}
  {{! This won't work yet! We need to update the substring helper }}
  @initial={{substring @username start=0 end=1}}
  @isActive={{@userIsActive}}
  class={{if @isCurrentUser "current-user"}}
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

```js {data-filename="app/helpers/substring.js"}
export default function substring(string, { start, end }) {
  return string.substring(start || 0, end);
}
```

### Classic Helpers

Sometimes, you may encounter helpers defined using the `helper` function:

```js {data-filename="app/helpers/substring.js"}
import { helper } from '@ember/component/helper';

function substring(positional, { start, end }) {
  const string = positional[0];
  return string.substring(start || 0, end);
}

export default helper(substring);
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Before Ember 4.5, this was the only way to define helpers.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

By wrapping the function using the `helper()` function, Ember will extract the
arguments passed from the template. It'll then call your function with an array
(positional arguments passed in the template) and an object (named arguments
passed in the template).

This style mostly exists for backwards compatibility reasons, but the other
advantage is that it makes it easier to untangle the positional and named
arguments (e.g. when your helper accept an arbitrary number of positional
arguments and optionally some named arguments). Note that, however, it also
makes it more difficult to reuse the logic of the helper function from regular
JavaScript code outside of templates. On the other hand, if you define your
helpers as plain JavaScript function, as we have been doing until now, you are
able to import and call them from any JavaScript files in your app.

### Class Helpers

Classic helpers can also be defined using class syntax. For instance, we could
define the substring helper using classes instead.

```js {data-filename="app/helpers/substring.js"}
import Helper from '@ember/component/helper';

export default class Substring extends Helper {
  compute(positional, { start, end }) {
    const string = positional[0];
    return string.substring(start || 0, end);
  }
}
```

Class helpers are useful when the helper logic is fairly complicated, requires
fine-grained control of the helper lifecycle, is _stateful_ (we'll be
discussing state in the next chapter), or requiring access to a [service](../../services/).

## Built-in Helpers

Below you will find some useful template helpers documented.
For the full list of available helpers, you can check the [template helpers API documentation](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/).

### The `get` helper

The [`{{get}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/get?anchor=get)
helper makes it easy to dynamically look up a property on an object or an element in an array. The second argument to `{{get}}` can be a string or a number, depending on the object being accessed.


To access a property on an object with a string key:

```handlebars
{{get this.someObject "object_key"}}
```

To access the first element in an array:

```handlebars
{{get this.someArray 0}}
```

To access a property on an object with a dynamic key:

```handlebars
{{get this.address this.part}}
```

If the `part` getter returns "zip", this will display the result of `this.address.zip`.
If it returns "city", you get `this.address.city`.


### The `concat` helper

We mentioned above that helpers can be nested. This can be
combined with different dynamic helpers. For example, the
[`{{concat}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/concat?anchor=concat)
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
The [`{{let}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/let?anchor=let)
helper lets you create new bindings (or temporary variables) in your template.

Say your template now looks like this:

```handlebars
Welcome back {{concat (capitalize this.person.givenName) ' ' (capitalize this.person.familyName)}}

Account Details:
Given Name: {{capitalize this.person.givenName}}
Family Name: {{capitalize this.person.familyName}}
```

As mentioned in the previous section, we use the `concat` helper to render both
`person.givenName` and `person.familyName` in one go. But we also want to make
sure that the names are capitalized. It gets a bit repetitive to keep writing
`capitalize` and honestly, we might just forget it at some point. Thankfully, we
can use the `{{let}}` helper to fix this:

```handlebars
{{#let (capitalize this.person.givenName) (capitalize this.person.familyName)
  as |givenName familyName|
}}
  Welcome back {{concat givenName ' ' familyName}}

  Account Details:
  Given Name: {{givenName}}
  Family Name: {{familyName}}
{{/let}}
```

Now, as long as your template is wrapped in the `let` helper, you can access the
capitalized given name and family name as `givenName` and `familyName` instead of
`(capitalize this.person.givenName)`.

### The `array` helper

Using the [`{{array}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/array?anchor=array) helper,
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

Using the [`{{hash}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/hash?anchor=hash)
helper, you can pass objects directly from the template as an argument to your
components.

```handlebars
<Greeting
  @person={{hash
    givenName='Jen'
    familyName='Weber'
  }}
/>
```

In the component's template, you can then use the `person` object:
```handlebars {data-filename=app/components/greeting/template.hbs}
Hello, {{@person.givenName}} {{@person.familyName}}
```

### The `in-element` helper

Using the [`{{in-element}}`](https://api.emberjs.com/ember/4.5.0/classes/Ember.Templates.helpers/methods/in-element?anchor=in-element) helper, you can render content into a DOM element that is in a _different_ part of the page. For instance, we might want
to render a modal, tooltip, or dropdown.

Suppose we want to show a dropdown menu when the user clicks on a button. The code below shows a `<button>` element, a placeholder `<div>` element, and a dropdown component. The argument `@show`, when set to `true`, will add the dropdown to the placeholder div.
```handlebars {data-filename=app/components/some-component.hbs}
  <button
    type="button"
    {{on "click" this.onClickShowDropdown}}
  >
    More Actions
  </button>
  <div id="dropdown-destination" />

  <MyDropdownComponent
    @show={{this.showDropdown}}
  />
```

When the user clicks on the button, the flag `showDropdown` will be set to `true`.
```js {data-filename=app/components/some-component.js}
  @tracked
  showDropdown = false;

  @action
  onClickShowDropdown() {
    this.showDropdown = true;
  }
```

The dropdown component uses the argument `@show` to activate the `in-element` helper. We must **provide the destination DOM element** to the helper. In other words, where should the helper render its block content?
```handlebars {data-filename=app/components/my-dropdown-component.hbs}
{{#if @show}}
  {{#in-element this.destinationElement}}
    <ul>
      <li>Archive</li>
      <li>Mark as Read</li>
      <li>Report</li>
    </ul>
  {{/in-element}}
{{/if}}
```

```js {data-filename=app/components/my-dropdown-component.js}
  get destinationElement() {
    return document.querySelector('#dropdown-destination');
  }
```

After the user clicks on the button, the final HTML result for the div will be like this:
```html
  <div id="dropdown-destination">
    <ul>
      <li>Archive</li>
      <li>Mark as Read</li>
      <li>Report</li>
    </ul>
  </div>
```

Things to note:
- The destination element needs to exist in the DOM before we use the helper. Otherwise, an error will be thrown if you are in development mode. The error is not thrown in production.
- When the destination element changes, the content defined in `in-element` will re-render completely.
- By default, the `in-element` helper replaces the destination element's existing content with the helper's block content. If you want to instead append the block content, you can pass `insertBefore=null`.
