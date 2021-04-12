import { visit } from '@ember/test-helpers';
import percySnapshot from '@percy/ember';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

function getAllPageUrls(page, urls = []) {
  const { pages, url } = page;

  if (url) {
    urls.push(url);
  }

  if (pages) {
    for (let subPage of pages) {
      getAllPageUrls(subPage, urls);
    }
  }

  return urls;
}

function extractPageInfo(url) {
  let name = `/${url}/index.html`;

  if (url.endsWith('index')) {
    name = `/${url}.html`;
  } else if (url.endsWith('index/')) {
    name = '/index.html';
  }

  return { url, name };
}

module('Acceptance | visual regression', function(hooks) {
  setupApplicationTest(hooks);

  test(`visiting visual regressions with Percy`, async function(assert) {
    assert.expect(0);
    await visit('/release');

    let store = this.owner.lookup('service:store');
    let pages = store.peekAll('page');

    const urls = pages.reduce(function(urls, page) {
      return urls.concat(getAllPageUrls(page));
    }, []);

    const pageInfos = urls.map(extractPageInfo).filter(function(pageInfo, _, self) {
      return self.find(pi => pi.name === pageInfo.name) === pageInfo;
    });

    for (let pageInfo of pageInfos) {
      await visit(`/release/${pageInfo.url}`);
      await percySnapshot(pageInfo.name);
    }
  });
});
