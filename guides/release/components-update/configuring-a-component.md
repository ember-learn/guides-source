Components are much more useful when you can configure them.

We'll work with the [letter example](https://github.com/mdn/learning-area/blob/master/html/introduction-to-html/marking-up-a-letter-finished/index.html) that MDN uses to teach beginning HTML.

Let's start with two similar but not identical address components, one for the sender and one for the receiver.

```handlebars {app/components/sender-address.hbs}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br>
  Awesome Science faculty<br>
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

There's a lot in common between these components, but they're not exactly the same.

## Arguments

The biggest difference between the two components is the names and and addresses. The first thing to do is to template out those parts.

```handlebars {app/components/address.hbs}
<address>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

Once you've created this templated address component, you can include it from another component.

```handlebars {app/components/receiver-address.hbs}
<Address
  @name="Miss Eileen Dover"
  @address="4321 Cliff Top Edge"
  @city="Dover, CT9 XXX"
  @country="UK"
/>
```

The templated `Address` component expects `@name`, `@address`, `@city` and `@country`, and we pass them in. The output will look the same as the HTML that we started with.

Now let's try to use our `<Address>` component for the sender address.

```handlebars {app/components/sender-address.hbs}
<Address
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
```

We're getting somewhere, but the output isn't quite there yet.

```handlebars {data-filename="output" data-diff="-1,+2,-4,-8,-9"}
<address class="sender-column">
<address>
  <strong>Dr. Eleanor Gaye</strong><br />
  Awesome Science faculty<br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</address>
```

## Conditional Content

The sender has the department "University of Awesome" in the address, while the receiver has no department.

```handlebars {data-filename="app/components/address.hbs" data-diff="+3,+4,+5"}
<address>
  <strong>{{@name}}</strong><br>
  {{#if @department}}
    {{@department}}<br>
  {{/if}}
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

The `#if` syntax allows us to include some content in the output conditionally. If we now specify the `@department` in the `<Address>` tag, the the department will be included in the output.

```handlebars {data-filename="app/components/sender-address.hbs"}
<Address
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @department="Awesome Science faculty"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
```

The output is getting closer:

```handlebars {data-filename="output" data-diff="-1,+2,-8,-9"}
<address class="sender-column">
<address>
  <strong>Dr. Eleanor Gaye</strong><br />
  Awesome Science faculty<br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</address>
```

## Providing HTML Attributes

Another difference between our two addresses is that the `<address>` tag in the sender address has `class="sender-column"`, while the `<address>` tag in the receiver address has no attributes.

What we'd like to do is specify the attributes that should go on the `<address>` tag on the `<Address>` tag.

```handlebars {data-filename="app/components/sender-address.hbs" data-diff="+2"}
<Address
  class="sender-column"
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @department="Awesome Science faculty"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
```

In the `<Address>` template, we can use `...attributes` to specify where the attributes should go.

```handlebars {data-filename="app/components/address.hbs" data-diff="-1,+2"}
<address>
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{#if @department}}
    {{@department}}<br>
  {{/if}}
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

We're getting really close now:

```handlebars {data-filename="output" data-diff="-7,-8"}
<address class="sender-column">
  <strong>Dr. Eleanor Gaye</strong><br />
  Awesome Science faculty<br />
  University of Awesome<br />
  Bobtown, CA 99999,<br />
  USA<br />
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</address>
```

## Block Content

The sender address has some extra information that isn't present in the receiver address.

We could continue to add optional arguments, but that could become complicated. Instead, we'll just let the `<Address>` tag supply any additional content it wants, and include it at the end.

```handlebars {data-filename="app/components/sender-address.hbs" data-diff="-8,+9,+10,+11,+12"}
<Address
  class="sender-column"
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @department="Awesome Science faculty"
  @city="Bobtown, CA 99999,"
  @country="USA"
/>
>
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</Address>
```

To include this extra content, we use `{{yield}}` in our address template.

```handlebars {data-filename="app/components/address.hbs" data-diff="+9"}
<address>
  <strong>{{@name}}</strong><br>
  {{#if @department}}
    {{@department}}<br>
  {{/if}}
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
  {{yield}}
</address>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>{{yield}}</code> is named after a similar concept in scripting languages,
        including Ruby, JavaScript and Python. You don't need to understand the connection
        in order to use it, but if you're in the mood for a tangent, check out
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield">
          the yield operator in JavaScript
        </a>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## All Done

We've now created an `<Address>` component that works for both use cases.

```handlebars {data-filename="app/components/address.hbs"}
<address>
  <strong>{{@name}}</strong><br>
  {{#if @department}}
    {{@department}}<br>
  {{/if}}
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
  {{yield}}
</address>
```

The receiver address looks like this:

```handlebars {app/components/receiver-address.hbs}
<Address
  @name="Miss Eileen Dover"
  @address="4321 Cliff Top Edge"
  @city="Dover, CT9 XXX"
  @country="UK"
/>
```

And the sender address, using more of the features, looks like this:

```handlebars {data-filename="app/components/sender-address.hbs"}
<Address
  class="sender-column"
  @name="Dr. Eleanor Gaye"
  @address="University of Awesome"
  @department="Awesome Science faculty"
  @city="Bobtown, CA 99999,"
  @country="USA"
>
  <strong>Tel</strong>: 123-456-7890<br />
  <strong>Email</strong>: no_reply@example.com
</Address>
```
