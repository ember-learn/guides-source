Templates are the home for what the user sees, like forms, buttons, links, and headings.

In this section of the Guides, you will learn about where to write HTML markup, plus how to add interaction, dynamically changing content, styling, and more. If you want to learn in a step-by-step way, you should begin your journey in the [Tutorial]() instead.

## Writing plain HTML

Ember templates have some superpowers, but let's start with regular HTML. For any file in an Ember app that has an extension ending in `.hbs`, you can write HTML markup in it as if it was an `.html` file. HTML is the language that browsers understand for laying out content on a web page. `.hbs` stands for Handlebars, the name of a tool that lets you write more than just HTML in your templates.

For example, every Ember app has a file called `application.hbs`. You can write regular HTML markup there or in any other `hbs` file:

```hbs {data-filename=app/templates/application.hbs data-update=false}
<h1>Starting simple</h1>
<p>
  This is regular html markup inside an hbs file
</p>
```

If you make a mistake like forgetting to close a tag or missing a quotation mark, you will see some errors when you run the app with `ember serve`. However, reading the error message on the page or in your browser's developer console will get you going again right away.

## Types of Templates

There are two main types of Templates: Route Templates and Component Templates.

A Route Template determines what is shown when someone visits a particular url, like `https://guides.emberjs.com/some-route`. A Component Template has bits of content that can be reused in multiple places throughout the app, like buttons or forms.

The best way to tell if a Template is part of a Route or Component is to look at the filepath. If you look at an existing app, you will see Templates in many different places in the app folder structure! This is to help the app stay organized as it grows from one to one hundred Templates.

## Making new Templates

