Most of the time, Ember renders your components for you: the router renders a route's template, that template invokes components, and so on down the tree. But sometimes _you_ need to be the one to start rendering—to embed an Ember component in a page that isn't an Ember app, to power a documentation site's interactive demos, to write a REPL, or to integrate with "islands"-based tools like Astro or Vitepress.

The `renderComponent` function renders any component into any DOM element, with full interactivity and reactivity, and without requiring an `Application`, a router, or any other setup.

```gjs
import { renderComponent } from '@ember/renderer';

const Hello = <template>Hello, world!</template>;

renderComponent(Hello, {
  into: document.querySelector('#some-element'),
});
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>renderComponent</code> was introduced in Ember 6.8 by <a href="https://rfcs.emberjs.com/id/1099-renderComponent/">RFC #1099</a>. It is a low-level API: inside an Ember app, you should keep letting the router and your templates do the rendering.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

When `renderComponent` is called:

- Any existing contents of the target element are cleared, and the component's output takes their place.
- The rendered component is fully live: event handlers and modifiers run, and updates are scheduled automatically when tracked state changes.
- Any component definition works—template-only components, class-based components, or components compiled at runtime.

`renderComponent` returns a `RenderResult`, an object with a single method:

```ts
interface RenderResult {
  /**
   * Destroys the render tree and removes all rendered
   * content from the element rendered into.
   */
  destroy(): void;
}
```

Hold on to the result so you can clean up when the rendered content is no longer needed.

## Passing Arguments

The `args` option provides the `@`-prefixed arguments for the rendered component. If the values are reactive, the rendered output updates automatically—the same reactivity rules as everywhere else in Ember.

A convenient way to make reactive arguments is `trackedObject` from [`@ember/reactive`](https://api.emberjs.com/ember/release/modules/@ember%2Freactive):

```gjs
import { renderComponent } from '@ember/renderer';
import { trackedObject } from '@ember/reactive/collections';

const Greeting = <template>Hello, {{@name}}!</template>;

const state = trackedObject({ name: 'Zoey' });

renderComponent(Greeting, {
  into: document.querySelector('#greeting'),
  args: state,
});

// Later: the rendered output updates automatically
state.name = 'Tomster';
```

Plain objects with getters work too. Each argument is read lazily, so a getter that reads tracked state makes that argument reactive:

```js
renderComponent(Greeting, {
  into: element,
  args: {
    get name() {
      return someTrackedState.name;
    },
  },
});
```

Two constraints to be aware of:

- The set of argument _names_ is static, just like in a template. Adding or removing keys on the `args` object later will not add or remove arguments.
- Pass a plain object (or `trackedObject`)—not a class instance with tracked fields. Only the object's own enumerable properties become arguments.

## Cleaning Up

Rendered content lives until you destroy it. Call `destroy()` on the returned `RenderResult` to remove the rendered content from the DOM and tear down the component tree—modifiers' cleanup, component destructors, and everything else runs as you would expect.

```js
const result = renderComponent(Hello, { into: element });

// later, when the content should go away:
result.destroy();
```

If you render into the same element again without destroying the previous result, the new content is rendered _alongside_ the old content rather than replacing it. When you want replacement—say, a demo that re-renders whenever its source changes—destroy the previous result first:

```js
let previous;

function show(component) {
  previous?.destroy();
  previous = renderComponent(component, {
    into: document.querySelector('#output'),
  });
}
```

## Sharing Services with an Owner

By default, each `renderComponent` call gets a private, empty [owner](../../applications/dependency-injection/). That's fine for self-contained components, but a component that injects services needs an owner that can provide them.

Pass the `owner` option to supply one. Inside an Ember app, use `getOwner` to hand your app's owner to the rendered tree, giving it access to the same services as the rest of your app:

```gjs {data-filename="app/components/island.gjs"}
import Component from '@glimmer/component';
import { getOwner } from '@ember/owner';
import { modifier } from 'ember-modifier';
import { renderComponent } from '@ember/renderer';

export default class Island extends Component {
  renderInto = modifier((element) => {
    const result = renderComponent(this.args.component, {
      into: element,
      owner: getOwner(this),
    });

    return () => result.destroy();
  });

  <template>
    <div {{this.renderInto}}></div>
  </template>
}
```

Components rendered with the same owner share that owner's services—a service injected in two separately rendered trees is the same instance, so tracked state on it stays in sync across both. The owner also takes part in cleanup: when it is destroyed, everything rendered with it is destroyed too.

## Rendering Without a Build Step

`renderComponent` pairs with the runtime template compiler ([RFC #931](https://rfcs.emberjs.com/id/0931-template-compiler-api/)) to make Ember usable with no build at all—handy for bug reproductions, online sandboxes, and teaching materials:

```html
<script type="module">
  import { renderComponent } from '@ember/renderer';
  import { template } from '@ember/template-compiler';

  renderComponent(template('Hello, {{@name}}!'), {
    into: document.querySelector('#demo'),
    args: { name: 'world' },
  });
</script>

<div id="demo"></div>
```

In a plain HTML page like this, the `@ember/...` modules can be served from a CDN with an [import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap), pointing each specifier at the corresponding file under `ember-source/dist/packages/`.

Since `template()` compiles arbitrary strings, this combination can power a full REPL: compile the user's input, render it, and destroy the previous result on each change.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        If the template string comes from user input, treat it like any other untrusted HTML and sanitize it, so users can't inject script or style tags into your page.
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

## Embedding Ember Components in Other Tools

Because `renderComponent` only needs an element, it slots into any tool that hands you one: documentation frameworks with islands architecture (Astro, Vitepress), component workshops like Storybook, web components, or even other frameworks. Wherever the host gives you a "mount" and "unmount", call `renderComponent` and `destroy`:

```jsx {data-filename="greeting-island.jsx"}
import { renderComponent } from '@ember/renderer';
import { useEffect, useRef } from 'react';
import Greeting from './greeting';

export default function GreetingIsland() {
  const ref = useRef(null);

  useEffect(() => {
    const result = renderComponent(Greeting, { into: ref.current });

    return () => result.destroy();
  }, []);

  return <div ref={ref}></div>;
}
```

## Waiting for Rendering to Finish

Rendering scheduled by `renderComponent`—like all rendering in Ember—happens asynchronously. When you need to know that the DOM reflects the latest state (in a test, or before measuring the rendered output), await `renderSettled` from the same module:

```js
import { renderComponent, renderSettled } from '@ember/renderer';

const result = renderComponent(Hello, { into: element });

await renderSettled();
// the rendered output is now in the DOM
```

## Non-Interactive Rendering

The `env.isInteractive` option (default: `true`) controls whether [modifiers](../../components/template-lifecycle-dom-and-modifiers/) run in the rendered tree. Passing `false` mimics how Ember renders during server-side rendering, where modifiers don't run because there is no real, interactive DOM:

```js
renderComponent(Hello, {
  into: element,
  env: { isInteractive: false },
});
```

This is rarely needed in application code, but is useful for tools that produce static output from components.
