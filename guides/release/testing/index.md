Ember gives you **the power to write tests and be productive from day one**. You can be confident that your app will be correct today and years from now. A question remains: *How* should you write tests?

Since tests are a core part of the Ember framework and your development cycle, we will dedicate several sections to learning how to write tests.

In this section, we will cover why testing is important, what tools can help you with testing, and how to run and debug your tests.


## Why Do I Need Tests?

Writing tests is a necessary ingredient if you want to guarantee users and stakeholders that your app, whether small or large, will function as intended at any given time. The larger your app, the more costly and error-prone manual testing becomes.

Writing tests is also a fun activity, a nice change of pace from delivering features daily, and a way to help you refactor code and improve as a developer. Tests can also serve as a living documentation—a key element in onboarding new developers.


## What Tools Can Help Me?

### QUnit, QUnit DOM

Every Ember app comes with [QUnit](http://qunitjs.com/) and [QUnit DOM](https://github.com/simplabs/qunit-dom). QUnit is a testing framework, and QUnit DOM is a library that helps you **write tests that are concise and readable**.

To see the power of QUnit DOM, consider this code snippet. It checks whether our button component shows the right label and the right attributes.

```javascript {data-filename=tests/integration/components/simple-button-test.js}
/*
  For simplicity, the import, module, and setup statements
  are omitted here. Our component accepts two arguments,
  label (string) and isDisabled (boolean).
*/
test('should show label', async function(assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
    />
  `);
  let button = this.element.querySelector('button');

  // QUnit
  assert.strictEqual(button.textContent.trim(), 'Hello world!');

  // QUnit DOM
  assert.dom(button).hasText('Hello world!');
});

