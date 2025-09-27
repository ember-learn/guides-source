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
  create app/components/rental.gjs
installing component-test
  create tests/integration/components/rental-test.gjs

Running "lint:fix" script...
```

The generator created two new files for us, a component template at `app/components/rental.gjs`, and a component test file at `tests/integration/components/rental-test.gjs`.

We will start by editing the component template. Let's _[hard-code](https://en.wikipedia.org/wiki/Hard_coding)_ the details for one rental property for now, and replace it with the real data from the server later on.

```gjs { data-filename="app/components/rental.gjs" data-diff="-2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19" }
<template>
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
</template>
```

Then, we will write a test to ensure all of the details are present. We will replace the boilerplate test generated for us with our own assertions, just like we did for the `<Jumbo>` component earlier:

```gjs { data-filename="tests/integration/components/rental-test.gjs" data-diff="-9,-10,-11,-12,-13,-14,+15,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,+28,+29,+30,+31,+32,+33" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import Rental from 'super-rentals/components/rental';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Updating values is achieved using autotracking, just like in app code. For example:
    // class State { @tracked myProperty = 0; }; const state = new State();
    // and update using state.myProperty = 1; await rerender();
    // Handle any actions with function myAction(val) { ... };

  test('it renders information about a rental property', async function (assert) {
    await render(<template><Rental /></template>);

    assert.dom().hasText('');

    // Template block usage:
    await render(<template>
      <Rental>
        template block text
      </Rental>
    </template>);

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

```gjs { data-filename="app/templates/index.gjs" data-diff="+3,+11,+12,+13,+14,+15,+16,+17,+18" }
import { LinkTo } from '@ember/routing';
import Jumbo from 'super-rentals/components/jumbo';
import Rental from 'super-rentals/components/rental';

<template>
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
</template>
```

With that, we should see the `<Rental>` component showing our Grand Old Mansion three times on the page:

<img src="/images/tutorial/part-1/more-about-components/three-old-mansions@2x.png" alt="Three Grand Old Mansions" width="1024" height="1130">

Things are looking pretty convincing already; not bad for just a little bit of work!

## Organizing Code in Folders

Next, let's add the image for the rental property. We will use the component generator for this again:

```shell
$ ember generate component rental/image
installing component
  create app/components/rental/image.gjs
installing component-test
  create tests/integration/components/rental/image-test.gjs

Running "lint:fix" script...
```

This time, we had a `/` in the component's name. This resulted in the component being created at `app/components/rental/image.gjs`.

We can organize our components by folders according to their purpose. This is completely optional—these components are not special in any way.

## Forwarding HTML Attributes with `...attributes`

Let's edit the component's template:

```gjs { data-filename="app/components/rental/image.gjs" data-diff="-2,+3,+4,+5" }
<template>
  {{yield}}
  <div class="image">
    <img ...attributes />
  </div>
</template>
```

Instead of hard-coding specific values for the `src` and `alt` attributes on the `<img>` tag, we opted for the `...attributes` keyword instead, which is also sometimes referred to as the _["splattributes"](../../../components/component-arguments-and-html-attributes/#toc_html-attributes)_ syntax. This allows arbitrary HTML attributes to be passed in when invoking this component, like so:

```gjs { data-filename="app/components/rental.gjs" data-diff="+1,+2,+5,+6,+7,+8" }
import RentalImage from 'super-rentals/components/rental/image';

<template>
  <article class="rental">
    <RentalImage
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
</template>
```

We specified a `src` and an `alt` HTML attribute here, which will be passed along to the component and attached to the element where `...attributes` is applied in the component template. You can think of this as being similar to `{{yield}}`, but for HTML attributes specifically, rather than displayed content. In fact, we have already used this feature [earlier](../building-pages/) when we passed a `class` attribute to `<LinkTo>`.

<img src="/images/tutorial/part-1/more-about-components/rental-image@2x.png" alt="The &lt;RentalImage&gt; component in action" width="1024" height="1130">

This way, our `<RentalImage>` component is not coupled to any specific rental property on the site. Of course, the hard-coding problem still exists (we simply moved it to the `<Rental>` component), but we will deal with that soon. We will limit all the hard-coding to the `<Rental>` component, so that we will have an easier time cleaning it up when we switch to fetching real data.

In general, it is a good idea to add `...attributes` to the primary element in your component. This will allow for maximum flexibility, as the invoker may need to pass along classes for styling or ARIA attributes to improve accessibility.

Let's write a test for our new component!

```gjs { data-filename="tests/integration/components/rental/image-test.gjs" data-diff="-4,+5,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,+21,-23,-24,-25,+26,+27,+28,+29,-32,-33,+34,+35,+36,+37,+38,+39" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import Image from 'super-rentals/components/rental/image';
import RentalImage from 'super-rentals/components/rental/image';

module('Integration | Component | rental/image', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Updating values is achieved using autotracking, just like in app code. For example:
    // class State { @tracked myProperty = 0; }; const state = new State();
    // and update using state.myProperty = 1; await rerender();
    // Handle any actions with function myAction(val) { ... };

    await render(<template><Image /></template>);

    assert.dom().hasText('');

    // Template block usage:
  test('it renders the given image', async function (assert) {
    await render(<template>
      <Image>
        template block text
      </Image>
      <RentalImage
        src="/assets/images/teaching-tomster.png"
        alt="Teaching Tomster"
      />
    </template>);

    assert.dom().hasText('template block text');
  });
    assert
      .dom('.image img')
      .exists()
      .hasAttribute('src', '/assets/images/teaching-tomster.png')
      .hasAttribute('alt', 'Teaching Tomster');
   });
});
```

## Determining the Appropriate Amount of Test Coverage

Finally, we should also update the tests for the `<Rental>` component to confirm that we successfully invoked `<RentalImage>`.

```gjs { data-filename="tests/integration/components/rental-test.gjs" data-diff="+18" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import Rental from 'super-rentals/components/rental';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(<template><Rental /></template>);

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

Because we already tested `<RentalImage>` extensively on its own, we can omit the details here and keep our assertion to the bare minimum. That way, we won't  _also_ have to update the `<Rental>` tests whenever we make changes to `<RentalImage>`.

<img src="/images/tutorial/part-1/more-about-components/pass-2@2x.png" alt="Tests passing with the new &lt;RentalImage&gt; test" width="1024" height="512">
