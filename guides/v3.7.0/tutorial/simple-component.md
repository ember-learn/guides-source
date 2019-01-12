As a user looks through our list of rentals, they may want to have some
interactive options to help them make a decision. Let's add the ability to
toggle the size of the image for each rental. To do this, we'll use a component.

Ember components are used to turn markup text and styles into reusable content.
Components can be included in any route's template, even multiple times, saving
you from copy-and-pasting the same code around your application.

Let's generate a `rental-listing` component that will manage the behavior for
each of our rentals. 

```bash
ember g component rental-listing
```

Ember CLI will then generate a handful of files for our component:


```bash
installing component
  create app/components/rental-listing.js
  create app/templates/components/rental-listing.hbs
installing component-test
  create tests/integration/components/rental-listing-test.js
```

A component consists of two parts:

* A template that defines how it will look (`app/templates/components/rental-listing.hbs`)
* A JavaScript source file (`app/components/rental-listing.js`) that defines how it will behave.

Our new `RentalListing` component will manage how a user sees and interacts with a rental.
To start, let's move the rental display details for a single rental from the `rentals.hbs` template into `rental-listing.hbs` and add the image field:

```handlebars {data-filename="app/templates/components/rental-listing.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19"}
{{yield}}
<article class="listing">
  <img src={{this.rental.image}} alt="">
  <div class="details">
    <h3>{{this.rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> {{this.rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{this.rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{this.rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{this.rental.bedrooms}}
    </div>
  </div>
</article>
```

Now in our `rentals.hbs` template, let's replace the old HTML markup within our `{{#each}}` loop
with our new `RentalListing` component:

```handlebars {data-filename="app/templates/rentals.hbs" data-diff="+12,+13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29"}
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome!</h2>
  <p>
    We hope you find exactly what you're looking for in a place to stay.
  </p>
  {{#link-to "about" class="button"}}
    About Us
  {{/link-to}}
</div>

{{#each this.model as |rentalUnit|}}
  <RentalListing @rental={{rentalUnit}} />
{{#each this.model as |rental|}}
  <article class="listing">
    <h3>{{rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> {{rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{rental.bedrooms}}
    </div>
  </article>
{{/each}}
```

For each `rentalUnit` in the `model` list, we are creating a new instance of our
`RentalListing` component and passing in the `rentalUnit` by assigning it to
the component's `rental` attribute.

Our app should behave now as before, with the addition of an image for each rental item.

![App with component and images](/images/simple-component/app-with-images.png)

## Hiding and Showing an Image

Now we can add functionality that will show the image of a rental when requested by the user.

Let's use the `{{if}}` helper to show our current rental image larger only when `isWide` is set to true, by setting the element class name to `wide`.
We'll also add some text to indicate that the image can be clicked on,
and wrap both with an anchor element,
giving it the `image` class name so that our test can find it.

```handlebars {data-filename="app/templates/components/rental-listing.hbs" data-diff="+2,+3,+5,+6"}
<article class="listing">
  <a class="image {{if this.isWide "wide"}}"
    role="button">
    <img src={{this.rental.image}} alt="">
    <small>View Larger</small>
  </a>
  <div class="details">
    <h3>{{this.rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> {{this.rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{this.rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{this.rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{this.rental.bedrooms}}
    </div>
  </div>
</article>
```

The value of `isWide` comes from our component's JavaScript file, in this case `rental-listing.js`.
Since we want the image to be smaller at first, we will set the property to start as `false`:

```javascript {data-filename="app/components/rental-listing.js" data-diff="+4"}
import Component from '@ember/component';

export default Component.extend({
  isWide: false
});
```

To allow the user to widen the image, we will need to add an action that toggles
the value of `isWide`. Let's create the `toggleImageSize` action to toggle the
`isWide` property on our component:

```javascript {data-filename="app/components/rental-listing.js" data-diff="-4,+5,+6,+7,+8,+9,+10"}
import Component from '@ember/component';

export default Component.extend({
  isWide: false
  isWide: false,
  actions: {
    toggleImageSize() {
      this.toggleProperty('isWide');
    }
  }
});
```

In order to trigger this action, we need to use the `{{action}}` helper in our
template:

```handlebars {data-filename="app/templates/components/rental-listing.hbs" data-diff="-2,+3,+4,+5,+6,+7"}
<article class="listing">
  <a class="image {{if this.isWide "wide"}}">
  <a
    onclick={{action "toggleImageSize"}}
    class="image {{if this.isWide "wide"}}"
    role="button"
  >
    <img src={{this.rental.image}} alt="">
    <small>View Larger</small>
  </a>
  <div class="details">
    <h3>{{this.rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> {{this.rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{this.rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{this.rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{this.rental.bedrooms}}
    </div>
  </div>
</article>
```

So, when we click on the anchor element, Ember will go into the `actions` hash
and call the `toggleImageSize` function. An
[actions hash](../../templates/actions/) is an object in the component that
contains functions. These functions are called when the user interacts with the
UI, such as clicking.

So, when we click the image or the `View Larger` link in our browser, we see our
image shown larger. When we click the enlarged image we again see it smaller.

![rental listing with expand](/images/simple-component/styled-rental-listings.png)

