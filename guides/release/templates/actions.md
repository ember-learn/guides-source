Your app will often need a way to let users interact with controls that change
application state. For example, imagine that you have a template that shows a
blog title, and supports expanding the post to show the body. This can be done
with _actions_.

Actions are methods that have been decorated with the `@action` decorator in
the context of the template:

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Post extends Component {
  @action
  toggleBody() {
    this.toggleProperty('isShowingBody');
  }
}
```

You can then add this action directly to an [_event handler
property_](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers)
on an element, like `onclick` or `onmouseenter`:

```handlebars {data-filename=app/components/post/template.hbs}
<h3>
  <button onclick={{this.toggleBody}}>{{this.title}}</button>
</h3>

{{#if this.isShowingBody}}
  <p>{{this.body}}</p>
{{/if}}
```

This assigns the action to the standard browser event handler for that function.
It'll receive the event as its first parameter, and you can handle it like any
standard JavaScript event:

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Post extends Component {
  @action
  toggleBody(event) {
    event.preventDefault();
    event.stopPropagation();
    this.toggleProperty('isShowingBody');
  }
}
```

You will learn about more advanced usages in the Component's [Actions and
Events](../../components/actions-and-events/) guide, but you should familiarize
yourself with the following basics first.

## Action Parameters

You can optionally pass arguments to the action with the
[`{{action}}`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/action?anchor=action)
helper. For example, if the `post` argument was passed:

```handlebars {data-filename=app/components/post/template.hbs}
<p>
  <button onclick={{action this.select this.post}}>
    ✓
  </button>
  {{this.post.title}}
</p>
```

The `select` action handler would be called with a single argument
containing the post model:

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Post extends Component {
  @tracked selectedPost;

  @action
  select(post) {
    this.selectedPost = post;
  }
}
```

If you pass arguments like this, the event will be the _last_ argument that is
passed to the handler:

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Post extends Component {
  @tracked selectedPost;

  @action
  select(post, event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedPost = post;
  }
}
```

## Modifying the action's first parameter

If a `value` option for the `{{action}}` helper is specified, its value will be
considered a property path that will be read off of the first parameter of the
action. This comes very handy with event listeners and enables to work with
one-way bindings.

```handlebars
<label>What's your favorite band?</label>
<input
  type="text"
  value={{this.favoriteBand}}
  onblur={{this.bandDidChange}}
/>
```

Let's assume we have an action handler that prints its first parameter:

```javascript
actions: {
  bandDidChange(newValue) {
    console.log(newValue);
  }
}
```

By default, the action handler receives the first parameter of the event
listener, the event object the browser passes to the handler, so `bandDidChange`
prints `Event {}`.

Using the `value` option modifies that behavior by extracting that property from
the event object:

```handlebars
<label>What's your favorite band?</label>
<input
  type="text"
  value={{this.favoriteBand}}
  onblur={{action this.bandDidChange value="target.value"}}
/>
```

The `newValue` parameter thus becomes the `target.value` property of the event
object, which is the value of the input field the user typed. (e.g 'Foo
Fighters')

## Attaching Actions to Non-Clickable Elements

Note that actions may be attached to any element of the DOM, but not all respond
to the `click` event. For example, if an action is attached to an `a` link
without an `href` attribute, or to a `div`, some browsers won't execute the
associated function. If it's really needed to define actions over such elements,
a CSS workaround exists to make them clickable, `cursor: pointer`. For example:

```css
[data-ember-action]:not(:disabled) {
  cursor: pointer;
}
```

Keep in mind that even with this workaround in place, the `click` event will not
automatically trigger via keyboard driven `click` equivalents (such as the
`enter` key when focused). Browsers will trigger this on clickable elements only
by default. This also doesn't make an element accessible to users of assistive
technology. You will need to add additional things like `role` and/or `tabindex`
to make this accessible for your users.
