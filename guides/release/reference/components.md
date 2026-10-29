This page lists component-specific behaviors you might need to know about on one page.
Use the "On this page" sidebar to jump to a topic, or search the page with <kbd>Ctrl</kbd>+<kbd>F</kbd> (<kbd>⌘</kbd>+<kbd>F</kbd> on a Mac) for the syntax/API/feature that you want.

For template syntaxes and APIs, view [The Template Reference](./templates).

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
It has no state, so its output depends only on its arguments or what it uses that is within scope.
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
