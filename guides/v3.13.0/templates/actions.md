Your app will often need a way to let users interact with controls that
change application state. For example, imagine that you have a template
that shows a blog title, and supports expanding the post to show the body.

If you add the
[`{{action}}`](https://api.emberjs.com/ember/3.13/classes/Ember.Templates.helpers/methods/action?anchor=action)
helper to any HTML DOM element, when a user clicks the element, the named event
will be sent to the template's corresponding component or controller.

```handlebars {data-filename=app/templates/components/single-post.hbs}
<h3><button {{action "toggleBody"}}>{{this.title}}</button></h3>
{{#if this.isShowingBody}}
  <p>{{this.body}}</p>
{{/if}}
```

In the component or controller, you can then define what the action does within
the `actions` hook:

```javascript {data-filename=app/components/single-post.js}
import Component from '@ember/component';

export default Component.extend({
  actions: {
    toggleBody() {
      this.toggleProperty('isShowingBody');
    }
  }
});
```

You will learn about more advanced usages in the Component's [Triggering Changes With Actions](../../components/triggering-changes-with-actions/) guide,
but you should familiarize yourself with the following basics first.

## Action Parameters

You can optionally pass arguments to the action handler. Any values
passed to the `{{action}}` helper after the action name will be passed to
the handler as arguments.

For example, if the `post` argument was passed:

```handlebars
<p><button {{action "select" this.post}}>✓</button> {{this.post.title}}</p>
```

The `select` action handler would be called with a single argument
containing the post model:

```javascript {data-filename=app/components/single-post.js}
import Component from '@ember/component';

export default Component.extend({
  actions: {
    select(post) {
      console.log(post.get('title'));
    }
  }
});
```

## Specifying the Type of Event

By default, the
[`{{action}}`](https://api.emberjs.com/ember/3.13/classes/Ember.Templates.helpers/methods/action?anchor=action)
helper listens for click events and triggers the action when the user clicks
on the element.

You can specify an alternative event by using the `on` option.

```handlebars
<p>
  <button {{action "select" this.post on="mouseUp"}}>✓</button>
  {{this.post.title}}
</p>
```

You should use the <code>camelCased</code> event names, so two-word names like `keypress`
become `keyPress`.

## Allowing Modifier Keys

By default, the `{{action}}` helper will ignore click events with
pressed modifier keys. You can supply an `allowedKeys` option
to specify which keys should not be ignored.

```handlebars
<button {{action "anActionName" allowedKeys="alt"}}>
  click me
</button>
```

This way the `{{action}}` will fire when clicking with the alt key
pressed down.

## Allowing Default Browser Action

By default, the `{{action}}` helper prevents the default browser action of the DOM event (i.e. going to `newPage.htm`). So, for example see the following standard `a` tag with an `action`:

```handlebars
<a href="newPage.htm" {{action "logClick"}}>Go</a>
```

**Clicking on this link does not go to `newPage.htm`** because the `action` has overridden this functionality. This is the default behavior for Ember.

You can override this behavior and make this work more like a standard, non-ember, anchor tag by using the `preventDefault=false` overload of the action on an `a` tag. For example:

```handlebars
<a href="newPage.htm" {{action "logClick" preventDefault=false}}>Go</a>
```

This still triggers the `logClick` action but then **we also go to `newPage.htm`.**

You can specify `preventDefault=true` and this reverts to the standard Ember functionality (see previous example).

## Modifying the action's first parameter

If a `value` option for the
[`{{action}}`](https://api.emberjs.com/ember/3.13/classes/Ember.Templates.helpers/methods/action?anchor=action)
helper is specified, its value will be considered a property path that will
be read off of the first parameter of the action. This comes very handy with
event listeners and enables to work with one-way bindings.

```handlebars
<label>What's your favorite band?</label>
<input type="text" value={{this.favoriteBand}} onblur={{action "bandDidChange"}} />
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
listener, the event object the browser passes to the handler, so
`bandDidChange` prints `Event {}`.

Using the `value` option modifies that behavior by extracting that property from
the event object:

```handlebars
<label>What's your favorite band?</label>
<input type="text" value={{this.favoriteBand}} onblur={{action "bandDidChange" value="target.value"}} />
```

The `newValue` parameter thus becomes the `target.value` property of the event
object, which is the value of the input field the user typed. (e.g 'Foo Fighters')

## Attaching Actions to Non-Clickable Elements

Note that while Ember currently permits you to add an action to any DOM element, not all DOM elements are eligible to receive focus, according to HTML standards.

For example, if an action is attached to an `a` link
without an `href` attribute, or to a `div`, some browsers won't execute the
associated function.

Always check to see that the element you are adding an action to is interactive, according to
[web accessibility and browser standards](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Interactive_elements).
As a rule of thumb, if you find yourself adding an action an `<a>` tag, you should turn it into a `<button>` instead.

For more information about building accessible apps in Ember, see the
[Accessibility Guide](../../accessibility/).
