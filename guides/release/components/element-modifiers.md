Element modifiers are functions that run when an element is rendered, letting you attach behavior directly to that element. They are the bridge between Ember's declarative templates and the imperative, JavaScript side of the DOM: event listeners, focus management, measuring, third-party widget libraries, and other side effects that HTML alone can't express.

A modifier appears inside the opening tag of an element, in double curly braces:

```gjs
import autofocus from 'my-app/modifiers/autofocus';

<template>
  <input {{autofocus}}>
</template>
```

When Ember inserts the `<input>` element into the DOM, it calls the modifier with that element. If the modifier sets anything up that needs to be undone later—like an event listener or an observer—it can provide cleanup that Ember runs automatically when the element is removed.

The previous chapter, [Template Lifecycle, DOM, and Modifiers](../template-lifecycle-dom-and-modifiers/), explains _when_ to reach for a modifier instead of an attribute. This chapter covers modifiers themselves: the built-in `{{on}}` modifier, and how to write your own.

## Rules of Modifiers

A few things are true of every modifier:

- Modifiers run **after** the element they are attached to has been created and inserted into the DOM. They are passed that element as their first argument.
- Modifiers do **not** run during server-side rendering, since there is no real DOM on the server to hand to them.
- Modifiers can run again when tracked state they used changes. Before a modifier re-runs, and when its element is removed, its cleanup function (if any) runs.
- The order in which multiple modifiers on the same element run is not guaranteed, so avoid writing modifiers that depend on the effects of other modifiers.

Like components and helpers in `<template>`, modifiers are just JavaScript values: you import them (or define them inline) and use them by name.

