Ember comes with great testing tools out of the box and popular addons which you can use as your testing game evolves.

In this section, we will go through various tools, that you can use while building an Ember app.

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
test("should show label", async function (assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
    />
  `);
  let button = this.element.querySelector("button");

  // QUnit
  assert.strictEqual(button.textContent.trim(), "Hello world!");

  // QUnit DOM
  assert.dom(button).hasText("Hello world!");
});

test("should allow disabling the button", async function (assert) {
  await render(hbs`
    <SimpleButton
      @label="Hello world!"
      @isDisabled={{true}}
    />
  `);
  let button = this.element.querySelector("button");

  // QUnit
  assert.strictEqual(button.disabled, true);
  assert.ok(button.classList.contains("is-disabled"));

  // QUnit DOM
  assert.dom(button).hasAttribute("disabled");
  assert.dom(button).hasClass("is-disabled");
});
```

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
<button data-test-button={{@label}} type="button">
  {{#if @icon}}
    <i data-test-icon aria-hidden="true" class="material-icons">
      {{@icon}}
    </i>
  {{/if}}

  <span data-test-label>{{@label}}</span>
</button>
```

```javascript {data-filename=tests/integration/components/simple-button-test.js}
test("should show icon and label", async function (assert) {
  await render(hbs`
    <SimpleButton
      @icon="face"
      @label="Hello world!"
    />
  `);

  // Bad
  assert.strictEqual(
    this.element.querySelector(".material-icons").textContent.trim(),
    "face",
    "The user sees the correct icon."
  );

  assert.strictEqual(
    this.element.querySelector("span").textContent.trim(),
    "Hello world!",
    "The user sees the correct label."
  );

  // Good
  assert.strictEqual(
    this.element.querySelector("[data-test-icon]").textContent.trim(),
    "face",
    "The user sees the correct icon."
  );

  assert.strictEqual(
    this.element.querySelector("[data-test-label]").textContent.trim(),
    "Hello world!",
    "The user sees the correct label."
  );

  // Great!
  assert
    .dom("[data-test-icon]")
    .hasText("face", "The user sees the correct icon.");

  assert
    .dom("[data-test-label]")
    .hasText("Hello world!", "The user sees the correct label.");
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

Last but not least, [Percy](https://percy.io/) is a **visual regression testing** tool that ensures consistent user interfaces across different browsers and devices by identifying visual bugs. It captures screenshots of web pages at different development stages and compares them pixel-by-pixel to detect any visual differences.

Visual regression testing is useful for maintaining visual consistency and quality in your app. Check out the [Percy documentation](https://www.browserstack.com/docs/percy/integrate/ember) to set it up in an Ember app.

While we don't recommend this practice in general, you might also use Percy in lieu of application tests to capture complex workflows.

## Summary

Ember provides easy paths to integrate QUnit and it also supports a variety of addons and debugging tools to improve your developer experience in testing.

In the next section, we will study 3 types of tests that Ember supports—unit, rendering, and application tests. We will look at each type and when you might use one over another.
