<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/05-more-about-components.md -->

It's time to finally work on the rentals listing:

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

While building this list of rental properties, you will learn about:

- Generating components
- Organizing code with namespaced components
- Forwarding HTML attributes with `...attributes`
- Determining the appropriate amount of test coverage

## Generating Components

Let's start by creating the `<Rental>` component. This time, we will use the component generator to create the template and test file for us:

```shell
$ ember generate component rental
installing component
  create app/components/rental.hbs
  skip app/components/rental.ts
  tip to add a class, run `ember generate component-class rental`
installing component-test
  create tests/integration/components/rental-test.js

Running "lint:fix" script...
```

The generator created two new files for us, a component template at `app/components/rental.hbs`, and a component test file at `tests/integration/components/rental-test.js`.

We will start by editing the template. Let's _[hard-code](https://en.wikipedia.org/wiki/Hard_coding)_ the details for one rental property for now, and replace it with the real data from the server later on.

```handlebars { data-filename="app/components/rental.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18" }
{{yield}}
<article class="rental">
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
</article>
```

Then, we will write a test to ensure all of the details are present. We will replace the boilerplate test generated for us with our own assertions, just like we did for the `<Jumbo>` component earlier:

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-9,-10,-11,-12,+13,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,+26,+27,+28,+29,+30,+31" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Rental>
        template block text
      </Rental>
    `);

    assert.dom().hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
  });
});
```

The test should pass.

<img src="/images/tutorial/part-1/more-about-components/pass@2x.png" alt="Tests passing with the new &lt;Rental&gt; test" width="1024" height="512">

Finally, let's invoke this a couple of times from our index template to populate the page.

```handlebars { data-filename="app/templates/index.hbs" data-diff="+6,+7,+8,+9,+10,+11,+12,+13" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

With that, we should see the `<Rental>` component showing our Grand Old Mansion three times on the page:

<img src="/images/tutorial/part-1/more-about-components/three-old-mansions@2x.png" alt="Three Grand Old Mansions" width="1024" height="1130">

Things are looking pretty convincing already; not bad for just a little bit of work!

## Organizing Code with Namespaced Components

Next, let's add the image for the rental property. We will use the component generator for this again:

```shell
$ ember generate component rental/image
installing component
  create app/components/rental/image.hbs
  skip app/components/rental/image.ts
  tip to add a class, run `ember generate component-class rental/image`
installing component-test
  create tests/integration/components/rental/image-test.js

Running "lint:fix" script...
```

This time, we had a `/` in the component's name. This resulted in the component being created at `app/components/rental/image.hbs`, which can be invoked as `<Rental::Image>`.

Components like these are known as _[namespaced](https://en.wikipedia.org/wiki/Namespace)_ components. Namespacing allows us to organize our components by folders according to their purpose. This is completely optional—namespaced components are not special in any way.

## Forwarding HTML Attributes with `...attributes`

Let's edit the component's template:

```handlebars { data-filename="app/components/rental/image.hbs" data-diff="-1,+2,+3,+4" }
{{yield}}
<div class="image">
  <img ...attributes>
</div>
```

Instead of hard-coding specific values for the `src` and `alt` attributes on the `<img>` tag, we opted for the `...attributes` keyword instead, which is also sometimes referred to as the _["splattributes"](../../../components/component-arguments-and-html-attributes/#toc_html-attributes)_ syntax. This allows arbitrary HTML attributes to be passed in when invoking this component, like so:

```handlebars { data-filename="app/components/rental.hbs" data-diff="+2,+3,+4,+5" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
    </div>
  </div>
</article>
```

We specified a `src` and an `alt` HTML attribute here, which will be passed along to the component and attached to the element where `...attributes` is applied in the component template. You can think of this as being similar to `{{yield}}`, but for HTML attributes specifically, rather than displayed content. In fact, we have already used this feature [earlier](../building-pages/) when we passed a `class` attribute to `<LinkTo>`.

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="The &lt;Rental::Image&gt; component in action" width="1024" height="1130">

This way, our `<Rental::Image>` component is not coupled to any specific rental property on the site. Of course, the hard-coding problem still exists (we simply moved it to the `<Rental>` component), but we will deal with that soon. We will limit all the hard-coding to the `<Rental>` component, so that we will have an easier time cleaning it up when we switch to fetching real data.

In general, it is a good idea to add `...attributes` to the primary element in your component. This will allow for maximum flexibility, as the invoker may need to pass along classes for styling or ARIA attributes to improve accessibility.

Let's write a test for our new component!

```js { data-filename="tests/integration/components/rental/image-test.js" data-diff="-9,-10,-11,-12,-13,-14,-15,-16,-17,+18,-20,-21,-22,+23,+24,+25,+26,-29,+30,+31,+32,+33,+34" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Rental::Image />`);

    assert.dom().hasText('');

    // Template block usage:
  test('it renders the given image', async function (assert) {
    await render(hbs`
      <Rental::Image>
        template block text
      </Rental::Image>
      <Rental::Image
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    `);

    assert.dom().hasText('template block text');
    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
  });
});
```

## Determining the Appropriate Amount of Test Coverage

Finally, we should also update the tests for the `<Rental>` component to confirm that we successfully invoked `<Rental::Image>`.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+18" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
  });
});
```

Because we already tested `<Rental::Image>` extensively on its own, we can omit the details here and keep our assertion to the bare minimum. That way, we won't  _also_ have to update the `<Rental>` tests whenever we make changes to `<Rental::Image>`.

<img src="/images/tutorial/part-1/more-about-components/pass-2@2x.png" alt="Tests passing with the new &lt;Rental::Image&gt; test" width="1024" height="512">
