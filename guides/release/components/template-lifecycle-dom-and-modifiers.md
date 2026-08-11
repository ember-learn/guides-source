## DOM Manipulation: You Often Don't Need It

For the most part, you should be able to build Ember applications without directly manipulating the DOM. It's better to use the Ember-provided templating language, because it will automatically be kept up to date in an efficient way as your state changes.

### Render content to the page using curlies in templates:

```gjs
<title>{{@title}}</title>
```

### Set HTML attributes directly in templates:

```gjs
<a href={{@link}}>
```

### Concatenated and Conditional HTML attributes work in templates:

```gjs
<div class="example {{@customClass}} {{if @highlighted 'highlighted' ''}}">
```

## When You Do Need DOM Manipulation, use Modifiers

Ember's basic primitive for interacting with the DOM is called a `modifier`. You invoke a modifier inside curlies directly on an HTML Element (or Component):

```gjs
<div {{on "click" this.doSomething}}>
```

## Event Handlers

If you want to add an event handler to an HTML element, you can use the `{{on` element modifier.

```gjs {data-filename="app/components/counter.gjs"}
import Component from "@glimmer/component";
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component {
  @tracked count = 0;

  increment = () => {
    this.count++;
  };

  <template>
    <p>{{this.count}}</p>

    <button type="button" {{on "click" this.increment}}>+</button>
  </template>
}
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

```gjs
import prop from 'ember-prop-modifier/addon/modifiers/prop.js';

<template>
  <audio {{prop srcObject=@blob}} />
