Ember provides 3 types of tests out of the box:

- Unit tests
- Rendering tests (previously known as integration tests)
- Application tests (previously known as acceptance tests)

Broadly speaking, these tests differ in two aspects:

- Which parts of your app they check for correctness. Having different types of tests help separate testing concerns.
- How fast they execute.

Let's take a look at each type and when you might use one over another.


## Unit Tests

### Definition

Unit tests check the **correctness of individual methods and functions**. Given an input, does the method return the right output? Since unit tests can check code at the method level, they can form the **foundation of your test suite**. Unit tests are also **extremely fast** by nature.

Unit tests get created automatically when you use Ember CLI to create [adapters](../../models/customizing-adapters/), controllers, initializers, [models](../../models/defining-models/), [serializers](../../models/customizing-serializers/), [services](../../services/), and utilities. We encourage you to read the rest of the documentation to learn writing tests for each.

### Why Use Them?

The benefits of having unit tests are threefold.

One, unit tests are typically isolated and focus on individual methods and functions, so it is easy to debug when your tests fail.

Two, unit tests allow you to focus on small pieces of logic that might be difficult to exercise in higher-level tests.

Finally, unit tests run extremely fast, so you can check many permutations of arguments with minimal impact on your test suite performance.

### Examples

The code below shows how unit tests check individual methods. Imagine that our app has a utility that helps us work with numbers.

```javascript {data-filename=tests/unit/math-library-test.js}
import { module, test } from 'qunit';
import { getDivisors, isPrime } from 'our-app-name/utils/math-library';

module('Unit | Utility | math-library', function() {
  test('should check if a number is prime', function(assert) {
    assert.strictEqual(isPrime(1), false);
    assert.strictEqual(isPrime(2), true);
    assert.strictEqual(isPrime(3), true);
    assert.strictEqual(isPrime(4), false);
    assert.strictEqual(isPrime(5), true);
    assert.strictEqual(isPrime(6), false);
  });

  test('should get all divisors of a number', function(assert) {
    assert.deepEqual(getDivisors(1), [1]);
    assert.deepEqual(getDivisors(2), [1, 2]);
    assert.deepEqual(getDivisors(3), [1, 3]);
    assert.deepEqual(getDivisors(4), [1, 2, 4]);
    assert.deepEqual(getDivisors(5), [1, 5]);
    assert.deepEqual(getDivisors(6), [1, 2, 3, 6]);
  });
});
```

Here are more examples where unit tests are ideal:

