For the most part, you should be able to build Ember applications without directly manipulating the DOM. Before considering directly accessing the DOM, it's always best to first consider whether there's an Ember-native way to accomplish your goal.

## Thinking About Updates

In most cases, the best way to think about your component's output is to assume that it will be re-executed from the top every time anything changes in your application.

For example, consider an `Article` component that takes `@title` and `@body` arguments.

```handlebars {data-filename=app/components/article/template.hbs}
<article>
  <header><h1>{{@title}}</h1></header>
  <section>{{@body}}</section>
</article>
```

Assuming an `article` route with a model that looks like:

```json
{
  "title": "Hello world",
  "body": "This is the first article"
}
```

This component would be invoked this way:

```handlebars {data-filename=app/templates/article.hbs}
<Article @title={{@model.title}} @body={{@model.body}}>
```

The first time the `Article` component is rendered, it would produce this output:

```html
<article>
  <header><h1>Hello world</h1></header>
  <section>This is the first article</section>
</article>
```

In a way, this is like substitution: references to `@title` in the component's template are replaced by the value passed in from the outside.

If the model changes to:

```json
{
  "title": "Hello world",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be updated to:

```html
<article>
  <header><h1>Hello world</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

Think of this as evaluating the template from scratch, substituting in the new values, and updating the output with the new contents.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        In practice, Ember avoids updating parts of the DOM that haven't changed,
        which means that the user's selection state, cursor and scroll position,
        and other state won't change for no reason.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

In general, before reaching for direct DOM manipulation, you should see whether you can model the changes that you want by writing a single template that applies no matter what the input is.

## Manipulating Attributes

The same philosophy that applies to changing text also applies to changing attributes.

For example, let's say we want to enhance our `Article` component to include a `title` attribute on the `<article>` tag.

```handlebars {data-filename=app/components/article/template.hbs}
<article title="{{@title}}">
  <header><h1>{{@title}}</h1></header>
  <section>{{@body}}</section>
</article>
```

With the model:

```json
{
  "title": "Hello world",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be:

```html
<article title="Hello world">
  <header><h1>Hello world</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

Just like in previous examples, you can think of attribute changes as substitution. If the model changes to:

```json {data-filename="input" data-diff="-2,+3"}
{
  "title": "Hello world",
  "title": "Hello world!",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be updated to:

```html {data-filename="output" data-diff="-1,+2,-3,+4"}
<article title="Hello world">
<article title="Hello world!">
  <header><h1>Hello world</h1></header>
  <header><h1>Hello world!</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

## Conditional Attributes

So far, we've talked about how to populate an attribute with the value of a variable. But what if we
want the value of an attribute to differ based upon whether the variable is truthy or falsy?

For example, let's say we want the `class` on a `<div>` to be `superuser` if the `@isAdmin` variable
is true, but `standard` if the `@isAdmin` variable is false.

We could accomplish this requirement by using the `if` helper inside of an attribute:

```handlebars
<div class={{if @isAdmin "superuser" "standard"}}>
  Welcome to my app.
</div>
```

Instead of thinking about changing the class imperatively when the `@isAdmin` variable changes, we
can think about how to build a template that produces the right output in both cases, and leave it
up to Ember to figure out how to update the HTML output.

## Summary: The Principle of Substitution

In summary, when you're trying to update a piece of text or an attribute in your component, think
of the Principle of Substitution, and write a template that produces the right HTML when you
substitute all of the variables in the template with the current values of the variables.

Whenever any of those variables change, Ember will automatically update the HTML efficiently without
blowing away browser state unnecessarily.

The advantage to writing components this way is that there is no way to make a mistake and forget to
update the output correctly in some situations. As long as the template produces the right HTML for
its inputs, the output will remain up to date.

This approach works great when you're trying to produce output that can be represented in HTML. But
what about aspects of your component that aren't represented in HTML, like event handlers? In those
cases, Ember tries to stick to the spirit of the Principle of Substitution, and allow you to write
templates as if they only ran one time, and then automatically keep the output up to date for you.

The rest of this guide describes how to enhance your templates with event handlers, custom DOM
properties and other kinds of custom JavaScript.

## Event Handlers

If you want to add an event handler to an HTML element, you can use the `{{on` element modifier.

```js {data-filename="app/components/counter.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count++;
  }
}
```

