In a template, you can use `if` to conditionally render content.
There are 2 styles of `if`: **block** and **inline**.

```handlebars
{{#if this.thingIsTrue}}
  Content for the block form of "if"
{{/if}}

<div class={{if this.thingIsTrue "value-if-true" "value-if-false"}}>
  This div used the inline "if" to calculate the class to use.
</div>
```

Additionally, you can use template helpers like `concat` within a conditional. For the example below, if `@color` has a truthy value, such as `'navy'`, the div classes will include `badge-navy`:

```handlebars
<div class="badge {{if @color (concat 'badge-' @color)}}">
  Badge Text
</div>
```

## Block `if`

### Motivation

Let's take a look at two components that display a person's username.

```handlebars {data-filename="app/components/received-message/username.hbs"}
<h4 class="username">
  Tomster
  <span class="local-time">their local time is 4:56pm</span>
</h4>
```

```handlebars {data-filename="app/components/sent-message/username.hbs"}
<h4 class="username">
  Zoey
</h4>
```

The components look similar, don't they?
The first component shows extra information about the user's local time.

Let's say we tried to create a single `username` component.

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  <span class="local-time">their local time is {{@localTime}}</span>
</h4>
```

If the `<Username>` tag doesn't specify a `@localTime` argument,
we will see an extra, incomplete text, `their local time is `, on the screen.

What we need is a way to display the local time if `@localTime` exists.
We can do this with an `if`.

```handlebars {data-filename="app/components/username.hbs"}
<h4 class="username">
  {{@name}}
  {{#if @localTime}}
    <span class="local-time">their local time is {{@localTime}}</span>
  {{/if}}
</h4>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          Just like in JavaScript, <code>0</code>, <code>false</code>,
          <code>null</code>, <code>undefined</code>, and
          the empty string are falsy in Ember templates.
          Unlike in JavaScript, the empty array is also considered falsy in Ember templates.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Usage

```handlebars {data-filename="app/components/my-component.hbs"}
{{#if condition}}
  {{!-- some content --}}
{{/if}}
```

This is the syntax for an `if` statement in block form.
If the `condition` is true, Ember will render the content that is inside the block.

Like many programming languages, Ember also allows you to write `if else` and
`if else if` statements in a template.

```handlebars {data-filename="app/components/my-component.hbs"}
{{#if condition}}
  {{!-- some content --}}
{{else}}
  {{!-- some other content --}}
{{/if}}

{{#if condition1}}
  ...
{{else if condition2}}
  ...
{{else if condition3}}
  ...
{{else}}
  ...
{{/if}}
```


## Inline `if`

### Motivation

Sometimes, you will want to conditionally set an argument or attribute.

For instance, consider two components that display a user's avatar.
One is for a recipient and the other for a sender.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div
    class="avatar is-active"
    title="Tomster's avatar"
  >
    T
  </div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div
    class="avatar"
    title="Zoey's avatar"
  >
    Z
  </div>
</aside>
```

Again, the two components look similar.
The first component has an `is-active` class, while the second a `current-user` class.
How should we unify the components into one?

The `is-active` class is responsible for showing the active icon.
_How_ that icon is rendered may change over time,
so we won't use `...attributes` to apply the `is-active` class.
Instead, we'll pass the argument `@isActive` to dictate _what_ to do (e.g. render the icon).

As for the `current-user` class, it may have been just one of a few classes
that can be applied to the `<aside>` element.
Let's use `...attributes` to apply the `current-user` class.

We take these API designs into account and end up with a reusable component.
The component uses an inline `if` to conditionally apply the `is-active` class.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div
    class="avatar {{if @isActive "is-active"}}"
    title={{@title}}
  >
    {{@initial}}
  </div>
</aside>
```

Afterwards, we can refactor the initial components.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar
  @isActive={{true}}
  @title="Tomster's avatar"
  @initial="T"
/>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  class="current-user"
  @title="Zoey's avatar"
  @initial="Z"
/>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          When passing a literal JavaScript value to a component,
          we have to wrap the value in double curlies (e.g. <code>@isActive={{true}}</code>).
          A value that isn't wrapped in curlies is assigned as string,
          which matches the behavior in HTML attributes.
          For example, writing <code>@isActive=true</code> will set <code>@isActive</code> to the string <code>'true'</code>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Usage

```handlebars {data-filename="app/components/my-component.hbs"}
{{if condition value}}
```

This is the syntax for an `if` statement in inline form.
If the `condition` is true, Ember will use `value` at the invocation site.

Ember also allows you to write an `if else` statement in inline form.
It looks similar to a ternary operator.

```handlebars {data-filename="app/components/my-component.hbs"}
{{if condition value1 value2}}
```


## Learn More

Please see the [API documentation of the `if` helper](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.helpers/methods/if?anchor=if) for more patterns.
