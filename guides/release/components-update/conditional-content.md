You can conditionally include some content in the output by using Ember's `if` syntax in templates.

Let's take a look at two similar components representing mailing addresses.

```handlebars {app/components/sender-address.hbs}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@department}}<br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}<br>
</address>
```

```handlebars {data-filename="app/components/receiver-address.hbs"}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

These two components are identical, but the sender has an extra argument for the department.

Let's say we tritryed to create a single `address` component.

```handlebars {data-filename="app/components/receiver-address.hbs"}
<address ...attributes>
  <strong>{{@name}}</strong><br>
  {{@department}}<br>
  {{@address}}<br>
  {{@city}}<br>
  {{@country}}
</address>
```

If the `<Address>` tag doesn't specify a `@department` argument, we'll end up with an extra `<br>` in the output.

What we need is a way to only include the `{{@department}}<br>` line if `@department` exists at all.

```handlebars {data-filename="app/components/receiver-address.hbs"}
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

This the syntax for conditionals in an Ember template. The `#if` means that the part after the `{{#if ...}}` is nested inside of the conditional. Just like HTML tags continue until closed (`<div>` continues until `</div>`), the content nested inside an `#if` continues until `{{/if}}`.
