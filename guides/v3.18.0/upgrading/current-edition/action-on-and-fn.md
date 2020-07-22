Octane provides a set of new conventional APIs for creating and adding event
handlers and actions to your components and templates:

* The `@action` decorator
* The `{{on}}` modifier
* The `{{fn}}` helper

These are meant to replace the `{{action}}` helper/modifier, which will be
deprecated in the future. You can use them like this:

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class TodoComponent extends Component {
  @action
  toggleCompleted(isComplete) {
    // ...
  }
}
```

```handlebars
<button type="button" {{on "click" (fn this.toggleCompleted true)}}>Complete</button>
```

## Benefits of `@action`, `{{on}}`, and `{{fn}}`

`{{action}}` has a number of functions, including:

* Creating action callbacks, which bind the _context_ of the callback (the
  component/controller).
* Adding arguments to action callbacks:

  ```handlebars
    <!-- passes 123 to the 'setValue' action -->
    <MyComponent @onClick={{action 'setValue' 123}} />
  ```

* Adding event handlers to elements (when used as a modifier):

  ```handlebars
    <button type="button" {{action 'sayHello'}}>Say Hello!</button>
  ```

The new APIs split each of these pieces of functionality out into one clearly
defined API:

* `@action` is a decorator that binds a method to the context its used in
* `{{on}}` is a modifier that's used to add event listeners to DOM elements
* `{{fn}}` is a helper that adds arguments to another function or callback

This keeps the responsibilities clearly delineated, and makes it much easier to
reason about what each individual API is doing.

## Getting used to `@action`, `{{on}}`, and `{{fn}}`

### The `@action` Decorator

In Ember Octane, actions are no longer defined on the `actions` object of a
component or controller. Instead, they are standard class methods decorated with
the `@action` decorator.

Before:

```javascript
import Component from '@ember/component';

export default Component.extend({
  actions: {
    doSomething() {
      // ...
    }
  }
})
```

After:

```javascript
import Component from '@glimmer/component';

export default class ExampleComponent extends Component {
  @action
  doSomething() {
    // ...
  }
}
```

The decorator leaves the method intact without any changes, so you can continue
to use it like a normal method. This also means that you can reference the
action directly in templates, instead of using strings.

Before:

```handlebars
<button type="button" {{action "doSomething"}}>Click Me!</button>
```

After:

```handlebars
<button type="button" {{on "click" this.doSomething}}>Click Me!</button>
```

The decorator _is_ important, as it binds the action directly to the class so it
can reference it later on.

### The `{{on}}` Modifier

The API for `{{on}}` is the same as JavaScript's native [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). It receives the event name as the first argument, and a
callback function as the second argument:

```handlebars
<button type="button" {{on "click" this.handleClick}}>Click Me!</button>
```

The event can be _any_ event name, not just the `click` event, which makes
`{{on}}` perfect for handling any kind of DOM event. For a list of native
browser events, see the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/Events).
The callback function will receive the event as its first argument:

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ExampleComponent extends Component {
  @action
  handleClick(event) {
    event.preventDefault();
  }
}
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        The <code>{{action}}</code> modifier called <code>event.preventDefault()</code> under the hood, but the <code>{{on}}</code> modifier does not, so if you need to do anything other than the default action for a particular event, you must call <code>event.preventDefault</code> within the action.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div> 

This is a replacement for `{{action}}` when it is used as a modifier:

```handlebars
<!-- Before -->
<button type="button" {{action 'handleClick'}}>Click Me!</button>
<button type="button" {{action 'handleDoubleClick' on="doubleClick"}}>Double Click Me!</button>

<!-- After -->
<button type="button" {{on "click" this.handleClick}}>Click Me!</button>
<button type="button" {{on "dblclick" this.handleDoubleClick}}>Double Click Me!</button>
```

You can also pass additional options such as `passive` and `once` as named
parameters to the modifier:

```handlebars
<button type="button" {{on "click" this.handleClick passive=true}}>Click Me!</button>
```

If you ever used the `value` parameter of `{{action}}`, there is no direct
equivalent for `{{on}}`. You should instead write an action that gets the value
for you.

Before:

```handlebars
<input value={{this.value}} onchange={{action (mut this.value) value="target.value"}} />
```

After:

```handlebars
<input value={{this.value}} {{on "change" this.updateValue}} />
```
```javascript
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ExampleComponent extends Component {
  @tracked value;

  @action
  updateValue(event) {
    this.value = event.target.value;
  }
}
```

If you want to pass additional parameters to the callback function, you must use
the `{{fn}}` helper. `{{on}}` does not receive any additional parameters.

### The `{{fn}}` Helper

`{{fn}}` is a helper that receives a function and some arguments, and returns
a new function that combines. This allows you to pass parameters along to
functions in your templates:

```handlebars
<button type="button" {{on "click" (fn this.handleClick 123)}}>Click Me!</button>
```

```javascript
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ExampleComponent extends Component {
  @action
  handleClick(value) {
    console.log(value); // 123
  }
}
```

This is a replacement for passing parameters to the `{{action}}` modifier or
helper:

```handlebars
<!-- Before -->
<button type="button" {{action 'handleClick' 123}}>Click Me!</button>
<MyComponent @onClick={{action 'handleClick' 123}} />

<!-- After -->
<button type="button" {{on "click" (fn this.handleClick 123)}}>Click Me!</button>
<MyComponent @onClick={{fn this.handleClick 123}} />
```

<!-- eof - needed for pages that end in a code block  -->
