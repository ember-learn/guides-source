When crafting an accessible component, the first and most important thing is that the component should render valid HTML. 

Both the HTML and ARIA specifications have been written in a way that make them work together. Semantic HTML provides the necessary _context_ to screen readers.

Browsers have implemented the spec in a way that provides functionality for free. 
For example, consider this code sample: 

```html
<button type="submit">Submit Form</button>
```

Here is what would be provided by the browser that the developer would otherwise need to provide: 

- keyboard interactions on interactive elements (i.e., using the `ENTER` key to activate a `<button>` element)
- a machine-readable name 
- a place in the `TAB` order of the page
- the intrinsic role of button 

If the interactive element would be written another way, such as: 

```html
<div>Submit Form</div>
```

The developer would need to write the following additional code: 

- add the role of button (`role="button"`)
- add the button to the tab order (`tabindex="0"`)
- add the keyboard functionality (a JavaScript function to activate the associated action when the `ENTER` key is pressed)

This is just one example of how developers can use HTML's built in features to improve accessibility and reduce the need for custom code. Read more here: ["Just use a button"](https://developer.paciellogroup.com/blog/2011/04/html5-accessibility-chops-just-use-a-button/).

## Focus management in components

Focus is one of the main ways a component can communicate with screen readers.

For example, when you hit tab on a page or click on a form field, a blue border usually appears around the element. This kind of behavior is part of focus.
Developers can use JavaScript to control the focus in their apps, enabling keyboard navigation and usability by screen readers.
For example, if there is a button that launches a modal with interactive elements in it, that button's click handler needs to contain code that brings focus to the new content.

This article is a good launching point for learning more about focus: [Keyboard accessibility](https://webaim.org/techniques/keyboard/)

Here are some other tips to get you started:

- There is a difference between browse mode and focus mode in screen readers- see ["Focus Please"](https://codepen.io/melsumner/live/ZJeYoP).
- Focus should return from whence it came- for example, if a `<button>` element opens a modal, the focus should then be returned to that same trigger button once the modal is closed. 
- Note: `role="presentation"` or `aria-hidden="true"` should not be used on a focusable element.


## Accessible name

All interactive elements must have an accessible name. But what does that mean, exactly? 

Because the code that is written must be readable by other machines (assistive tech like screen readers, for example), there is documentation about how this accessible name is determined: [Accessible Name and Description Computation](https://www.w3.org/TR/accname-1.1/). 

However, the most common methods for providing accessible names can be reviewed here. 

### Adding a label to an input element

Every `<input>` element should have an associated `<label>` element. To do this, the `<input>` element's `id` attribute value should be the same as the `for` attribute value on the `<label>`. Ember has a built-in `unique-id` helper that can generate unique ids that you can use like this:

![Separate input and label elements with a connection established by matching for and id attributes](/images/accessibility/component-considerations/input-for-id.png)

```html
{{#let (unique-id) as |id|}}
  <label for={{id}}>Name:</label>
  <input id={{id}} name="name" value="" type="text" />
{{/let}}
```

It is also valid to wrap the `<label>` element around the `<input />` element: 

![A child input element nested within a parent label element without any for and id attributes](/images/accessibility/component-considerations/input-nested.png)

```html
<label>Name:
  <input name="name" value="" type="text" />
</label>
```

However, this option can be a little harder to apply styles to, so both should be tested before determining which approach to use.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
To dig deeper into accessible input patterns in Ember check out the <a href="https://emberjs-1.gitbook.io/ember-component-patterns/form-components/input">ember-component-patterns article on Input Fields</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
