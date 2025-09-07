<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/04-component-basics.md -->

In this chapter, you will _[refactor](../../../components/introducing-components/#toc_breaking-it-into-pieces)_ your existing templates to use components. We will also be adding a site-wide navigation bar:

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="315">

In doing so, you will learn about:

- Extracting markup into components
- Invoking components
- Passing content to components
- Yielding content with the `{{yield}}` keyword
- Refactoring existing code
- Writing component tests
- Using the application template and `{{outlet}}`s

## Extracting Markup into Components

In a [previous chapter](../building-pages/), we got a light introduction to _[components](../../../components/introducing-components/)_ when using `<LinkTo>` to connect our pages. To recap, we said that components are Ember's way of creating _custom tags_ to supplement the built-in HTML tags from the browser. Now, we are going to create our own components!

During the course of developing an app, it is pretty common to reuse the same UI element across different parts of the app. For example, we have been using the same "jumbo" header in all three pages so far. On every page we worked to follow the same basic structure:

```html
<div class="jumbo">
  <div class="right tomster"></div>
  <!-- page specific content -->
</div>
```

Since it is not a lot of code, it may not seem like a big deal to duplicate this structure on each page. However, if our designer wanted us to make a change to the header, we would have to find and update every single copy of this code. As our app gets bigger, this will become even more of a problem.

Components are the perfect solution to this. In its most basic form, a component is just a piece of template that can be referred to by name. Let's start by creating a new file at `app/components/jumbo.hbs` with markup for the "jumbo" header:

```handlebars { data-filename="app/components/jumbo.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  {{yield}}
</div>
```

That's it, we have created our first component! We can now _invoke_ this component anywhere in our app, using `<Jumbo>` as the tag name.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Remember, when invoking components, we need to capitalize their names so Ember can tell them apart from regular HTML elements. The <code>jumbo.hbs</code> template corresponds to the <code>&#x3C;Jumbo></code> tag, just like <code>super-awesome.hbs</code> corresponds to <code>&#x3C;SuperAwesome></code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Passing Content to Components with `{{yield}}`

When invoking a component, Ember will replace the component tag with the content found in the component's template. Just like regular HTML tags, it is common to pass _[content](../../../components/block-content/)_ to components, like `<Jumbo>some content</Jumbo>`. We can enable this using the `{{yield}}` keyword, which will be replaced with the content that was passed to the component.

Let's try it out by editing the index template:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-1,-2,+3,-7,+8" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</div>
</Jumbo>
```

## Refactoring Existing Code

After saving the changes, your page should automatically reload, and, _voilà_... nothing changed? Well, that's exactly what we wanted to happen this time! We successfully _[refactored](../../../components/introducing-components/#toc_breaking-components-down-further)_ our index template to use the `<Jumbo>` component, and everything still works as expected. And the tests still pass!

<img src="/images/tutorial/part-1/component-basics/index@2x.png" alt="Index page – nothing changed" width="1024" height="251">

<img src="/images/tutorial/part-1/component-basics/pass@2x.png" alt="Tests still passing after the refactor" width="1024" height="512">

Let's do the same for our other two pages as well.

```handlebars { data-filename="app/templates/about.hbs" data-diff="-1,-2,+3,-11,+12" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</div>
</Jumbo>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="-1,-2,+3,-19,+20" }
<div class="jumbo">
  <div class="right tomster"></div>
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</div>
</Jumbo>
```

After saving, everything should look exactly the same as before, and all the tests should still pass. Very nice!

<img src="/images/tutorial/part-1/component-basics/about@2x.png" alt="About page – nothing changed" width="1024" height="275">

<img src="/images/tutorial/part-1/component-basics/contact@2x.png" alt="Contact page – nothing changed" width="1024" height="445">

<img src="/images/tutorial/part-1/component-basics/pass-2@2x.png" alt="Tests still passing another round of refactor" width="1024" height="512">

While it may not save you a lot of characters in this case, _[encapsulating](../../../components/component-arguments-and-html-attributes/)_ the implementation of the "jumbo" header into its own component makes the template slightly easier to read, as it allows the reader to focus on things that are unique to just that page. Further, if we need to make a change to the header, we can make it in a single place. Feel free to give that a try!

## Writing Component Tests

Before we move on to the next component, let's write an automated test for our `<Jumbo>` component. Run this command in your terminal:

```shell
$ ember generate component-test jumbo
installing component-test
  create tests/integration/components/jumbo-test.js

Running "lint:fix" script...
```

Here, we used the generator to generate a _[component test](../../../testing/testing-components/)_, also known as a rendering test. These are used to render and test a single component at a time. This is in contrast to the acceptance tests that we wrote earlier, which have to navigate and render entire pages worth of content.

Let's replace the boilerplate code that was generated for us with our own test:

```js { data-filename="tests/integration/components/jumbo-test.js" data-diff="-9,-10,-11,+12,+13,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,+27,+28,+29" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | jumbo', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  test('it renders the content inside a jumbo header with a tomster', async function (assert) {
    await render(hbs`<Jumbo>Hello World</Jumbo>`);

    await render(hbs`<Jumbo />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <Jumbo>
        template block text
      </Jumbo>
    `);

    assert.dom().hasText('template block text');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo').hasText('Hello World');
    assert.dom('.jumbo .tomster').exists();
  });
});
```

Instead of navigating to a URL, we start the test by rendering our `<Jumbo>` component on the test page. This is useful because it may otherwise require a lot of setup and interaction just to get to a page where your component is used. Component tests allows us to skip all of that and focus exclusively on testing the component in isolation.

Just like visit and click, which we used earlier, render is also an async step, so we need to pair it with the `await` keyword. Other than that, the rest of the test is very similar to the acceptance tests we wrote in the previous chapter. Make sure the test is passing by checking the tests UI in the browser.

<img src="/images/tutorial/part-1/component-basics/pass-3@2x.png" alt="Tests still passing with our component test" width="1024" height="512">

We've been refactoring our existing code for a while, so let's change gears and implement a new feature: the site-wide navigation bar.

We can create a `<NavBar>` component at `app/components/nav-bar.hbs`:

```handlebars { data-filename="app/components/nav-bar.hbs" }
<nav class="menu">
  <LinkTo @route="index" class="menu-index">
    <h1>SuperRentals</h1>
  </LinkTo>
  <div class="links">
    <LinkTo @route="about" class="menu-about">
      About
    </LinkTo>
    <LinkTo @route="contact" class="menu-contact">
      Contact
    </LinkTo>
  </div>
