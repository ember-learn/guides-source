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

You can then add this action to an element using the
[`{{action}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/action?anchor=action)
helper:

```handlebars {data-filename=app/components/post/template.hbs}
<h3>
  <button {{action this.toggleBody}}>{{@title}}</button>
</h3>

{{#if this.isShowingBody}}
  <p>{{@body}}</p>
{{/if}}
```

The `{{action}}` helper calls your action function when the element is
clicked.
You will learn about more advanced usages in the Component's [Actions and
Events](../../components/actions-and-events/) guide, but you should familiarize
yourself with the basics on this page first.

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

You can optionally pass arguments to the action
helper. For example, if the `post` argument was passed:

```handlebars {data-filename=app/components/post/template.hbs}
<p>
  <button {{action this.select @post}}>
    ✓
  </button>
  {{this.selectedPost.title}}
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

## Attaching Actions to Other Events

Actions don't need to be triggered on click, in fact they can be attached
to any event Ember is already listening to. For example this form will
call the `updateText` action when submitted, but prevent the default
form submission logic in the browser from running:

```handlebars {data-filename=app/components/post/template.hbs}
<form {{action this.createPost on="submit" preventDefault=true}}>
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
  createPost() {
    // Do something with `this.title`
  }
}
```

Read about which events Ember is already listening to in
[Handling Events: Event
Names](../../components/handling-events/#toc_event-names).

## Attaching Actions to Non-Clickable Elements

Note that actions may be attached to any element of the DOM, but not all respond
to the `click` event. For example, if an action is attached to an `a` link
without an `href` attribute, or to a `div`, some browsers won't execute the
associated function. If it's really needed to define actions over such elements,
a CSS workaround exists to make them clickable, `cursor: pointer`. For example:

For example, if an action is attached to an `a` link
without an `href` attribute, or to a `div`, some browsers won't execute the
associated function.

Always check to see that the element you are adding an action to is interactive, according to
[web accessibility and browser standards](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Interactive_elements).
As a rule of thumb, if you find yourself adding an action an `<a>` tag, you should turn it into a `<button>` instead.

Keep in mind that even with this workaround in place, the `click` event will not
automatically trigger via keyboard driven `click` equivalents (such as the
`enter` key when focused). Browsers will trigger this on clickable elements only
by default. This also doesn't make an element accessible to users of assistive
technology. You will need to add additional things like `role` and/or `tabindex`
to make this accessible for your users.
