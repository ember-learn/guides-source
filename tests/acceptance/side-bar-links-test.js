import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { get } from '@ember/object';

async function visitPages(pages, assert) {
  for (let page of pages) {
    if (page.skipToc) continue;

    if (get(page, 'pages')) {
      await visitPages(get(page, 'pages'), assert);
    } else {
      let url = get(page, 'url');
      let title = get(page, 'title');

      await visit(`/release/${url}`);

      let titleSearch = await find(`h1`);
      assert.equal(titleSearch.innerText, title, title);
    }
  }
}

module('Acceptance | side bar links', function(hooks) {
  setupApplicationTest(hooks);

  test('release links go to correct page', async function(assert) {
    await visit('/release');

    let store = this.owner.lookup('service:store');
    let pages = await store.peekAll('page');

    await visitPages(pages.toArray(), assert);
  });
});
