## Angle Bracket Syntax

The [Angle Bracket Syntax](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md) is an alternative style of invoking components in templates. The difference between the Angle Bracket Syntax and the Classic Invocation Syntax is purely syntactical and does not affect the semantics of invoking a component.

**Classical Invocation Syntax:**
```handlebars
{{site-header user=this.user class=(if this.user.isAdmin "admin")}}
```

**Angle Bracket Syntax:**
```handlebars
<SiteHeader @user={{this.user}} @class={{if this.user.isAdmin "admin"}} />
```

Consider the example above, the `site-header` component is represented in both the Classical Invocation and Angle Bracket syntax to illustrate the differences between them.

As the syntax name suggests, the Angle Bracket Syntax replaces the outside curly braces `{{}}` with angle brackets `<>` and capitalizes the component name instead of having it be lowercase dash delimited.

While the Angle Bracket Syntax may remind you of HTML elements, it comes with differentiating features such as using the `@` syntax for passing in arguments which sets it apart from traditional HTML elements easily.

### Why Use the Angle Bracket Syntax?

The main motivation for using the Angle Bracket Syntax is for clarity.

Having a dedicated syntax for distinguishing between UI components enables developers to identify each piece of information. With the Angle Bracket Syntax, it is easier to tell apart helpers and components from variables, or see where the variables are defined.

For example, `{{display-button}}` looks a lot like `{{displayButton}}`, but one is a component and one is a variable! The Angle Bracket Syntax would eliminate this confusion by clearly defining components with angle brackets `<>`.

You could also never know whether an attribute was local to the component or passed in from a parent. Now, all these things are clear since parent variables are passed down and accessed using the `{{@name}}` syntax whereas local variables are accessed using the `{{this.name}}` syntax.

### Leverage Existing Knowledge

Since Angle Bracket notation is closely resembles the syntax for HTML elements, we enable developers to reuse their existing knowledge in creating templates for Ember components. This is especially useful for newer Ember developers as it provides syntactic sugar for creating component templates, reducing the learning curve.

You can apply regular HTML attributes like `class`, `id`, `aria-role`, etc. when you use the component. Block form components also follow the same pattern as HTML elements where an HTML-like closing tag denotes where a component starts and ends.

**Classical Invocation Syntax:**
```handlebars
{{#super-select selected=this.user.country as |s|}}
  {{#each this.availableCountries as |country|}}
    {{#s.option value=country}}{{country.name}}{{/s.option}}
  {{/each}}
{{/super-select}}
```

**Angle Bracket Syntax:**
```handlebars
<SuperSelect @selected={{this.user.country}} as |s|>
  {{#each this.availableCountries as |country|}}
    <s.option @value={{country}}>{{country.name}}</s.option>
  {{/each}}
</SuperSelect>
```

### Determining the Argument Scope

The fundamental change is that the scope of arguments passed in and properties local to the component are no longer mashed together. There is a clear boundary between arguments passed down from the parent and arguments that is tracked in the local component.

```handlebars
{{@name}} {{!-- this is the arg passed down from the parent --}}
{{this.name}} {{!-- this is the property that is tracked in the local component js --}}
```

Variables passed into a component have an `@` before them, also known as [named arguments](https://github.com/emberjs/rfcs/blob/master/text/0276-named-args.md). While variables created by the current component will have `this` in front of it.

### Limitations

- Positional arguments like `{{foo-bar "first" "second"}}` cannot be used with Angle Brackets.
- Angle Bracket syntax requires using the `@myvariablename` notation when passing a variable into a component, with the variable name being lowercase
- User defined components must be capitalized such as `<FooBar></FooBar>` or `<FooBar />`

### What is happening with the Classical Invocation Syntax?

The Classical Invocation Syntax – which uses “curlies” `{{}}` instead of angle brackets `<>` – is here to stay, the ability to accept positional arguments and "else" blocks makes them ideal for control-flow like components such as `{{liquid-if}}`.