Move on to the [next page](../hbs-helper/) for the next feature, or continue on here to test what you just wrote.

### An Integration Test

Ember components are commonly tested with [component integration tests](../../testing/testing-components/).
Component integration tests verify the behavior of a component within the context of Ember's rendering engine.
When running in an integration test, the component goes through its regular [render lifecycle](../../components/the-component-lifecycle/),
and has access to dependent objects, loaded through Ember's resolver.

Our component integration test will test two different behaviors:

* The component should show details about the rental
* The component should toggle the existence of a wide class on click, to expand and shrink the photo of the rental.

Let's update the default test to contain the scenarios we want to verify:

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+11,+12,+13,+14,+15,+16,+17,+18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';



module('Integration | Component | rental listing', function (hooks) {
  setupRenderingTest(hooks);

  test('should display rental details', async function(assert) {

  });

  test('should toggle wide class on click', async function(assert) {

  });
});
  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<RentalListing />`);

    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <RentalListing>
        template block text
      </RentalListing>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
```

For the test we'll pass the component a fake object that has all the properties that our rental model has.
We'll give the variable the name `rental`, and in each test we'll set `rental` to our local scope, represented by the `this` object.
The render template can access values in local scope.

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+9,+10,+11,+12,+13,+14,+15,+16,+17,+18"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rental listing', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.rental = {
      image: 'fake.png',
      title: 'test-title',
      owner: 'test-owner',
      type: 'test-type',
      city: 'test-city',
      bedrooms: 3
    };
  });

  test('should display rental details', async function(assert) {

  });

  test('should toggle wide class on click', async function(assert) {

  });
});
```

Now let's render our component using the `render` function.
The `render` function allows us to pass a template string, so that we can declare the component in the same way we do in our templates.
Since we set the `rental` variable to our local scope in the `beforeEach` hook, we can access it as part of our render string.

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+21,+25"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | rental listing', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.rental = {
      image: 'fake.png',
      title: 'test-title',
      owner: 'test-owner',
      type: 'test-type',
      city: 'test-city',
      bedrooms: 3
    };
  });

  test('should display rental details', async function(assert) {
    await render(hbs`<RentalListing @rental={{this.rental}} />`);
  });

  test('should toggle wide class on click', async function(assert) {
    await render(hbs`<RentalListing @rental={{this.rental}} />`);
  });
});
```

Finally, let's add our actions and assertions.

In the first test, we just want to verify the output of the component, so we just assert that the title and owner text match what we provided in the fake `rental`.

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+3,+4"}
test('should display rental details', async function(assert) {
  await render(hbs`<RentalListing @rental={{this.rental}} />`);
  assert.equal(this.element.querySelector('.listing h3').textContent.trim(), 'test-title', 'Title: test-title');
  assert.equal(this.element.querySelector('.listing .owner').textContent.trim(), 'Owner: test-owner', 'Owner: test-owner');
});
```

In the second test, we verify that clicking on the image toggles the size.
We will assert that the component is initially rendered without the `wide` class name.
Clicking the image will add the class `wide` to our element, and clicking it a second time will take the `wide` class away.
Note that we find the image element using the CSS selector `.image`.

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+3,+4,+5,+6,+7"}
  test('should toggle wide class on click', async function(assert) {
    await render(hbs`<RentalListing @rental={{this.rental}} />`);
    assert.notOk(this.element.querySelector('.image.wide'), 'initially rendered small');
    await click('.image');
    assert.ok(this.element.querySelector('.image.wide'), 'rendered wide after click');
    await click('.image');
    assert.notOk(this.element.querySelector('.image.wide'), 'rendered small after second click');
  });
```
Since we're using the new function "click", we need to import it.

```javascript {data-filename="tests/integration/components/rental-listing-test.js" data-diff="+3"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
```
The final test should look as follows:

```javascript {data-filename=tests/integration/components/rental-listing-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';


module('Integration | Component | rental listing', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.rental = EmberObject.create({
      image: 'fake.png',
      title: 'test-title',
      owner: 'test-owner',
      type: 'test-type',
      city: 'test-city',
      bedrooms: 3
    });
  });

  test('should display rental details', async function(assert) {
    await render(hbs`<RentalListing @rental={{this.rental}} />`);
    assert.equal(this.element.querySelector('.listing h3').textContent.trim(), 'test-title', 'Title: test-title');
    assert.equal(this.element.querySelector('.listing .owner').textContent.trim(), 'Owner: test-owner', 'Owner: test-owner');
  });

  test('should toggle wide class on click', async function(assert) {
    await render(hbs`<RentalListing @rental={{this.rental}} />`);
    assert.notOk(this.element.querySelector('.image.wide'), 'initially rendered small');
    await click('.image');
    assert.ok(this.element.querySelector('.image.wide'), 'rendered wide after click');
    await click('.image');
    assert.notOk(this.element.querySelector('.image.wide'), 'rendered small after second click');
  });
});
```

Run `ember t -s` to verify that our new test is passing.
To find the new test, locate "Integration | Component | rental listing" in the "Module" field of the test UI.

![simple_component_test](/images/simple-component/simple-component-test.gif)
