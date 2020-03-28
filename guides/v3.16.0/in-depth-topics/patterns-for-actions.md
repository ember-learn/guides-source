Actions are the primary method for updating state in an Ember application, and
as such they have lots of uses and patterns. This guide covers some of the more
common action patterns that can be used in Ember.

## Action Fundamentals

Imagine we're building an application where users can have accounts. We need to
build the UI for users to delete their account. Because we don't want users to
accidentally delete their accounts, we'll build a button that requires the user
to confirm in order to trigger some action.

We'll call this the `ButtonWithConfirmation` component. We can start off with a
normal component definition, like we've seen before:

```handlebars {data-filename=app/components/button-with-confirmation.hbs}
<button>{{@text}}</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button class="confirm-submit">
      OK
    </button>
    <button class="confirm-cancel">
      Cancel
    </button>
  </div>
{{/if}}
```

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;
}
```

Now we have a button that can receive some text as an argument, with a modal
confirmation that will show conditionally based on its `isConfirming`
property. You'll notice this property is decorated with the `@tracked`
decorator - this is known as a _tracked property_, and indicates to Ember that
the field will change in value over the lifetime of the component. You can learn
more about tracked properties in the [Autotracking In-Depth](../autotracking-in-depth/)
guide.

Next, we need to hook up the button to toggle that property. We'll
do this with an _action_:

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }
}
```

```handlebars
<button {{on "click" this.launchConfirmationDialog}}>
  {{@text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button class="confirm-submit">
      OK
    </button>
    <button class="confirm-cancel">
      Cancel
    </button>
  </div>
{{/if}}
```

Now if we click the button, it will show the confirmation dialog - our first
interactive component! We'll also want the modal to close when we click either
of the modal buttons, so we can add a couple more actions to handle that:

