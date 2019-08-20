When considering an application's page or view structure, there are two primary areas that should be planned for: focus management and skip links. 

## Focus Management

No single-page application framework provides the appropriate route-level focus for assistive technology. This is primarily due to 

In Ember, there is an attempt to address this shortcoming with [RFC 433](https://github.com/emberjs/rfcs/pull/433); in the meantime there are a few addons that exist to help provide page or view-level focus for your application. All options should be evaluated to determine which is the appropriate use case for your application:

- [ember-a11y](https://github.com/ember-a11y/ember-a11y) 
- [ember-self-focused](https://github.com/linkedin/self-focused/tree/master/packages/ember-self-focused) 
- [ember-a11y-refocus](https://github.com/MelSumner/ember-a11y-refocus)
