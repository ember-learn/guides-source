import { click, currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | meta data', function (hooks) {
  setupApplicationTest(hooks);

  test('meta data title and description', async function (assert) {
    await visit('/release/');

    await click('[data-test-toc-link="Routing"]');
    assert.strictEqual(currentURL(), '/release/routing');

    // look up the og:title instead of title because testem modifies title https://github.com/testem/testem/issues/195
    assert
      .dom('head meta[property="og:title"]', document)
      .hasAttribute('content', 'Introduction - Routing - Ember Guides');
    assert
      .dom('head meta[name="description"]', document)
      .hasAttribute(
        'content',
        'Imagine we are writing a web app for managing a blog. At any given time, we should be able to answer questions like What post are they looking at? and Are they editing it? In Ember.js, the answer to these questions is determined by the URL. \n\nThe URL can be...',
      );

    await click('[data-test-toc-link="Defining Your Routes"]');
    assert.strictEqual(currentURL(), '/release/routing/defining-your-routes');

    assert
      .dom('head meta[property="og:title"]', document)
      .hasAttribute('content', 'Defining Your Routes - Routing - Ember Guides');

    // figure out why the description doesn't update on page navigation
    //     assert.dom('head meta[name="description"]', document)
    //       .hasAttribute('content', `When your application starts, the router matches the current URL to the routes that you've defined. The routes, in turn, are responsible for displaying templates, loading data, and setting up application state.

    // To define a route, run

    // ember generate...`);
  });
});
