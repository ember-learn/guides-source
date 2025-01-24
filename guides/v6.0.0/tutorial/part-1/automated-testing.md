<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/03-automated-testing.md -->

In this chapter, you will use Ember's built-in testing framework to write some automated tests for your app. By the end of this chapter, we will have an automated test suite that we can run to ensure our app is working correctly:

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="The Super Rentals test suite by the end of the chapter" width="1024" height="512">

In the process, you will learn about:

- The purpose of automated testing
- Writing acceptance tests
- Using generators in Ember CLI
- Testing with the QUnit test framework
- Working with Ember's test helpers
- Practicing the testing workflow

## The Purpose of Automated Testing

We accomplished a lot in the last few chapters! Let's recap—we started with a blank canvas, added a few pages of content, styled everything to look pretty, dropped in a picture of Tomster, added links between our pages and amazingly, everything worked together flawlessly!

But do we _really_ know that everything is actually working? Sure, we clicked around a bit to confirm that things look as expected. But do we feel confident that we checked _every_ page after the most recent change that we made?

After all, most of us have experienced (or heard horror stories about) making a Small Tweak™ in one area of the app that inadvertently broke _everything else_ when we weren't looking.

Maybe we can write a checklist somewhere of all the things to check after making changes to our site. But surely, this will get out of hand as we add more features to our app. It is also going to get old really quickly—repetitive tasks like that are best left to robots.

Hmm, robots. That's an idea. What if we can write this checklist and just get the computer to check everything for us? I think we just invented the idea of _[automated testing](../../../testing/)_! Okay, maybe we were not the first to come up with the concept, but we independently discovered it so we still deserve some credit.

## Adding Acceptance Tests with Generators

Once we are done patting ourselves on the back, go ahead and run the following command in the terminal:

```shell
$ ember generate acceptance-test super-rentals
installing acceptance-test
  create tests/acceptance/super-rentals-test.js

Running "lint:fix" script...
```

This is called a _[generator](https://cli.emberjs.com/release/basic-use/cli-commands/#generatemorefiles)_ command in Ember CLI. Generators automatically create files for us based on Ember's conventions and populate them with the appropriate boilerplate content, similar to how `ember new` initially created a skeleton app for us. It typically follows the pattern `ember generate <type> <name>`, where `<type>` is the kind of thing we are generating, and `<name>` is what we want to call it.

In this case, we generated an _[acceptance test](../../../testing/test-types/#toc_application-tests)_ located at `tests/acceptance/super-rentals-test.js`.

Generators aren't required; we _could_ have created the file ourselves which would have accomplished the exact same thing. But, generators certainly save us a lot of typing. Go ahead and take a peek at the acceptance test file and see for yourself.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Want to save even more typing? <code>ember generate ...</code> can be shortened into <code>ember g ...</code>. That's 7 fewer characters!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Writing Acceptance Tests

Acceptance tests, also known as _application tests_, are one of a few types of automated testing at our disposal in Ember. We will learn about the other types later, but what makes acceptance tests unique is that they test our app from the user's perspective—they are an automated version of the "click around and see if it works" testing we did earlier, which is exactly what we need.

Let's open the generated test file and replace the boilerplate test with our own:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="-2,+3,-9,-10,+11,+12,-14,+15,+16,+17,+18,+19,+20,+21" }
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /super-rentals', async function (assert) {
    await visit('/super-rentals');
  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/super-rentals');
    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

First, we instruct the test robot to navigate to the `/` URL of our app by using the `visit` _test helper_ provided by Ember. This is akin to us typing `http://localhost:4200/` in the browser's address bar and hitting the `enter` key.

Because the page is going to take some time to load, this is known as an _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ (short for _asynchronous_) step, so we will need to tell the test robot to wait by using JavaScript's `await` keyword. That way, it will wait until the page completely finishes loading before moving on to the next step.

This is almost always the behavior we want, so we will almost always use `await` and `visit` as a pair. This applies to other kinds of simulated interaction too, such as clicking on a button or a link, as they all take time to complete. Even though sometimes these actions may seem imperceptibly fast to us, we have to remember that our test robot has really, really fast hands, as we will see in a moment.

After navigating to the `/` URL and waiting for things to settle, we check that the current URL matches the URL that we expect (`/`). We can use the `currentURL` test helper here, as well as `equal` _[assertion](https://github.com/emberjs/ember-test-helpers/blob/master/API.md)_. This is how we encode our "checklist" into code—by specifying, or asserting how things _should_ behave, we will be alerted if our app does _not_ behave in the way that we expect.

Next, we confirmed that the page has an `<h2>` tag that contains the text "Welcome to Super Rentals!". Knowing this is true means that we can be quite certain that the correct template has been rendered, without errors.

Then, we looked for a link with the text `About Us`, located using the _[CSS selector](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors)_ `.jumbo a.button`. This is the same syntax we used in our stylesheet, which means "look inside the tag with the `jumbo` class for an `<a>` tag with the `button` class." This matches up with the HTML structure in our template.

Once the existence of this element on the page was confirmed, we told the test robot to click on this link. As mentioned above, this is a user interaction, so it needs to be `await`-ed.

Finally, we asserted that clicking on the link should bring us to the `/about` URL.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Here, we are writing the tests in a framework called QUnit, which is where the functions <code>module</code>, <code>test</code> and <code>assert</code> come from. We also have additional helpers like <code>click</code>, <code>visit</code>, and <code>currentURL</code> provided by the <code>@ember/test-helpers</code> package. You can tell what comes from which package based on the <code>import</code> paths at the top of the file. Knowing this will be helpful when you need to search for documentation on the Internet or ask for help.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

We can put our automated test into motion by running the _test server_ using the `ember test --server` command, or `ember t -s` for short. This server behaves much like the development server, but it is explicitly running for our tests. It may automatically open a browser window and take you to the test UI, or you can open `http://localhost:7357/` yourself.

If you watch really carefully, you can see our test robot roaming around our app and clicking links:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/automated-testing/pass@2x.png" alt="All tests passing" width="1024" height="512">

It happens really quickly though—blink and you might miss it! In fact, I had to slow this animation down by a hundred times just so you can see it in action. I told you the robot has really, really fast hands!

As much as I enjoy watching this robot hard at work, the important thing here is that the test we wrote has _passed_, meaning everything is working exactly as we expect and the test UI is all green and happy. If you want, you can go to `index.hbs`, delete the `<LinkTo>` component and see what things look like when we have _a failing test_.

<img src="/images/tutorial/part-1/automated-testing/fail@2x.png" alt="A failing test" width="1024" height="768">

Don't forget to put that line back in when you are done!

## Practicing the Testing Workflow

Let's practice what we learned by adding tests for the remaining pages:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });
});
```

As with the development server, the test UI should automatically reload and rerun the entire test suite as you save the files. It is recommended that you keep this page open as you develop your app. That way, you will get immediate feedback if you accidentally break something.

<img src="/images/tutorial/part-1/automated-testing/pass-2@2x.png" alt="Tests still passing with the new tests" width="1024" height="512">

For the rest of the tutorial, we will continue to add more automated tests as we develop new features. Testing is optional but highly recommended. Tests don't affect the functionality of your app, they just protect it from _regressions_, which is just a fancy way of saying "accidental breakages."

If you are in a hurry, you can skip over the testing sections in this tutorial and still be able to follow along with everything else. But don't you find it super satisfying—_oddly satisfying_—to watch a robot click on things really, really fast?
