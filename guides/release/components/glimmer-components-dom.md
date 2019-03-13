For the most part, you should be be able to build Ember applications without directly manipulating the DOM. Before considering directly accessing the DOM, it's always best to first consider whether there's an Ember-native way to accomplish your goal.

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
<Article @title={{model.title}} @body={{model.title}}>
```

The first time the `Article` component is rendered, it would produce this output:

```html
<article>
  <header><h1>Hello world</h1></header>
  <section>This is the first article</section>
</article>
```

You can think of this as working through substitution: references to `@title` in the component's template are replaced by the value passed in from the outside.

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

You can think of this as working by evaluating the template from scratch, substituting in the new values, and updating the output with the new contents.

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
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>

In general, before reaching for direct DOM manipulation, you should see whether you can model the changes that you want by writing a single template that applies no matter what the input is.

## Manipulating Attributes

The same philosophy that applies to manipulating text also applies to manipulating attributes.

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

Again, you can think of attributes as working through substitution. If the model changes to:

```json {data-filename="input" data-diff="-2,+3"}
{
  "title": "Hello world",
  "title": "Hello world!",
  "body": "This is the first article. [UPDATE] I am so excited!"
}
```

the output will be updated to:

```html {data-filename="output" data-diff="-2,+3"}
<article title="Hello world">
  <header><h1>Hello world</h1></header>
  <header><h1>Hello world!</h1></header>
  <section>This is the first article. [UPDATE] I am so excited!</section>
</article>
```

## Conditional Attributes

## Summary: The Principle of Substitution

## Event Handlers

If you want to add an event handler to an HTML element, you can use the `{{on` element modifier to do so.

```js {data-filename="app/components/counter.js"}
import Component from "@glimmer/component";
import action from "@ember/object";

export default class Counter extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count++;
  }
}
```

```handlebars {data-filename="app/templates/components/counter.hbs"}
<p>{{this.count}}</p>

<button {{on 'click' this.increment}}>+</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        "Element modifiers" appear inside free-floating curlies inside of an opening
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
    <img src="/images/mascots/tomster.png" role="presentation" alt="Ember Mascot">
  </div>
</div>

## Manipulating Properties

Manipulating attributes is straight-forward: since you're writing an HTML template, you can use dynamic substitution inside of an attribute's value, and the principle of substitution means that whenever the value changes, the attribute will change.

Setting properties on an HTML element, on the other hand, is a different story, because there's no way to set a property using HTML syntax.

For example, let's say you want to create an `<audio>` element, but pass it a blob as its [`srcObject`](https://www.w3.org/TR/html52/semantics-embedded-content.html#dom-htmlmediaelement-srcobject).

Since `srcObject` is a property and not an HTML attribute, you can use the `prop` element modifier like this (TODO: needs to be written):

```handlebars
<audio {{prop srcObject=this.blob}} />
```

If the value changes, Ember will automatically update the element's property for you.

### How to Know If You Need a Property

If you're looking at a piece of documentation written using HTML syntax, you can use the syntax as-is in your template, and use `{{` to insert dynamic content.

On the other hand, if you're looking at JavaScript documentation that tells you to set a property on an element object, you can use `{{prop` to set the prop

If you want to set a property, you can use the `prop` element modifier.

For example