```js {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  submitConfirm() {
    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

```handlebars
<button {{on "click" this.launchConfirmationDialog}}>
  {{@text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    <button
      class="confirm-submit"
      {{on "click" this.submitConfirm}}
    >
      OK
    </button>
    <button
      class="confirm-cancel"
      {{on "click" this.cancelConfirm}}
    >
      Cancel
    </button>
  </div>
{{/if}}
```

Now we can open and close the modal dialog at will! Next, we'll setup the
component to send its _own_ events when the user clicks the "OK" and "Cancel"
buttons.

## Exposing Actions as Public API

Let's create a parent component, the `UserProfile` component, where the user can
delete their profile:

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
/>
```

First we'll define what we want to happen when the user clicks the button and
then confirms. In the first case, we'll find the user's account and delete it.

We'll implement an action on the parent component called
`deleteAccount()` that, when called, gets a hypothetical `login`
[service](../../services/) and calls the service's `deleteUser()`
method. We'll go over services later on - for now, think of it as an API
that manages the user's login and information.

```javascript {data-filename=app/components/user-profile.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UserProfileComponent extends Component {
  @service login;

  @action
  deleteAccount() {
    this.login.deleteUser();
  }
}
```

Now we've implemented our action, but we have not told Ember when we want this
action to be triggered. In order to trigger the action when the user clicks "OK"
in the `ButtonWithConfirmation` component, we'll need to pass the action _down_
to it as an argument:

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
  @onConfirm={{this.deleteAccount}}
/>
```

Next, in the child component we will implement the logic to confirm that the
user wants to take the action they indicated by clicking the button:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  submitConfirm() {
    if (this.args.onConfirm) {
      this.args.onConfirm();
    }

    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

Now, when we click on the confirm button, the `submitConfirm` action will also
call the `deleteAccount` action, which was passed down as an argument to
the confirmation button component. In this way, the `@onConfirm` argument is
like an event which our `ButtonWithConfirmation` component triggers.

## Handling Action Completion

Often actions perform asynchronous tasks, such as making an ajax request to a
server. Since actions are functions that can be passed in by a parent component,
they are able to return values when called. The most common scenario is for an
action to return a promise so that the component can handle the action's
completion.

In our `ButtonWithConfirmation` component we want to leave the confirmation
modal open until we know that the operation has completed successfully. This is
accomplished by expecting a promise to be returned from `onConfirm`. Upon
resolution of the promise, we set a property used to indicate the visibility of
the confirmation modal. We can use an `async` function to handle that promise:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @tracked isConfirming = false;

  @action
  launchConfirmDialog() {
    this.isConfirming = true;
  }

  @action
  async submitConfirm() {
    if (this.args.onConfirm) {
      await this.args.onConfirm();
    }

    this.isConfirming = false;
  }

  @action
  cancelConfirm() {
    this.isConfirming = false;
  }
}
```

## Passing Arguments

Sometimes the parent component invoking an action has some context needed for
the action that the child component doesn't. Consider, for example, the case
where the `ButtonWithConfirmation` component we've defined is used within
`SendMessage`. The `sendMessage` action that we pass to the child component may
expect a message type parameter to be provided as an argument:

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SendMessageComponent extends Component {
  @action
  async sendMessage(messageType) {
    // send message here and return a promise
  }
}
```

However, the `ButtonWithConfirmation` component invoking the action doesn't know
or care what type of message it's collecting. In cases like this, the parent
template can provide the required parameter when the action is passed to the
child. For example, if we want to use the button to send a message of type
`"info"`:

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.sendMessage "info"}}
/>
```

Within `ButtonWithConfirmation`, the code in the `submitConfirm` action does not
change. It will still invoke `onConfirm` without explicit arguments:

```javascript {data-filename=app/components/button-with-confirmation.js}
await this.args.onConfirm();
```

However the expression `{{fn this.sendMessage "info"}}` used in passing the
action to the component creates a closure and partially applies the given parameter to the new function. So now when the action is invoked, that parameter will automatically be passed as its argument,
effectively calling `sendMessage("info")`, despite the argument not appearing in
the calling code.

So far in our example, the action we have passed to `ButtonWithConfirmation` is
a function that accepts one argument, `messageType`. Suppose we want to extend
this by allowing `sendMessage` to take a second argument, the actual text of the
message the user is sending:

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SendMessageComponent extends Component {
  @action
  async sendMessage(messageType, messageText) {
    // send message here and return a promise
  }
}
```

We want to arrange for the action to be invoked from within
`ButtonWithConfirmation` with both arguments. We've seen already that if we
provide a `messageType` value to the `fn` helper when we insert
`ButtonWithConfirmation` into its parent `SendMessage` template, that value will
be passed to the `sendMessage` action as its first argument automatically when
invoked as `onConfirm`. If we subsequently pass a single additional argument to
`onConfirm` explicitly, that argument will be passed to `sendMessage` as its
second argument (This ability to provide arguments to a function one at a time
is known as [partial application](https://en.wikipedia.org/wiki/Partial_application)).

In our case, the explicit argument that we pass to `onConfirm` will be the
required `messageText`. However, remember that internally our
`ButtonWithConfirmation` component does not know or care that it is being used
in a messaging application. Therefore within the component's JavaScript file, we
will use a property `confirmValue` to represent that argument and pass it to
`onConfirm` as shown here:

```javascript {data-filename=app/components/button-with-confirmation.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonWithConfirmationComponent extends Component {
  @action
  async submitConfirm() {
    if (this.args.onConfirm) {
      // call `onConfirm` with a second argument
      await this.args.onConfirm(this.confirmValue);
    }

    this.isConfirming = false;
  }

  //...
}
```

In order for `confirmValue` to take on the value of the message text, we'll bind
the property to the value of a user input field that will appear when the button
is clicked. To accomplish this, we'll first modify the component so that it can
be used in block form and we will pass `confirmValue` as a
[block parameter](../../components/block-content/) within the confirm dialog
element:

```handlebars {data-filename=app/components/button-with-confirmation.hbs}
<button {{on "click" this.launchConfirmDialog}}>
  {{this.text}}
</button>

{{#if this.isConfirming}}
  <div class="confirm-dialog">
    {{yield this.confirmValue}}

    <button
      class="confirm-submit"
      {{on "click" this.submitConfirm}}
    >
      OK
    </button>
    <button
      class="confirm-cancel"
      {{on "click" this.cancelConfirm}}
    >
      Cancel
    </button>
  </div>
{{/if}}
```

With this modification, we can now use the component in `SendMessage` to wrap a
text input element whose `value` attribute is set to `confirmValue`:

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.sendMessage "info"}}
as |confirmValue|>
  <Input @value={{confirmValue}} />
</ButtonWithConfirmation>
```

When the user enters their message into the input field, the message text will
now be available to the component as `confirmValue`. Then, once they click the
"OK" button, the `submitConfirm` action will be triggered, calling `onConfirm`
with the provided `confirmValue`, thus invoking the `sendMessage` action in
`SendMessage` with both the `messageType` and `messageText` arguments.

## Invoking Actions Directly on Component Collaborators

Actions can be invoked on objects other than the component directly from the
template. For example, in our `SendMessage` component we might include a service
that processes the `sendMessage` logic.

```javascript {data-filename=app/components/send-message.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SendMessageComponent extends Component {
  @service messaging;

  // component implementation
}
```

We can tell the action to invoke the `sendMessage` action directly on the
messaging service.

```handlebars {data-filename=app/components/send-message.hbs}
<ButtonWithConfirmation
  @text="Click to send your message."
  @onConfirm={{fn this.messaging.sendMessage "info"}}
as |confirmValue|>
  <Input @value={{confirmValue}} />
</ButtonWithConfirmation>
```

The interesting part is that the action from the service just works, because
it's auto-bound to that service.

```javascript {data-filename=app/services/messaging.js}
import Service from '@ember/service';
import { action } from '@ember/object';

export default class Messaging extends Service {
  @action
  async sendMessage(messageType, text) {
    // handle message send and return a promise
  }
}
```

## Destructuring Objects Passed as Action Arguments

A component will often not know what information a parent needs to process an
action, and will just pass all the information it has. For example, our
`UserProfile` component is going to notify its parent,
`SystemPreferencesEditor`, that a user's account was deleted, and passes along
with it the full user profile object.

```javascript {data-filename=app/components/user-profile.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class UserProfileComponent extends Component {
  @service login;

  @action
  async deleteAccount() {
    await this.login.deleteUser();

    this.args.didDelete(this.login.currentUserObj);
  }
}
```

All our `SystemPreferencesEditor` component really needs to process a user
deletion is an account ID. For this case, the `fn` helper provides the value
via partial application to allow a parent component to dig into the passed
object to pull out only what it needs.

```handlebars {data-filename=app/components/system-preferences-editor.hbs}
<UserProfile @didDelete={{fn this.userDeleted}} />
```

Now when the `SystemPreferencesEditor` handles the delete action, it receives
 the entire user object and can extract the `id` string.

```javascript {data-filename=app/components/system-preferences-editor.js}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class SystemPreferencesEditorComponent extends Component {
  @action
  userDeleted(userObj /* , native clickEvent */) {
    // respond to deletion
  }
}
```

## Calling Actions Up Multiple Component Layers

When your components go multiple template layers deep, it is common to need to
handle an action several layers up the tree.

Note about prop drilling / anti-patterns?

Parent
components can pass actions to child components through templates alone without
adding JavaScript code to those child components.

For example, say we want to move account deletion from the `UserProfile`
component to its parent `SystemPreferencesEditor`.

First we would move the `deleteUser` action from `user-profile.js` to
the parent `system-preferences-editor.js`.

```javascript {data-filename=app/components/system-preferences-editor.js}
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SystemPreferencesEditorComponent extends Component {
  @service login;

  @action
  deleteUser(idStr) {
    return this.login.deleteUserAccount(idStr);
  }
}
```

Then our `SystemPreferencesEditor` template passes its local `deleteUser`
action into the `UserProfile` as that component's `deleteCurrentUser` argument.

```handlebars {data-filename=app/components/system-preferences-editor.hbs}
<UserProfile
  @deleteCurrentUser={{fn this.deleteUser this.login.currentUser.id}}
/>
```

The `deleteUser` action is prepended with `this.`, since
`SystemPreferencesEditor` is where the action is defined now. If the action
was passed from a parent, then it might have looked like `@deleteUser` instead.

In our `user-profile.hbs` template we change our action to call
`deleteCurrentUser` as passed above.

```handlebars {data-filename=app/components/user-profile.hbs}
<ButtonWithConfirmation
  @text="Click OK to delete your account."
  @onConfirm={{@deleteCurrentUser}}
/>
```

Note that `deleteCurrentUser` is now prepended with `@` as opposed to `this.`
[previously](#toc_passing-the-action-to-the-component).

Now when you confirm deletion, the action goes straight to the
`SystemPreferencesEditor` to be handled in its local context.
