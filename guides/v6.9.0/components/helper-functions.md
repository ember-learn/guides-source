Helper functions are JavaScript functions that you can call from your template.

Ember's template syntax limits what you can express to keep the structure of your application clear at a glance. When you need to compute something using JavaScript, you can use helper functions. Helper functions are just plain JavaScript, so it's possible to create your own helpers. You can define functions locally or import them like any other JavaScript code.  Ember also ships with a few [common functions](./#toc_built-in-helpers) you can import as well.

Let's take a look at a generic message component from a messaging app.

```gjs {data-filename="app/components/message.gjs"}
import MessageAvatar from 'my-app/components/message/avatar';
import MessageUsername from 'my-app/components/message/username';

<template>
  <MessageAvatar
    @title={{@avatarTitle}}
    @initial={{@avatarInitial}}
    @isActive={{@userIsActive}}
    class={{if @isCurrentUser "current-user"}}
  />
  <section>
    <MessageUsername
      @name={{@username}}
      @localTime={{@userLocalTime}}
    />

    {{yield}}
  </section>
</template>
```

```gjs
import Message from 'my-app/components/message';

<template>
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
</template>
```

By looking at how we use the `<Message>` component, we can see that some of the arguments are fairly repetitive. Both `@avatarTitle` and `@avatarInitial` are based on the user's `@username`, but the title has more text, and the initial is only the first letter of the name. We'd rather just pass a username to the `<Message>` component and _compute_ the value of the title and initial.

Let's update the component to do that. It'll take a `@username` argument and calculate the title and initial.

Since the title is just the `@username` plus some extra stuff, we can replace `@avatarTitle` by _interpolating_ the `@username` argument in a string literal passed to `<Message::Avatar>`.

```gjs {data-filename="app/components/message.gjs" data-diff="-6,+7"}
import MessageAvatar from 'my-app/components/message/avatar';
import MessageUsername from 'my-app/components/message/username';

<template>
  <MessageAvatar
    @title={{@avatarTitle}}
    @title="{{@username}}'s avatar"
    @initial={{@avatarInitial}}
    @isActive={{@userIsActive}}
    class={{if @isCurrentUser "current-user"}}
  />
  <section>
    <MessageUsername
      @name={{@username}}
      @localTime={{@userLocalTime}}
    />

    {{yield}}
  </section>
</template>
```

However, to get the first initial of the string, we'll need to use JavaScript. To do that, we'll write a helper function.

In this case we want a helper function that takes three arguments: a string, a starting position, and a length. The function will return a substring of the original string.

## Local Helper Functions

It's possible to use plain functions for helpers and modifiers. A plain helper function can be "local" to our component file.

We can then use this helper in the component's template to get the first letter of the username.

```gjs {data-filename="app/components/message.gjs" data-diff="+4,+5,+6,+7,-12,+13"}
import MessageAvatar from 'my-app/components/message/avatar';
import MessageUsername from 'my-app/components/message/username';

// Regular JavaScript function to exctract a substring
function substring(string, start, end) {
  return string.substring(start, end);
}

<template>
  <MessageAvatar
    @title="{{@username}}'s avatar"
    @initial={{@avatarInitial}}
    @initial={{substring @username 0 1}}
    @isActive={{@userIsActive}}
    class={{if @isCurrentUser "current-user"}}
  />
  <section>
    <MessageUsername
      @name={{@username}}
      @localTime={{@userLocalTime}}
    />

    {{yield}}
  </section>
</template>
```

### Named Arguments

Helpers default to using positional arguments, but sometimes it can make the corresponding syntax `{{substring @username 0 1}}` a little hard to read. We see some numbers at the end but can't tell what exactly they mean. We can use _named arguments_ to make the `substring` helper easier to read.

Using named arguments, we could make our template a lot clearer.

Helpers take _named arguments_ as a JavaScript object. All named arguments are grouped into an "options object" as the last parameter.

```gjs {data-filename="app/components/message.gjs" data-diff="-5,-6,+7,+8,-14,+15"}
import MessageAvatar from 'my-app/components/message/avatar';
import MessageUsername from 'my-app/components/message/username';

// Regular JavaScript function to exctract a substring
function substring(string, start, end) {
  return string.substring(start, end);
function substring(string, options) {
  return string.substring(options.start, options.end);
}

<template>
  <MessageAvatar
    @title="{{@username}}'s avatar"
    @initial={{substring @username 0 1}}
    @initial={{substring @username start=0 end=1}}
    @isActive={{@userIsActive}}
    class={{if @isCurrentUser "current-user"}}
  />
  <section>
    <MessageUsername
      @name={{@username}}
      @localTime={{@userLocalTime}}
    />

    {{yield}}
  </section>
</template>
```

You can mix positional and named arguments to make your templates easy to read:

```gjs {data-filename="app/components/calculator.gjs"}
function calculate(first, second, options) {
  // ...
}

<template>
  {{calculate 1 2 op="add"}}
</template>
```

### Nested Helpers

Sometimes, you might see helpers invoked by placing them inside parentheses,
`()`. This means that a Helper is being used inside of another Helper or
Component. This is referred to as a "nested" Helper Invocation. Parentheses must be used because curly braces `{{}}` cannot be nested.

```gjs {data-filename="app/templates/application.gjs"}
function sum(first, second) {
  return first + second;
}

function multiply(first, second) {
  return first * second;
}

<template>
  {{sum (multiply 2 4) 2}}
</template>
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

## Shared Helper Functions

Since helper functions are plain JavaScript functions, we can define them anywhere in our app and import them into our component files. 

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Before template tag (`.gjs`), Ember applications defined reusable helper functions in `app/helpers`. Those helpers were made globally available in any template. You may still put shared functions there, but it is no longer a requirement.
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

We can then import this helper and use it in the component's template to get the first letter of the username.

```gjs {data-filename="app/components/message.gjs" data-diff="+3,-8,+9"}
import MessageAvatar from 'my-app/components/message/avatar';
import MessageUsername from 'my-app/components/message/username';
import substring from '../helpers/substring.js';

<template>
  <MessageAvatar
    @title="{{@username}}'s avatar"
    @initial={{@avatarInitial}}
    @initial={{substring @username 0 1}}
    @isActive={{@userIsActive}}
    class={{if @isCurrentUser "current-user"}}
  />
  <section>
    <MessageUsername
      @name={{@username}}
      @localTime={{@userLocalTime}}
    />

    {{yield}}
  </section>
</template>
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

## Built-in and Common Helpers

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Unlike nearly everything else in  template tag (`.gts`) files, these helpers do not need to be explicitly imported.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Below you will find some useful template helpers documented.
For the full list of available helpers, you can check the [template helpers API](https://api.emberjs.com/ember/6.9.0/classes/Ember.Templates.helpers/) and [@ember/helpers](https://api.emberjs.com/ember/6.9.0/classes/@ember%2Fhelper) documentation.

### The `get` helper

The [`{{get}}`](https://api.emberjs.com/ember/6.9.0/classes/@ember%2Fhelper/methods/get?anchor=get)
helper makes it easy to dynamically look up a property on an object or an element in an array. The second argument to `{{get}}` can be a string or a number, depending on the object being accessed.

To access a property on an object with a string key:

```gjs
import { get } from '@ember/helper';

const someObject = { object_key: 'Value' };

<template>
  {{get someObject "object_key"}}
</template>
```

To access the first element in an array:

```gjs
import { get } from '@ember/helper';

const someArray = [ 'one', 'two' ];

<template>
  {{get someArray 0}}
</template>
```

To access a property on an object with a dynamic key:

```gjs
import { get } from '@ember/helper';

const address = { city: 'Chicago', state: 'IL', zip: '60610' };
let part = 'zip';

<template>
  {{get address part}}
</template>
```

If the `part` is "zip", this will display the result of `address.zip`.
If it's "city", you get `address.city`.

### The `concat` helper

We mentioned above that helpers can be nested. This can be
combined with different dynamic helpers. For example, the
[`{{concat}}`](https://api.emberjs.com/ember/6.9.0/classes/@ember%2Fhelper/methods/concat?anchor=concat)
helper makes it easy to dynamically send a number of parameters to a component
or helper as a single parameter in the format of a concatenated string.

```gjs
import { concat, get } from '@ember/helper';

const foo = { item1: 'One', item2: 'Two' };
let index = 1;

<template>
  {{get foo (concat "item" index)}}
</template>
```

This will display the result of `foo.item1` when index is 1, and
`foo.item2` when index is 2, etc.

### The `let` helper

Now let's say your template is starting to get a bit cluttered and you want
to clean up the logic in your templates. This can be achieved with the `let`
block helper.
The [`{{let}}`](https://api.emberjs.com/ember/6.9.0/classes/Ember.Templates.helpers/methods/let?anchor=let)
helper lets you create new bindings (or temporary variables) in your template.

Say your template now looks like this:

```gjs
import { concat } from '@ember/helper';

const capitalize = (s) => s.toUpperCase();

const person = { givenName: 'George', familyName: 'Washington' };

<template>
  Welcome back {{concat (capitalize person.givenName) ' ' (capitalize person.familyName)}}

  Account Details:
  Given Name: {{capitalize person.givenName}}
  Family Name: {{capitalize person.familyName}}
</template>
```

As mentioned in the previous section, we use the `concat` helper to render both
`person.givenName` and `person.familyName` in one go. But we also want to make
sure that the names are capitalized. It gets a bit repetitive to keep writing
`capitalize` and honestly, we might just forget it at some point. Thankfully, we
can use the `{{let}}` helper to fix this:

```gjs
import { concat } from '@ember/helper';

const capitalize = (s) => s.toUpperCase();

const person = { givenName: 'George', familyName: 'Washington' };

<template>
  {{#let (capitalize person.givenName) (capitalize person.familyName)
    as |givenName familyName|
  }}
    Welcome back {{concat givenName ' ' familyName}}

    Account Details:
    Given Name: {{givenName}}
    Family Name: {{familyName}}
  {{/let}}
</template>
```

Now, as long as your template is wrapped in the `let` helper, you can access the
capitalized given name and family name as `givenName` and `familyName` instead of
`(capitalize this.person.givenName)`.

### The `array` helper

Using the [`{{array}}`](https://api.emberjs.com/ember/6.9.0/classes/@ember%2Fhelper/methods/concat?anchor=array) helper,
you can pass arrays directly from the template as an argument to your components.

```gjs
import { array } from '@ember/helper';
import MyComponent from 'my-app/components/my-component';

const myOtherPerson = 'George Washington';

<template>
  <MyComponent
    @people={{array
      'Tom Dale'
      'Yehuda Katz'
      myOtherPerson
    }}
  />
</template>
```

In the component's template, you can then use the `people` argument as an array:

```gjs {data-filename="app/components/my-component.gjs"}
<template>
  <ul>
    {{#each @people as |person|}}
      <li>{{person}}</li>
    {{/each}}
  </ul>
</template>
```

### The `hash` helper

Using the [`{{hash}}`](https://api.emberjs.com/ember/6.9.0/classes/@ember%2Fhelper/methods/hash?anchor=hash)
helper, you can pass objects directly from the template as an argument to your
components.

```gjs
import { hash } from '@ember/helper';
import Greeting from 'my-app/components/greeting';

<template>
  <Greeting
    @person={{hash
      givenName='Jen'
      familyName='Weber'
    }}
  />
</template>
```

In the component's template, you can then use the `person` object:

```gjs {data-filename="app/components/greeting.gjs"}
<template>
  Hello, {{@person.givenName}} {{@person.familyName}}
</template>
```

### The `in-element` helper

Using the [`{{in-element}}`](https://api.emberjs.com/ember/6.9.0/classes/Ember.Templates.helpers/methods/in-element?anchor=in-element) helper, you can render content into a DOM element that is in a _different_ part of the page.

Suppose we want to change the footer text of the page when a component is shown. In this example, the footer has static markup like this:

```html
<footer>
  Original text
</footer>
```

We can use `in-element` to target the footer even though our component is nowhere near the footer.

```gjs {data-filename="app/components/footer-changer.gjs"}
const destinationElement = document.querySelector('footer');

<template>
  {{#in-element destinationElement}}
    Updated text
  {{/in-element}}
</template>
```

This completely replaces the contents of the `<footer>` with whatever is in the body of the `in-element` block.

Things to note:

- The destination element needs to exist in the DOM before we use the helper. Otherwise, an error will be thrown if you are in development mode. The error is not thrown in production.
- When the destination element changes, the content defined in `in-element` will re-render completely.
- By default, the `in-element` helper replaces the destination element's existing content with the helper's block content. If you want to instead append the block content, you can pass `insertBefore=null`.
