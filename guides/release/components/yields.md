We've mentioned a few times that components can be used in a block form, with an
opening and closing tag, and a child template. This form allows you to reuse and
compose components just like you would HTML elements:

```handlebars
<ModalDialog>
  You have unsaved progress, are you sure you want to quit?

  <button class="btn-danger">
    Yes
  </button>
  <button class="btn">
    No
  </button>
</ModalDialog>
```

Users can pass a block to your component, but by default your component doesn't
know where to put it. You have to decide this by using the `{{yield}}` helper:

```handlebars {data-filename=app/components/modal-dialog/template.hbs}
<dialog>
  {{yield}}
</dialog>
```

Wherever you place the `{{yield}}` helper in your component's template is where
the template passed to its block will be placed. So in this example, for
instance, the final rendered output would be:

```html
<dialog>
  You have unsaved progress, are you sure you want to quit?

  <button class="btn-danger">
    Yes
  </button>
  <button class="btn">
    No
  </button>
</dialog>
```

Any valid template constructs can be placed into the block, including other
components and helpers. If someone uses this component and _doesn't_ pass a
block, nothing will be rendered in place of the yield:

```handlebars
<ModalDialog/>
```

Outputs

```html
<dialog> </dialog>
```

And vice versa, if you do not yield in the component, and a block is passed,
then nothing will be done with the block.

### Conditionally Yielding

You can check whether or not a user passed a block to the component with the
`hasBlock` helper:

```handlebars {data-filename=app/components/modal-dialog/template.hbs}
<dialog>
  {{#if hasBlock}}
    {{yield}}
  {{else}}
    Default Message
  {{/if}}
</dialog>
```

Now, if we use our `ModalDialog` component without a block, we'll get the
default message:

```handlebars
<ModalDialog/>
```

Results in:

```html
<dialog>
  Default Message
</dialog>
```

## Yielding Values

Yield can also pass values _back_ into the template, similar to a callback
function in JavaScript. Consider for instance the `ModalDialog` component -
let's say we want to make the dialog show _conditionally_ when we click a
button:

```handlebars {data-filename=app/components/modal-dialog/template.hbs}
{{#if this.showModal}}
  <dialog>
    {{yield}}
  <dialog>
{{/if}}

<button onclick={{this.toggleModal}}>
  {{@triggerText}}
</button>
```

```js {data-filename=app/components/modal-dialog/component.js}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ModalDialog extends Component {
  @tracked showModal = false;

  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }
}
```

This works, but when the modal is open, we want users to be able to close it by
clicking buttons in the modal. There's just one problem - we don't know where
those buttons are going to be!

What we can do here is _yield_ the `toggleModal` action:

```handlebars {data-filename=app/components/modal-dialog/template.hbs}
{{#if this.showModal}}
  <dialog>
    {{yield this.toggleModal}}
  <dialog>
{{/if}}

<button onclick={{this.toggleModal}}>
  {{@triggerText}}
</button>
```

Then, consumers can access the action using the `as |...|` syntax in the block,
similar to the `{{each}}` helper, and place the action on their buttons:

```handlebars
<ModalDialog as |toggle|>
  You have unsaved progress, are you sure you want to quit?

  <button
    onclick={{toggle}}
    class="btn-danger"
  >
    Yes
  </button>
  <button
    onclick={{toggle}}
    class="btn"
  >
    No
  </button>
</ModalDialog>
```
