When considering an application's page or view structure, there are a few primary concerns that should be planned for: 

- page title
- skip nav
- focus management


## Page Title

Each page (what is rendered for a unique URL) should have a page title. This page title should be unique to that page, and should accurately reflect what that page does. Consider this format: 

Unique Page Title - Site Title

Until Ember provides this functionality by default, there are a few different Ember addons that will help:

- [ember-page-title](https://github.com/adopted-ember-addons/ember-page-title)
- [ember-cli-head](https://github.com/ronco/ember-cli-head)
- [ember-cli-document-title](https://github.com/kimroen/ember-cli-document-title)

To evaluate more addons to add/manage content in the `<head>` of a page, view this category on [Ember Observer](https://emberobserver.com/categories/header-content).


## Skip navigation

A skip navigation link, or skip nav, is a useful feature for users who want to bypass content that is repeated on multiple pages (i.e., a site header). This can especially apply to users with assistive technology, who have to browse website content in a more linear fashion, but can also be useful for power users who prefer to navigate websites only using a keyboard. 

To implement a skip nav link in an application, add an anchor element as close as possible after the opening `<body>` element, and have it link to the beginning of the page's main content area. 

To read more about skip links, visit the [MDN docs](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML#Skip_links).


## Focus Management

No single-page application framework provides the appropriate route-level focus for assistive technology. This is primarily due to 

In Ember, there is an attempt to address this shortcoming with [RFC 433](https://github.com/emberjs/rfcs/pull/433); in the meantime there are a few addons that exist to help provide page or view-level focus for your application. All options should be evaluated to determine which is the appropriate use case for your application:

- [ember-a11y](https://github.com/ember-a11y/ember-a11y) 
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) 
- [ember-a11y-refocus](https://github.com/MelSumner/ember-a11y-refocus)
