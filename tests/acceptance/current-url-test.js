import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | current url', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /release-url', async function (assert) {
    await visit('/release');
    let page = this.owner.lookup('service:page');
    let currentVersion = page.get('currentVersion');
    currentVersion = currentVersion.slice(
      currentVersion.indexOf('v') + 1 || 0,
      currentVersion.lastIndexOf('.') === currentVersion.indexOf('.')
        ? currentVersion.length
        : currentVersion.lastIndexOf('.'),
    );
    assert.dom('.ember-basic-dropdown-trigger').hasText(currentVersion);
  });

  test('visiting / redirects you to /release', async function (assert) {
    await visit('/');
    let page = this.owner.lookup('service:page');
    assert.strictEqual(currentURL(), '/release');

    let currentVersion = page.get('currentVersion');
    currentVersion = currentVersion.slice(
      currentVersion.indexOf('v') + 1 || 0,
      currentVersion.lastIndexOf('.') === currentVersion.indexOf('.')
        ? currentVersion.length
        : currentVersion.lastIndexOf('.'),
    );
    assert.dom('.ember-basic-dropdown-trigger').hasText(currentVersion);
  });
});
