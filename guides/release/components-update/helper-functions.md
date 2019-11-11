Helper functions are functions that you can call from your template. These can
be used to derive values or trigger function calls and callbacks.

For instance, let's take a look at a generic message component from a
messaging app.

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

We can see that when used, some of the arguments are fairly repetitive - both
`@avatarTitle` and `@avatarInitial` are based on the user's `@username`, but the
title has a more text, and the initial is only the first letter of the name.

We can update the component to calculate these values instead. For the
`@avatarTitle`, we embed the argument directly in a string within the component.

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

However, to get the first initial of the string, we'll need to use a helper
function that gives us the substring:

## Writing a Helper Function

We can define helper functions in the `app/helpers` folder. In this case we want
a helper that receives a string, a starting position, and a length, and then
returns the substring of the passed string. The implementation is pretty similar
to a standard JavaScript function, with the exception that helpers receive their
arguments as an _array_. This is because helpers can also receive _named_
arguments, which we'll discuss next.

```js {data-filename="app/helpers/substring.js"}
import { helper } from "@ember/component/helper";

function substring([string, start, length]) {
  return string.substr(start, length);
}

export default helper(substring);
```

We can then use this helper in the template to get the first letter of the
username.

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

Helpers can also receive named arguments, which can allow us to create easier to
read APIs. For instance, we could provide the `start` and `length` arguments to
`substring` as named arguments instead of positional arguments. This can also
make it easier to provide default values for arguments.

```js {data-filename="app/helpers/substring.js"}
import { helper } from "@ember/component/helper";

function substring([string], { start, length }) {
  return string.substr(start || 0, length);
}

export default helper(substring);
```

```handlebars {data-filename="app/components/message.hbs" data-diff="-3,+4"}
<Message::Avatar
  @title="{{@username}}'s avatar"
  @initial={{@avatarTitle}}
  @initial={{substring @username length=1}}
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

## Class Helpers

Helpers can also be defined using class syntax. For instance, you could define
the substring helper using classes instead.

```js {data-filename="app/helpers/substring.js"}
import Helper from "@ember/component/helper";

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
        Helpers can also return nothing, and instead be used to call functions
        or update state. For instance, you could create a helper to send a
        tracking event whenever a page renders, or certain values on the page
        update. Modifiers are alse useful for these use cases, and we'll discuss
        them in more depth in later chapters.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