test('should allow disabling the button', async function(assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
      @isDisabled={{true}}
    />
  `);
  let button = this.element.querySelector('button');

  // QUnit
  assert.strictEqual(button.disabled, true);
  assert.ok(button.classList.contains('is-disabled'));

  // QUnit DOM
  assert.dom(button).hasAttribute('disabled');
  assert.dom(button).hasClass('is-disabled');
});
```

### Mocha, Chai DOM

[Mocha](https://mochajs.org/) is another testing framework. If you are more familiar with Mocha, you can install [ember-mocha](https://github.com/emberjs/ember-mocha) and [Chai DOM](https://www.chaijs.com/plugins/chai-dom/) instead.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        All examples in this guide follow QUnit. Rest assured, the best practices for testing that we present in this guide are independent of your choice of testing framework. Keep in mind, the setup functions from <a href="https://github.com/emberjs/ember-qunit" target="_blank" rel="noopener noreferrer">ember-qunit</a>—<code>setupTest</code>, <code>setupRenderingTest</code>, and <code>setupApplicationTest</code>—need to be replaced with those from <a href="https://github.com/emberjs/ember-mocha" target="_blank" rel="noopener noreferrer">ember-mocha</a>.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Ember CLI

When you use [Ember CLI](https://ember-cli.com/generators-and-blueprints) to generate an Ember "object" (e.g. component, model, service), it will create a test file with a setup that correctly addresses your testing framework and the [type of test that you should write](./test-types).

You can also use Ember CLI to create the test file separately from the object. For example, if you enter the following lines in the terminal:

```bash
ember g model-test student
ember g component-test student
ember g acceptance-test students
```

you get a unit test for the `student` model, a rendering test (integration test) for the `student` component, and an application test (acceptance test) that can be used to check the `students` route and its subroutes.

### Ember Test Selectors

You want to be able to grab DOM elements in your tests. Since Ember is just JavaScript, you can use [`querySelector`](https://developer.mozilla.org/docs/Web/API/Element/querySelector) and [`querySelectorAll`](https://developer.mozilla.org/docs/Web/API/Element/querySelectorAll) to do so. These methods require you to pass a **selector**, a string that identifies the element(s) that you want.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Tomster says...</div>
      <div class="cta-note-message">
        While you can use CSS classes as selectors, a best practice for testing is to <strong>separate the concerns between styling and testing</strong>. Class names and DOM structure change over time—for the better—by you, your team, and addon developers. If you rely on CSS classes, your tests will break and need a significant rewrite.
      </div>
    </div>
    <img src="/images/mascots/tomster.png" role="presentation" alt="">
  </div>
</div>

[Ember Test Selectors](https://github.com/simplabs/ember-test-selectors) is an addon that helps you **write tests that are more resilient to DOM changes**. You use `data-test-*` attributes to mark the elements that will be used in your tests. The addon works with QUnit DOM and helpers from [@ember/test-helpers](https://github.com/emberjs/ember-test-helpers/). It also removes the `data-test-*` attributes in the production build.

Consider the example of a button component again. This time, our component can display a Material icon in addition to the label.

```handlebars {data-filename=app/components/simple-button.hbs}
<button
  data-test-button={{@label}}
  type="button"
>
  {{#if @icon}}
    <i
      data-test-icon
      aria-hidden="true"
      class="material-icons"
    >
      {{@icon}}
    </i>
  {{/if}}

  <span data-test-label>{{@label}}</span>
</button>
```

```javascript {data-filename=tests/integration/components/simple-button-test.js}
test('should show icon and label', async function(assert) {
  await render(hbs`
    <SimpleButton
      @icon="face"
      @label="Hello world!"
    />
  `);

  // Bad
  assert.strictEqual(
    this.element.querySelector('.material-icons').textContent.trim(),
    'face',
    'The user sees the correct icon.'
  );

  assert.strictEqual(
    this.element.querySelector('span').textContent.trim(),
    'Hello world!',
    'The user sees the correct label.'
  );

  // Good
  assert.strictEqual(
    this.element.querySelector('[data-test-icon]').textContent.trim(),
    'face',
    'The user sees the correct icon.'
  );

  assert.strictEqual(
    this.element.querySelector('[data-test-label]').textContent.trim(),
    'Hello world!',
    'The user sees the correct label.'
  );

  // Great!
  assert.dom('[data-test-icon]')
    .hasText('face', 'The user sees the correct icon.');

  assert.dom('[data-test-label]')
    .hasText('Hello world!', 'The user sees the correct label.');
});
```

### Ember CLI Mirage

If your application receives and sends data, you want to show that you can take these actions successfully. You also want to prove that you can handle the error states correctly.

[Ember CLI Mirage](https://www.ember-cli-mirage.com/) is an addon that allows you to create a mock server. You can also use it to test your app against various server states. To learn more about using Mirage in tests, we encourage you to [visit the official website](https://www.ember-cli-mirage.com/docs/testing/acceptance-tests).

### Ember Exam

You want your tests to finish fast. A fast run means you get to try out a different solution and iterate many more times.

[Ember Exam](https://github.com/ember-cli/ember-exam) is an addon that allows you to parallelize the run. If you have many rendering and application tests, this can dramatically speed up your testing.

Ember Exam also lets you randomize how the tests are run. Why would you want to do so? When you don't properly set up and tear down a test, you can create dependencies among tests. Randomizing the order helps you catch these inadvertent bugs.

### Percy

Last but not least, [Percy](https://percy.io/) is a **visual regression testing** tool that helps you catch accidental style changes. You can try it out for free and pay for additional service.

While we don't recommend this practice in general, you might also use Percy in lieu of application tests to capture complex workflows.


## How to Run Tests

You have a few options for running tests.

First, you can run the test suite by entering the command `ember test`, or `ember t`, in your terminal. This will run the suite just once.

Suppose, instead, you want the suite to run after every file change. You can enter `ember test --server`, or `ember t -s`.

Lastly, if you are already running a local development server (through `ember server`), you can visit the `/tests` URI. This will render the `tests/index.html` template.

```bash
# Run all tests once
ember test
ember t

# Run all tests after every file change
ember test --server
ember t -s
```

### How to Filter Tests

When you are working on a single component or page, you will want only a small subset of tests to run after every file change. To specify which tests to run, you can add `--module` or `--filter` option to your command.

The `--module` option allows you to select a **module**—a group of tests that you specified in `module()` in QUnit, or `describe()` in Mocha.

```bash
# Button component example
ember test --server --module="Integration | Component | simple-button"

# Run tests for a location service
ember t -s -m="Unit | Service | location"
```

The `--filter` option is more versatile. You can provide a phrase to match against the modules and test descriptions. A test description is what appears in `test()` in QUnit, or `it()` in Mocha.

```bash
# Button component example
ember test --server --filter="should show icon and label"

# Test everything related to your dashboard
ember t -s -f="Dashboard"

# Run integration tests
ember t -s -f="Integration"
```

In QUnit, you can exclude tests by adding an exclamation point to the beginning of the filter, e.g. `ember test --filter="!Acceptance"`. In Mocha, `ember test --filter="Acceptance" --invert`.

To learn more about options for testing, you can visit [Ember CLI Documentation](https://ember-cli.com/testing) or type `ember help test` in the command line.


## How to Debug Tests

When you are writing tests or application code, the execution of your tests may fail.

To find out the problem, you can add [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) to your code to check the intermediate state. You can add this line to both test and application code.

Thanks to Ember's setup, you can also use [`pauseTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#pausetest) and [`resumeTest()`](https://github.com/emberjs/ember-test-helpers/blob/master/API.md#resumetest) to debug your tests. `pauseTest` allows you to inspect the DOM easily, but can only be used in the test code.

Simply add `await pauseTest();` to your test code, then save. When the test reaches this line, it will pause, allowing you to inspect the state of your application. When you are done, type `resumeTest()` in the browser console to continue the test.


## Summary

Ember considers testing a first-class citizen. In addition to providing easy paths to integrate QUnit and Mocha, Ember supports a variety of addons and debugging tools to improve your developer experience in testing.

In the next section, we will study 3 types of tests that Ember supports—unit, rendering, and application tests. We will look at each type and when you might use one over another.
