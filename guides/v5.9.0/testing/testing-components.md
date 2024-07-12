Components can be tested easily with a rendering test.
Let's see how this plays out in a specific example:

Let's assume we have a component with a `style` property that is updated whenever the value of the `name` property changes.
The `style` attribute of the component is bound to its `style` property.

> You can follow along by generating your own component with `ember generate
> component pretty-color`.

```javascript {data-filename="app/components/pretty-color.js"}
import Component from '@glimmer/component';

export default class PrettyColorComponent extends Component {
  get style() {
    return `color: ${this.args.name}`;
  }
}
```

```handlebars {data-filename="app/components/pretty-color.hbs"}
<div style={{this.style}}>
  Pretty Color: {{@name}}
</div>
```

The `module` from QUnit will scope your tests into groups of tests which can be configured and run independently.
Make sure to call the `setupRenderingTest` function together with the `hooks` parameter first in your new module.
This will do the necessary setup for testing your component for you,
including setting up a way to access the rendered DOM of your component later on in the test,
and cleaning up once your tests in this module are finished.

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

});
```

Inside of your `module` and after setting up the test, we can now start to create our first test case.
Here, we can use the `QUnit.test` helper and we can give it a descriptive name:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
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

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('should change colors', async function(assert) {
    // set the outer context to red
    this.set('colorValue', 'red');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');
  });
});
```

Each test can use the `render()` function imported from the `@ember/test-helpers` package to create a new instance of the component by declaring the component in template syntax,
as we would in our application.
Also notice, the keyword `await` in front of the call to `render`.
It allows the test which we marked as `async` earlier to wait for any asynchronous behavior to complete before executing the rest of the code below.
In this case our first assertion will correctly execute after the component has fully rendered.

Next we can test that changing the component's `name` property updates the
component's `style` attribute and is reflected in the rendered HTML:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // set the outer context to red
    this.set('colorValue', 'red');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: red', 'starts as red');

    this.set('colorValue', 'blue');

    assert.equal(this.element.querySelector('div').getAttribute('style'), 'color: blue', 'updates to blue');  });
});
```

We might also test this component to ensure that the content of its template is being rendered properly:

```javascript {data-filename="tests/integration/components/pretty-color-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | pretty-color', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('colorValue', 'orange');

    await render(hbs`<PrettyColor @name={{this.colorValue}} />`);

    assert.equal(this.element.textContent.trim(), 'Pretty Color: orange', 'text starts as orange');

    this.set('colorValue', 'green');

    assert.equal(this.element.textContent.trim(), 'Pretty Color: green', 'text switches to green');
  });
});
```

### Testing User Interaction

Components are a great way to create powerful, interactive, and self-contained custom HTML elements.
It is important to test the component's methods _and_ the user's interaction with the component.

Imagine you have the following component that changes its title when a button is clicked on:

> You can follow along by generating your own component with `ember generate
> component magic-title`.

```javascript {data-filename="app/components/magic-title.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MagicTitleComponent extends Component {
  @tracked title = 'Hello World';

  @action
  updateTitle() {
    this.title = 'This is Magic';
  }
}
```

```handlebars {data-filename="app/components/magic-title.hbs"}
<h2>{{this.title}}</h2>

<button type="button" class="title-button" {{on "click" this.updateTitle}}>
  Update Title
