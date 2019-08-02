Your app will often need a way to let users interact with controls that change
application state. For example, imagine that you have a template that shows a
blog title, and supports expanding the post to show the body. This can be done
with _actions_.

Actions are methods that have been decorated with the `@action` decorator in
the context of the template:

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Post extends Component {
  @tracked isShowingBody;

  @action
  toggleBody() {
    this.isShowingBody = !this.isShowingBody;
  }
}
```

`@action` binds the `this` of `toggleBody()` to the instance of the class, allowing access the component's other properties when invoked. Without the decorator, `this.isShowingBody` in `toggleBody()` is undefined. For more information on `this` [Understanding Javascript Function Invocation and this](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)

You can trigger the method `toggleBody()` on a DOM event using
[`{{on}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/on?anchor=on)
modifier:

```handlebars {data-filename=app/components/post/template.hbs}
<h3>
  <button {{on "click" this.toggleBody}}>{{@title}}</button>
</h3>

{{#if this.isShowingBody}}
  <p>{{@body}}</p>
{{/if}}
```

The `{{on}}` modifier binds the passed function to
[any event](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) --
such as `click`, `mouseup`, `focusout`, etc.
In this case, the passed action, `toggleBody`, has been bound to
the `click` event, such that when the button is clicked, `toggleBody`
will be invoked.

You will learn about more advanced usages in the Component's [Actions
and Events](../../components/actions-and-events/) guide, but you should
familiarize yourself with the basics on this page first.

Templates rendered for your application's routes are backed by controllers, so
you may also see actions defined on a controller using the same `@action`
decorator.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
If this doesn't seem familiar you might be looking for documentation
about Ember components and controller that use the older <code>.extend({</code> syntax.
In those files you define actions in an object on the class then reference
the action name with a string in the template.
For more examples of that syntax see <a href="https://guides.emberjs.com/v3.6.0/templates/actions/">previous version of this Guide entry</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>

## Action Parameters

You can optionally pass arguments to the
[`fn`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/on?anchor=fn)
helper via [partial application](https://en.wikipedia.org/wiki/Partial_application).
For example, if the `post` argument was passed:

```handlebars {data-filename=app/components/post/template.hbs}
<p>
  <button {{on "click" (fn this.select @post)}}>
    ✓
  </button>
  {{this.selectedPost.title}}
</p>
```

The `select` action handler would be called with `@post` as the first
argument and the
[native JavaScript `click` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event)
as the second argument.


```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Post extends Component {
  @tracked selectedPost;

  @action
  select(post /*, clickEvent */) {
    this.selectedPost = post;
  }
}
```

## Attaching Actions to Other Events

Actions don't need to be triggered on click, in fact they can be attached
to any event. For example this form will
call the `createPost` action when submitted:

```handlebars {data-filename=app/components/post/template.hbs}
<form {{on "submit" this.createPost}}>
  Post title: <Input @value={{this.title}} />
</form>
```

```javascript {data-filename=app/components/post/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Post extends Component {
  @tracked title;

  @action
  createPost(event) {
    event.preventDefault();
    // Do something with `this.title`
  }
}
```

The native JavaScript form submission event is the sole argument to
`createPost`. The form submission event needs to have `preventDefault`
called on it in order to opt out of the browser-default behavior -- which,
for forms, is to POST to the current URL.

## Attaching Actions to Non-Clickable Elements

Note that while Ember currently permits you to add an action to any DOM
element, not all DOM elements are eligible to receive focus, according to
HTML standards.

For example, if an action is attached to an `a` link
without an `href` attribute, or to a `div`, some browsers won't execute the
associated function.

Always check to see that the element you are adding an action to is interactive, according to
[web accessibility and browser standards](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Interactive_elements).
As a rule of thumb, if you find yourself adding an action an `<a>` tag, you should turn it into a `<button>` instead.

For more information about building accessible apps in Ember, see the
[Accessibility Guide](../../reference/accessibility-guide/).
