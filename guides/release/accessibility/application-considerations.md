In this section, you will learn about the configurations and libraries that affect an entire application's accessibility.

## Language attribute

Every application must have a primary language declaration. This language declaration is important for assistive technology like screen readers, internationalization tools built into browsers, and search engines.

To indicate the primary language, use the `lang` attribute on the `<html>` element. Until Ember provides this by default, developers should edit the `index.html` file of the generated Ember application with the default language declaration. This is inherited by all other elements, and will set a default language for the text in the document head element.

If there happens to be any content on the page that is in a different language from that declared in the `<html>` element, the `lang` attribute can be used on the parent element to indicate a different language.

Note: a page cannot have multiple language attribute _values_. For example, this means that `lang="en"` could be set on the page's HTML element and then `lang="es"` could be set on a different element in the page content (as appropriate).  

## Accessibility addons

Any addon that will provide UI elements to the application should be evaluated for accessibility before use.

There are some existing Ember addons that may help you make your app more accessible. Each addon should be evaluated for its own usefulness and merit- you may find in some instances, that it would be better to implement the ideas presented in the addon in your own application.

Here are some examples of accessibility-focused addons created by many people throughout the Ember community:

- [ember-a11y-landmarks](https://github.com/ember-a11y/ember-a11y-landmarks) - Ember addon to help with landmark roles for better accessibility
- [ember-component-focus](https://github.com/ember-a11y/ember-component-focus) - A mixin for adding methods to your Ember components that help you manage the currently focused element.
- [ember-gestures](https://github.com/html-next/ember-gestures) - Ember Gestures provides an easy way to use gestures by making it simple to define and use HammerJS managers and recognizers throughout your app.
- [ember-steps](https://github.com/rwjblue/ember-steps) - Declarative create wizards, tabbed UIs, and more
- [ember-page-title](https://github.com/tim-evans/ember-page-title) - Page title management for Ember.js Apps
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) - Focus on route on transition
- [ember-keyboard](https://github.com/patience-tema-baron/ember-keyboard) - An Ember.js addon for the painless support of keyboard events
- [ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) - A suite of accessibility tests that can be run within the Ember testing framework
- [a11y-announcer](https://github.com/ember-a11y/a11y-announcer) - An accessible ember route change announcer
- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) - linter for Ember templates

While there are quite a few moving parts, here's a cheat sheet to get you started: [Accessibility Cheat Sheet](https://moritzgiessmann.de/accessibility-cheatsheet/)
