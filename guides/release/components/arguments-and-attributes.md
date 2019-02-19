_Arguments_ and _attributes_ are the two kinds of things that you can pass to a
component when you use it in a template. Arguments are values that are prefixed
with the `@` symbol, and attributes are values that are not:

```handlebars
<Tooltip @content="Required Value" class="error"/>
```

In this example, we're passing the `@content` argument and the `class` attribute
to an instance of the `Tooltip` component.

Arguments are _JavaScript values_, which are accessible in both the component
template and its class instance, if a class exists. All kinds of values can be
passed as arguments to a component, and can be consumed and used with JavaScript
code.

Attributes, by contrast, are specifically _HTML attributes_, such as `class`,
`id`, `data-test`, and `role`. These get reflected directly onto HTML elements,
and are not accessible directly in either the template of a component, or its
class. Instead, components can direct where they are applied with the
`...attributes` syntax.

## Arguments

Arguments are values that you pass down to your component, and that can be
accessed in the template with the `@` symbol. If we define a `Tooltip`
component, we can pass a `@content` argument to it like so:

```handlebars
<Tooltip @content="Required Value" />
```

And then we can access it in the template for the `Tooltip` component like this:

```handlebars {data-filename=src/ui/components/tooltip/template.hbs}
{{@content}}
```

The same symbol `@` is used on both sides, so its easy to remember that this is
an argument coming from the caller whenever you're looking at the template. In
the component class you can access the arguments on the `args` property of the
class, since `@` is special character in JavaScript reserved for decorators:

```js {data-filename=src/ui/components/tooltip/component.js}
export default class Tooltip extends Component {
  get upperCased() {
    return this.args.content.toUpperCase();
  }
}
```

In templates arguments are valid identifiers that can be used anywhere a
standard identifier can:

```handlebars
{{!-- in a helper --}}
{{capitalize @content}}

{{!-- in an attribute --}}
<div class="{{@class}}"></div>

{{!-- as an argument --}}
<Icon @type={{@iconType}} />
```

You can pass strings as arguments to components, or you can pass literal values
using double curlies:

```handlebars
<Tooltip
  @icon="warning"
  @count={{4}}
  @isError={{false}}
/>
```

Note that if you do _not_ wrap literal values in double curlies, they are
treated as strings, like standard HTML attributes:

```handlebars
<Tooltip @isError=false />

{{!-- is equivalent to... --}}
<Tooltip @isError="false" />
```

You can also pass a class property, or the result of a helper, through
arguments:

```handlebars
<Tooltip
  @icon={{this.icon}}
  @isError={{not this.isWarning}}
/>
```

In short, arguments are how you pass _JavaScript values_ into a component. This
is part of why they are named _arguments_ - if you think of using a component
like calling a _function_, whose result is a new component that produces some
HTML, then arguments to a component are the same as arguments to a function.
They're values that you pass to the component that the component then uses to
produce a result (the final HTML).

### Argument Defaults

At some point, you may want to add default values to your arguments if one
wasn't passed to your component. Arguments are not mutable, so if you attempt to
reassign a value on `this.args`, it'll fail. Instead, you should define a getter
on your component that provides the default value if the argument was not
provided.

For instance, if you wanted to create a tooltip icon that had a standard icon
and class, you could do it like so:

```javascript {data-filename=src/ui/components/tooltip/component.js}
import Component from '@glimmer/component';

export default class Tooltip extends Component {
  get icon() {
    return this.args.icon || 'icon-info';
  }

  get tooltipClass() {
    return this.args.tooltipClass + ' tooltip';
  }
}
```

```handlebars {data-filename=src/ui/components/tooltip/template.hbs}
<div class="{{this.tooltipClass}}">
  <i class="{{this.icon}}"></i>
  {{@content}}
</div>
```

Now when called like so:

```handlebars
<Tooltip @content="I'm a tooltip!"/>
```

The result will be:

```html
<div class="tooltip">
  <i class="icon-info"></i>
  I'm a tooltip!
</div>
```

Note that because arguments are prefixed with `@` in templates, and placed on
`args` in the component definition, we can use the same name for our `icon` and
`tooltipClass` getters, which is pretty convenient. We can also tell clearly
when we look at the template for the tooltip that `this.tooltipClass` and
`this.icon` are values that come from the class definition, and that means they
probably have been used in some kind of dynamic code (in this case, our
defaulting logic).

### Attributes

While arguments are a way for you to pass JavaScript values into your
components, _attributes_ are about passing HTML attributes like `class`, `id`,
and `role` through your component, down to the final elements that get rendered.
This allows you to easily customize a component without having to add a bunch of
customization logic to every single component.

For instance, in our `<Tooltip>` component from above, instead of adding the
`@tooltipClass` argument, we could use attributes:

```handlebars {data-filename=src/ui/components/tooltip/template.hbs}
<div class="tooltip" ...attributes>
  <i class="{{this.icon}}"></i>
  {{@content}}
</div>
```

We would then invoke the component like this:

```handlebars
<Tooltip
  @content="I'm a tooltip!"
  class="warning-tooltip"
/>
```

Then our result is:

```html
<div class="tooltip warning-tooltip">
  <i class="icon-info"></i>
  I'm a tooltip!
</div>
```

The `...attributes` syntax is how you specify where the attributes should be
applied. It can be applied to elements or components, and you can use it on as
many elements or components within your component as you want:

```handlebars
<BlogPostTitle @title={{title}} ...attributes/>
<BlogPostContent>
  <section ...attributes>
    <p>
      Here's some content!
    </p>
  </section>
</BlogPostContent>
```

Although typically you'll just want to put it on one of the top level components
or elements. If you don't use `...attributes` in your component and someone
tries to pass an attribute to it, Ember will do nothing, and the attributes will
not be applied.

#### Attribute Order

The positioning of `...attributes` matters, with respect to the other attributes
in the element it is applied to. Attributes that come _before_ `...attributes`
can be overriden, but attributes that come _after_ cannot:

```handlebars
<p
  data-overridable="you can override me"
  ...attributes
  data-non-overridable="but you can't override me!"
>
</p>
```

There is one exception to this, which is the `class` attribute. `class` will get
merged, since its more often the case that users of the component want to _add_
a class than completely override the existing ones. For `class`, the order of
`...attributes` will determine the order of merging. Putting it before:

```handlebars
<p ...attributes class="friend-greeting">Hello {{@friend}}, I'm {{this.name}}!</p>
```

Results in:

```html
<p class="red-alert friend-greeting">Hello {{@friend}}, I'm {{this.name}}!</p>
```

And putting it after:

```handlebars
<p class="friend-greeting" ...attributes>Hello {{@friend}}, I'm {{this.name}}!</p>
```

Results in:

```html
<p class="friend-greeting red-alert">Hello {{@friend}}, I'm {{this.name}}!</p>
```

#### Attributes and Modifiers

Modifiers are a concept that we haven't covered too deeply just yet, but they're
similar to helpers, except that they are applied directly to elements:

```handlebars
<div {{did-insert this.setupElement}}>
  ...
</div>
```

Modifiers can also be applied to components, and when they are, they are also
passed forward and applied to an element with `...attributes`:

```handlebars
<Tooltip {{did-insert this.setupTooltip}}/>
```
