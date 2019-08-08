## Angle Bracket Syntax

There are two ways to invoke a component in a template: curly braces invocation syntax (`{{my-component}}`), and [angle bracket invocation syntax](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md) (`<MyComponent />`).
The difference between them is syntactical.

**Curly braces invocation syntax:**
```handlebars
{{site-header user=this.user class=(if this.user.isAdmin "admin")}}
```

**Angle bracket invocation syntax:**
```handlebars
<SiteHeader @user={{this.user}} @class={{if this.user.isAdmin "admin"}} />
```

Consider the example above.
The `site-header` component is represented in both invocation syntaxes to illustrate the differences between the two.

As the name suggests, angle bracket invocation syntax replaces the outside curly braces `{{}}` with angle brackets `<>` and capitalizes the component name instead of having it be lowercase dash-delimited.

While the angle bracket syntax may remind you of HTML elements, it comes with differentiating features such as the `@` syntax for passing in arguments that sets it apart from traditional HTML elements.

### When to use angle bracket invocation syntax?

The angle bracket invocation syntax is useful when you wish to pass arbitrary HTML attributes to the component.
This is possible because in angle bracket invocation syntax there is a distinction between passing a named argument and an HTML attribute,
while in curly braces invocation syntax everything is an argument to the component, either named or positional.

### Leverage Existing Knowledge

Since Angle Bracket notation is closely resembles the syntax for HTML elements, we enable developers to reuse their existing knowledge in creating templates for Ember components. This is especially useful for newer Ember developers as it provides syntactic sugar for creating component templates, reducing the learning curve.

You can apply regular HTML attributes like `class`, `id`, `aria-role`, etc. when you use the component.
Block form components also follow the same pattern as HTML elements where an HTML-like closing tag denotes where a component ends.

**Curly invocation syntax:**
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

### Positional parameters

The curly braces invocation syntax supports passing arguments to the component by their position.
In the following example, `"Hello"` and `"World"` are positional parameters:

```handlebars
{{my-greeting "Hello" "World"}}
```

As shown in the relevant ["Positional Params"](../../components/arguments-and-attributes/#toc_positional-params) part of the Guides,
there are two ways to handle them inside the component.
One way is to individually specify what component property the positional parameter should map to.
The other way is to map all positional parameters to the `params` property and refer to them by their index.

#### Individual names

If `my-greeting` had the following implementation:

```javascript {data-filename="app/components/my-greeting.js"}
import Component from '@ember/component';

export default Component.extend({
}).reopenClass({
  positionalParams: ['greeting', 'name']
});
```

To invoke it using angle bracket syntax, you would do the following:

```handlebars
<MyGreeting @greeting="Hello" @name="World" />
```

#### `params` array

If `my-greeting` had the following implementation:

```javascript {data-filename="app/components/my-greeting.js"}
import Component from '@ember/component';

export default Component.extend({
}).reopenClass({
  positionalParams: 'params'
});
```

To invoke it using angle bracket syntax, you would do the following:

```handlebars
<MyGreeting @params={{array "Hello" "World"}}>
```

### Are curly braces gone completely?

In some cases, classic invocation is still required.

For example, when direct support for positional arguments is required, curly braces are still appropriate:

```handlebars
{{some-component param1 param2}}
{{ui/foo-bar}}
```
