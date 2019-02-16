## Angle Bracket Syntax

There are two ways to invoke a component in a template: classic invocation syntax (`{{my-component}}`), and [angle bracket invocation syntax](https://github.com/emberjs/rfcs/blob/master/text/0311-angle-bracket-invocation.md) (`<My Component />`).
The difference between them is syntactical.
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

As the name suggests, angle bracket invocation syntax replaces the outside curly braces `{{}}` with angle brackets `<>` and capitalizes the component name instead of having it be lowercase dash delimited.

While the Angle Bracket Syntax may remind you of HTML elements, it comes with differentiating features such as using the `@` syntax for passing in arguments which sets it apart from traditional HTML elements easily.

### When to use angle bracket invocation syntax?

The angle bracket invocation syntax is useful when you wish to pass arbitrary HTML attributes to the component.
This is possible because in angle bracket invocation syntax there is a distinction between passing a named argument and an HTML attribute,
while in classic invocation syntax everything is an argument to the component, either named or positional.

### Leverage Existing Knowledge

Since Angle Bracket notation is closely resembles the syntax for HTML elements, we enable developers to reuse their existing knowledge in creating templates for Ember components. This is especially useful for newer Ember developers as it provides syntactic sugar for creating component templates, reducing the learning curve.

You can apply regular HTML attributes like `class`, `id`, `aria-role`, etc. when you use the component.
Block form components also follow the same pattern as HTML elements where an HTML-like closing tag denotes where a component starts and ends.

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

### Positional parameters

The classic invocation syntax supports passing arguments to the component by their position.
In the following example, `"greeting"` and `"name"` are positional parameters:

```handlebars
{{my-greeting "Hello" "World"}}
```

As shown in the relevant ["Position Params"](../../components/passing-properties-to-a-component/#toc_positional-params) part of the Guides,
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

To invoke it using the angle bracket syntax, you would do the following:

```handlebars
<MyGreeting @greeting="Hello" @name="World" />
```

#### `params` array

If `my-greeting` has the following implementation:

```javascript {data-filename="app/components/my-greeting.js"}
import Component from '@ember/component';

export default Component.extend({
}).reopenClass({
  positionalParams: 'params'
});
```

```handlebars
<MyGreeting @params={{array "Hello" "World"}}>
```

### When to use classic invocation syntax?

Although Angle Bracket syntax is considered to be the best approach, classic invocation syntax is fine to keep using.
In some cases, classic invocation is still required. 
When you need direct support for positional arguments or if your components are nested within the file tree, you should still reach for those curly brackets:

```handlebars
{{some-component param1 param2}}
{{ui/foo-bar}}
```