</button>
```

And our test might look like this:

```javascript {data-filename="tests/integration/components/magic-title-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | magic-title', function(hooks) {
  setupRenderingTest(hooks);

  test('should update title on button click', async function(assert) {
    await render(hbs`<MagicTitle />`);

    assert.equal(this.element.querySelector('h2').textContent.trim(), 'Hello World', 'initial text is hello world');

    // Click on the button
    await click('.title-button');

    assert.equal(this.element.querySelector('h2').textContent.trim(), 'This is Magic', 'title changes after click');
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

```javascript {data-filename="app/components/comment-form.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CommentFormComponent extends Component {
  @tracked comment = '';

  @action
  submitComment() {
    this.args.submitComment({ comment: this.comment });
  }
}
```

```handlebars {data-filename="app/components/comment-form.hbs"}
<form {{on "submit" this.submitComment}}>
  <label for="comment">Comment:</label>
  <Textarea id="comment" @value={{this.comment}} />
  <input class="comment-input" type="submit" value="Submit"/>
</form>
```

Here's an example test that asserts that the specified `externalAction` function is invoked when the component's internal `submitComment` action is triggered by making use of a test double (dummy function).
The value from the external action is captured in a shared variable (if and when it is called),
so that it can be explicitly asserted directly in the test function at the time where we
expect the closure action to have been called.

```javascript {data-filename="tests/integration/components/comment-form-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | comment-form', function(hooks) {
  setupRenderingTest(hooks);

  test('should trigger external action on form submit', async function(assert) {
    // test double for the external action
    let actual;
    this.set('externalAction', (data) => {
      actual = data;
    });

    await render(hbs`<CommentForm @submitComment={{this.externalAction}} />`);

    // fill out the form and force an onchange
    await fillIn('textarea', 'You are not a wizard!');

    // click the button to submit the form
    await click('.comment-input');

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

```javascript {data-filename="app/components/location-indicator.js"}
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
}
```

```handlebars {data-filename="app/components/location-indicator.hbs"}
You currently are located in {{this.city}}, {{this.country}}
```

To stub the location service in your test, create a local stub object that extends `Service` from `@ember/service`,
and register the stub as the service your tests need in the beforeEach function.
In this case we initially force location to "New York".

```javascript {data-filename="tests/integration/components/location-indicator-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

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
    this.owner.register('service:location-service', LocationStub);
  });
});
```

Once the stub service is registered,
the test needs to check that the stub data from the service is reflected in the component output.

```javascript {data-filename="tests/integration/components/location-indicator-test.js" data-diff="+30,+31,+32,+33,+34,+35"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

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
    this.owner.register('service:location-service', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(hbs`<LocationIndicator />`);
    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });
});
```

In the next example, we'll add another test that validates that the display changes when we modify the values on the service.

```javascript {data-filename="tests/integration/components/location-indicator-test.js" data-diff="+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,+47,+48,+49,+50"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

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
    this.owner.register('service:location-service', LocationStub);
  });

  test('should reveal current location', async function(assert) {
    await render(hbs`<LocationIndicator />`);
    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA');
  });

  test('should change displayed location when current location changes', async function (assert) {
    await render(hbs`<LocationIndicator />`);

    assert.equal(this.element.textContent.trim(),
     'You currently are located in New York, USA', 'origin location should display');

    this.locationService = this.owner.lookup('service:location-service');
    this.set('locationService.city', 'Beijing');
    this.set('locationService.country', 'China');
    this.set('locationService.currentLocation', { x: 11111, y: 222222 });

    assert.equal(this.element.textContent.trim(),
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
assert.equal(this.element.querySelector('.form-message').textContent, 'Your details have been submitted successfully.');
```

Nearly all of the helpers for DOM interaction from `@ember/test-helpers` return a call to `settled` - a function
that ensures that any Promises, operations in Ember's `run` loop, timers or network requests have already resolved.
The `settled` function itself returns a Promise that resolves once all async operations have come to an end.

You can use `settled` as a helper in your tests directly and `await` it for all async behavior to settle deliberately.

Imagine you have a typeahead component that uses [`Ember.run.debounce`](https://api.emberjs.com/ember/5.9.0/classes/@ember%2Frunloop/methods/debounce?anchor=debounce) to limit requests to the server, and you want to verify that results are displayed after typing a character.

> You can follow along by generating your own component with `ember generate
> component delayed-typeahead`.

```javascript {data-filename="app/components/delayed-typeahead.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

export default class DelayedTypeaheadComponent extends Component {
  @tracked searchValue = '';

  @action
  handleTyping() {
    // The fetchResults function is passed into the component from its parent
    debounce(this, this.args.fetchResults, this.searchValue, 250);
  }
};
```

```handlebars {data-filename="app/components/delayed-typeahead.hbs"}
<label for="search">Search</label>
<Input id="search" @value={{this.searchValue}} {{on 'keyup' this.handleTyping}} />
<ul>
  {{#each @results as |result|}}
    <li class="result">{{result.name}}</li>
  {{/each}}
</ul>
```

In your test, use the `settled` helper to wait until your debounce timer is up and then assert that the page is rendered appropriately.

```javascript {data-filename="tests/integration/components/delayed-typeahead-test.js"}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, settled } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | delayed-typeahead', function(hooks) {
  setupRenderingTest(hooks);

  const stubResults = [
    { name: 'result 1' },
    { name: 'result 2' }
  ];

  test('should render results after typing a term', async function(assert) {
    this.set('results', []);

    let value;
    this.set('fetchResults', (data) => {
      value = data;
      this.set('results', stubResults);
    });

    await render(hbs`<DelayedTypeahead @fetchResults={{this.fetchResults}} @results={{this.results}} />`);
    this.element.querySelector('input').value = 'test';
    this.element.querySelector('input').dispatchEvent(new Event('keyup'));

    await settled();
    assert.equal(value, 'test', 'fetch closure action called with search value');

    assert.equal(this.element.querySelectorAll('.result').length, 2, 'two results rendered');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->
