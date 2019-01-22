import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | meta data', function(hooks) {
  setupApplicationTest(hooks);

  test('meta data title and description', async function(assert) {
    await visit('/release/');
    await click('[data-test-toc-title="Routing"]')
    await click('[data-test-toc-link="Defining Your Routes"]')

    assert.equal(currentURL(), '/release/routing/defining-your-routes');

    // lookup title from service because testem modifies title https://github.com/testem/testem/issues/195
    let headData = this.owner.lookup('service:head-data');
    let title = headData.title;

    let description = document.head.querySelector('meta[name="description"]');

    assert.ok(title);
    assert.ok(description);

    assert.equal(title,
      'Defining Your Routes - Routing - Ember Guides');

    const descriptionStart = 'When your application starts, the router matches the current URL to the routes';
    assert.ok(description.content.startsWith(descriptionStart), `${description.content} should start with ${descriptionStart}`);
  });
});
