## What are Engines?

Engines can be considered miniature applications that provide functionality to their host applications. Engines are isolated, `composable applications`, they have almost all the same features as normal Ember applications, except an [Engine](https://api.emberjs.com/ember/release/classes/Engine) requires a host application to boot it and provide a Router instance.

> Engines allow multiple logical applications to be composed together into a single application from the user's perspective. - [Engines Guides](http://ember-engines.com/)

## Why use Engines?

Large companies are increasingly adopting Ember.js to power their entire product lines. Often this means separate teams (sometimes distributed around the world) working on the same app. Typically, responsibility is shared by dividing the application into one or more "sections". How this division is actually implemented varies from team to team. 

These companies also have large monolithic applications, which pose the following challenges:

* `Side effects` - is a bit insecure if you change something and how will this affect the rest of platform (unclear code ownership, shared code, risky refactoring in code).
* `Coordination` - when you develop a new feature or make big changes, many teams may need to be in sync to approve it
* `Complexity` - with a huge dependency tree and many layers of abstraction developers couldn't iterate quickly, and of features suffer as a result.
* `Killing Innovation` - when you wanted to new features, to do something a/b testing or something that took a lot, it's result in stop innovation.
* `Slow Onboarding` - when new people were approaching and coming into the team.

Engines provide an alternative to these approaches that allows for distributed development, testing, and packaging. The goal of Ember Engines was to allow large Ember applications to be split into consumable Addons allowing development teams to build logically-grouped pieces of an application.

Engines are good for companies that have a large number of teams and each team have their own area that is clearly separated from the others. If your app is developed by a small team engines are probably not very helpful for you. The isolation is good when it matches organizational boundaries, but bad when it doesn't.

If you are considering splitting up our application into engines just to reduce the amount of data that needs to be initially downloaded and increase the performance (for some code reuse as well) it doesn't a good idea. Please check out the section on tree shaking and code splitting in: [Embroider](https://github.com/embroider-build/embroider).

