_Testing helpers follows previous patterns shown in [Testing Components](../testing-components/),
because helpers are rendered to templates just like components._

Helpers are best tested with rendering tests, but can also be tested with unit
tests. Rendering tests will provide better coverage for helpers, as it more
closely simulates the lifecycle of a helper than in isolation.

We're going to demonstrate how to test helpers by testing the `format-currency`
helper from [Helper Functions](../../components/helper-functions/).

> You can follow along by generating your own helper with `ember generate helper
> format-currency`.

```javascript {data-filename=app/helpers/format-currency.js}
export function formatCurrency(value, { sign = '$' } = {}) {
  let dollars = Math.floor(value / 100);
  let cents = value % 100;

  if (cents.toString().length === 1) { cents = '0' + cents; }
  return `${sign}${dollars}.${cents}`;
}
```

Let's start by testing the helper by showing a simple unit test and then move on
to testing with a rendering test afterwards.

Helpers are functions, which can be easily tested through `module` alone.

```javascript {data-filename=tests/unit/helpers/format-currency-test.js}
import { formatCurrency } from 'my-app/helpers/format-currency';
import { module, test } from 'qunit';

module('Unit | Helper | format currency', function(hooks) {
  test('formats 199 with $ as currency sign', function(assert) {
    assert.equal(formatCurrency(199, { sign: '$' }), '$1.99');
  });
});
```

As seen in the [Helper Functions](../../components/helper-functions/) guide,
a helper function receives the positional arguments from the template directly
as function arguments. Named arguments are grouped into an object which is
passed as the last argument, so we can call the helper the same way from
JavaScript.

Now we can move on to a more complex test case that ensures our helper is rendered
correctly as well. This can be done with the `setupRenderingTest` helper, as shown
in [Testing Components](../testing-components/). Note that the test file uses the
`.gjs` extension, because we will use `<template></template>` to render the helper
under test.

```gjs {data-filename=tests/integration/helpers/format-currency-test.gjs}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import { formatCurrency } from 'my-app-name/helpers/format-currency';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    const data = trackedObject({
      value: 199,
      sign: '$',
    });

    await render(<template>{{formatCurrency data.value sign=data.sign}}</template>);

    assert.equal(this.element.textContent.trim(), '$1.99');
  });
});
```

Since helpers are imported into the templates that use them, we import the
helper into the test file and invoke it directly in the `<template>` tag.

We can now also properly test if a helper will respond to property changes.

```gjs {data-filename=tests/integration/helpers/format-currency-test.gjs}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render, rerender } from '@ember/test-helpers';
import { trackedObject } from '@ember/reactive/collections';
import { formatCurrency } from 'my-app-name/helpers/format-currency';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    const data = trackedObject({
      value: 199,
      sign: '$',
    });

    await render(<template>{{formatCurrency data.value sign=data.sign}}</template>);

    assert.equal(this.element.textContent.trim(), '$1.99');

    data.sign = '€';

    await rerender();

    assert.equal(this.element.textContent.trim(), '€1.99', 'Value is formatted with €');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->