</template>
```

[prop-modifier]: https://www.npmjs.com/package/ember-prop-modifier

If the value changes, Ember will automatically update the element's property for you.

### How to Know If You Need a Property

If you're looking at a piece of documentation written using HTML syntax, you can use the syntax as-is in your template, and use `{{` to insert dynamic content.

On the other hand, if you're looking at JavaScript documentation that tells you to set a property on an element object, you can use `{{prop` to set the prop

If you want to set a property, you can use the `prop` element modifier.

## Calling Methods On First Render

So far, we've talked about web APIs that work by setting attributes as well as web APIs that work by setting properties. But what about web APIs that work by calling methods, like setting focus on an element?

For example, let's say we want to focus an `<input>` in a form as soon as the form is rendered. The web API for focusing an element is:

```js
inputElement.focus();
```

This code needs to run after the element is rendered.
The simplest way to accomplish this is by using a modifier.

Ember apps ship with [ember-modifier](https://github.com/ember-modifier/ember-modifier), an official part of the framework that provides a friendly API for writing your own element modifiers.
In the following examples, the modifier API is imported from the `ember-modifier` package.

```gjs {app/components/edit-form.gjs}
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default class EditFormComponent extends Component {

  focusElement = modifier((element) => {
    element.focus();
  });

  <template>
    <input {{focusElement}}>
  </template>
}
```

The `focusElement` modifier will call a function after its element is added to the DOM. That function receives the element as a parameter.

### Abstracting the Logic Into a Shared Modifier

If you want to pull this logic into reusable functionality that you can use throughout your app, you can put your modifier in a separate module and import it wherever you want.

The modifier that we're going to build will allow us to say:

```gjs {data-filename="app/components/edit-form.gjs"}
import autofocus from 'my-app/modifiers/autofocus';

<template>
  <form>
    <input {{autofocus}}>
  </form>
</template>
```

Pretty nice, right?

First generate the `autofocus` modifier for your application:

```bash
ember generate modifier autofocus
```

Now add the functionality to focus the element:

```js {data-filename="app/modifiers/autofocus.js"}
import { modifier } from "ember-modifier";

export default modifier((element) => element.focus());
```

And that's it! Now we can import and use our custom `{{autofocus}}` modifier throughout our application.

Read more about the `ember-modifier` APIs at [ember-modifiers:
Usage](https://github.com/ember-modifier/ember-modifier#usage).

## Communicating Between Elements in a Component

What if you want to handle an event in one part of your component by calling a DOM method on another part? For example, let's say you're creating an audio component:

```gjs {data-filename="app/components/audio-player.gjs"}
import Component from "@glimmer/component";

export default class AudioPlayerComponent extends Component {

  <template>
    <audio src={{@srcURL}} />

    <button type="button">Play</button>
    <button type="button">Pause</button>
  </template>
}
```

How should we connect clicking the "Play" and "Pause" to calling the audio tag's `play` and `pause` methods?

While we _could_ manage these DOM interactions in the component class, we're better off using a modifier here. It lets us cleanly separate our concerns: the component manages the _state_, and the modifier manages _interactions with the DOM_.

There are three reasons to reach for modifiers for DOM element interactions:

1. A component, by itself, doesn't have direct access to DOM elements. We have to render the page, push an element back up into the component class, and only then can we safely refer to that element. This can sometimes require us to render the component's HTML twice in order for things to start working. Modifiers let us avoid this possible performance issue.
2. By keeping state in the component and handling DOM method calls in a modifier, we can use autotracking and stick to 1-way data flow in the component. Further, we could change the component's own design later _without_ having to change how we interact with the DOM element.
3. The code for calling the audio element's `play` and `pause` can be reused. It isn't tied to this particular audio component. It can be tested independently, too!

Now that we see _why_ we want to use a modifier for our audio component, let's walk through _how_ to create one. We will start with the component (to manage the state) and then implement the modifier (the manage the DOM).

First, we add actions to handle the `click` events for the `Play` and `Pause` buttons:

```gjs {data-filename="app/components/audio-player.gjs" data-diff="+2,+6,+7,+8,+10,+11,+12,-17,+18,-19,+20"}
import Component from "@glimmer/component";
import { on } from '@ember/modifier';

export default class AudioPlayerComponent extends Component {

  play = () => {
    // TODO
  };

  pause = () => {
    // TODO
  };

  <template>
    <audio src={{@srcURL}} />

    <button type="button">Play</button>
    <button type="button" {{on "click" this.play}}>Play</button>
    <button type="button">Pause</button>
    <button type="button" {{on "click" this.pause}}>Pause</button>
  </template>
}
```

Recall that our modifier will manage the DOM (i.e. calling the audio element's `play` or `pause` method). All the component needs to do is to track whether the audio is playing:

```gjs {data-filename="app/components/audio-player.gjs" data-diff="+3,+6,-9,+10,-14,+15"}
import Component from "@glimmer/component";
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class AudioPlayerComponent extends Component {
  @tracked isPlaying = false;

  play = () => {
    // TODO
    this.isPlaying = true;
  };

  pause = () => {
    // TODO
    this.isPlaying = false;
  };

  <template>
    <audio src={{@srcURL}} />

    <button type="button" {{on "click" this.play}}>Play</button>
    <button type="button" {{on "click" this.pause}}>Pause</button>
  </template>
}
```

That's it for the component: we're translating the user's interactions into _state_. Now we need to build a modifier to translate the state into the appropriate DOM method calls!

```bash
ember generate modifier play-when
```

The modifier takes 1 argument, a Boolean that specifies if we should call the element's `play` or `pause` method.

```js {data-filename="app/modifiers/play-when.js"}
import { modifier } from "ember-modifier";

export default modifier((element, [isPlaying]) => {
  if (isPlaying) {
    element.play();
  } else {
    element.pause();
  }
});
```

Last but not least, we attach the modifier to the `audio` element:

```gjs {data-filename="app/components/audio-player.gjs" data-diff="+4,-18,+19"}
import Component from "@glimmer/component";
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import playWhen from 'my-app/modifiers/play-when';

export default class AudioPlayerComponent extends Component {
  @tracked isPlaying = false;

  play = () => {
    this.isPlaying = true;
  };

  pause = () => {
    this.isPlaying = false;
  };

  <template>
    <audio src={{@srcURL}} />
    <audio src={{@srcURL}} {{playWhen this.isPlaying}} />

    <button type="button" {{on "click" this.play}}>Play</button>
    <button type="button" {{on "click" this.pause}}>Pause</button>
  </template>
}
```

With that, we can now click the buttons to play and pause the audio!

In summary, when you want to allow elements in a component to communicate, see if you can separate the concerns of _managing state_ and _managing DOM interactions_. The component can manage the state, while a modifier can manage the DOM.

The modifier that we made for the audio player component can be reused on _any_ element that implements `play` and `pause` methods. In particular, we can reuse the modifier on any `HTMLMediaElement`, which includes `audio` and `video` elements.

## Out-of-Component Modifications

In most cases, your component should restrict its behavior to its own elements. However, there are cases where a component needs to do something outside of itself. One simple example of this would be an element that wants to handle clicks outside of its DOM, which requires registering a handler on the whole document, and then hit-testing the element.

Let's start with the DOM structure of a super-simple component that would remove its contents when a click occurs outside of the element.

```gjs {data-filename="app/components/modal.gjs"}
<template>
  <div class="modal">
    {{yield}}
  </div>
</template>
```

We don't want to use `{{on "click"}}` here because we want the opposite behavior: do something whenever the user clicks _outside_ of the `<div>`. To accomplish that, we'll register a `click` handler on the entire document and then hit-test it, looking something like this:

```js
document.addEventListener("click", (event) => {
  if (!element.contains(event.target)) {
    // do something
  }
});
```

The most important difference between this example and the cases we've seen so far is that we need to remove the `click` event handler from the document when this element is destroyed.

To accomplish this, we can create a `on-click-outside` modifier that sets up the event listener after the element is first inserted and removes the event listener when the element is removed.

Generate the new modifier:

```bash
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

```gjs {data-filename="app/components/modal.gjs"}
import onClickOutside from 'my-app/modifiers/on-click-outside';

<div class="modal" {{onClickOutside @clickedOutside}}>
  {{yield}}
</div>
```

We could then use the `modal` component this way:

```gjs {data-filename="app/components/sidebar.gjs"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from '@ember/modifier';
import Modal from 'my-app/components/modal';

export default class SidebarComponent extends Component {
  @tracked showingHelp = false;

  showHelp = () => {
    this.showingHelp = true;
  };

  hideHelp = () => {
    this.showingHelp = false;
  };

  <template>
    <p class="help-icon" {{on "click" this.showHelp}}>?</p>

    {{#if this.showingHelp}}
      <Modal @clickedOutside={{this.hideHelp}}>
        Here's some interesting facts about the sidebar that you can learn.
      </Modal>
    {{/if}}
  </template>
```

### Modifiers and `...attributes`

Modifiers can also be applied to components, and when they are, they are also
passed forward and applied to an element with `...attributes`:

```gjs
import doSomething from 'my-app/modifiers/do-something';

<template>
  <Tooltip {{doSomething}}/>
</template>
```

```gjs {data-filename="app/components/tooltip.hbs"}
<template>
  <div ...attributes>
    ...
  </div>
</template>
```

In this example, the `div` within the Tooltip component will get the
`doSomething` modifier applied to it.
