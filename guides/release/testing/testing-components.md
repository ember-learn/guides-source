Components can be tested easily with a rendering test.
Let's see how this plays out in a specific example:

Let's assume we have a component with a `style` property that is updated whenever the value of the `name` property changes.
The `style` attribute of the component is bound to its `style` property.

> You can follow along by generating your own component with `ember generate
> component pretty-color`.

```gjs {data-filename="app/components/pretty-color.gjs"}
import Component from '@glimmer/component';

export default class PrettyColorComponent extends Component {
  get style() {
    return `color: ${this.args.name}`;
  }

  <template>
    <div style={{this.style}}>
      Pretty Color: {{@name}}
    </div>
  </template>
}
```

The `module` from QUnit will scope your tests into groups of tests which can be configured and run independently.
Make sure to call the `setupRenderingTest` function together with the `hooks` parameter first in your new module.
This will do the necessary setup for testing your component for you,
including setting up a way to access the rendered DOM of your component later on in the test,
and cleaning up once your tests in this module are finished.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        If you generated your component using <code>ember generate component pretty-color</code> it will already have generated
        the following file for you with all the boilerplate needed to get started. We are describing the steps to build to that same
        boilerplate for educational purposes. 
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="Ember Mascot">
  </div>
</div>



```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

});
```

The first thing to notice about this file is the filename, we are creating a `.gjs` file for a rendering test because we will be using `<template></template>` to render our Component under test and this only works inside `.gjs` files.

Inside your `module` and after setting up the test, we can now start to create our first test case.
Here, we can use the QUnit's `test` function, and we can give it a descriptive name:

```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('should change colors', async function(assert) {


  });
});
```

Also note how the callback function passed to the test helper is marked with the keyword `async`.
The [ECMAScript 2017 feature async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) allows us to write asynchronous code in an easy-to-read,
seemingly synchronous manner.
We can better see what this means, once we start writing out our first test case:

```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import PrettyColor from 'my-app-name/components/pretty-color';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('should change colors', async function(assert) {
    let colorValue = 'red'

    await render(<template> <PrettyColor @name={{colorValue}} /> </template>);

    assert.strictEqual(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');
  });
});
```

Each test can use the `render()` function imported from the `@ember/test-helpers` package to create a new instance of the component by declaring the component in template syntax,
as we would in our application.

Also notice, the keyword `await` in front of the call to `render`.
It allows the test which we marked as `async` earlier to wait for any asynchronous behavior to complete before executing the rest of the code below.
In this case our first assertion will correctly execute after the component has fully rendered.

Next we can test to see if changing the component's `name` property updates the
component's `style` attribute and is reflected in the rendered HTML. Note: we expect this to fail so continue reading after this example if you want to find out why this fails:

```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import PrettyColor from 'my-app-name/components/pretty-color';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let colorValue = 'red'

    await render(<template> <PrettyColor @name={{colorValue}} /> </template>);

    assert.strictEqual(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');

    colorValue = 'blue';

    assert.strictEqual(this.element.querySelector('div').getAttribute('style'), 'color: blue', 'updates to blue');  
  });
});
```

This test is now failing with the following error: 

```
Expected: "color: blue"
Result: "color: red"
```

This means that the `name` attribute never updated the template after we update the value in `colorValue`. This happens because we need to mark data as `@tracked` before we can expect it to update templates automatically. You can read more about the tracking system on the [Autotracking In-Depth](../../in-depth-topics/autotracking-in-depth/) topic.

Also it's worth noting that currently we can only use `@tracked` in the context of a class field, so we need to create an inline class with the data in the test: 

```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-strict/tests/helpers';
import { render, rerender } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import PrettyColor from 'ember-strict/components/pretty-color';

module('Integration | Component | pretty-color', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const data = new class {
      @tracked colorValue = 'red';
    };

    await render(<template> <PrettyColor @name={{data.colorValue}} /> </template>);

    assert.strictEqual(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');

    data.colorValue = 'blue';
    await rerender();

    assert.strictEqual(this.element.querySelector('div').getAttribute('style'), 'color: blue', 'updates to blue');
  });
});
```

We also needed to add a call to `await rerender()` for this to work. This function returns a promise that will resolve when all the template updates have finished executing. We can await this promise to wait until all templates have updated before continuing to assert against the DOM.

Now that we have data updating correctly in a test, we can start testing other things about this component e.g. we can also test this that the content of its template is being rendered properly:

```gjs {data-filename="tests/integration/components/pretty-color-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, rerender } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import PrettyColor from 'my-app-name/components/pretty-color';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const data = new class {
      @tracked colorValue = 'red';
    };

    await render(<template> <PrettyColor @name={{data.colorValue}} /> </template>);

    assert.strictEqual(this.element.textContent.trim(), 'Pretty Color: orange', 'text starts as orange');

    data.colorValue = 'green';
    await rerender();

    assert.strictEqual(this.element.textContent.trim(), 'Pretty Color: green', 'text switches to green');
  });
});
```

### Testing User Interaction

Components are a great way to create powerful, interactive, and self-contained custom HTML elements.
It is important to test the component's methods _and_ the user's interaction with the component.

