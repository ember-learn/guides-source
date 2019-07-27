In Ember, there are 3 types of tests. From the least complex to the most, we have:

- Unit tests
- Rendering tests (integration tests)
- Application tests (acceptance tests)

Broadly speaking, these tests differ in two aspects. (1) How much of our app should they cover for correctness? In other words, we look at separation of concerns. (2) How fast can they run? After all, we want our tests to finish in a timely manner.

In this section, we will take a look at each type and when we might use one over another.


## Unit Tests

### Definition

We can use unit tests to check the **correctness of an individual method**. Given an input, does the method return the right output? Unit tests are **fast** and should form the **building blocks of our test suite**.

When we use Ember CLI, a unit test gets created for an [adapter](../../models/customizing-adapters/), a controller, initializer, [model](../../models/defining-models/), [serializer](../../models/customizing-serializers/), [service](../../services/), and utility—pretty much everything! (Unit tests are the building blocks, remember?) We encourage you to read the rest of the documentation to learn writing tests for each.

### Why Use Them?

The benefits of having unit tests are twofold. If our unit tests are correct, then we can be more confident that our rendering and application tests will be also. Conversely, when a rendering or an application test fails, we can more easily identify the method that failed, because it likely hasn't been covered by a unit test.

### Examples

The code below shows how unit tests check individual methods. Imagine that our app has a utility that helps us work with numbers.

```javascript {data-filename=tests/unit/math-library-test.js}
import { module, test } from 'qunit';
import util from 'our-app-name/utils/math-library';

module('Unit | Utility | math-library', function() {
  test('isPrime works correctly', function(assert) {
    assert.strictEqual(util.isPrime(1), false);
    assert.strictEqual(util.isPrime(2), true);
    assert.strictEqual(util.isPrime(3), true);
    assert.strictEqual(util.isPrime(4), false);
    assert.strictEqual(util.isPrime(5), true);
    assert.strictEqual(util.isPrime(6), false);
  });

  test('getDivisors works correctly', function(assert) {
    assert.deepEqual(util.getDivisors(1), [1]);
    assert.deepEqual(util.getDivisors(2), [1, 2]);
    assert.deepEqual(util.getDivisors(3), [1, 3]);
    assert.deepEqual(util.getDivisors(4), [1, 2, 4]);
    assert.deepEqual(util.getDivisors(5), [1, 5]);
    assert.deepEqual(util.getDivisors(6), [1, 2, 3, 6]);
  });
});
```

Here are more examples for which we can write unit tests:

- Inside a controller, a computed property continues to filter `this.model` correctly after an action is taken
- Check how [`normalize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/normalize?anchor=normalize) in a serializer receives data
- Check how [`serialize()`](https://api.emberjs.com/ember-data/release/classes/JSONAPISerializer/methods/serialize?anchor=serialize) in a serializer sends data
- A utility, which follows a standard (e.g. cron, LDAP, encryption), correctly parses an input expression

### What to Watch Out for

When unit tests involve the Ember framework, we must import and call [`setupTest()`](https://github.com/emberjs/ember-qunit#setup-tests), then pass the `hooks` object. (Don't worry. [Ember CLI](../#toc_ember-cli) will do this for us!)

For example, consider a service that shows messages to the user:

```javascript {data-filename=tests/unit/services/flash-messages-test.js}
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | flash-messages', function(hooks) {
  setupTest(hooks);

  test('We can buffer messages', function(assert) {
    let service = this.owner.lookup('service:flash-messages');

    service.add('Hello');
    service.add('World!');

    assert.deepEqual(service.get('messages'), ['Hello', 'World!']);
  });
});
```

By calling `setupTest()`, we gain access to a few things. First is Ember's [Dependency Injection](../../applications/dependency-injection/) system. In short, we can [look up](https://emberjs.com/api/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) anything in our application, with a little help from `this.owner`. Second, we can use `this.get()` and `this.set()` in our tests. Finally, we can use `pauseTest()` to [debug our tests](../#toc_how-to-debug-tests).


## Rendering Tests

### Definition

We can use rendering tests (also known as integration tests) to check how a **component looks and behaves**. Ember CLI creates a rendering test for a [component](../../components/defining-a-component/) and [helper](../../templates/writing-helpers/).

In terms of speed, rendering tests sit in the middle, between unit and application tests.

### Why Use Them?

Since our app is made up of multiple components, we want to ensure that each is correct before testing them as a group. If a component is reusable, we want to guarantee that it works for all (if not, many) permutations of [arguments](../../components/arguments-and-attributes/) and [actions](../../components/actions-and-events/#toc_passing-down-the-action).

Rendering tests also let us test components in the context of an Ember application. When we use `render` to create a component, we know that the component will follow Ember's lifecycle hooks and will be injected with [services](../../services/). Having a good hypothesis like this helps us trace errors in our components and rendering tests.

### Examples

In the example below, we consider a button component. For simplicity, we assume that the component keeps track of the number of clicks and displays it as text. (In other words, this component doesn't allow arguments or actions to be passed.)

```javascript {data-filename=tests/integration/components/simple-button/component-test.js}
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration | Component | simple-button', function(hooks) {
  setupRenderingTest(hooks);

  test('We show the correct number of clicks', async function(assert) {
    await render(hbs`<SimpleButton />`);
    assert.dom(this.element).hasText('0 clicks');

    await click(this.element);
    assert.dom(this.element).hasText('1 click');

    await click(this.element);
    assert.dom(this.element).hasText('2 clicks');
  });
});
```

Note, we imported `render` and `click` from [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md) to show and interact with the component. We also imported `hbs` from [htmlbars-inline-precompile](https://github.com/ember-cli/ember-cli-htmlbars-inline-precompile) to help with inline template definitions. With these methods, we can check if clicking on the component correctly updates its internal state and external feedback to the user.

Here are more examples for which we can write rendering tests:

* A blog post component allows two modes—view and edit
* A button component satisfies accessibility for various arguments and actions
* A navigation component recursively renders child nav items
* A helper, which uses [`Intl.NumberFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat), formats a price depending on the currency and number of digits to show


