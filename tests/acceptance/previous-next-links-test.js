import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | previous next links', function(hooks) {
  setupApplicationTest(hooks);

  test('navigation by previous and next links', async function(assert) {
    await visit('/v2.17.0/models/');
    assert.equal(currentURL(), '/v2.17.0/models/');
    await click('.next-guide')
    assert.equal(currentURL(), '/v2.17.0/models/defining-models');
    await click('.next-guide')
    assert.equal(currentURL(), '/v2.17.0/models/finding-records');
    await click('.previous-guide')
    assert.equal(currentURL(), '/v2.17.0/models/defining-models');
  });
});
