Templates are the home for what the user sees, like forms, buttons, links, and headings.

In this section of the Guides, you will learn about where to write HTML markup, plus how to add interaction, dynamically changing content, styling, and more.
If you want to learn in a step-by-step way, you should begin your journey in the [Tutorial](../../tutorial/ember-cli/) instead.

## Writing plain HTML

Templates in Ember have some superpowers, but let's start with regular HTML.
For any file in an Ember app that has an extension ending in `.hbs`, you can write HTML markup in it as if it was an `.html` file.
HTML is the language that browsers understand for laying out content on a web page.
`.hbs` stands for Handlebars, the name of a tool that lets you write more than just HTML.

For example, every Ember app has a file called `application.hbs`.
You can write regular HTML markup there or in any other `hbs` file:

```handlebars {data-filename=app/templates/application.hbs data-update=false}
<h1>Starting simple</h1>
<p>
  This is regular html markup inside an hbs file
</p>
```

When you start an app with `ember serve`, your templates are compiled down to something that Ember's rendering engine can process more easily. The compiler helps you catch some errors, such as forgetting to close a tag or missing a quotation mark.
Reading the error message on the page or in your browser's developer console will get you back on track.

## Types of templates

There are two main types of templates: Route templates and Component templates.

A Route template determines what is shown when someone visits a particular URL, like `https://guides.emberjs.com/some-route`.
A Component template has bits of content that can be reused in multiple places throughout the app, like buttons or forms.

If you look at an existing app, you will see templates in many different places in the app folder structure! 
This is to help the app stay organized as it grows from one template to _one hundred_ templates.
The best way to tell if a template is part of a Route or Component is to look at the file path.

## Making new templates

