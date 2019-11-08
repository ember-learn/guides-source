If you want to _reuse_ a component in multiple places, you'll need a way to template out parts of it.

Let's start with two similar but not identical mailing address components, one for a letter's sender and one for its receiver.

```handlebars {app/components/sender-address.hbs}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br>
  University of Awesome<br>
  Bobtown, CA 99999,<br>
  USA<br>
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

The _structure_ of these components is identical, but the names and addresses are different.

## Arguments

We can create a component that can be used in both situation by _templating_ the parts of the HTML that are different.

```handlebars {app/components/address.hbs}
<address>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

The syntax `{{@name}}` means that the contents inside the `<strong>` tag is _dynamic_ and will be specified by the `<Address>` tag.

```handlebars {app/components/receiver-address.hbs}
<Address
  @name="Miss Eileen Dover"
  @address="4321 Cliff Top Edge"
  @city="Dover, CT9 XXX"
  @country="UK"
/>
```

This code includes the `<Address>` component, which expects four _arguments_: `@name`, `@address`, `@city` and `@country`.

You are probably familiar with HTML attributes, which tell the _browser_ how to draw an HTML element. The syntax `@name=` is similar, but instead of telling the _browser_ what to do, it's telling your custom tag what to do.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>You might be wondering why Ember doesn't simply use attribute syntax for the component syntax. We'll learn later that
        you can put normal HTML attributes on component tags, and they will end up on the HTML element that the component
        creates.</p>
        <p>So when you use a normal attribute name, you're putting a normal HTML attribute on an element. When you use an argument
        (which starts with <code>@</code>), you're providing data to a component</p>
        <p>This also means that arguments can pass any kind of data to the component, even though HTML attributes are always strings</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Now let's try use our `<Address>` component for the sender address.

```handlebars {app/components/sender-address.hbs}
<Address
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
```

We're really, really close.

```handlebars {data-filename="output" data-diff="-1,+2"}
<address class="sender-column">
<address>
  <strong>Dr. Eleanor Gaye</strong><br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
</address>
```

We're just missing the `sender-column` class on the HTML `<address>` element. To make that work, we'll specify the HTML attribute `class` on the `<Address>` tag.

```handlebars {app/components/sender-address.hbs}
<Address
  class="sender-column"
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
```

The `address` component also needs to specify where to put attributes that were specified on the tag.

```handlebars {app/components/address.hbs}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

The syntax `...attributes` specifies where in the template of a component attributes from the tag should go.
