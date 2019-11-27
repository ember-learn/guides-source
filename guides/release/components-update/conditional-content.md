You can conditionally include some content in the output of a template by using
Ember's `if` syntax in templates.

Let's take a look at two similar components representing a user's username.

```handlebars {data-filename="app/components/received-message/username.hbs"}
<h4 class="username">
  Tomster
  <span class="local-time">their local time is 4:56pm</span>
</h4>
```

```handlebars {data-filename="app/components/sent-message/username.hbs"}
<h4 class="username">Zoey</h4>
```

We can use arguments to make these two components dynamic, but the first
username has extra information in the form of the local time of the user.

Let's say we tried to create a single `address` component.

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  <span class="local-time">their local time is {{@localTime}}</span>
</h4>
```

If the `<Username>` tag doesn't specify a `@localTime` argument, we'll end up
with some extra unneeded text in the output.

What we need is a way to only include the local time text `@localTime` exists at
all. We can do this with an `if`:

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  {{#if @localTime}}
    <span class="local-time">their local time is {{@localTime}}</span>
  {{/if}}
</h4>
```

This is the syntax for conditionals in an Ember template. The `#if` means that the
part after the `{{#if ...}}` is nested inside of the conditional. Just like HTML
tags continue until closed (`<div>` continues until `</div>`), the content
nested inside an `#if` continues until `{{/if}}`.

## Inline `if`

Sometimes, you need to place conditional content inside an argument or
attribute. You can do this with _inline_ `if`. For instance, consider these two
avatar components, for received messages and for sent messages respectively:

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

The first component needs to have an `is-active` class applied to the avatar to
show the active icon. That icon could also change over time, so it probably
doesn't make sense to try to use `...attributes` to apply it. It's a part of the
_public API_ of the component, so an argument makes sense.

So, we want to add the `is-active` class if an argument, like say `@isActive`,
is passed in and is truthy.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div
    class="avatar {{if @isActive "is-active"}}"
    title="{{@title}}"
  >
    {{@initial}}
  </div>
</aside>
```

We can then use the argument to add the active state to the received message
avatar, and omit it from the sent message avatar.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar
  @title="Tomster's avatar"
  @initial="T"
  @isActive={{true}}
/>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  @title="Zoey's avatar"
  @initial="Z"
  class="current-user"
/>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          When passing literal JavaScript values to a component, we have to wrap
          the values in double curlies (like <code>{{true}}</code>). Values that
          are not wrapped in curlies are assigned as strings, matching the
          behavior of HTML attributes.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
