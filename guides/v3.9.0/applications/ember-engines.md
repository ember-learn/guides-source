## What are Engines?

Engines can be considered miniature applications that provide functionality to their host applications. Engines are isolated, `composable applications`, they have almost all the same features as normal Ember applications, except an [Engine](https://api.emberjs.com/ember/release/classes/Engine) requires a host application to boot it and provide a Router instance.

"Engines allow multiple logical applications to be composed together into a single application from the user's perspective." - [Engines Guides](http://ember-engines.com/)

## Why use Engines?

Large companies are increasingly adopting Ember.js to power their entire product lines. Often this means separate teams (sometimes distributed around the world) working on the same app. Typically, responsibility is shared by dividing the application into one or more "sections". How this division is actually implemented varies from team to team. 

These companies also have large monolithic applications, which pose the following challenges:

* `Side effects` - if you change something, it may be unclear how it could affect the rest of platform.
* `Coordination` - when you develop a new feature or make big changes, many teams may need to be in sync to approve it.
* `Complexity` - with a huge dependency tree and many layers of abstraction, developers cannot iterate quickly, and features suffer as a result.
* `Killing Innovation` - a/b testing a cutting-edge feature is hard to do without disrupting the rest of the app and the teams working on it.
* `Slow Onboarding` - new people coming into the team are overwhelmed.

Engines provide an alternative to these approaches that allows for distributed development, testing, and packaging. The goal of Ember Engines was to allow large Ember applications to be split into consumable Addons allowing development teams to build logically-grouped pieces of an application.

Engines are good for companies that have a large number of teams, where each team has their own area that is clearly separated from the others. If your app is developed by a small team, engines are probably not very helpful for you. The isolation is good when it matches organizational boundaries, but adds unnecessary complexity when there is not a good match.

If you are considering splitting up your application into engines just to reduce the amount of data that needs to be initially downloaded and increase the performance, Engines are not the right solution. Please check out the section on tree shaking and code splitting in projects like [Embroider](https://github.com/embroider-build/embroider).
