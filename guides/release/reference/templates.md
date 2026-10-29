This page lists everything that you can write in an Ember template, on one page.
Use the "On this page" sidebar to jump to a topic, or search the page with <kbd>Ctrl</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>F</kbd> on a Mac) for the syntax that you want, for example `{{#each`, `(eq`, `...attributes`, or `<:header>`.

The examples use the `<template>` tag in `.gjs` and `.gts` files, and Ember 7.1 or later.
For the full explanation of a topic, follow the links to the other guides.

## Template Basics

### `<template>`

The `<template>` tag holds the template of a component in a `.gjs` or `.gts` file.
The template can use every JavaScript value that is in scope, for example an import or a `const`.
A `<template>` that you assign to a `const` is a template-only component.
A `<template>` in a class body is the template of that class.

```gjs
import { Avatar } from './avatar';

const greeting = 'Hello';

<template>
  <Avatar />

  {{greeting}}, {{@name}}!
</template>
```

Learn more: [Template Tag Format](../../components/template-tag-format/).

### `<Component />`

Write a component like an HTML element, with `<` and `>` around its name.
A component without content closes itself with `/>`.

```gjs
import { SomeComponent } from './some-component';

<template>
  <SomeComponent />

  <SomeComponent>
    Some content
  </SomeComponent>
</template>
```

### `<Nested::Component />`

A nested component is a component in a folder inside the components folder.
In a `.gjs` or `.gts` file, import the component by name from its path.

```gjs
import { SomeComponent } from './nested/some-component';

<template>
  <SomeComponent />
</template>
```

In a `.hbs` template, Ember finds components by name.
There, a component in `app/components/nested/some-component` is invoked with `::` between the folder names.

```handlebars
<Nested::SomeComponent />
```

### `@argument`

Arguments are the data that the caller passes to a component, a helper, or a modifier.
The name of a component argument starts with `@`, for the caller and inside the component.

```handlebars
<SomeComponent @someArgument={{@anArgument}} />
```

Learn more: [Component Arguments and HTML Attributes](../../components/component-arguments-and-html-attributes/).

### `class=...`

Every [HTML attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) works on elements and on components.
An attribute without `@` is an HTML attribute, not an argument.

```handlebars
<SomeComponent class="..." data-test style="..." />
<div class="...">
```

An attribute value can contain dynamic parts.

```handlebars
<div class="card {{if @isActive "active"}}" title={{@title}}></div>
```

### `...attributes`

`...attributes` applies the HTML attributes and modifiers of the caller to an element.
Arguments are not included in `...attributes`.

If this `div` is the template of `SomeComponent` above, the `class`, `data-test`, and `style` attributes go on the `div`.

```handlebars
<div ...attributes></div>
```

The position of `...attributes` controls which value wins.
Attributes after `...attributes` override the attributes of the caller.
Attributes before `...attributes` can be overridden by the caller.
For `class`, Ember joins the values.

### `this`

`this` is the instance of the class that contains the `<template>`.
A template-only component has no class, so there `this` is `undefined`.
In a route template in a `.hbs` file, `this` is the instance of the controller.

```gjs
import Component from '@glimmer/component';

export class Greeting extends Component {
  greeting = 'Hello';

  <template>
    {{this.greeting}}, {{@name}}!
  </template>
}
```

### `as |param|`

A block is a nested scope with its own local variables.
The variables are not available outside of the block.
Like in JavaScript, variables that are defined outside of the block are still available inside it.
Unlike Handlebars, there is no implicit scope.

A curly block starts with `#` and ends with `/`.

```handlebars
{{#let (array 1 2 3) as |threeItems|}}
  {{threeItems}}
{{/let}}
```

A component invocation can also have a block.
The new local variables go between the pipes of `as |...|`.

```handlebars
<MyComponent as |a b|>
  {{a}} {{b}}
</MyComponent>
```

The template of `MyComponent` must contain a `{{yield}}` for the block to render.

### `<:name>`

A named block is a block with a name.
The caller writes a named block as `<:name>...</:name>` inside the component invocation.
A component can receive many named blocks, and it decides where each block renders.
A block without a name is the block with the name `default`.

```gjs
import { Card } from './card';

<template>
  <Card>
    <:header>Ember</:header>
    <:body>A framework for ambitious web developers.</:body>
  </Card>
</template>
```

