To create an application test, run `ember generate acceptance-test <name>`.
For example:

```bash
ember g acceptance-test login
```

This generates this file:

```javascript {data-filename=tests/acceptance/login-test.js}
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | login', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /login', async function(assert) {
    await visit('/login');
    assert.equal(currentURL(), '/login');
  });
});
```

`module` allows you to scope your tests: Any test setup that is done inside of this scope will
apply to all test cases contained in this module.
Scoping your tests with `module` also allows you to execute your tests independently from other tests.
For example, to only run your tests from your `login` module, run `ember test --module='Acceptance | login'`.
`setupApplicationTest` deals with application setup and teardown.
The `test` function contains an example test.

Almost every test has a pattern of visiting a route, interacting with the page
(using the helpers), and checking for expected changes in the DOM.

For example:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
import { module, test } from 'qunit';
import { click, fillIn, visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('should add new post', async function(assert) {
    await visit('/posts/new');
    await fillIn('input.title', 'My new post');
    await click('button.submit');
    assert.equal(this.element.querySelector('ul.posts li').textContent, 'My new post');
  });
});
```

## Test Helpers

One of the major issues in testing web applications is that all code is
event-driven and therefore has the potential to be asynchronous (i.e. output can
happen out of sequence from input). This has the ramification that code can be
executed in any order.

An example may help here: Let's say a user clicks two buttons, one after another
and both load data from different servers. They take different times to respond.

When writing your tests, you need to be keenly aware of the fact that you cannot
be sure that the response will return immediately after you make your requests,
therefore your assertion code (the "tester") needs to wait for the thing being
tested (the "testee") to be in a synchronized state. In the example above, that
would be when both servers have responded and the test code can go about its
business checking the data (whether it is mock data, or real data).

This is why all Ember's test helpers are wrapped in code that ensures Ember is
back in a synchronized state when it makes its assertions. It saves you from
having to wrap everything in code that does that, and it makes it easier to read
your tests because there's less boilerplate in them.

Ember includes several helpers to facilitate application testing. There are two
types of helpers: **asynchronous** and **synchronous**.

### Asynchronous Helpers

Asynchronous helpers are "aware" of (and wait for) asynchronous behavior within
your application, making it much easier to write deterministic tests.

Some of these handy helpers are:

* [`click(selector)`][1]
  - Clicks an element and triggers any actions triggered by the element's `click`
    event and returns a promise that fulfills when all resulting async behavior
    is complete.
* [`fillIn(selector, value)`][2]
  - Fills in the selected input with the given value and returns a promise that
     fulfills when all resulting async behavior is complete. Works with `<select>` elements as well as `<input>` elements. Keep in mind that with `<select>` elements, `value` must be set to the _value_ of the `<option>` tag, rather than its _content_ (for example, `true` rather than `"Yes"`).
* [`triggerKeyEvent(selector, type, keyCode)`][3]
  - Simulates a key event type, e.g. `keypress`, `keydown`, `keyup` with the
    desired keyCode on element found by the selector.
* [`triggerEvent(selector, type, options)`][4]
  - Triggers the given event, e.g. `blur`, `dblclick` on the element identified
    by the provided selector.
* [`visit(url)`][5]
  - Visits the given route and returns a promise that fulfills when all resulting
     async behavior is complete.

You can find the full list of helpers in the [API Documentation of ember-test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md).

The asynchronous test helpers from `@ember/test-helpers` are meant to be used together with the [ES2017 feature async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) to write easy-to-read tests which
deal with asynchronous behavior as follows:

Mark the callback passed to the `test` function as asynchronous using the `async` keyword:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
  test('should add new post', async function(assert) {

  });
```
Before making an assertion, wait for the execution of each asynchronous helper to finish with the `await` keyword:

```javascript {data-filename=tests/acceptance/new-post-appears-first-test.js}
  test('should add new post', async function(assert) {
    await visit('/posts/new');
    await fillIn('input.title', 'My new post');
    await click('button.submit');
    assert.equal(this.element.querySelector('ul.posts li').textContent, 'My new post');
  });
```

Once we `await` the execution of the asynchronous helpers this way, we will ensure that all subsequent assertions are always made **after** the
previous steps in the test have completed.

### Synchronous Helpers

Synchronous helpers are performed immediately when triggered.

* [`currentRouteName()`][6]: returns the currently active route name.
* [`currentURL()`][7]: returns the current URL.
* [`find(selector)`][8]: finds one element within the app's root element
  that matches the given selector. Scoping to the root element is useful
  to avoid conflicts with the test framework's reporter.
* [`findAll(selector)`][9]: like `find(selector)`, but finds all elements
  that match the given selector. Equivalent to calling querySelectorAll()
  on the test root element. Returns an array of matched elements.

## Debugging Your Tests

During the development of you tests or when you refactor you application's code, the execution of your tests may fail. In order to help you understand why, [`pauseTest()`][10] and [`resumeTest()`][11] can help you.

To try them out, do the following steps:

1. Add `await pauseTest();` in you test code.
2. Run `ember server`.
3. Visit `http://localhost:4200/tests` in your browser

When the execution of the test come upon `await pauseTest()`, the test will be paused, allowing you to inspect the state of your application.

You can now type `resumeTest()` in the console of your browser to continue the test execution.

[1]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#click
[2]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillin
[3]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#triggerkeyevent
[4]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#triggerevent
[5]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#visit
[6]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currentroutename
[7]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#currenturl
[8]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#find
[9]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#findall
[10]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest
[11]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest
