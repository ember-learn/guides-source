import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

async function visitPages(pages, assert) {
  for (let page of pages) {
    const { pages, skipToc, title, url } = page;

    if (skipToc) {
      continue;
    }

    if (pages) {
      await visitPages(pages, assert);
    } else {
      await visit(`/release/${url}`);

      assert
        .dom('h1')
        .hasText(title, `We see the correct title in h1 tag on ${url}`);
    }
  }
}

module('Acceptance | side bar links', function (hooks) {
  setupApplicationTest(hooks);

  test('release links go to correct page', async function (assert) {
    assert.expect(131);
    await visit('/release');

    let store = this.owner.lookup('service:store');
    let pages = await store.peekAll('page');

    await visitPages(
      pages.toArray().filter((page) => !page.id.includes('toc-heading')),
      assert,
    );
  });
});
