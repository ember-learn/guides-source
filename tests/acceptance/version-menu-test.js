import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { selectChoose } from 'ember-power-select/test-support';

module('Acceptance | version menu when changing versions', function (hooks) {
  setupApplicationTest(hooks);

  test('stays on index page', async function (assert) {
    await visit('/v2.17.0/');
    await selectChoose('.ember-basic-dropdown-trigger', '2.10');
    const isOnIndexPage =
      currentURL() === '/v2.10.0/' || currentURL() === '/v2.10.0';
    assert.ok(isOnIndexPage);
  });

  test('stays on same section', async function (assert) {
    await visit('/v1.13.0/getting-started/');
    await selectChoose('.ember-basic-dropdown-trigger', '1.12');
    assert.strictEqual(currentURL(), '/v1.12.0/getting-started');
  });

  test('stays on same section and page', async function (assert) {
    await visit('/v3.0.0/object-model/classes-and-instances/');
    await selectChoose('.ember-basic-dropdown-trigger', '3.1');
    assert.strictEqual(
      currentURL(),
      '/v3.1.0/object-model/classes-and-instances',
    );
  });

  test("redirects to index page if current section/page doesn't exist in new version", async function (assert) {
    await visit('/v1.10.0/getting-started/using-fixtures/');
    await selectChoose('.ember-basic-dropdown-trigger', '1.13');
    assert.strictEqual(currentURL(), '/v1.13.0');
  });
});
