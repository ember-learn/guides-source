When considering an application's page or view structure, there are a few primary concerns that should be planned for:

- page title
- skip navigation links
- focus management


## Page Title

Each page (what is rendered for a unique URL) should have a page title. This page title should be unique to that page, and should accurately reflect what that page does.

Consider this format:

`Unique Page Title - Site Title`

<img width="675px" title="Page Title Example" alt="A visual representation of page title in the browser's tab" src="/images/accessibility/page-template-considerations/page-title.png"/>

Note that the unique page title is first. This is because it is the most important piece of information from a contextual perspective. Since a user with a screen reader can interrupt the screen reader as they wish, it introduces less fatigue when the unique page title is first, but provides the additional guidance if it is desired.

A simple way to add page titles is to use the `page-title` helper which comes from the [ember-page-title](https://github.com/ember-cli/ember-page-title) addon that is installed by default in new apps. We can use this helper to set the page title at any point in any template.

For example, if we have a “posts” route, we can set the page title for it like so:


```handlebars {data-filename=app/routes/posts.hbs}
{{page-title "Posts - Site Title"}}

{{outlet}}
```

Extending the example, if we have a “post” route that lives within the “posts” route, we could set its page title like so:

```handlebars {data-filename=app/routes/posts/post.hbs}
{{page-title (concat @model.title " - Site Title")}}

<h1>{{@model.title}}</h1>
```

When your needs become more complex, the following addons facilitate page titles in a more dynamic and maintainable way.

- [ember-cli-head](https://github.com/ronco/ember-cli-head)
- [ember-cli-document-title](https://github.com/kimroen/ember-cli-document-title)

To evaluate more addons to add/manage content in the `<head>` of a page, view this category on [Ember Observer](https://emberobserver.com/categories/header-content).

You can test that page titles are generated correctly by asserting on the value of `document.title` in your tests:

```javascript {data-filename=tests/acceptance/posts-test.js}
import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'my-app-name/tests/helpers';

module('Acceptance | posts', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /posts', async function(assert) {
    await visit('/posts');
    assert.equal(document.title, 'Posts - Site Title');
  });
});
```

## Skip Navigation Links

A skip navigation link, or skip link, is a useful feature for users who want to bypass content that is repeated on multiple pages (i.e., a site header). This can especially helpful to users with assistive technology, who have to browse website content in a more linear fashion, but it can also be useful for power users who prefer to navigate websites only using a keyboard.

<img width="675px" title="Skip Main Content Example" alt="A visual representation of how the skip link works in the browser" src="/images/accessibility/page-template-considerations/skip-main-content.png"/>

To implement a skip link in an application, add an anchor element as close as possible after the opening `<body>` element, and have it link to the beginning of the page's main content area.

To read more about skip links, visit the [MDN docs](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#Skip_links).


## Focus Management

No single-page application framework provides the appropriate route-level focus for assistive technology in a default manner. This is primarily due to the way `pushState` works, and the lack of an event hook for JavaScript frameworks to tell assistive technology that the page content has changed. This *also* means that the focus is unchanged on route navigation, which in some cases means that it would be lost entirely (if the element that previously had focus is now gone).

Most frameworks have some mechanism for adding the missing functionality to an application. In Ember, there is an attempt to address these two specific shortcomings with [RFC 433](https://github.com/emberjs/rfcs/pull/433); in the meantime there are a few addons that exist to help provide page or view-level focus for your application. All options should be evaluated to determine which is the appropriate use case for your application:

- [ember-a11y](https://github.com/ember-a11y/ember-a11y)
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused)
- [ember-a11y-refocus](https://github.com/MelSumner/ember-a11y-refocus)
