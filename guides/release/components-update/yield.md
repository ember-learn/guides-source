Component templates can leave a placeholder that users can fill with their own HTML.

To make it more concrete, let's take a look at two similar components representing mailing addresses.

```handlebars {app/components/sender-address.hbs}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br>
  University of Awesome<br>
  Bobtown, CA 99999,<br>
  USA<br>
  <strong>Tel</strong>: 123-456-7890<br>
  <strong>Email</strong>: no_reply@example.com
</address>
```

```handlebars {data-filename="app/components/receiver-address.hbs"}
<address>
  <strong>Miss Eileen Dover</strong><br>
  4321 Cliff Top Edge<br>
  Dover, CT9 XXX<br>
  UK
</address>
```

These two components look pretty similar. Most of the differences can be expressed using arguments.

```handlebars {data-filename="app/components/address.hbs"}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

That works, but there's some extra content at the bottom of the sender address. One way we could handle this problem would be to add some more conditional arguments, but that would be restrictive. What we really want is to leave a placeholder for any content supplied by the `<Address>` tag.

The way we do that in Ember is the `{{yield}}` syntax.

```handlebars {data-filename="app/components/address.hbs"}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
  {{yield}}
</address>
```

You can think of `{{yield}}` as leaving a placeholder for the content of the `<Address>` tag.

```handlebars {app/components/sender-address.hbs}
<Address
  class="sender-column"
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @city="Bobtown, CA 99999,"
  @country="USA"
>
  <strong>Tel</strong>: 123-456-7890<br>
  <strong>Email</strong>: no_reply@example.com
</Address>
```

We call the content of the `<Address>` tag "the block" and say that `{{yield}}` is "yielding to the block."

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You can think of the <code>address</code> component like a function, and the block as a <em>callback</em>
        that you're passing to the component. From this perspective, the <code>{{yield}}</code> syntax calls the
        callback.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
