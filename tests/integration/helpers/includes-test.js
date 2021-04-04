import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Helper | includes', function (hooks) {
  setupRenderingTest(hooks);

  test('returns false when string is undefined', async function (assert) {
    this.pageId = undefined;

    await render(hbs`
      <div data-test-output>
        {{if (includes this.pageId "toc-heading") "true" "false"}}
      </div>
    `);

    assert
      .dom('[data-test-output]')
      .hasText('false', 'We see the correct output.');
  });

  test('returns false when string does not include query', async function (assert) {
    // Core Concepts > Components
    this.pageId = 'components';

    await render(hbs`
      <div data-test-output>
        {{if (includes this.pageId "toc-heading") "true" "false"}}
      </div>
    `);

    assert
      .dom('[data-test-output]')
      .hasText('false', 'We see the correct output.');
  });

  test('returns true when string includes query', async function (assert) {
    // Core Concepts
    this.pageId = 'toc-heading_core-concepts';

    await render(hbs`
      <div data-test-output>
        {{if (includes this.pageId "toc-heading") "true" "false"}}
      </div>
    `);

    assert
      .dom('[data-test-output]')
      .hasText('true', 'We see the correct output.');
  });
});