Imagine you have the following component that changes its title when a button is clicked on:

> You can follow along by generating your own component with `ember generate
> component magic-title`.

```gjs {data-filename="app/components/magic-title.gjs"}
import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

export default class MagicTitleComponent extends Component {
  @tracked title = 'Hello World';

  updateTitle = () => {
    this.title = 'This is Magic';
  }

  <template>
    <h2>{{this.title}}</h2>

    <button type="button" class="title-button" {{on "click" this.updateTitle}}>
      Update Title
    </button>
  </template>
}
```

And our test might look like this:

```gjs {data-filename="tests/integration/components/magic-title-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, render } from '@ember/test-helpers';

module('Integration | Component | magic-title', function(hooks) {
  setupRenderingTest(hooks);

  test('should update title on button click', async function(assert) {
    await render(<template><MagicTitle /></template>);

    assert.strictEqual(this.element.querySelector('h2').textContent.trim(), 'Hello World', 'initial text is hello world');

    // Click on the button
    await click('.title-button');

    assert.strictEqual(this.element.querySelector('h2').textContent.trim(), 'This is Magic', 'title changes after click');
  });
});
```

Note how we make use of the `click` helper from [`ember-test-helpers`](https://github.com/emberjs/ember-test-helpers) to interact with the component DOM to trigger the `updateTitle` action.
You can find many other helpful helpers for simulating user interaction in rendering tests in the [API documentation of ember-test-helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md).

### Testing Actions

Components starting in Ember 2 utilize closure actions.
Closure actions allow components to directly invoke functions provided by outer components.

For example, imagine you have a comment form component that invokes a `submitComment` action when the form is submitted,
passing along the form's data:

> You can follow along by generating your own component with `ember generate
> component comment-form`.

```gjs {data-filename="app/components/comment-form.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

export default class CommentFormComponent extends Component {
  @tracked comment = '';

  submitComment = (event) => {
    this.args.submitComment({ comment: this.comment });
    // this prevents the page from refreshing
    event.preventDefault();
  }

  updateComment = (event) => {
    this.comment = event.target.value;
  }

  <template>
    <form {{on "submit" this.submitComment}}>
      <label for="comment">Comment:</label>
      <textarea id="comment" value={{this.comment}} {{on "input" this.updateComment}}></textarea>
      <button class="comment-submit" type="submit">Submit</button>
    </form>
  </template>
}
```

Here's an example test that asserts that the specified `externalAction` function is invoked when the component's internal `submitComment` action is triggered by making use of a test double (dummy function).
The value from the external action is captured in a shared variable (if and when it is called),
so that it can be explicitly asserted directly in the test function at the time where we
expect the closure action to have been called.

```gjs {data-filename="tests/integration/components/comment-form-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, fillIn, render } from '@ember/test-helpers';

module('Integration | Component | comment-form', function(hooks) {
  setupRenderingTest(hooks);

  test('should trigger external action on form submit', async function(assert) {
    // test double for the external action
    let actual;
    let externalAction = (data) => {
      actual = data;
    });

    await render(<template><CommentForm @submitComment={{externalAction}} /></template>);

    // fill out the form and force an onchange
    await fillIn('textarea', 'You are not a wizard!');

    // click the button to submit the form
    await click('.comment-submit');

    let expected = { comment: 'You are not a wizard!' };
    assert.deepEqual(actual, expected, 'submitted value is passed to external action');
  });
});
```

### Stubbing Services

In cases where components have dependencies on Ember services,
it is possible to stub these dependencies for rendering tests.
You stub non-Ember services by using the built-in `register()` function to register your stub service in place of the default.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
If you are thinking of stubbing the router service in a unit or integration test, consider writing an acceptance test instead. Acceptance tests let you navigate through many routes in your app, and the router does not need to be stubbed in them. If you choose to stub the router, you will need to stub multiple methods.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Imagine you have the following component that uses a location service to display the city and country of your current location:

> You can follow along by generating your own component with `ember generate
> component location-indicator`.

```gjs {data-filename="app/components/location-indicator.gjs"}
import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class LocationIndicatorComponent extends Component {
  @service location;

  // when the coordinates change, call the location service to get the current city and country
  get city() {
    return this.location.getCurrentCity();
  }

  get country() {
    return this.location.getCurrentCountry();
  }
  <template>
    You currently are located in {{this.city}}, {{this.country}}
  </template>
}
```

To stub the location service in your test, create a local stub object that extends `Service` from `@ember/service`,
and register the stub as the service your tests need in the `beforeEach()` function.
In this case we initially force location to "New York".

```gjs {data-filename="tests/integration/components/location-indicator-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import LocationIndicator from 'my-app-name/components/location-indicator';

// Stub location service
class LocationStub extends Service {
  city = 'New York';
  country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }

  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location', LocationStub);
  });
});
```

Once the stub service is registered,
the test needs to check that the stub data from the service is reflected in the component output.

```gjs {data-filename="tests/integration/components/location-indicator-test.gjs" data-diff="+31,+32,+33,+34,+35,+36"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import Service from '@ember/service';
import LocationIndicator from 'my-app-name/components/location-indicator';

// Stub location service
class LocationStub extends Service {
  city = 'New York';
  country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }

  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(<template><LocationIndicator /></template>);
    assert.strictEqual(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });
});
```

In the next example, we'll add another test that validates that the display changes when we modify the values on the service. Remember to add `@tracked` to the
values that can change in our subbed service!

```gjs {data-filename="tests/integration/components/location-indicator-test.gjs" data-diff="+38,+39,+40,+41,+42,+43,+44,+45,+46,+47,+48,+49,+50,+51,+52"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, rerender } from '@ember/test-helpers';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

// Stub location service
class LocationStub extends Service {
  @tracked city = 'New York';
  @tracked country = 'USA';
  currentLocation = {
    x: 1234,
    y: 5678
  };

  getCurrentCity() {
    return this.city;
  }
  
  getCurrentCountry() {
    return this.country;
  }
}

module('Integration | Component | location-indicator', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function(assert) {
    this.owner.register('service:location', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(<template><LocationIndicator /></template>);
    assert.strictEqual(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });

  test('should change displayed location when current location changes', async function (assert) {
    await render(<template><LocationIndicator /></template>);

    assert.strictEqual(this.element.textContent.trim(),
     'You currently are located in New York, USA', 'origin location should display');

    let locationService = this.owner.lookup('service:location');
    locationService.city = 'Beijing';
    locationService.country = 'China';
    locationService.currentLocation = { x: 11111, y: 222222 };

    await rerender();

    assert.strictEqual(this.element.textContent.trim(),
     'You currently are located in Beijing, China', 'location display should change');
  });
});
```

### Waiting on Asynchronous Behavior

Often, interacting with a component will cause asynchronous behavior to occur, such as HTTP requests, or timers.
The module `@ember/test-helpers` provides you with several [useful helpers](https://github.com/emberjs/ember-test-helpers/blob/master/API.md) that will allow you to wait for any asynchronous behavior to complete that is triggered by a DOM interaction induced by those.
To use them in your tests, you can `await` any of them to make sure that subsequent assertions are executed once the asynchronous behavior has fully settled:

```javascript
await click('button.submit-button'); // clicks a button and waits for any async behavior initiated by the click to settle
assert.strictEqual(this.element.querySelector('.form-message').textContent, 'Your details have been submitted successfully.');
```

Nearly all of the helpers for DOM interaction from `@ember/test-helpers` return a call to `settled` - a function
that ensures that any Promises, operations in Ember's `run` loop, timers or network requests have already resolved.
The `settled` function itself returns a Promise that resolves once all async operations have come to an end.

You can use `settled` as a helper in your tests directly and `await` it for all async behavior to settle deliberately.

Imagine you have a typeahead component that uses [`Ember.run.debounce`](https://api.emberjs.com/ember/release/classes/@ember%2Frunloop/methods/debounce?anchor=debounce) to limit requests to the server, and you want to verify that results are displayed after typing a character.

> You can follow along by generating your own component with `ember generate
> component delayed-typeahead`.

```gjs {data-filename="app/components/delayed-typeahead.gjs"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { on } from '@ember/modifier';

export default class DelayedTypeaheadComponent extends Component {
  @tracked searchValue = '';

  updateValue = (event) => {
    this.searchValue = event.target.value;
  }

  handleTyping = () => {
    // The fetchResults function is passed into the component from its parent
    debounce(this, this.args.fetchResults, this.searchValue, 250);
  }

  <template>
    <label for="search">Search</label>
    <input id="search" value={{this.searchValue}} {{on 'input' this.updateValue}} {{on 'keyup' this.handleTyping}} />
    <ul>
      {{#each @results as |result|}}
        <li class="result">{{result.name}}</li>
      {{/each}}
    </ul>
  </template>
}
```

In your test, use the `settled` helper to wait until your debounce timer is up and then assert that the page is rendered appropriately.

```gjs {data-filename="tests/integration/components/delayed-typeahead-test.gjs"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, settled, fillIn } from '@ember/test-helpers';
import { tracked } from '@glimmer/tracking';
import DelayedTypeahead from 'my-app-name/components/delayed-typeahead';

module('Integration | Component | delayed-typeahead', function(hooks) {
  setupRenderingTest(hooks);

  const stubResults = [
    { name: 'result 1' },
    { name: 'result 2' }
  ];

  test('should render results after typing a term', async function(assert) {
    const data = new class {
      @tracked results = [];
    };

    let value;
    let fetchResults = (data) => {
      value = data;
      data.results = stubResults;
    };

    await render(<template><DelayedTypeahead @fetchResults={{fetchResults}} @results={{data.results}} /></template>);
    await fillIn('input', 'test')
    this.element.querySelector('input').dispatchEvent(new Event('keyup'));

    await settled();
    assert.strictEqual(value, 'test', 'fetch closure action called with search value');

    assert.strictEqual(this.element.querySelectorAll('.result').length, 2, 'two results rendered');
  });
});
```

Notice that we don't need to call `await rerender()` in this test to make sure the template has updated. This is because the work done in `await rerender()` is fully encapsulated in the `await settled()` so we don't need to call both.
