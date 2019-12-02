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

Since the title is just the `@username` plus some extra stuff, We can replace `@avatarTitle` by _interpolating_ the `@username` argument in a string literal passed to `<Message::Avatar>`.

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

However, to get the first initial of the string, we'll need to use JavaScript. We'll write a helper function that gives us a substring from inside a string.

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

**This is how we'll normally write helpers in Ember**.

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
  @initial={{substring @username start=0 lenght=1}}
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

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Helpers do not need to have a return value. They can return nothing and
        instead be used to call functions or update state. For instance, you
        could create a helper to send a tracking event whenever a page renders,
        or certain values on the page update. Modifiers are also useful for
        these use cases, and we'll discuss them in more depth in later chapters.</p>
        <p>Using helpers in this way is an advanced pattern, and not something
        you will need to be productive in Ember for the most part.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