### What to Watch Out for

In order for rendering tests to work, we must call [`setupRenderingTest()`](https://github.com/emberjs/ember-qunit#setup-rendering-tests) and pass the `hooks` object.

What does `setupRenderingTest()` do? First, it uses `setupTest()` behind the scenes. Just like in [Unit Tests](../different-types-of-tests/#toc_what-to-watch-out-for), we have access to `this.owner`, `this.get()`, `this.set()`, and `pauseTest()`.

In addition, `setupRenderingTest()` lets us call test helpers for rendering and DOM interaction, such as `render`, `click`, and `fillIn`. We can also use `this.element` to access the DOM element that results from `render`.


## Application Tests

### Definition

We can use application tests (also known as acceptance tests) to **verify user stories and features from an end-user perspective**. We interact with the application in the same way as a user would—from visiting the homepage, to authenticating ourselves, to navigating to a different page, to filling out a form, etc.

Application tests are slow because they create an instance of our app. Use them wisely! If we can check something through a unit or rendering test, do so instead.

### Why Use Them?

Application tests help us see how well different components interact with each other. For nested or contextual components, we can get by with rendering tests. If components are unrelated, however, application tests may be the only way.

If our application receives and sends data, we want to guarantee our user that we can do these successfully. We also want to prove that we can handle the error states correctly. Application tests are a great place to check these, since we have to interact with the app just like the user would.

### Examples

We will continue with the blog post example from [Rendering Tests](../different-types-of-tests/#toc_examples-1). Recall that our blog post component allows two modes—view and edit. The following test checks one way for creating a blog post:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('The user can create a blog post', async function(assert) {
    await visit('/posts/new');
    await fillIn('[data-test-title]', 'My new post');
    await fillIn('[data-test-content]', 'Lorem ipsum dolor sit amet');
    await click('[data-test-button="Save"]');

    // The user is redirected to their new post
    assert.strictEqual(currentURL(), '/posts/1');
    assert.dom('[data-test-title]').hasText('My new post');
    assert.dom('[data-test-content]').hasText('Lorem ipsum dolor sit amet');
  });
});
```

What are other things that we can test for?

- The user can read, update, and delete blog posts (possibly in a batch operation)
- The user can make comments on a blog post
- The user can share a blog post
- The user needs to be logged in to take the actions above
- The user receives feedback if there is an error

### What to Watch Out for

We can use Ember CLI to create an application test. Because application tests can cover anything in our app, we should organize the files in some natural manner. This will help us quickly find tests and prevent writing duplicates.

One way to organize is to mimic the folder structure of `app/routes`. In other words, for every route, we create an application test file. If this would result in too many files, we can instead create a file for each parent route.

In order for application tests to work, we must call [`setupApplicationTest()`](https://github.com/emberjs/ember-qunit#setup-application-tests) and pass the `hooks` object. In addition to the usual goodness of `setupTest()`, this method creates an application instance so that we can test the app from an end-user perspective. It also lets us use test helpers for routing and DOM interaction, such as `currentURL`, `visit`, `click`, and `fillIn`.