New templates should be made using the [Ember CLI](https://cli.emberjs.com). It helps ensure that the files go in the right place in the app folder structure, and that they follow the right file naming conventions. If you have never used the Ember CLI before, it is recommended to do the [Tutorial]().

For example, either of these commands will generate `.hbs` Template files (and other things!) in your app:

```sh
ember generate component my-component-name
ember generate route my-route-name
```

## Template restrictions

A typical, modern web app is made of dozens of files that have to all be combined together into something the browser can understand. Ember does this work for you with zero configuration, but as a result, there are some rules to follow when it comes to adding assets into your HTML.

You cannot use script tags directly within a template, and should use [actions]() or [Route Lifecycle Hooks]() to make your app responsive to user interactions and new data. If you are working with a non-Ember JavaScript library and need to use a `js` file from it, see the Guide section [Addons and Dependencies]().

Similarly, you should not add links to CSS Stylesheets within the `hbs` file. Style rules should go in the `app/styles` directory instead. `app/styles/app.css` is included in your app's build by default. For CSS files within the styles directory, you can create multiple stylesheets and use regular CSS APIs like `import` to link them together. If you want to incorporate CSS from an npm package or similar, see [Addons and Dependencies]() for instructions.

## What is `index.html` for?

If HTML markup goes in `hbs` Templates, what is `index.html` for?

The `index.html` file is the entry point for an app. It is not a Template, but rather it is where all the Templates, stylesheets, and JavaScript come together into something the browser can understand.

When you are first getting started in Ember, you will not need to make any changes to `index.html`. There's no need to add any links to other Ember app pages, stylesheets, or scripts in here by hand, since Ember's built-in tools do the work for you.

The most common customizations developers make to `index.html` are when they use a CDN to load assets like fonts or stylesheets. Here's an example:

```html {data-filename=app/index.html}
  <link integrity="" rel="stylesheet" href="https://my-font-cdn/something.css">
```

## Understanding a Template's context

A Template only has access to the data it has been given. This is referred to as the Template's "context." For example, to display a property inside a Route's Template, it should be defined in a Controller:

```javascript {data-filename=app/controllers/application.js}
import Controller from '@ember/controller';

export default Controller.extend({
  firstName: 'Trek',
  lastName: 'Glowacki',
  favoriteFramework: 'Ember'
});
```

The attributes like `firstName` can be used in the template
by putting them inside of curly braces, plus the word
`this`:

```handlebars {data-filename=app/templates/application.hbs}
Hello, <strong>{{this.firstName}} {{this.lastName}}</strong>!
```

The above template and controller render as the following HTML:

```html
Hello, <strong>Trek Glowacki</strong>!
```

If you use JavaScript to change the values of `firstName` or `lastName` in the Controller, what the user sees will be automatically updated! In Ember, this is referred to as "data binding."

Here's another example using a Component.
Components are usually made of two files, a JavaScript file `my-component.js` and a
template file with the same name, `my-component.js`. Whatever attributes are defined
in the Component's JavaScript are available for use in the Template:

```javascript {data-filename=app/components/my-component.js}
import Component from '@ember/component';

export default Component.extend({
  firstName: 'Jessica',
  lastName: 'Jordan'
});
```

```handlebars {data-filename=app/templates/components/my-component.hbs}
Hello, <strong>{{this.firstName}} {{this.lastName}}</strong>!
```

This would render:

```html
Hello, <strong>Jessica Jordan</strong>!
```

## Things you might see in a Template

A lot more than just HTML markup can go in Templates. In the other pages of this guide, we will cover the features one at a time. In general, special Ember functionality will appear inside curly braces, like this: `{{example}}`. Here are a few examples of Ember Handlebars in action:

Route example:
```hbs {data-filename=app/templates/application.hbs data-update=true}
{{!-- Example of a comment that will be invisible --}}

{{!-- outlet determines where a child route's content should render. Don't delete it until you know more about it! --}}
<div>
  {{outlet}}
</div>

{{!-- One way to use a component within a template. This is called "Angle Bracket Component syntax." --}}
<MyComponent />

```

Component example:
```hbs {data-filename=app/components/templates/my-component.hbs data-update=true}
{{!-- An attribute that is defined in a component's JavaScript file --}}
{{this.numberOfSquirrels}}

{{!-- Some data passed down from a parent component or controller --}}
{{weatherStatus}}

{{!-- This button uses Ember Actions to make it interactive. A method named `plantATree` is called when the button is clicked --}}
<button onclick={{action 'plantATree'}}>
  More trees!
<button>

{{!-- Here's an example of template logic in action. If the `this.skyIsBlue` attribute is `true`, the text inside will be shown --}}
{{#if this.skyIsBlue}}
  If the skyIsBlue attribute is true, show this message
{{/if}}

{{!-- You can pass a whole block of markup and handlebars content from one component to another. yield is where the block shows up when the page is rendered --}}
{{yield}}
```

Lastly, it's important to know that data can be passed from
one Template to another. Here's what it looks like
to pass data from a Route Template to a Component Template.

```handlebars {data-filename=app/templates/application.hbs}
<MyComponent @favoriteFramework=this.favoriteFramework />
```

Learn more about passing data between Templates in [../../components/passing-properties-to-a-component].

## Helper functions

Ember Helpers are pure functions that can be used in any template to change how data is displayed. For example, you could write a Helper function that capitalizes a word, does some math, converts a currency, or more.
A Helper takes in `parameters`, which is an array of the values passed into the function, and should return a value.
Ember gives you the ability to [write your own helpers](../writing-helpers/), and comes with some [helpers built-in]().

For example, let's say you would like the ability to add two numbers together.
Define a function in `app/helpers/sum.js` to create a `sum` helper:


```javascript {data-filename=app/helpers/sum.js}
import { helper } from '@ember/component/helper';

export function sum(params) {
  return params[0] + params[1]
};

export default helper(sum);
```

Now you can use the `sum()` function as `{{sum}}` in your templates:

```handlebars {data-filename=app/templates/application.hbs}
<p>Total: {{sum 1 2}}</p>
```

The user will see a value of `3` rendered in the template!

Ember ships with several built-in helpers, which you will learn more about in the following guides.

### Nested Helpers

Sometimes, you might see helpers used inside of some parentheses, `()`.
It means that a Helper is being used inside of another Helper or Component.
This is referred to as a "nested" Helper. 
Parentheses must be used because curly braces `{{}}` cannot be nested.

```handlebars {data-filename=app/templates/application.hbs}
{{sum (multiply 2 4) 2}}
```

In this example, we are using a helper to multiply `2` and `4` _before_ passing the value into `{{sum}}`.

Thus, the output of these combined helpers is `10`.

As you move forward with these template guides, keep in mind that a helper can be used anywhere a normal value can be used.

Many of Ember's built-in helpers (as well as your custom helpers) can be used in nested form.