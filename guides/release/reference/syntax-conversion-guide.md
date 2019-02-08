## Angle Bracket Syntax

The [angle bracket invocation syntax (ABIS)](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md) is an alternative style of invoking components in templates.
The difference between ABIS and classic invocation syntax (CIS) is syntactical and does not affect the semantics of invoking a component.
Classic invocation syntax may also be referred to as curly invocation syntax.

**Classic invocation syntax:**
```handlebars
{{site-header user=this.user class=(if this.user.isAdmin "admin")}}
```

**Angle bracket invocation syntax:**
```handlebars
<SiteHeader @user={{this.user}} @class={{if this.user.isAdmin "admin"}} />
```

Consider the example above.
The `site-header` component is represented in both invocation syntaxes to illustrate the differences between the two.

As the name suggests, ABIS replaces the outside curly braces `{{}}` with angle brackets `<>` and capitalizes the component name instead of having it be lowercase dash delimited.

While the Angle Bracket Syntax may remind you of HTML elements, it comes with differentiating features such as using the `@` syntax for passing in arguments which sets it apart from traditional HTML elements easily.

### When to use angle bracket invocation syntax?

The main motivation for using the Angle Bracket Syntax is for clarity.

Having a dedicated syntax for distinguishing between UI components enables developers to identify each piece of information. With the Angle Bracket Syntax, it is easier to tell apart helpers and components from variables, or see where the variables are defined.

For example, `{{display-button}}` looks a lot like `{{displayButton}}`, but one is a component and one is a variable! The Angle Bracket Syntax would eliminate this confusion by clearly defining components with angle brackets `<>`.

You could also never know whether an attribute was local to the component or passed in from a parent. Now, all these things are clear since parent variables are passed down and accessed using the `{{@name}}` syntax whereas local variables are accessed using the `{{this.name}}` syntax.

### Leverage Existing Knowledge

Since Angle Bracket notation is closely resembles the syntax for HTML elements, we enable developers to reuse their existing knowledge in creating templates for Ember components. This is especially useful for newer Ember developers as it provides syntactic sugar for creating component templates, reducing the learning curve.

You can apply regular HTML attributes like `class`, `id`, `aria-role`, etc. when you use the component. Block form components also follow the same pattern as HTML elements where an HTML-like closing tag denotes where a component starts and ends.

**Classic invocation syntax:**
```handlebars
{{#super-select selected=this.user.country as |s|}}
  {{#each this.availableCountries as |country|}}
    {{#s.option value=country}}{{country.name}}{{/s.option}}
  {{/each}}
{{/super-select}}
```

**Angle bracket invocation syntax:**
```handlebars
<SuperSelect @selected={{this.user.country}} as |s|>
  {{#each this.availableCountries as |country|}}
    <s.option @value={{country}}>{{country.name}}</s.option>
  {{/each}}
</SuperSelect>
```



```handlebars
```




### What is happening with the Classic Invocation Syntax?

Classic invocation syntax—which uses “curlies” `{{}}` instead of angle brackets `<>`–is here to stay.
The ability to accept positional arguments and "else" blocks makes them ideal for control-flow like components such as `{{liquid-if}}`.
