<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/06-interactive-components.md -->

In this chapter, you will add interactivity to the page, allowing the user to click an image to enlarge or shrink it:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="The Super Rentals app by the end of the chapter (default image size)" width="1024" height="1130">

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="The Super Rentals app by the end of the chapter (large image size)" width="1024" height="1500">

While doing so, you will learn about:

- Adding behavior to components with classes
- Accessing instance states from templates
- Managing state with tracked properties
- Using conditionals syntaxes in templates
- Responding to user interaction with actions
- Invoking element modifiers
- Testing user interactions

## Adding Behavior to Components with Classes

So far, all the components we have written are purely _presentational_—they are simply reusable snippets of markup. That's pretty cool! But in Ember, components can do so much more.

Sometimes, you want to associate some _[behavior](https://developer.mozilla.org/docs/Learn/JavaScript/Building_blocks/Events)_ with your components so that they can do more interesting things. For example, `<LinkTo>` can respond to clicks by changing the URL and navigating us to a different page.

Here, we are going to do just that! We are going to implement the "View Larger" and "View Smaller" functionality, which will allow our users to click on a property's image to view a larger version, and click on it again to return to the smaller version.

In other words, we want a way to _toggle_ the image between one of the two _[states](../../../components/component-state-and-actions/)_. In order to do that, we need a way for the component to store two possible states, and to be aware of which state it is currently in.

Ember optionally allows us to associate JavaScript code with a component for exactly this purpose. We can add a JavaScript file for our `<Rental::Image>` component by running the `component-class` generator:

```shell
$ ember generate component-class rental/image
installing component-class
  create app/components/rental/image.js

Running "lint:fix" script...
```

This generated a JavaScript file with the same name as our component's template at `app/components/rental/image.js`. It contains a _[JavaScript class](https://javascript.info/class)_, _[inheriting](https://javascript.info/class-inheritance)_ from `@glimmer/component`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>@glimmer/component</code>, or <em><a href="../../../upgrading/current-edition/glimmer-components/">Glimmer component</a></em>, is one of the several component classes available to use. They are a great starting point whenever you want to add behavior to your components. In this tutorial, we will be using Glimmer components exclusively.</p>        
<p>In general, Glimmer components should be used whenever possible. However, you may also see <code>@ember/components</code>, or <em><a href="https://ember-learn.github.io/ember-octane-vs-classic-cheat-sheet/">classic components</a></em>, used in older apps. You can tell them apart by looking at their import path (which is helpful for looking up the respective documentation, as they have different and incompatible APIs).</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Ember will create an _instance_ of the class whenever our component is invoked. We can use that instance to store our state:

```js { data-filename="app/components/rental/image.js" data-diff="-3,+4,+5,+6,+7,+8,+9" }
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {}
export default class RentalImageComponent extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
}
```

Here, in the _component's constructor_, we _initialized_ the _instance variable_ `this.isLarge` with the value `false`, since this is the default state that we want for our component.

## Accessing Instance States from Templates

Let's update our template to use this state we just added:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14" }
<div class="image">
  <img ...attributes>
</div>
{{#if this.isLarge}}
  <div class="image large">
    <img ...attributes>
    <small>View Smaller</small>
  </div>
{{else}}
  <div class="image">
    <img ...attributes>
    <small>View Larger</small>
  </div>
{{/if}}
```

In the template, we have access to the component's instance variables. The `{{#if ...}}...{{else}}...{{/if}}` _[conditionals](../../../components/conditional-content/)_ syntax allows us to render different content based on a condition (in this case, the value of the instance variable `this.isLarge`). Combining these two features, we can render either the small or the large version of the image accordingly.

We can verify this works by temporarily changing the initial value in our JavaScript file. If we change `app/components/rental/image.js` to initialize `this.isLarge = true;` in the constructor, we should see the large version of the property image in the browser. Cool!

<img src="/images/tutorial/part-1/interactive-components/is-large-true@2x.png" alt="&lt;Rental::Image&gt; with this.isLarge set to true" width="1024" height="1500">

Once we've tested this out, we can change `this.isLarge` back to `false`.

Since this pattern of initializing instance variables in the constructor is pretty common, there happens to be a much more concise syntax for it:

```js { data-filename="app/components/rental/image.js" data-diff="-4,-5,-6,-7,+8" }
import Component from '@glimmer/component';

export default class RentalImageComponent extends Component {
  constructor(...args) {
    super(...args);
    this.isLarge = false;
  }
  isLarge = false;
}
```

This does exactly the same thing as before, but it's much shorter and less to type!

Of course, our users cannot edit our source code, so we need a way for them to toggle the image size from the browser. Specifically, we want to toggle the value of `this.isLarge` whenever the user clicks on our component.

## Managing State with Tracked Properties

Let's modify our class to add a _[method](../../../in-depth-topics/native-classes-in-depth/#toc_methods)_ for toggling the size:

```js { data-filename="app/components/rental/image.js" data-diff="+2,+3,-6,+7,+8,+9,+10,+11" }
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RentalImageComponent extends Component {
  isLarge = false;
  @tracked isLarge = false;

  @action toggleSize() {
    this.isLarge = !this.isLarge;
  }
}
```

We did a few things here, so let's break it down.

First, we added the `@tracked` _[decorator](../../../in-depth-topics/native-classes-in-depth/#toc_decorators)_ to the `isLarge` instance variable. This annotation tells Ember to monitor this variable for updates. Whenever this variable's value changes, Ember will automatically re-render any templates that depend on its value.

In our case, whenever we assign a new value to `this.isLarge`, the `@tracked` annotation will cause Ember to re-evaluate the `{{#if this.isLarge}}` conditional in our template, and will switch between the two _[blocks](../../../components/conditional-content/#toc_block-if)_ accordingly.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Don't worry! If you reference a variable in the template but forget to add the <code>@tracked</code> decorator, you will get a helpful development mode error when you change its value!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Responding to User Interaction with Actions

Next, we added a `toggleSize` method to our class that switches `this.isLarge` to the opposite of its current state (`false` becomes `true`, or `true` becomes `false`).

Finally, we added the `@action` decorator to our method. This indicates to Ember that we intend to use this method from our template. Without this, the method will not function properly as a callback function (in this case, a click handler).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you forget to add the <code>@action</code> decorator, you will also get a helpful error when clicking on the button in development mode!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

With that, it's time to wire this up in the template:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-2,+3,-6,+7,-9,+10,-13,+14" }
{{#if this.isLarge}}
  <div class="image large">
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Smaller</small>
  </div>
  </button>
{{else}}
  <div class="image">
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
    <small>View Larger</small>
  </div>
  </button>
{{/if}}
```

We changed two things here.

First, since we wanted to make our component interactive, we switched the containing tag from `<div>` to `<button>` (this is important for accessibility reasons). By using the correct semantic tag, we will also get focusability and keyboard interaction handling "for free".

Next, we used the `{{on}}` _[modifier](../../../components/template-lifecycle-dom-and-modifiers/#toc_event-handlers)_ to attach `this.toggleSize` as a click handler on the button.

With that, we have created our first _interactive_ component. Go ahead and try it in the browser!

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/interactive-components/rental-image-default@2x.png" alt="&lt;Rental::Image&gt; (default size)" width="1024" height="1130">

<img src="/images/tutorial/part-1/interactive-components/rental-image-large@2x.png" alt="&lt;Rental::Image&gt; (large size)" width="1024" height="1500">

## Testing User Interactions

Finally, let's write a test for this new behavior:

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-3,+4,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,+47" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });

  test('clicking on the component toggles its size', async function (assert) {
    await render(hbs`
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom('button.image').exists();

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');

    await click('button.image');

    assert.dom('.image').hasClass('large');
    assert.dom('.image small').hasText('View Smaller');

    await click('button.image');

    assert.dom('.image').doesNotHaveClass('large');
    assert.dom('.image small').hasText('View Larger');
  });
});
```

<img src="/images/tutorial/part-1/interactive-components/pass@2x.png" alt="Tests passing with the new &lt;Rental::Image&gt; test" width="1024" height="512">

Let's clean up our template before moving on. We introduced a lot of duplication when we added the conditional in the template. If we look closely, the only things that are different between the two blocks are:

1. The presence of the `"large"` CSS class on the `<button>` tag.
2. The "View Larger" and "View Smaller" text.

These changes are buried deep within the large amount of duplicated code. We can reduce the duplication by using an `{{if}}` _[expression](../../../components/conditional-content/#toc_inline-if)_ instead:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,-2,-3,+4,+5,+6,-8,-9,-10,-11,+12,-14,-15,+16,+17" }
{{#if this.isLarge}}
  <button type="button" class="image large" {{on "click" this.toggleSize}}>
    <img ...attributes>
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>View Smaller</small>
  </button>
{{else}}
  <button type="button" class="image" {{on "click" this.toggleSize}}>
    <img ...attributes>
  {{else}}
    <small>View Larger</small>
  </button>
{{/if}}
  {{/if}}
</button>
```

The expression version of `{{if}}` takes two arguments. The first argument is the condition. The second argument is the expression that should be evaluated if the condition is true.

Optionally, `{{if}}` can take a third argument for what the expression should evaluate into if the condition is false. This means we could rewrite the button label like so:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-3,-4,-5,-6,-7,+8" }
<button type="button" class="image {{if this.isLarge "large"}}" {{on "click" this.toggleSize}}>
  <img ...attributes>
  {{#if this.isLarge}}
    <small>View Smaller</small>
  {{else}}
    <small>View Larger</small>
  {{/if}}
  <small>View {{if this.isLarge "Smaller" "Larger"}}</small>
</button>
```

Whether or not this is an improvement in the clarity of our code is mostly a matter of taste. Either way, we have significantly reduced the duplication in our code, and made the important bits of logic stand out from the rest.

Run the test suite one last time to confirm our refactor didn't break anything unexpectedly, and we will be ready for the next challenge!

<img src="/images/tutorial/part-1/interactive-components/pass-2@2x.png" alt="Tests still passing after the refactor" width="1024" height="512">
