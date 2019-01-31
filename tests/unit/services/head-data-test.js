import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | head data', function(hooks) {
  setupTest(hooks);

  test('title with currentPage and currentSelect details', function(assert) {

    let headDataService = this.owner.lookup('service:head-data');
    let pageService = this.owner.lookup('service:page');

    assert.equal(headDataService.title, 'Ember Guides', 'Default title without currentPage nor currentSelection');

    let currentPage = {
      title: 'CurrentPage title'
    }
    pageService.set('currentPage', currentPage);

    assert.equal(headDataService.title, 'Ember Guides', 'Default title without currentSelection');

    let currentSection = {
      title: 'CurrentSection title'
    }
    pageService.set('currentSection', currentSection);

    assert.equal(headDataService.title, 'CurrentPage title - CurrentSection title - Ember Guides', 'Title with currentPage and currentSelection');
  });
});
