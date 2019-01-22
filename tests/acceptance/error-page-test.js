import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | error page', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting a non-existent page shows the 404 error-page', async function(assert) {
    await visit('/v1.12.0/nonsense/route/');

    assert.equal(currentURL(), '/v1.12.0/nonsense/route/');
    assert.dom('[data-test-error-page]').exists();
    assert.dom('[data-test-error-message]').hasText(`Ack! 404 friend, you're in the wrong place`);
  });
});
