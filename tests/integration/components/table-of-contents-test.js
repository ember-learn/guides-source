import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { createPages } from 'ember-guides/tests/helpers/create-pages';
import { setupTableOfContentsTest } from 'ember-guides/tests/helpers/table-of-contents';
import { setupRenderingTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Integration | Component | table-of-contents', function (hooks) {
  setupRenderingTest(hooks);
  setupTableOfContentsTest(hooks);

  test("renders a table of contents when we don't pass pages", async function (assert) {
    await render(hbs`
      <ol>
        <TableOfContents />
      </ol>
    `);

    assert.areTitlesCorrect([]);

    assert.areLinksCorrect([]);
  });

  test('renders a table of contents we pass pages', async function (assert) {
    this.pages = createPages();

    await render(hbs`
      <ol>
        <TableOfContents
          @data={{this.pages}}
        />
      </ol>
    `);

    assert.areTitlesCorrect([
      'Getting Started',
      'Tutorial',
      'Components',
      'Routing',
      'Services',
      'Ember Data',
      'In-Depth Topics',
      'Application Concerns',
      'Accessibility',
      'Configuration',
      'Testing',
      'Addons and Dependencies',
      'Ember Inspector',
      'Code Editors',
      'Upgrading',
      'Contributing to Ember.js',
      'Glossary',
    ]);

    assert.areLinksCorrect([]);
  });

  test('shows links when the user clicks on a title', async function (assert) {
    this.pages = createPages();

    await render(hbs`
      <ol>
        <TableOfContents
          @data={{this.pages}}
        />
      </ol>
    `);

    await click('[data-test-toc-title="Upgrading"]');

    assert.areTitlesCorrect([
      'Getting Started',
      'Tutorial',
      'Components',
      'Routing',
      'Services',
      'Ember Data',
      'In-Depth Topics',
      'Application Concerns',
      'Accessibility',
      'Configuration',
      'Testing',
      'Addons and Dependencies',
      'Ember Inspector',
      'Code Editors',
      'Upgrading',
      'Octane Upgrade Guide',
      'Contributing to Ember.js',
      'Glossary',
    ]);

    assert.areLinksCorrect([
      'How to upgrade',
      'Introduction',
      'Templates',
      'Native Classes',
      'Tracked Properties',
      '@action, {{on}} and {{fn}}',
      'Glimmer Components',
      'Cheat Sheet',
    ]);

    await click('[data-test-toc-title="Application Concerns"]');

    assert.areTitlesCorrect([
      'Getting Started',
      'Tutorial',
      'Components',
      'Routing',
      'Services',
      'Ember Data',
      'In-Depth Topics',
      'Application Concerns',
      'Accessibility',
      'Configuration',
      'Testing',
      'Addons and Dependencies',
      'Ember Inspector',
      'Code Editors',
      'Upgrading',
      'Octane Upgrade Guide',
      'Contributing to Ember.js',
      'Glossary',
    ]);

    assert.areLinksCorrect([
      'Applications and Instances',
      'Dependency Injection',
      'Initializers',
      'The Run Loop',
      'Ember Engines',
      'How to upgrade',
      'Introduction',
      'Templates',
      'Native Classes',
      'Tracked Properties',
      '@action, {{on}} and {{fn}}',
      'Glimmer Components',
      'Cheat Sheet',
    ]);
  });

  test('hides links when the user clicks on a title again', async function (assert) {
    this.pages = createPages();

    await render(hbs`
      <ol>
        <TableOfContents
          @data={{this.pages}}
        />
      </ol>
    `);

    await click('[data-test-toc-title="Upgrading"]');
    await click('[data-test-toc-title="Application Concerns"]');
    await click('[data-test-toc-title="Upgrading"]');

    assert.areTitlesCorrect([
      'Getting Started',
      'Tutorial',
      'Components',
      'Routing',
      'Services',
      'Ember Data',
      'In-Depth Topics',
      'Application Concerns',
      'Accessibility',
      'Configuration',
      'Testing',
      'Addons and Dependencies',
      'Ember Inspector',
      'Code Editors',
      'Upgrading',
      'Contributing to Ember.js',
      'Glossary',
    ]);

    assert.areLinksCorrect([
      'Applications and Instances',
      'Dependency Injection',
      'Initializers',
      'The Run Loop',
      'Ember Engines',
    ]);

    await click('[data-test-toc-title="Application Concerns"]');

    assert.areTitlesCorrect([
      'Getting Started',
      'Tutorial',
      'Components',
      'Routing',
      'Services',
      'Ember Data',
      'In-Depth Topics',
      'Application Concerns',
      'Accessibility',
      'Configuration',
      'Testing',
      'Addons and Dependencies',
      'Ember Inspector',
      'Code Editors',
      'Upgrading',
      'Contributing to Ember.js',
      'Glossary',
    ]);

    assert.areLinksCorrect([]);
  });
});
