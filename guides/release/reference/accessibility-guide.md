The purpose of this guide is to give every Ember developer a starting point for making your Ember application minimally accessible. As accessibility can be a complex issue, it should be noted that this guide only covers a some of the basics, and should not be considered a comprehensive guide. A good place to start is [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/) provided by the Web Accessibility Initiative (WAI).

## Ember Application Configuration

### Optional Feature: Application Template Wrapper

If you are using the [application template wrapper](#toc_optional-features) enabled (default state), then you will need to add certain aria roles to your [landmark regions](https://www.w3.org/WAI/PF/aria/roles#landmark_roles), even if you are using native HTML elements, because those regions are not the direct child descendant of the body element (they are the children of the div that wraps the Ember app).

If you disable the [application template wrapper](#toc_optional-features), you will not need to add role attributes to your landmark regions when they are the direct descendant of the body element, and they are using native HTML elements. This is the preferred approach for accessible applications. 

**Application Template Wrapper Disabled** _(preferred)_

```hbs
<body>
  <header></header>
  <main></main>
  <footer></footer>
</body>
```

**Application Template Wrapper Enabled**

```hbs
<body>
  <div class="ember-view">
    <header role="banner"></header>
    <main role="main"></main>
    <footer role="contentinfo"></footer>
  </div>
</body>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        To learn more about landmark roles and how to use them: <a href="https://www.w3.org/WAI/PF/aria/roles#landmark_roles">https://www.w3.org/WAI/PF/aria/roles#landmark_roles</a>. Still need more help? Visit the #topic-a11y channel in <a href="https://emberjs.com/community/">the community chat</a>. 
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Ember Application vs role=''application''

An important thing to note in this section is this: "application" in Ember development and "application" in landmark roles have two _very_ different meanings. 

The <abbr title="too long; didn't read">TL;DR</abbr>? Don't use `role="application"` until you have done your research and know exactly how it is to be used correctly (if at all). There are **very** few use cases where the role of application is appropriate. 

Read more about it: [https://a11yproject.com/posts/how-to-use-application-role/](https://a11yproject.com/posts/how-to-use-application-role/)


## Basic Guidelines for Accessibility

Here is a checklist of some things to keep in mind when developing your application:

- Familiarize yourself with [the five rules of ARIA](https://www.w3.org/TR/using-aria/#NOTES)
  - Use native HTML elements whenever possible; the built-in benefits of native browser keyboard navigation support and accessibility features mean you have less to add into your app. There are a lot of examples that demonstrate why, the most famous of which is ["Just use a button"](https://developer.paciellogroup.com/blog/2011/04/html5-accessibility-chops-just-use-a-button/).
  - Don't change semantics unless you _really_ have to (you probably don't).
  - All interactive elements must be usable with only a keyboard. A helpful development tip- make sure you can use your own app just using your keyboard.
  - Do not use `role="presentation"` or `aria-hidden="true"` on a focusable element.
  - All interactive elements must have an accessible name.
- The values for the role attribute are pre-defined by the ARIA specification. This is not something an author can define a custom value for (that is not listed in the spec). [Learn more about roles in the specification.](https://www.w3.org/TR/wai-aria/#roles_categorization)
- In general, avoid making your own keyboard shortcuts. [Screen readers already provide quite a few.](https://dequeuniversity.com/screenreaders/) There is some nuance here, so proceed with caution should you choose to do so. 
- "Completely accessible" may be somewhat of a misnomer. Practical accessibility looks more like 90% coding to the spec and 10% filing browser bugs (or keeping track of existing browser bugs). Keep in mind that if you choose to implement a workaround for a browser bug, you will need to to put an issue in your product backlog to follow up on browser bugs at a later date. 

### Focus

Focus management is a large part of how your application's code coordinates with the code that runs screen readers (If you peek through the source code for [NVDA](https://github.com/nvaccess/nvda), you'll see what I mean).

To get you started, here are some focus basics:

- There's a difference between browse mode and focus mode in screen readers- see ["Focus Please"](https://codepen.io/melsumner/live/ZJeYoP).
- While we have [RFC 433](https://github.com/emberjs/rfcs/pull/433) to address accessible routing in Ember more permanently, in the meantime there are a few addons to help address the primary focus flaw that affects screen reader users. Evaluate [ember-a11y](https://github.com/ember-a11y/ember-a11y) and [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) to see which approach might fit your application best. 
- If you have an element in your application that opens a modal (like, say, a button element), focus should return to that same element once that modal is closed. 

## Ember Addon Support

There are some existing Ember addons that may help you make your app more accessible. Each addon should be evaluated for its own usefulness and merit- you may find in some instances, that it would be better to implement the ideas presented in the addon in your own application. 

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

## Testing

### Screen Reader and Browser Combinations

It is important to use a screen reader when checking to make sure your application is accessible. 

There are assistive technologies (known as screen readers) available for all common desktop platforms and mobile devices. 

- VoiceOver, integrated in Apple products
- Narrator, integrated in Windows products
- Orca, available for integration in Ubuntu, otherwise available as a download
- JAWS, proprietary software by Freedom Scientific, available for Windows
- NVDA, open source software, available for Windows
- TalkBack, integrated in Android products

While developing and testing for conformance, keep in mind that there are well-known screen reader and browser combinations that were developed in a way that work well together; using combinations different than these may produce false-positive results. It should be noted that these may change over time, so periodic review of this list is recommended. 

- Firefox & NVDA (Windows)
- IE & JAWS (Windows)
- Edge & Narrator (Windows)
- Safari & VoiceOver (MacOS)

The absolute best method for learning how a screen reader works is using one yourself! It might feel a little awkward at first, but understanding how to use a screen reader (and other assistive technology) will help you become a more skilled developer. 


## Other Accessibility Reference Materials

- [WAI-ARIA specification](https://www.w3.org/TR/wai-aria/)
- [How to Meet WCAG 2 (Quick Reference)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Tips for Developing](https://www.w3.org/WAI/tips/developing/)