New templates should be made using [Ember CLI](https://cli.emberjs.com) commands.
The CLI helps ensure that the new files go in the right place in the app folder structure, and that they follow the essential file naming conventions.

For example, either of these commands will generate `.hbs` template files (and other things!) in your app:

```sh
ember generate component my-component-name
ember generate route my-route-name
```

## Template restrictions

A typical, modern web app is made of dozens of files that have to all be combined together into something the browser can understand.
Ember does this work for you with zero configuration, but as a result, there are some rules to follow when it comes to adding assets into your HTML.

You cannot use script tags directly within a template, and should use [actions](../actions/) or [Component Lifecycle Hooks](../../components/the-component-lifecycle/) to make your app responsive to user interactions and new data.
If you are working with a non-Ember JavaScript library and need to use a `js` file from it, see the Guide section [Addons and Dependencies](../../addons-and-dependencies/managing-dependencies/).

You should not add links to your own local CSS files within the `hbs` file.
Style rules should go in the `app/styles` directory instead.
`app/styles/app.css` is included in your app's build by default.
For CSS files within the styles directory, you can create multiple stylesheets and use regular CSS APIs like `import` to link them together.
If you want to incorporate CSS from an npm package or similar, see [Addons and Dependencies](../../addons-and-dependencies/managing-dependencies/) for instructions.
To load styles through a CDN, read the next section below.

## What is `index.html` for?

If HTML markup goes in `hbs` templates, what is `index.html` for?

The `index.html` file is the entry point for an app.
It is not a template, but rather it is where all the templates, stylesheets, and JavaScript come together into something the browser can understand.

When you are first getting started in Ember, you will not need to make any changes to `index.html`.
There's no need to add any links to other Ember app pages, stylesheets, or scripts in here by hand, since Ember's built-in tools do the work for you.

A common customization developers make to `index.html` is adding a link to a CDN that loads assets like fonts and stylesheets.
Here's an example:

```html {data-filename=app/index.html}
  <link integrity="" rel="stylesheet" href="https://my-font-cdn/something.css">
```

## Understanding a Template's context

A template only has access to the data it has been given.
This is referred to as the template's "context."
For example, to display a property inside a Component's template, it should be defined in the Component's JavaScript file:

```javascript {data-filename=app/components/my-component.js}
import Component from '@ember/component';

export default Component.extend({
  firstName: 'Trek',
  lastName: 'Glowacki',
  favoriteFramework: 'Ember'
});
```

Properties like `firstName` can be used in the template
by putting them inside of curly braces, plus the word
`this`:

```handlebars {data-filename=app/templates/application.hbs}
Hello, <strong>{{this.firstName}} {{this.lastName}}</strong>!
```

Together, these render with the following HTML:

```html
Hello, <strong>Trek Glowacki</strong>!
```

## Things you might see in a template

A lot more than just HTML markup can go in templates.
In the other pages of this guide, we will cover the features one at a time.
In general, special Ember functionality will appear inside curly braces, like this: `{{example}}`.
Here are a few examples of Ember Handlebars in action:

Route example:
```handlebars {data-filename=app/templates/application.hbs data-update=true}

<!-- outlet determines where a child route's content 
should render. Don't delete it until you know more 
about it! -->
<div>
  {{outlet}}
</div>

<!-- One way to use a component within a template -->
<MyComponent />

{{! Example of a comment that will be invisible, even
if it contains things in {{curlyBraces}} }}

```

Component example:

```handlebars {data-filename=app/components/templates/my-component.hbs data-update=true}
<!-- A property that is defined in a component's
JavaScript file -->
{{this.numberOfSquirrels}}

<!-- Some data passed down from a parent component 
or controller -->
{{@weatherStatus}}

<!-- This button uses Ember Actions to make it interactive. 
A method named `plantATree` is called when the button is
clicked. `plantATree` comes from the JavaScript file
associated with the template, like a Component or 
Controller -->
<button onclick={{action 'plantATree'}}>
  More trees!
<button>

<!-- Here's an example of template logic in action. 
If the `this.skyIsBlue` property is `true`, the text
inside will be shown -->
{{#if this.skyIsBlue}}
  If the skyIsBlue property is true, show this message
{{/if}}

<!-- You can pass a whole block of markup and handlebars
content from one component to another. yield is where
the block shows up when the page is rendered -->
{{yield}}
```

Lastly, it's important to know that arguments can be passed from one Component to another through templates:

```handlebars {data-filename=app/templates/components/some-other-component.hbs}
<MyComponent @favoriteFramework={{this.favoriteFramework}} />
```

To pass in arguments associated with a Route, define the property from within a Controller. Learn more about passing data between templates [here](../../components/passing-properties-to-a-component).

## Helper functions

Ember Helpers are a way to use JavaScript logic in your templates.
For example, you could write a Helper function that capitalizes a word, does some math, converts a currency, or more.
A Helper takes in two types of arguments, `positional` (an array of the positional values passed in the template) or `named` (an object of the named values passed in the template), which are passed into the function, and should return a value.
Ember gives you the ability to [write your own helpers](../writing-helpers/), and comes with some [helpers built-in](../built-in-helpers).

For example, let's say you would like the ability to add two numbers together.
Define a function in `app/helpers/sum.js` to create a `sum` helper:

```javascript {data-filename=app/helpers/sum.js}
import { helper as buildHelper } from '@ember/component/helper';

export function sum(params) {
  return params[0] + params[1]
};

export const helper = buildHelper(sum);
```

Now you can use the `sum()` function as `{{sum}}` in your templates:

```handlebars {data-filename=app/templates/application.hbs}
<p>Total: {{sum 1 2}}</p>
```

The user will see a value of `3` rendered in the template!

Ember ships with several built-in helpers, which you will learn more about in the following guides.

### Nested Helpers

Sometimes, you might see helpers invoked by placing them inside parentheses, `()`.
This means that a Helper is being used inside of another Helper or Component.
This is referred to as a "nested" Helper Invocation.
Parentheses must be used because curly braces `{{}}` cannot be nested.

```handlebars {data-filename=app/templates/application.hbs}
{{sum (multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

Many of Ember's built-in helpers (as well as your custom helpers) can be used in nested form.
