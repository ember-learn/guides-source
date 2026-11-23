In this section, you will learn about the configurations and libraries that affect an entire application's accessibility.

## Lang Attribute

Declaring the language of the HTML document allows users to better understand your content.

> Both assistive technologies and conventional user agents can render text more accurately when the language of the Web page is identified. Screen readers can load the correct pronunciation rules. Visual browsers can display characters and scripts correctly. Media players can show captions correctly. As a result, users with disabilities will be better able to understand the content.
> [WCAG Success Criterion 3.1.1: Intent](https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html#intent)

A primary language should be defined on the `<html>` element's `lang` attribute. For new apps, you can use the `--lang` option on the `ember new` command to set the language for a new application.

```bash
ember new mon-app --lang fr
```

This command will create your application with French defined as the primary language
on the `<html>` element's `lang` attribute.

For existing Ember apps, a developer may edit the `index.html` file or leverage [ember-intl](https://github.com/ember-intl/ember-intl).

The `html` element may not have multiple `lang` _values_. If an element contains content in a language different from the primary, then you can provide the element its own `lang` attribute.

![For example, the HTML tag may have a lang of "es" while a paragraph may have a lang of "en"](/images/accessibility/application-considerations/lang.png)

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        To learn more about the lang attribute and how to use it: <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang">https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang</a>. Unsure which language subtag to use? Try <a href="https://r12a.github.io/app-subtags/">the Language Subtag Lookup tool</a>.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Accessibility addons

Any addon that will provide UI elements to the application should be evaluated for accessibility before use.

There are some existing Ember addons that may help you make your app more accessible. Each addon should be evaluated for its own usefulness and merit- you may find in some instances, that it would be better to implement the ideas presented in the addon in your own application.

Here are some examples of accessibility-focused addons created by many people throughout the Ember community:

- [ember-a11y-landmarks](https://github.com/ember-a11y/ember-a11y-landmarks) - Ember addon to help with landmark roles for better accessibility
- [ember-component-focus](https://github.com/ember-a11y/ember-component-focus) - A mixin for adding methods to your Ember components that help you manage the currently focused element.
- [ember-steps](https://github.com/rwjblue/ember-steps) - Declarative create wizards, tabbed UIs, and more
- [ember-page-title](https://github.com/tim-evans/ember-page-title) - Page title management for Ember.js Apps
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) - Focus on route on transition
- [ember-keyboard](https://github.com/patience-tema-baron/ember-keyboard) - An Ember.js addon for the painless support of keyboard events
- [ember-a11y-testing](https://github.com/ember-a11y/ember-a11y-testing) - A suite of accessibility tests that can be run within the Ember testing framework
- [a11y-announcer](https://github.com/ember-a11y/a11y-announcer) - An accessible ember route change announcer
- [ember-template-lint](https://github.com/ember-template-lint/ember-template-lint) - linter for Ember templates
  ![Template Linting Preview](/images/accessibility/application-considerations/template-lint.png)

While there are quite a few moving parts, here's a cheat sheet to get you started: [Accessibility Cheat Sheet](https://moritzgiessmann.de/accessibility-cheatsheet/)