```handlebars {data-filename="app/templates/components/counter.hbs"}
<p>{{this.count}}</p>

<button {{on "click" this.increment}}>+</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        "Element modifiers" appear inside free-floating curly braces inside of an opening
        tag. Unlike <strong>attribute syntax</strong>, which works by substitution
        (and therefore affects the HTML output of your page), element modifiers work
        by passing the element to a function that can do anything with it.
      </div>
    </div>
  </div>
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-message">
        Unlike attributes, element modifiers do <strong>not</strong> run on the
        server-side, because there is no general-purpose and complete way to serialize
        the results of an element modifier into HTML.</p>
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

## Manipulating Properties

Since you're writing an HTML template, you can use dynamic substitution inside of an attribute's value; whenever the value changes, the attribute will change.

Setting properties on an HTML element, on the other hand, is a different story, because there's no way to set a property using HTML syntax.

For example, let's say you want to create an `<audio>` element, but pass it a blob as its [`srcObject`](https://www.w3.org/TR/html52/semantics-embedded-content.html#dom-htmlmediaelement-srcobject).

Since `srcObject` is a property and not an HTML attribute, you can use the `prop` element modifier from [ember-prop-modifier][prop-modifier] like this:

```handlebars
<audio {{prop srcObject=this.blob}} />
```

[prop-modifier]: https://www.npmjs.com/package/ember-prop-modifier

If the value changes, Ember will automatically update the element's property for you.

### How to Know If You Need a Property

If you're looking at a piece of documentation written using HTML syntax, you can use the syntax as-is in your template, and use `{{` to insert dynamic content.

On the other hand, if you're looking at JavaScript documentation that tells you to set a property on an element object, you can use `{{prop` to set the prop

If you want to set a property, you can use the `prop` element modifier.

## Calling Methods On First Render

So far, we've talked about web APIs that work by setting attributes as well as web APIs that work by setting properties. But what about web APIs that work by calling methods, like setting focus on an element?

For example, let's say we want to focus the an `<input>` in a form as soon as the form is rendered. The web API for focusing an element is:

```js
inputElement.focus();
```

This code needs to run after the element is rendered.

The simplest way to accomplish this is by using the `did-insert` modifier from [@ember/render-modifiers][render-modifiers].

[render-modifiers]: https://github.com/emberjs/ember-render-modifiers

```handlebars {app/templates/components/edit-form.hbs}
<form>
  <input {{did-insert this.focus}}>
</form>
```

```js {app/components/edit-form.js}
export default class EditForm {
  focus(element) {
    element.focus();
  }
}
```

The `did-insert` modifier will call a function after its element is added to the DOM. That function receives the element as a parameter.

### Abstracting the Logic Into a Custom Modifier

Using the `did-insert` modifier works well for one-off cases, but if you want to pull this logic into reusable functionality that you can use throughout your app, you can make your _own_ modifier.

The modifier that we're going to build will allow us to say:

```handlebars {data-filename="app/templates/components/edit-form.hbs"}
<form>
  <input {{autofocus}}>
</form>
```

Pretty nice, right?

To accomplish that, we'll create a modifier in `app/modifiers/autofocus.js`. First, install [`ember-modifier`](https://github.com/ember-modifier/ember-modifier) and then generate an `autofocus` modifier for your app:

```bash
ember install ember-modifier
ember generate modifier autofocus
```

Now add the functionality to focus the element:

```js {data-filename="app/modifiers/autofocus.js"}
import { modifier } from "ember-modifier";

export default modifier(element => element.focus());
```

And that's it!

Now we can use our custom `{{autofocus}}` modifier throughout our application.

## Communicating Between Elements in a Component

What if you want to handle an event in one part of your component by calling a DOM method on another part? For example, let's say you're creating an audio component, and you want clicking the "Play" button to call the audio tag's `play` method.

Let's start with the HTML we're working with:

```handlebars {data-filename="app/templates/components/audio-player.hbs"}
<audio src={{@srcURL}} />

<button>Play</button>
<button>Pause</button>
```

Next, let's add an event handler to the `Play` button:

```handlebars {data-filename="app/templates/components/audio-player.hbs" data-diff="-3,+4"}
<audio src={{@srcURL}} />

<button>Play</button>
<button {{on "click" this.play}}>Play</button>
<button>Pause</button>
```

```js {data-filename="app/components/audio-player.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class AudioPlayerComponent extends Component {
  @action
  play() {
    // TODO
  }
}
```

We'd like to call the `play` method on our `<audio>` element, but how do we get access to that element?

We can give our component access to elements inside of it by using [`ember-ref-modifier`](https://github.com/lifeart/ember-ref-modifier).

> The `{{ref}}` modifier takes a property name and an object, and assigns the modifier's element to that property on the object.

In this case, we'll assign the `<audio>` element to the `audioElement` property in our component:

```handlebars {data-filename="app/templates/components/audio-player.hbs" data-diff="-1,+2"}
<audio src={{@srcURL}} />
<audio src={{@srcURL}} {{ref this "audioElement"}} />

<button {{on "click" this.play}}>Play</button>
<button>Pause</button>
```

Now, the component can access the audio element in the `play` method:

```js {data-filename="app/components/audio-player.js" data-diff="-7,+8"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class AudioPlayerComponent extends Component {
  @action
  play() {
    // TODO
    this.audioElement.play();
  }
}
```

## Out-of-Component Modifications

In most cases, your component should restrict its behavior to its own elements. However, there are cases where a component needs to do something outside of itself. One simple example of this would be an element that wants to handle clicks outside of its DOM, which requires registering a handler on the whole document, and then hit-testing the element.

Let's start with the DOM structure of a super-simple component that would remove its contents when a click occurs outside of the element.

```handlebars {data-filename="app/templates/components/modal.hbs"}
<div class="modal">
  {{yield}}
</div>
```

We don't want to use `{{on "click"}}` here because we want the opposite behavior: do something whenever the user clicks _outside_ of the `<div>`. To accomplish that, we'll register a `click` handler on the entire document and then hit-test it, looking something like this:

```js
document.addEventListener("click", event => {
  if (!element.contains(event.target)) {
    // do something
  }
});
```

The most important difference between this example and the cases we've seen so far is that we need to remove the `click` event handler from the document when this element is destroyed.

To accomplish this, we can use [`ember-modifier`](https://github.com/ember-modifier/ember-modifier) to create a `on-click-outside` modifier that sets up the event listener after the element is first inserted and removes the event listener when the element is removed. 

Run the following commands to install the addon and generate a new modifier:

```bash
ember install ember-modifier
ember generate modifier on-click-outside
```

The `on-click-outside` modifier adds the click handler to the `document` and returns _another function_ that should be run when Ember removes the element the modifier is attached to.

```js {data-filename="app/modifiers/on-click-outside.js"}
import { modifier } from "ember-modifier";

export default modifier((element, [callback]) => {
  function handleClick(event) {
    if (!element.contains(event.target)) {
      callback();
    }
  }

  document.addEventListener("click", handleClick);

  return () => {
    document.removeEventListener("click", handleClick);
  };
});
```

Now that we've created this modifier, we can use it in our `modal` component, and add some logic to invoke a passed-in action whenever the user clicks outside the modal.

```handlebars {data-filename="app/templates/components/modal.hbs"}
<div class="modal" {{on-click-outside @clickedOutside}}>
  {{yield}}
</div>
```

We could then use the `modal` component this way:

```handlebars {data-filename="app/templates/components/sidebar.hbs"}
<p class="help-icon" {{on "click" this.showHelp}}>?</p>

{{#if this.showingHelp}}
  <Modal @clickedOutside={{this.hideHelp}}>
    Here's some interesting facts about the sidebar that you can learn.
  </Modal>
{{/if}}
```

```js {data-filename="app/components/sidebar.js"}
import Component from "@glimmer/component";
import { action } from "@ember/object";

export default class SidebarComponent extends Component {
  @tracked showingHelp = false;

  @action
  showHelp() {
    this.showingHelp = true;
  }

  @action
  hideHelp() {
    this.showingHelp = false;
  }
}
```

#### Modifiers and `...attributes`

Modifiers can also be applied to components, and when they are, they are also
passed forward and applied to an element with `...attributes`:

```handlebars
<Tooltip {{did-insert this.setupTooltip}}/>
```

```handlebars {data-filename="app/templates/components/tooltip.hbs"}
<div ...attributes>
  ...
</div>
```

In this example, the `div` within the Tooltip component will get the
`did-insert` modifier applied to it.
