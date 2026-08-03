import { findAll } from '@ember/test-helpers';

export function setupTableOfContentsTest(hooks) {
  hooks.beforeEach(setupCustomAssertions);
  hooks.afterEach(cleanUpCustomAssertions);
}

function setupCustomAssertions(assert) {
  assert.areLinksCorrect = (expectedLinks = []) => {
    const tocLinks = findAll('[data-test-toc-link]');
    const isLengthCorrect = tocLinks.length === expectedLinks.length;

    assert.ok(isLengthCorrect, `We see ${expectedLinks.length} links.`);

    if (!isLengthCorrect) {
      return;
    }

    tocLinks.forEach((tocLink, index) => {
      assert
        .dom(tocLink)
        .hasText(
          expectedLinks[index],
          `We see the correct link. (${index + 1})`,
        );
    });
  };

  assert.areTitlesCorrect = (expectedTitles = []) => {
    const tocTitles = findAll('[data-test-toc-link]');
    const isLengthCorrect = tocTitles.length === expectedTitles.length;

    assert.ok(isLengthCorrect, `We see ${expectedTitles.length} titles.`);

    if (!isLengthCorrect) {
      return;
    }

    tocTitles.forEach((tocTitle, index) => {
      assert
        .dom(tocTitle)
        .hasText(
          expectedTitles[index],
          `We see the correct title. (${index + 1})`,
        );
    });
  };
}

function cleanUpCustomAssertions(assert) {
  delete assert.areLinksCorrect;
  delete assert.areTitlesCorrect;
}