</nav>
```

Next, we will add our `<NavBar>` component to the top of each page:

```handlebars { data-filename="app/templates/about.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/index.hbs" data-diff="+1" }
<NavBar />
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
```

Voilà, we made another component!

<img src="/images/tutorial/part-1/component-basics/index-with-nav@2x.png" alt="Index page with nav" width="1024" height="315">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>&#x3C;NavBar /></code> is a shorthand for <code>&#x3C;NavBar>&#x3C;/NavBar></code>. Component tags must always be closed properly, even when you are not passing any content to them, as in this case. Since this is pretty common, Ember provides the alternative self-closing shorthand to save you some typing!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Everything looks great in the browser, but as we know, we can never be too sure. So let's write some tests!

But what kind of test? We _could_ write a component test for the `<NavBar>` by itself, like we just did for the `<Jumbo>` component. However, since the job of `<NavBar>` is to _navigate_ us around the app, it would not make a lot of sense to test this particular component in isolation. So, let's go back to writing some acceptance tests!

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+12,+13,+26,+27,+40,+41,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

We updated the existing tests to assert that a `<nav>` element exists on each page. This is important for accessibility since screen readers will use that element to provide navigation. Then, we added a new test that verifies the behavior of the `<NavBar>` links.

All tests should pass at this point!

<img src="/images/tutorial/part-1/component-basics/pass-4@2x.png" alt="Tests still passing with our &lt;NavBar&gt; tests" width="1024" height="512">

## Using the Application Template and `{{outlet}}`s

Before we move on to the next feature, there is one more thing we could clean up. Since the `<NavBar>` is used for site-wide navigation, it really needs to be displayed on _every_ page in the app. So far, we have been adding the component on each page manually. This is a bit error-prone, as we could easily forget to do this the next time that we add a new page.

We can solve this problem by moving the nav-bar into a special template called `application.hbs`. You may remember that it was generated for us when we first created the app but we deleted it. Now, it's time for us to bring it back!

This template is special in that it does not have its own URL and cannot be navigated to on its own. Rather, it is used to specify a common layout that is shared by every page in your app. This is a great place to put site-wide UI elements, like a nav-bar and a site footer.

While we are at it, we will also add a container element that wraps around the whole page, as requested by our designer for styling purposes.

```handlebars { data-filename="app/templates/application.hbs" }
<div class="container">
  <NavBar />
  <div class="body">
    {{outlet}}
  </div>
</div>
```

```handlebars { data-filename="app/templates/index.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
  <LinkTo @route="about" class="button">About</LinkTo>
</Jumbo>
```

```handlebars { data-filename="app/templates/about.hbs" data-diff="-1" }
<NavBar />
<Jumbo>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</Jumbo>
```

The `{{outlet}}` keyword denotes the place where our site's pages should be rendered into, similar to the `{{yield}}` keyword we saw [earlier](#toc_passing-content-to-components-with-yield).

This is much nicer! We can run our test suite, which confirms that everything still works after our refactor. We are ready to move on to the next feature!

<img src="/images/tutorial/part-1/component-basics/pass-5@2x.png" alt="Tests still passing with {{outlet}}" width="1024" height="512">
