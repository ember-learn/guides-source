_Testing helpers follows previous patterns shown in [Testing Components](../testing-components/),
because helpers are rendered to templates just like components._

Helpers are best tested with rendering tests, but can also be tested with unit
tests. Rendering tests will provide better coverage for helpers, as it more
closely simulates the lifecycle of a helper than in isolation.

We're going to demonstrate how to test helpers by testing the `format-currency`
helper from [Writing Helpers](../../templates/writing-helpers/).

> You can follow along by generating your own helper with `ember generate helper
> format-currency`.

```javascript {data-filename=app/helpers/format-currency.js}
import { helper } from '@ember/component/helper';

export function formatCurrency([value, ...rest], namedArgs) {
  let dollars = Math.floor(value / 100);
  let cents = value % 100;
  let sign = namedArgs.sign === undefined ? '$' : namedArgs.sign;

  if (cents.toString().length === 1) { cents = '0' + cents; }
  return `${sign}${dollars}.${cents}`;
}

export default helper(formatCurrency);
```

Let's start by testing the helper by showing a simple unit test and then move on
to testing with a rendering test afterwards.

Helpers are functions, which can be easily tested through `module` alone.

```javascript {data-filename=tests/unit/helpers/format-currency-test.js}
import { formatCurrency } from 'my-app/helpers/format-currency';
import { module, test } from 'qunit';

module('Unit | Helper | format currency', function(hooks) {
  test('formats 199 with $ as currency sign', function(assert) {
    assert.equal(formatCurrency([199], { sign: '$' }), '$1.99');
  });
});
```

As seen in the [Writing Helpers](../../templates/writing-helpers/) guide. 
The helper function expects the unnamed arguments as an array as the 
first argument. It expects the named arguments as
an object as the second argument.

Now we can move on to a more complex test case that ensures our helper is rendered 
correctly as well. This can be done with the `setupRenderingTest` helper, as shown 
in [Testing Components](../testing-components/).

```javascript {data-filename=tests/integration/helpers/format-currency-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    this.set('value', 199);
    this.set('sign', '$');

    await render(hbs`{{format-currency value sign=sign}}`);

    assert.equal(this.element.textContent.trim(), '$1.99');
  });
});
```

We can now also properly test if a helper will respond to property changes.

```javascript {data-filename=tests/integration/helpers/format-currency-test.js}
import { module, test } from 'qunit';
import { setupRenderingTest } from 'my-app-name/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Helper | format currency', function(hooks) {
  setupRenderingTest(hooks);

  test('formats 199 with $ as currency sign', async function(assert) {
    this.set('value', 199);
    this.set('sign', '$');

    await render(hbs`{{format-currency value sign=sign}}`);

    assert.equal(this.element.textContent.trim(), '$1.99');

    this.set('sign', '€');

    assert.equal(this.element.textContent.trim(), '€1.99', 'Value is formatted with €');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->