- Inside a controller, a computed property continues to filter `this.model` correctly after an action is taken
- Check how [`normalize()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/normalize?anchor=normalize) in a serializer receives data
- Check how [`serialize()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/serialize?anchor=serialize) in a serializer sends data
- A [cron](https://en.wikipedia.org/wiki/Cron) utility parses an input string into an object that can be used for UI

### What to Watch Out for

When unit tests involve the Ember framework, you must import and call [`setupTest()`](https://github.com/emberjs/ember-qunit#setup-tests), then pass the `hooks` object. (Don't worry. [Ember CLI](../#toc_ember-cli) will do this for you!)

For example, consider a service that keeps an array of messages, to be shown to the user at a later time:

```javascript {data-filename=tests/unit/services/flash-messages-test.js}
import { setupTest } from 'my-app-name/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Service | flash-messages', function(hooks) {
  setupTest(hooks);

  test('should be able to buffer messages', function(assert) {
    let service = this.owner.lookup('service:flash-messages');

    service.add('Hello');
    service.add('World!');

    assert.deepEqual(service.get('messages'), ['Hello', 'World!']);
  });
});
```

By calling `setupTest()`, you gain access to a few things. First is Ember's [Dependency Injection](../../applications/dependency-injection/) system. In short, you can [look up](https://api.emberjs.com/ember/5.9.0/classes/ApplicationInstance/methods/lookup?anchor=lookup) anything in your application, with a little help from `this.owner`. Second, you gain access to some common utility functions, `this.get()` and `this.set()`, in your tests. Finally, you can use `pauseTest()` to [debug your tests](../#toc_how-to-debug-tests).


## Rendering Tests

### Definition

Rendering tests (integration tests) check how a **component looks and behaves**. Ember CLI creates rendering tests for [components](../../components/defining-a-component/) and [helpers](../../templates/writing-helpers/).

In terms of performance, rendering tests sit in the middle, between unit and application tests.

### Why Use Them?

Since your app is made up of multiple components, you want to ensure that each is correct before testing them as a group. If a component is reusable, you want to guarantee that it works for all (if not, many) permutations of [arguments](../../components/component-arguments-and-html-attributes/) and [actions](../../components/component-state-and-actions/).

Rendering tests let you test components using Ember's rendering engine. This means, a component created in your rendering test will behave as it would in the real app. You are guaranteed that the component will follow its lifecycle hooks. You can also interact with the component like an end-user would.

### Examples

Consider a button component. For simplicity, assume that the component keeps track of the number of clicks and displays it as label. (In other words, this component doesn't allow arguments or actions to be passed.)

```javascript {data-filename=tests/integration/components/simple-button-test.js}
import { click, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

module('Integration | Component | simple-button', function(hooks) {
  setupRenderingTest(hooks);

  test('should keep track of clicks', async function(assert) {
    await render(hbs`<SimpleButton />`);
    assert.dom('[data-test-label]').hasText('0 clicks');

    await click('[data-test-button]');
    assert.dom('[data-test-label]').hasText('1 click');

    await click('[data-test-button]');
    assert.dom('[data-test-label]').hasText('2 clicks');
  });
});
```

Note, we imported `render` and `click` from [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md) to show and interact with the component. We also imported `hbs` from [ember-cli-htmlbars](https://github.com/ember-cli/ember-cli-htmlbars) to help with inline template definitions. With these methods, we can check if clicking on the component correctly updates its output to the user.

Here are more examples where rendering tests are ideal:

* A blog post component allows two modes—view and edit
* A button component satisfies accessibility for various arguments and actions
* A navigation component recursively renders child nav items
* A helper, which uses [`Intl.NumberFormat`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat), formats a price depending on the currency and number of digits to show


### What to Watch Out for

In order for rendering tests to work, you must call [`setupRenderingTest()`](https://github.com/emberjs/ember-qunit#setup-rendering-tests) and pass the `hooks` object.

What does `setupRenderingTest()` do? First, it uses `setupTest()` behind the scenes. Just like in [Unit Tests](../test-types/#toc_what-to-watch-out-for), you have access to `this.owner`, `this.get()`, `this.set()`, and `pauseTest()`.

In addition, `setupRenderingTest()` allows Ember's renderer to use helpers for rendering and DOM interaction, such as `render`, `click`, and `fillIn`. You can also use `this.element` to access the DOM element that results from `render`.


## Application Tests

### Definition

You can use application tests (acceptance tests) to **verify user stories and features from an end-user perspective**. You interact with the application in the same way as a user would—from visiting the homepage, to authenticating oneself, to navigating to a different page, to filling out a form, etc.

Application tests are slower than unit and rendering tests because they create an instance of the Ember application.

### Why Use Them?

Application tests help you see how well different components interact with each other. For nested or contextual components, you can get by with rendering tests. If components are unrelated, however, application tests may be the only way.

You can also use application tests to check routing. Can the user navigate from one page to another? Will they see the right components when the page is loaded? It's easy to check these in application tests.

Finally, if your application receives and sends data, you want to guarantee that you can take these actions successfully. You also want to prove that you can handle the error states correctly. Application tests are a great place to check these, since you have to interact with the app just like the user would.

### Examples

Let's continue with the blog post example from [Rendering Tests](../test-types/#toc_examples-1). Recall that our blog post component allows two modes—view and edit. The following test checks one way for creating a blog post:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { click, currentURL, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('The user can create a blog post', async function(assert) {
    await visit('/posts/new');
    await fillIn('[data-test-field="Title"]', 'My New Post');
    await fillIn('[data-test-field="Content"]', 'Lorem ipsum dolor sit amet');
    await click('[data-test-button="Save"]');

    // The user is redirected to their new post
    assert.strictEqual(currentURL(), '/posts/1');
    assert.dom('[data-test-field="Title"]').hasText('My New Post');
    assert.dom('[data-test-field="Content"]').hasText('Lorem ipsum dolor sit amet');
  });
});
```

What are other things that you can test for?

- The user can read, update, and delete blog posts (possibly in a batch operation)
- The user can make comments on a blog post
- The user can share a blog post
- The user should be authorized to take actions on a blog
- The user receives feedback if there is an error

### What to Watch Out for

There are a few things to look out for.

First is the time that application tests take to run. For small apps, its impact is minimal. However, for large apps, maintaining a short feedback loop becomes critical. In these cases, if you can verify a scenario in your app using unit or rendering tests, you may want to consider them instead.

Second, you can use Ember CLI to create an application test. Because application tests can cover anything in your app, you will want to organize the files in some natural manner. This will help you quickly find tests and prevent writing duplicates.

One way to organize is to mimic the folder structure of `app/routes`. In other words, for every route, you create an application test file. If this would result in too many files, you can instead create a file for each parent route.

Finally, in order for application tests to work, you must call [`setupApplicationTest()`](https://github.com/emberjs/ember-qunit#setup-application-tests) and pass the `hooks` object. In addition to the usual goodness of `setupTest()`, this method creates an application instance so that you can test the app from an end-user perspective. It also lets you use test helpers for routing and DOM interaction, such as `currentURL`, `visit`, `click`, and `fillIn`.


## Summary

We learned that, by default, Ember provides 3 types of tests: unit, rendering, and application tests.

These tests differ in how many parts of your app they integrate to help you arrive at a logical conclusion. On one end, unit tests let you check a section of your code in isolation. On the other, application tests let you experience your entire application as end-user.

A corollary is that these tests differ in performance. The more parts used (the closer to the real app), the slower the tests. As your app gets bigger, you will want to maintain a healthy mix of unit, rendering, and application tests so that you can enjoy both broad test coverage and short feedback loop.

In the next section, we will take a look at best practices for writing tests.
