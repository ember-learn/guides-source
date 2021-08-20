import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | table of contents', function(hooks) {
  setupApplicationTest(hooks);

  test('navigation by TOC', async function(assert) {
    await visit('/v2.17.0/');
    await click('[data-test-toc-link="Routing"]')
    await click('[data-test-toc-link="Defining Your Routes"]')
    assert.equal(currentURL(), '/v2.17.0/routing/defining-your-routes');
  });
});
