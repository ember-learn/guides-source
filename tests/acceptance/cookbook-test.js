import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | cookbook', function (hooks) {
  setupApplicationTest(hooks);

  /*
  Cookbook gets its own tests because it has one additional layer of nesting than
  the rest of the guides
  */

  test('visiting /cookbook', async function (assert) {
    await visit('/v1.10.0/cookbook/');
    assert.strictEqual(currentURL(), '/v1.10.0/cookbook/');
    await click('.next-guide');
    assert.strictEqual(currentURL(), '/v1.10.0/cookbook/contributing');
    await click('.next-guide');
    assert.strictEqual(
      currentURL(),
      '/v1.10.0/cookbook/contributing/understanding_the_cookbook_format',
    );
    await click('.previous-guide');
    assert.strictEqual(currentURL(), '/v1.10.0/cookbook/contributing');
  });
});