When a modifier is applied to a component invocation instead of an element, it is forwarded—along with the rest of `...attributes`—to whichever element the component spreads `...attributes` onto. See [Modifiers and `...attributes`](../template-lifecycle-dom-and-modifiers/#toc_modifiers-and-attributes).

## The `{{on}}` Modifier

The most common modifier is `{{on}}`, which Ember provides out of the box. It attaches an event listener to an element using [`addEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener), and removes the listener when the element is removed.

```gjs {data-filename="app/components/like-button.gjs"}
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class LikeButton extends Component {
  @tracked likes = 0;

  like = () => {
    this.likes++;
  };

  <template>
    <button type="button" {{on "click" this.like}}>
      ♥ {{this.likes}}
    </button>
  </template>
}
```

`{{on}}` takes exactly two positional arguments: the event name, exactly as you would pass it to `addEventListener` (`"click"`, `"submit"`, `"pointerdown"`, and so on), and the function to call. The function receives the native [`Event`](https://developer.mozilla.org/docs/Web/API/Event) object.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The function you pass to <code>{{on}}</code> is called without a <code>this</code> context. Define your event handlers as arrow-function class fields, like <code>like</code> above, so that <code>this</code> refers to your component.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Passing Additional Arguments

Since `{{on}}` only accepts the event name and a function, use the `fn` helper to pass extra arguments along:

```gjs {data-filename="app/components/color-picker.gjs"}
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';

export default class ColorPicker extends Component {
  select = (color, event) => {
    // `color` is the value passed to `fn`;
    // `event` is the click event, appended last
  };

  <template>
    {{#each @colors as |color|}}
      <button type="button" {{on "click" (fn this.select color)}}>
        {{color}}
      </button>
    {{/each}}
  </template>
}
```

### Event Listener Options

`{{on}}` accepts three named arguments, matching the options of `addEventListener`:

- `capture` — listen during the capture phase, before the event reaches elements deeper in the tree.
- `once` — remove the listener automatically after it fires the first time.
- `passive` — promise the browser that the listener will never call `event.preventDefault()`, which allows it to keep scrolling smooth. In development mode, calling `preventDefault()` from a passive listener throws an error.

```gjs
<template>
  <div {{on "scroll" @onScroll passive=true}}>
    {{yield}}
  </div>
</template>
```

## Writing Your Own Modifiers

For everything `{{on}}` doesn't cover, you can write your own modifiers using [ember-modifier](https://github.com/ember-modifier/ember-modifier), which ships with new Ember apps as an official part of the framework. It provides two APIs, mirroring the two ways to define helpers: a `modifier` function for most cases, and a `Modifier` base class for advanced ones.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        Unlike helpers, plain functions cannot (yet) be used directly as modifiers. Wrap them with the <code>modifier</code> function from <code>ember-modifier</code>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Function-Based Modifiers

Pass a function to `modifier()`. The function receives the element, an array of positional arguments, and an object of named arguments:

```js
import { modifier } from 'ember-modifier';

export default modifier((element, positional, named) => {
  // set up the element
});
```

The `autofocus` example from the start of this chapter is a one-liner:

```js {data-filename="app/modifiers/autofocus.js"}
import { modifier } from 'ember-modifier';

export default modifier((element) => element.focus());
```

You can put shared modifiers in `app/modifiers` (the `ember generate modifier autofocus` command will create one there for you) and import them wherever they are needed. For a modifier that only makes sense in one component, you can define it in the same file instead—even as a class field:

```gjs {data-filename="app/components/search-form.gjs"}
import Component from '@glimmer/component';
import { modifier } from 'ember-modifier';

export default class SearchForm extends Component {
  focusWhenEditing = modifier((element) => {
    if (this.args.isEditing) {
      element.focus();
    }
  });

  <template>
    <input {{this.focusWhenEditing}}>
  </template>
}
```

### Arguments

Arguments are passed to a modifier the same way as to a helper: positional arguments by position, named arguments with `name=value`.

```js {data-filename="app/modifiers/scroll-position.js"}
import { modifier } from 'ember-modifier';

export default modifier((element, [position], { relative }) => {
  if (relative) {
    element.scrollTop += position;
  } else {
    element.scrollTop = position;
  }
});
```

```gjs
import scrollPosition from 'my-app/modifiers/scroll-position';

<template>
  <div class="scroll-container" {{scrollPosition @scrollPosition relative=false}}>
    {{yield}}
  </div>
</template>
```

### Cleaning Up

Most interesting modifiers set something up that must be torn down again: an event listener, a timer, an observer, a third-party library instance. To handle this, return a function from your modifier. Ember calls it when the element is removed from the DOM—and before the modifier re-runs, as we'll see in a moment.

Here is a modifier that watches an element's size with a [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) and reports changes to a callback:

```js {data-filename="app/modifiers/on-resize.js"}
import { modifier } from 'ember-modifier';

export default modifier((element, [callback]) => {
  let observer = new ResizeObserver(([entry]) => {
    callback(entry.contentRect);
  });

  observer.observe(element);

  return () => observer.disconnect();
});
```

```gjs {data-filename="app/components/chart.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import onResize from 'my-app/modifiers/on-resize';

export default class Chart extends Component {
  @tracked width = 0;

  updateSize = ({ width }) => {
    this.width = width;
  };

  <template>
    <div class="chart" {{onResize this.updateSize}}>
      <!-- draw a chart sized for {{this.width}} -->
    </div>
  </template>
}
```

The component never touches the DOM directly: the modifier owns the observer and its cleanup, while the component only manages state. When the `<div>` is removed, Ember calls the returned function and the observer is disconnected. No leaks, and nothing for the component to remember to do.

The same pattern works for integrating third-party libraries. Most DOM-oriented libraries have the shape "create an instance attached to an element, then destroy it later," which maps directly onto a modifier:

```js {data-filename="app/modifiers/tooltip.js"}
import { modifier } from 'ember-modifier';
import tippy from 'tippy.js';

export default modifier((element, [content]) => {
  let tooltip = tippy(element, { content });

  return () => tooltip.destroy();
});
```

```gjs
import tooltip from 'my-app/modifiers/tooltip';

<template>
  <button type="button" {{tooltip "Save your changes"}}>
    Save
  </button>
</template>
```

## When Modifiers Re-Run

Modifiers participate in [autotracking](../../in-depth-topics/autotracking-in-depth/), just like the rest of your templates. A modifier runs once when its element is inserted. While it runs, Ember tracks every piece of tracked state it reads—including its arguments. When any of that state changes, the modifier runs again: first the cleanup function from the previous run is called, then the modifier function runs fresh with the current argument values.

In the `on-resize` example above, the modifier reads `[callback]`. If the component ever swaps in a different callback, the old observer is disconnected and a new one is created with the new callback. The full lifecycle of a function-based modifier is:

1. Element inserted → modifier runs.
2. Tracked state used by the modifier changes → cleanup runs, then the modifier runs again.
3. Element removed → cleanup runs one last time.

Two details of this behavior are worth knowing:

- Re-runs are based on what the modifier actually _used_. If an argument changes but the modifier never read it, the modifier does not re-run.
- A function-based modifier always tears down completely and starts over when it re-runs. If your setup is expensive and you want to update it incrementally instead, use a class-based modifier.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        Avoid writing to tracked state from inside a modifier if that state is also read by the template that is currently rendering—Ember will raise an error about updating a value that was already used. Modifiers are for pushing state <em>out</em> to the DOM. When the DOM needs to push information back into your component (as in the resize example), it should happen asynchronously, via callbacks from events or observers.
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

## Class-Based Modifiers

The `modifier()` function covers the vast majority of cases. Reach for the class-based API when you need to:

1. inject services,
2. keep state across re-runs, or
3. avoid tearing everything down on every re-run, for performance.

A class-based modifier extends the `Modifier` base class and implements a single hook, `modify()`. It receives the same three things as a function-based modifier: the element, the positional arguments, and the named arguments. It is called when the modifier is installed and again whenever tracked state it used changes—but on the _same instance_, so class fields persist between runs.

Cleanup works differently: instead of returning a function, register a destructor with `registerDestructor` from [`@ember/destroyable`](https://api.emberjs.com/ember/release/modules/@ember%2Fdestroyable). It runs when the modifier is destroyed.

Here is a modifier that reports clicks to an analytics service:

```js {data-filename="app/modifiers/track-click.js"}
import Modifier from 'ember-modifier';
import { service } from '@ember/service';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  instance.element?.removeEventListener('click', instance.onClick);
}

export default class TrackClick extends Modifier {
  @service analytics;

  element = null;
  eventName = null;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  modify(element, [eventName]) {
    // remove the listener from the previous run, if any
    cleanup(this);

    this.element = element;
    this.eventName = eventName;
    element.addEventListener('click', this.onClick);
  }

  onClick = () => {
    this.analytics.trackEvent(this.eventName);
  };
}
```

```gjs
import trackClick from 'my-app/modifiers/track-click';

<template>
  <button type="button" {{trackClick "signup-button-clicked"}}>
    Sign up
  </button>
</template>
```

A few patterns to note, since `modify()` may run many times on one instance:

- Register destructors in the `constructor`, which runs once, rather than in `modify()`.
- Write cleanup so it is safe to call when there is nothing to clean up yet, and call it at the top of `modify()` to reset any previous run.
- The element and arguments are only available as parameters to `modify()`; store them on the instance yourself if your destructor or other methods need them.

## Modifiers with TypeScript

Both APIs are fully typed. For function-based modifiers, write the types directly on the function:

```ts {data-filename="app/modifiers/on-resize.ts"}
import { modifier } from 'ember-modifier';

export default modifier(
  (element: HTMLElement, [callback]: [(rect: DOMRectReadOnly) => void]) => {
    let observer = new ResizeObserver(([entry]) => {
      callback(entry.contentRect);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }
);
```

Class-based modifiers are typed with a signature, much like components, declaring the kind of element the modifier may be attached to and its positional and named arguments. See [TypeScript: Invokables](../../typescript/core-concepts/invokables/#toc_modifiers) for the full details.

## Testing Modifiers

Modifiers are tested with rendering tests: render a template that applies the modifier, then assert on the DOM.

```gjs {data-filename="tests/integration/modifiers/autofocus-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import autofocus from 'my-app-name/modifiers/autofocus';

module('Integration | Modifier | autofocus', function (hooks) {
  setupRenderingTest(hooks);

  test('it focuses the element', async function (assert) {
    await render(<template><input {{autofocus}}></template>);

    assert.strictEqual(document.activeElement, document.querySelector('input'));
  });
});
```

To test update behavior, change tracked state that the modifier consumed and wait for re-rendering with `rerender()` or `settled()` from `@ember/test-helpers`. To test cleanup, render the element inside an `{{#if}}` and toggle it away. The [Testing Components](../../testing/testing-components/) guide covers these tools in depth.

## Choosing the Right Tool

Modifiers are for side effects that are tied to the lifetime of a DOM element. Before writing one, check the simpler options:

- **Can it be expressed as HTML?** Use attribute substitution: `<div class={{if @isAdmin "superuser"}}>`. See [Template Lifecycle, DOM, and Modifiers](../template-lifecycle-dom-and-modifiers/).
- **Is it a computation?** Use a getter or a [helper function](../helper-functions/). Derived state doesn't need an element.
- **Is it a side effect with no element involved**—polling, a `WebSocket`, document-level state? A modifier is the wrong shape: it won't run until something renders, and it shouldn't be coupled to an arbitrary element. Use a [service](../../services/), or register cleanup directly on your component with `registerDestructor`.

When you do write a modifier, name it after the _behavior_ it provides—`{{autofocus}}`, `{{tooltip}}`, `{{onResize}}`—rather than after a moment in time. You may encounter older code using the `@ember/render-modifiers` addon, whose `{{did-insert}}` and `{{did-update}}` modifiers run arbitrary functions at lifecycle moments. Those were designed as a temporary migration aid, and even their own documentation discourages them: they spread one concern across several template hooks and a component method, where a custom modifier keeps the setup, update, and cleanup logic together in one named, reusable, independently testable unit.