To render named blocks, see [`{{yield to="name"}}`](#toc_yield-) and [Named Blocks Pattern](#toc_named-blocks-pattern).

Learn more: [Block Content](../../components/block-content/).

### `{{!-- ... --}}`

Comments do not render in the DOM.
Use `{{!-- --}}` when the comment contains `}}`.

```handlebars
{{! A short comment }}

{{!--
  A comment that contains {{curly braces}}.
--}}

<!-- An HTML comment. It renders in the DOM. -->
```

## Template Grammar

### Grammar and S-expressions

Ember's template grammar is an intentionally simple language, so that the Glimmer VM can be fast.
It is built on [symbolic expressions (S-expressions)](https://en.wikipedia.org/wiki/S-expression), a tree structure that keeps the syntax, building, and parsing of templates simple.

In TypeScript-like pseudo-code, the template grammar is:

```typescript
type Value = string | number | null | undefined | object | Value[];
type Helper = Function | EmberHelper | EmberModifier;
type NamedArgs = Key + '=' + SExpression
type SExpression =
  | Value
  | `(` + Helper + `)`
  | `(` + Helper + ...SExpression + `)`
  | `(` + Helper + ...SExpression + ...NamedArgs + `)`

type Moustache = `{{` + SExpression + `}}`
```

A plain function works as a helper.
No addon and no wrapper are necessary, because Ember calls the function with the positional arguments.
If there are named arguments, the function receives them in one object as its last parameter.

```handlebars
<div>
    {{a b c d=e}}
{{!-- │ │ │ │ └─── value / s-expression
      │ │ │ └─── named argument key
      │ │ └─── positional argument
      │ └─── positional argument
      └─── helper --}}
</div>
```

In this example, `a` can _only_ be a helper.
Each of `b`, `c`, and `e` can only be a plain value, because a function is not called without the parentheses around it.

### Prefix notation

Unlike JavaScript, Ember templates use [Polish notation](https://en.wikipedia.org/wiki/Polish_notation), or _prefix notation_.
The operator (or function) comes _before_ its operands (arguments).

```handlebars
{{or argA (not argB)}}

{{functionA argA argB argC=(functionB argD)}}
```

This is the same as this JavaScript:

```js
argA || !argB;

functionA(argA, argB, { argC: functionB(argD) });
```

### Position decides the type

The position of an expression in the template tells you _exactly_ what it is: a modifier, a helper, or a plain value.

```handlebars
<div {{modifierName a b=(helperName c)}}>
  {{yield to="default"}}
</div>
```

It does not matter how the reference to a modifier or a helper is written.
The _syntax_ decides what is expected.

```handlebars
<div {{this.modifierName a b=(this.helperName c)}}>
{{!--  │                 │ │  │               └─── positional argument
       │                 │ │  └─── helper
       │                 │ └─── named argument key
       │                 └─── positional argument
       └─── modifier --}}
  {{yield to="default"}}
{{!--  │  │   └─── value
       │  └─── named argument key
       └─── helper --}}
</div>

<div {{@modifierName a b=(@helperName c)}}>
{{!--  │             │ │  │           └─── positional argument
       │             │ │  └─── helper
       │             │ └─── named argument key
       │             └─── positional argument
       └─── modifier --}}
  {{yield to="default"}}
{{!--  │  │   └─── value
       │  └─── named argument key
       └─── helper --}}
</div>
```

## Control Flow

### `{{#if ...}}`

[`if`](https://api.emberjs.com/ember/release/functions/Keywords/if) renders its block when the value is truthy.
These values are falsy: `false`, `undefined`, `null`, `""`, `0`, `NaN`, and an empty array.
An empty array is falsy in templates, which is different from JavaScript.

```handlebars
{{#if this.condition}}
  ...
{{else if this.otherCondition}}
  ...
{{else}}
  ...
{{/if}}
```

Learn more: [Conditional Content](../../components/conditional-content/).

### `(if ...)`

Inline, [`if`](https://api.emberjs.com/ember/release/functions/Keywords/if) returns its second argument when the condition is truthy.
If not, it returns its third argument.

```handlebars
<div class={{if @isActive "active" "inactive"}}>
  {{if @name @name "No name"}}
</div>
```

### `{{#unless ...}}`

[`unless`](https://api.emberjs.com/ember/release/functions/Keywords/unless) renders its block when the value is falsy.
It also has an inline form and an `{{else}}` block.

```handlebars
{{#unless this.condition}}
  ...
{{else}}
  ...
{{/unless}}

{{unless @isValid "Fix the errors"}}
```

### `{{#each ...}}`

[`each`](https://api.emberjs.com/ember/release/functions/Keywords/each) renders its block one time for each item of an array, or of another collection such as a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) or a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).
The second block parameter is the index.
The `{{else}}` block renders when the list is empty.

```handlebars
{{#each this.anIterable as |item index|}}
  {{index}}: {{item}}
{{else}}
  The list is empty.
{{/each}}
```

By default, Ember identifies each item by its object identity.
When the list gets new objects for the same items, give `key` the name of a property that has a unique value.
Ember then keeps the DOM of each item.
`key="@index"` identifies each item by its position.

```handlebars
{{#each this.anIterable key="uuid" as |item|}}
  {{item.name}}
{{/each}}
```

Learn more: [Looping Through Lists](../../components/looping-through-lists/).

### `{{#each-in ...}}`

[`each-in`](https://api.emberjs.com/ember/release/functions/Keywords/each-in) renders its block one time for each key of an object or of a [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

```handlebars
{{#each-in this.anObject as |key value|}}
  {{key}}: {{value}}
{{/each-in}}
```

### `{{#let ...}}`

[`let`](https://api.emberjs.com/ember/release/functions/Keywords/let) is the only way to define variables inline in a template.
Because `let` is a block, its scope works like the scope of every other block.
This is different from JavaScript, where a variable is available in the "current scope".
With `let`, you create a new scope.

```handlebars
{{#let (array 1 2 3) as |list|}}
  {{#each list as |number|}}
    {{number}}
  {{/each}}
{{/let}}
```

In this example, `let` creates an array, and the block receives it as `list`.
You can iterate over it like over every array that is defined in JavaScript.

`let` accepts more than one value.

```handlebars
{{#let (concat @post.title " | The Ember.js Blog") @post.body as |title body|}}
  <MyPost @title={{title}} @body={{body}} />
{{/let}}
```

In a `.gjs` or `.gts` file, a JavaScript variable outside of the `<template>` is frequently simpler.

```gjs
const list = [1, 2, 3];

<template>
  {{#each list as |number|}}
    {{number}}
  {{/each}}
</template>
```

Learn more: [`let` on the Ember API docs](https://api.emberjs.com/ember/release/functions/Keywords/let).

## Blocks

### `{{yield ...}}`

[`yield`](https://api.emberjs.com/ember/release/functions/Keywords/yield) renders the block that the caller passed to the component.
Each value after `yield` becomes a block parameter.
The caller receives the block parameters between the pipes of `as |...|`.
Use `to="name"` to render a named block.

```gjs
const Article = <template>
  <article>
    {{yield @title}}
  </article>
</template>;

<template>
  <Article @title="Hello" as |title|>
    <h1>{{title}}</h1>
  </Article>
</template>
```

```handlebars
{{yield}}
{{yield to="default"}}
{{yield to="header"}}
{{yield this.isOn this.toggle}}
{{yield (hash title=@title body=@body)}}
```

Learn more: [Block Content](../../components/block-content/).

### `(has-block ...)`

[`has-block`](https://api.emberjs.com/ember/release/functions/Keywords/has-block) is `true` when the caller passed the block.
Without an argument, it checks the default block.
With a name, it checks a named block.

```handlebars
{{#if (has-block)}}
  {{yield}}
{{else}}
  Default content
{{/if}}

{{#if (has-block "header")}}
  <header>{{yield to="header"}}</header>
{{/if}}
```

### `(has-block-params ...)`

[`has-block-params`](https://api.emberjs.com/ember/release/functions/Keywords/has-block-params) is `true` when the caller wrote `as |...|` on the block.

```handlebars
{{#if (has-block-params)}}
  {{yield this.favoriteFlavor}}
{{else}}
  {{yield}}
{{/if}}
```

## Values

### `{{this.prop}}`

Use a path with dots to read a property of an argument, of `this`, or of a block parameter.
If a value in the path is missing, the result is `undefined`, and there is no error.

```handlebars
{{@argumentA}}
{{@user.address.city}}
{{this.property}}
```

### `(get ...)`

Use the [`get`](https://api.emberjs.com/ember/release/functions/@ember%2Fhelper/get) helper when the property name is a value, or when it is not a valid identifier.
`get` also reads an array item by its index.
The index can be a literal or a value.

```gjs
import { get } from '@ember/helper';

<template>
  {{get @argObject 'property-name'}}
  {{get @argObject @dynamicProperty}}

  {{get @someArray 0}}
  {{get @someArray @index}}
</template>
```

`get` treats the key as a path, so `{{get obj "a.b"}}` reads `obj.a.b`.
To read a key that contains a dot, write a plain function.

### `(array ...)`

[`array`](https://api.emberjs.com/ember/release/functions/Keywords/array) returns an array of its arguments.

```handlebars
{{#each (array "red" "green" "blue") as |color|}}
  {{color}}
{{/each}}

<ColorPicker @colors={{array "red" "green" "blue"}} />
```

`array` is an older utility.
In a `<template>` tag, use [`Array.of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of) from JavaScript instead.
`Array` is a JavaScript global, so it needs no import.

```gjs
<template>
  {{#each (Array.of "red" "green" "blue") as |color|}}
    {{color}}
  {{/each}}

  <ColorPicker @colors={{Array.of "red" "green" "blue"}} />
</template>
```

Learn more: [`array` on the Ember API docs](https://api.emberjs.com/ember/release/functions/Keywords/array).

### `(hash ...)`

[`hash`](https://api.emberjs.com/ember/release/functions/Keywords/hash) returns an object of its named arguments.
The object has no prototype, so methods such as [`toString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) are not available on it.

```handlebars
<UserCard @user={{hash givenName="Jen" familyName="Weber"}} />

{{yield (hash title=@title body=@body)}}
```

`hash` is an older utility.
In a `<template>` tag, use [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) from JavaScript instead.
A function receives the named arguments as one object, so `Object` returns that object.

```gjs
<template>
  <UserCard @user={{Object givenName="Jen" familyName="Weber"}} />

  {{yield (Object title=@title body=@body)}}
</template>
```

### `(concat ...)`

[`concat`](https://api.emberjs.com/ember/release/functions/@ember%2Fhelper/concat) joins its arguments into one string.
Inside quotes, you can also write the dynamic parts directly.

```gjs
import { concat } from '@ember/helper';

<template>
  <input class={{concat "field-" @field}} />
  <input class="field-{{@field}}" />
</template>
```

### `(uniqueId)`

[`uniqueId`](https://api.emberjs.com/ember/release/functions/@ember%2Fhelper/uniqueId) returns a new ID each time Ember calls it.
Use [`let`](https://api.emberjs.com/ember/release/functions/Keywords/let) to use the same ID two times.

```gjs
import { get, uniqueId } from '@ember/helper';

<template>
  {{#let (uniqueId) as |id|}}
    <label for={{id}}>{{get @labels @field}}</label>
    <input id={{id}} />
  {{/let}}
</template>
```

### `{{{ ... }}}`

Ember escapes every value that it renders.
To render a trusted string as HTML, mark it with [`trustHTML`](https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/trustHTML) in JavaScript.
Never do this with input from the user, because it permits cross-site scripting (XSS).

```gjs
import { trustHTML } from '@ember/template';

const bold = (text) => trustHTML(`<b>${text}</b>`);

<template>
  {{bold "Hello"}}
</template>
```

Triple curly braces also render a string as HTML, with the same risk.

```handlebars
{{{this.trustedHtml}}}
```

Learn more: [`trustHTML` on the Ember API docs](https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/trustHTML).

## Comparison and Logic

All of these helpers are built in to the `<template>` tag in Ember 7.1 and later, and need no import.

### `(eq ...)`

[`eq`](https://api.emberjs.com/ember/release/functions/Keywords/eq) is `true` when its two arguments are strictly equal (`===`).

```handlebars
{{if (eq @status "active") "Active" "Inactive"}}
```

### `(neq ...)`

[`neq`](https://api.emberjs.com/ember/release/functions/Keywords/neq) is `true` when its two arguments are strictly not equal (`!==`).

```handlebars
{{if (neq @status "active") "Not active" "Active"}}
```

### `(lt ...)`

[`lt`](https://api.emberjs.com/ember/release/functions/Keywords/lt) is `true` when the first argument is less than the second (`<`).

```handlebars
{{if (lt @stock 5) "Almost sold out"}}
```

### `(lte ...)`

[`lte`](https://api.emberjs.com/ember/release/functions/Keywords/lte) is `true` when the first argument is less than or equal to the second (`<=`).

```handlebars
{{if (lte @count 0) "None"}}
```

### `(gt ...)`

[`gt`](https://api.emberjs.com/ember/release/functions/Keywords/gt) is `true` when the first argument is greater than the second (`>`).

```handlebars
{{if (gt @count 10) "More than ten"}}
```

### `(gte ...)`

[`gte`](https://api.emberjs.com/ember/release/functions/Keywords/gte) is `true` when the first argument is greater than or equal to the second (`>=`).

```handlebars
{{if (gte @age 18) "Adult" "Minor"}}
```

### `(and ...)`

[`and`](https://api.emberjs.com/ember/release/functions/Keywords/and) returns the first falsy argument, or the last argument if all are truthy.
It uses the same truthiness as [`if`](https://api.emberjs.com/ember/release/functions/Keywords/if), so an empty array is falsy.

```handlebars
{{#if (and @isAdmin @isActive)}}
  ...
{{/if}}
```

### `(or ...)`

[`or`](https://api.emberjs.com/ember/release/functions/Keywords/or) returns the first truthy argument, or the last argument if all are falsy.
It uses the same truthiness as [`if`](https://api.emberjs.com/ember/release/functions/Keywords/if), so an empty array is falsy.

```handlebars
{{or @nickname @name "Anonymous"}}
```

### `(not ...)`

[`not`](https://api.emberjs.com/ember/release/functions/Keywords/not) returns `true` when its argument is falsy.
It uses the same truthiness as [`if`](https://api.emberjs.com/ember/release/functions/Keywords/if), so an empty array is falsy.

```handlebars
{{#if (and @isAdmin (not @isLocked))}}
  ...
{{/if}}
```

### Math in templates

Ember has no helpers for arithmetic.
Write a function, and call it in the template.

```gjs
const add = (a, b) => a + b;

<template>
  {{add @count 1}}
</template>
```

## Functions and Helpers

### `{{myFunction ...}}`

To call a function, write its name and then the arguments, as you do for a helper.
The function can be an import, a local variable, an argument, or a property of `this`.

```gjs
import { Price } from './price';

const formatPrice = (cents, currency = 'USD') => {
  const format = new Intl.NumberFormat('en-US', { style: 'currency', currency });

  return format.format(cents / 100);
};

<template>
  {{formatPrice @cents}}
  {{formatPrice @cents "EUR"}}

  <Price @label={{formatPrice @cents}} />
</template>
```

Named arguments go into one object, which is the last parameter of the function.

```gjs
const greet = (name, { greeting }) => `${greeting}, ${name}!`;

<template>
  {{greet @name greeting="Hello"}}
</template>
```

Learn more: [Helper Functions](../../components/helper-functions/).

### `{{(myFunction)}}`

A function with arguments is always called.
A function without arguments is called when its result goes directly into the page.
Where the function is the value of an argument, add parentheses to call it.
Without the parentheses, the argument receives the function itself, not its result.

```handlebars
{{(this.myFunction)}}

<Price @label={{(this.myFunction)}} />
```

### `(fn ...)`

[`fn`](https://api.emberjs.com/ember/release/functions/Keywords/fn) returns a new function that calls the original function with the arguments that you give it, followed by the arguments of the call.
Use it to pass arguments to an event handler.

```handlebars
<button type="button" {{on "click" (fn @onDelete @user)}}>
  Delete
</button>
```

### `(helper ...)`

[`helper`](https://api.emberjs.com/ember/release/functions/Keywords/helper) returns a helper with some arguments already set.
Pass it to a component, or yield it, and invoke it later.

```gjs
import { formatPrice } from './format-price';

<template>
  {{#let (helper formatPrice currency="EUR") as |formatEuros|}}
    {{formatEuros @cents}}

    <Price @format={{formatEuros}} />
  {{/let}}
</template>
```

### `{{log ...}}`

[`log`](https://api.emberjs.com/ember/release/functions/Keywords/log) prints its arguments to the browser console.

```handlebars
{{log "The user is" @user}}
```

### `{{debugger}}`

[`debugger`](https://api.emberjs.com/ember/release/functions/Keywords/debugger) stops the code at that place in the template, when the developer tools are open.
In the console, call `get('name')` to read a value that the template can see.

```handlebars
{{#each this.items as |item|}}
  {{debugger}}
{{/each}}
```

## Elements and Modifiers

### `{{on ...}}`

The [`on`](https://api.emberjs.com/ember/release/functions/Keywords/on) modifier adds an event listener to an element, and the handler receives the event.
Ember removes the listener when the element leaves the DOM.
The named arguments `capture`, `once`, and `passive` are the options of [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).

```handlebars
<button type="button" {{on "click" this.save}}>Save</button>

<div {{on "scroll" this.onScroll passive=true}}></div>

<form {{on "submit" (fn this.submit @model)}}></form>
```

Learn more: [Component State and Actions](../../components/component-state-and-actions/).

### `{{myModifier ...}}`

A modifier runs code with an element when the element enters the DOM, and again when its arguments change.
The `modifier` function comes from the [ember-modifier](https://github.com/ember-modifier/ember-modifier) package.

```gjs
import { modifier } from 'ember-modifier';

const autofocus = modifier((element) => {
  element.focus();
});

<template>
  <input {{autofocus}} />
</template>
```

Learn more: [Template Lifecycle, DOM, and Modifiers](../../components/template-lifecycle-dom-and-modifiers/).

### `(modifier ...)`

`modifier` returns a modifier with some arguments already set.
Pass it to a component, or yield it, and apply it later.

```gjs
import { scrollTo } from './scroll-to';

<template>
  {{#let (modifier scrollTo behavior="smooth") as |smoothScrollTo|}}
    <div {{smoothScrollTo @position}}></div>
  {{/let}}
</template>
```

### `(element ...)`

[`element`](https://api.emberjs.com/ember/release/functions/Keywords/element) returns a component that renders an element with the tag name that you give it.
When the tag name is an empty string, the block renders without an element around it.
When the tag name is `null` or `undefined`, nothing renders.

```handlebars
{{#let (element @tagName) as |Tag|}}
  <Tag class="my-element">Hello</Tag>
{{/let}}
```

When `@tagName` is `"h1"`, this renders `<h1 class="my-element">Hello</h1>`.

### `{{#in-element ...}}`

[`in-element`](https://api.emberjs.com/ember/release/functions/Keywords/in-element) renders its block into another DOM element, for example for a modal, a dropdown, or a tooltip.
The element must exist when the block renders.
By default, the block replaces the content of the element.
With `insertBefore=null`, the block goes after the existing content.

```handlebars
{{#in-element this.destinationElement insertBefore=null}}
  <div class="modal">Some content</div>
{{/in-element}}
```

## Components in Templates

### `<@Component />`

Every value that is a component can be invoked with angle brackets, for example `<this.Kind />`, `<@Kind />`, or a block parameter.
Attributes and modifiers work as they do on every other component: they go to the element that has `...attributes`.

```gjs
import Component from '@glimmer/component';

import { ErrorMessage } from './error-message';
import { InfoMessage } from './info-message';

const kinds = {
  error: ErrorMessage,
  info: InfoMessage,
};

export class Message extends Component {
  get Kind() {
    return kinds[this.args.kind];
  }

  <template>
    <this.Kind class="message" {{on "click" @onDismiss}} />
  </template>
}
```

### `(component ...)`

An invocation with curly braces cannot take attributes or modifiers.
Use the [`component`](https://api.emberjs.com/ember/release/functions/Keywords/component) helper as a value to set arguments in advance, and invoke the result with angle brackets.
Arguments that the caller passes override the arguments that `component` set.

```gjs
import { Message } from './message';

<template>
  {{#let (component Message kind="error") as |ErrorMessage|}}
    <ErrorMessage class="message" {{on "click" @onDismiss}} />
  {{/let}}
</template>
```

### `<LinkTo>`

[`<LinkTo>`](https://api.emberjs.com/ember/release/functions/@ember%2Frouting/LinkTo) renders a link to a route.
Use it when the user starts the navigation.

```gjs
import { LinkTo } from '@ember/routing';

<template>
  <LinkTo @route="posts.show" @model={{@post}}>
    {{@post.title}}
  </LinkTo>

  <LinkTo @route="posts" @query={{hash page=2}}>Next page</LinkTo>
</template>
```

Learn more: [Linking Between Routes](../../routing/linking-between-routes/).

### `<Input>`, `<Textarea>`

[`<Input>`](https://api.emberjs.com/ember/release/functions/@ember%2Fcomponent/Input) and [`<Textarea>`](https://api.emberjs.com/ember/release/functions/@ember%2Fcomponent/Textarea) update `@value` when the user types.
A plain `<input>` with `{{on "input"}}` does the same, and gives you more control.

```gjs
import { Input, Textarea } from '@ember/component';

<template>
  <Input @type="text" @value={{this.name}} />
  <Input @type="checkbox" @checked={{this.isAdmin}} />
  <Textarea @value={{this.bio}} />
</template>
```

Learn more: [Built-in Components](../../components/built-in-components/).

### `{{outlet}}`

In a route template, [`outlet`](https://api.emberjs.com/ember/release/functions/Keywords/outlet) renders the template of the active child route.

```gjs
<template>
  <nav>...</nav>

  <main>
    {{outlet}}
  </main>
</template>
```

Learn more: [Defining Your Routes](../../routing/defining-your-routes/).

### `{{pageTitle ...}}`

`pageTitle` comes from [ember-page-title](https://github.com/ember-cli/ember-page-title), which new apps include.
Each route template can add a part to the title of the page.

```gjs
import { pageTitle } from 'ember-page-title';

<template>
  {{pageTitle "My Page Title"}}
</template>
```

## TypeScript

### `Signature`

In a `.gts` file, a signature describes the parts of a component that the caller uses.

- `Args`: the arguments. Add `?` to an optional argument.
- `Blocks`: the blocks, and the types of the block parameters of each block.
- `Element`: the element that receives `...attributes`.

```gts
interface ToggleSignature {
  Element: HTMLDivElement;
  Args: {
    label: string;
    initial?: boolean;
  };
  Blocks: {
    default: [isOn: boolean, toggle: () => void];
  };
}
```

### `Component<Signature>`

Give the signature to [`Component`](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent) as a type argument.
Then TypeScript checks [`this.args`](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent), the `@arguments` in the template, and the values that you [`yield`](https://api.emberjs.com/ember/release/functions/Keywords/yield).

```gts
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export class Toggle extends Component<ToggleSignature> {
  @tracked isOn = this.args.initial ?? false;

  toggle = () => {
    this.isOn = !this.isOn;
  };

  <template>
    <div ...attributes>
      {{@label}}
      {{yield this.isOn this.toggle}}
    </div>
  </template>
}
```

### `TOC<Signature>`

A template-only component has no class.
Give it a type with [`TOC`](https://api.emberjs.com/ember/release/modules/@ember%2Fcomponent%2Ftemplate-only) from `@ember/component/template-only`.

```gts
import type { TOC } from '@ember/component/template-only';

interface BadgeSignature {
  Element: HTMLSpanElement;
  Args: {
    label: string;
  };
}

export const Badge: TOC<BadgeSignature> = <template>
  <span class="badge" ...attributes>{{@label}}</span>
</template>;
```

### `satisfies TOC<Signature>`

You can also put the type after the template, with [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator).

```gts
import type { TOC } from '@ember/component/template-only';

export const Badge = <template>
  <span class="badge" ...attributes>{{@label}}</span>
</template> satisfies TOC<BadgeSignature>;
```

### `modifier<Signature>`

A modifier signature has the element, and the positional and named arguments.

```gts
import { modifier } from 'ember-modifier';

interface ScrollToSignature {
  Element: HTMLElement;
  Args: {
    Positional: [position: number];
  };
}

export const scrollTo = modifier<ScrollToSignature>((element, [position]) => {
  element.scrollTop = position;
});
```

### Helpers: typed functions

A helper is a function, so you give it types as you do for all functions.
Named arguments are in one object, which is the last parameter.

```gts
const greet = (name: string, { greeting }: { greeting: string }) =>
  `${greeting}, ${name}!`;

<template>
  {{greet @name greeting="Hello"}}
</template>
```

### `WithBoundArgs`

When a component yields a component with [`(component)`](https://api.emberjs.com/ember/release/functions/Keywords/component), use `WithBoundArgs` from `@glint/template` for the type.
The second type argument lists the arguments that are already set, so the caller does not have to pass them.

```gts
import Component from '@glimmer/component';
import type { WithBoundArgs } from '@glint/template';
import { Tab } from './tab';

interface TabsSignature {
  Args: {
    initial: string;
  };
  Blocks: {
    default: [{ Tab: WithBoundArgs<typeof Tab, 'active' | 'onSelect'> }];
  };
}

export class Tabs extends Component<TabsSignature> {
  // ...
}
```

Learn more: [TypeScript: Invokables](../../typescript/core-concepts/invokables/).

## Component How-To

### Access arguments

Use `@name` in the template.
Use `this.args.name` in the class.
A getter that reads an argument computes again when the argument changes.

```gjs
import Component from '@glimmer/component';

export class LineItem extends Component {
  get total() {
    return this.args.price * this.args.quantity;
  }

  <template>
    {{@quantity}} × {{@price}} = {{this.total}}
  </template>
}
```

To give an argument a default value, use a getter with `??`.

```gjs
import Component from '@glimmer/component';

export class Greeting extends Component {
  get name() {
    return this.args.name ?? 'stranger';
  }

  <template>
    Hello, {{this.name}}!
  </template>
}
```

### Update arguments

A component cannot change its arguments.
To change a value, the owner of the data also passes a function, and the component calls that function.
The data goes down, and the action goes up.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const Counter = <template>
  <button type="button" {{on "click" @onIncrement}}>
    {{@count}}
  </button>
</template>;

export class Scoreboard extends Component {
  @tracked count = 0;

  increment = () => {
    this.count++;
  };

  <template>
    <Counter @count={{this.count}} @onIncrement={{this.increment}} />
  </template>
}
```

Learn more: [Component State and Actions](../../components/component-state-and-actions/).

### Handle events

The [`on`](https://api.emberjs.com/ember/release/functions/Keywords/on) modifier adds an event listener to an element, and the handler receives the event.
Use [`fn`](https://api.emberjs.com/ember/release/functions/Keywords/fn) to pass arguments before the event.
Define the handler as an arrow function in a class field, so that `this` is always the component.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export class ProductList extends Component {
  @tracked selected;

  select = (product, event) => {
    event.preventDefault();

    this.selected = product;
  };

  <template>
    {{#each @products as |product|}}
      <a href="/products/{{product.id}}" {{on "click" (fn this.select product)}}>
        {{product.name}}
      </a>
    {{/each}}
  </template>
}
```

### Do something on creation

The `constructor` runs one time, when Ember creates the component.
The arguments are ready, but there is no DOM yet.

```gjs
import Component from '@glimmer/component';

export class Clock extends Component {
  constructor(owner, args) {
    super(owner, args);

    this.startedAt = new Date();
  }
}
```

A Glimmer component has no hooks for render or update.
To compute a value from other values, use a getter.
To work with a DOM element, use a modifier.

### Do something on render

Use a modifier to run code when an element enters the DOM.
The modifier receives the element.

```gjs
import { modifier } from 'ember-modifier';

const autofocus = modifier((element) => {
  element.focus();
});

<template>
  <input {{autofocus}} />
</template>
```

If the code does not need an element, a render hook is usually not necessary.
Compute the value in a getter, and the template reads it during the render.

### Do something during teardown

A modifier can return a function.
That function runs after Ember removes the element from the DOM, and before the modifier runs again.
Use it to undo what the modifier did.

```gjs
import { modifier } from 'ember-modifier';

const onResize = modifier((element, [callback]) => {
  const observer = new ResizeObserver(callback);

  observer.observe(element);

  return () => observer.disconnect();
});

<template>
  <div {{onResize @onResize}}>
    {{yield}}
  </div>
</template>
```

For work that does not belong to an element, use [`registerDestructor`](https://api.emberjs.com/ember/release/functions/@ember%2Fdestroyable/registerDestructor).
The function runs when Ember destroys the component, and it keeps the cleanup next to the setup.
The [`willDestroy()`](https://api.emberjs.com/ember/release/modules/@glimmer%2Fcomponent) method of the class does the same job.
If you use it, call `super.willDestroy()`.

```gjs
import Component from '@glimmer/component';
import { registerDestructor } from '@ember/destroyable';

export class Poller extends Component {
  constructor(owner, args) {
    super(owner, args);

    const interval = setInterval(() => this.args.onTick(), 1000);

    registerDestructor(this, () => clearInterval(interval));
  }
}
```

Learn more: [Template Lifecycle, DOM, and Modifiers](../../components/template-lifecycle-dom-and-modifiers/).

### React to changes

Do not watch for the change. Derive the value.
A getter that reads tracked state or arguments gives a new result after one of them changes.
Add [`@cached`](https://api.emberjs.com/ember/release/functions/@glimmer%2Ftracking/cached) when the computation is expensive, so that the getter runs one time for each change.

```gjs
import Component from '@glimmer/component';
import { cached, tracked } from '@glimmer/tracking';

export class Search extends Component {
  @tracked query = '';

  @cached
  get results() {
    return this.args.items.filter((item) => item.name.includes(this.query));
  }

  updateQuery = (event) => {
    this.query = event.target.value;
  };

  <template>
    <input value={{this.query}} {{on "input" this.updateQuery}} />

    {{#each this.results as |item|}}
      {{item.name}}
    {{/each}}
  </template>
}
```

To update the DOM when a value changes, pass the value to a modifier.
The modifier runs again when one of its arguments changes.

```gjs
import { modifier } from 'ember-modifier';

const scrollTo = modifier((element, [position]) => {
  element.scrollTop = position;
});

<template>
  <div {{scrollTo @position}}>
    {{yield}}
  </div>
</template>
```

### Reference an element

A modifier receives the element as its first parameter.
Store the element if a method needs it later.

```gjs
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export class Player extends Component {
  video;

  setVideo = modifier((element) => {
    this.video = element;
  });

  play = () => {
    this.video.play();
  };

  <template>
    <video src={{@src}} {{this.setVideo}}></video>

    <button type="button" {{on "click" this.play}}>Play</button>
  </template>
}
```

### Redirect to a different URL

Inject the router service and call [`transitionTo`](https://api.emberjs.com/ember/release/classes/RouterService/methods/transitionTo?anchor=transitionTo) with a route name or a URL.
[`replaceWith`](https://api.emberjs.com/ember/release/classes/RouterService/methods/replaceWith?anchor=replaceWith) does the same, but it replaces the current entry in the browser history.

```gjs
import Component from '@glimmer/component';
import { service } from '@ember/service';

export class LogoutButton extends Component {
  @service router;

  logout = () => {
    this.router.transitionTo('login');
  };

  <template>
    <button type="button" {{on "click" this.logout}}>Log out</button>
  </template>
}
```

When the user starts the navigation, render a link with [`<LinkTo>`](#toc_linkto).

Learn more: [`RouterService` on the Ember API docs](https://api.emberjs.com/ember/release/classes/RouterService).

## Component Patterns

### Provider components

A provider component owns state and behavior, and renders no markup of its own.
It yields the state and the functions, and the caller decides what to render.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export class Toggle extends Component {
  @tracked isOn = false;

  toggle = () => {
    this.isOn = !this.isOn;
  };

  <template>
    {{yield this.isOn this.toggle}}
  </template>
}
```

The caller receives the yielded values as block parameters.

```gjs
import { Toggle } from './toggle';

<template>
  <Toggle as |isOn toggle|>
    <button type="button" {{on "click" toggle}}>
      {{if isOn "On" "Off"}}
    </button>
  </Toggle>
</template>
```

### Template-only components

A template-only component is a component without a class.
It has no `this` and no state, so its output depends only on its arguments.
Assign a `<template>` to an exported `const` to define a template-only component.

```gjs
export const Badge = <template>
  <span class="badge" ...attributes>
    {{@label}}
  </span>
</template>;
```

A `<template>` in a `const` that is not exported is a component for this file only.

```gjs
const Badge = <template>
  <span class="badge">{{@label}}</span>
</template>;

<template>
  <Badge @label="New" />
  <Badge @label="Sale" />
</template>
```

### Named blocks pattern

A component with more than one block lets the caller fill more than one place.
Render each block with [`yield`](https://api.emberjs.com/ember/release/functions/Keywords/yield) and `to="name"`.
Use [`has-block`](https://api.emberjs.com/ember/release/functions/Keywords/has-block) to find out if the caller passed a block.

```gjs
export const Card = <template>
  <section class="card">
    {{#if (has-block "header")}}
      <header>{{yield to="header"}}</header>
    {{/if}}

    <div class="body">
      {{yield to="body"}}
    </div>
  </section>
</template>;
```

The caller fills each block by name.

```gjs
import { Card } from './card';

<template>
  <Card>
    <:header>Ember</:header>
    <:body>A framework for ambitious web developers.</:body>
  </Card>
</template>
```

Learn more: [Block Content](../../components/block-content/).

### Contextual components

A contextual component yields other components with some arguments already set.
The [`component`](https://api.emberjs.com/ember/release/functions/Keywords/component) helper sets the arguments, and [`hash`](https://api.emberjs.com/ember/release/functions/Keywords/hash) gives each component a name.
The caller gets parts that already know their parent.

```gjs
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

const Tab = <template>
  <button
    type="button"
    class={{if (eq @name @active) "active"}}
    {{on "click" (fn @onSelect @name)}}
  >
    {{yield}}
  </button>
</template>;

export class Tabs extends Component {
  @tracked active = this.args.initial;

  select = (name) => {
    this.active = name;
  };

  <template>
    {{yield (hash Tab=(component Tab active=this.active onSelect=this.select))}}
  </template>
}
```

The caller passes only the arguments that the parent did not set.

```gjs
import { Tabs } from './tabs';

<template>
  <Tabs @initial="one" as |tabs|>
    <tabs.Tab @name="one">One</tabs.Tab>
    <tabs.Tab @name="two">Two</tabs.Tab>
  </Tabs>
</template>
```
