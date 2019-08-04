import { module, test } from 'qunit';
import { visit, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { get } from '@ember/object';

module('Acceptance | side bar links', function(hooks) {
  setupApplicationTest(hooks);

  test('release links go to correct page', async function(assert) {
		await visit('/release');

		let store = this.owner.lookup('service:store');
    let pages = await store.peekAll('page');

		await pages.reduce(async (prev, section) => {
			await prev;

			if (section.skipToc) return Promise.resolve();

			return section.get('pages').reduce(async (prev, page) => {
				await prev;

				let url = get(page, 'url');
				let title = get(page, 'title');

				await visit(`/release/${url}`);

				let titleSearch = await find(`h1`);
				assert.equal(titleSearch.innerText, title);

			}, Promise.resolve());
		}, Promise.resolve());
  });
});
