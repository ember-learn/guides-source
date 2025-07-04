## What are Engines?

[Ember Engines](http://ember-engines.com/) allow multiple logical applications to be composed together into a single application from the user's perspective, that provide functionality to their host applications. Engines are isolated, `composable applications`, they have almost all the same features as normal Ember applications, except an [Engine](https://api.emberjs.com/ember/6.0.0/classes/Engine) requires a host application to boot it and provide a Router instance.

## Why use Engines?

Large organizations often use Ember.js to power sophisticated web applications. These apps may require collaboration among several teams, sometimes distributed around the world. Typically, responsibility is shared by dividing the application into one or more "sections". How this division is actually implemented varies from team to team. 

Maintaining large monolithic applications poses the following challenges:

* `Side effects` - if you change something, it may be unclear how it could affect the rest of platform.
* `Coordination` - when you develop a new feature or make big changes, many teams may need to be in sync to approve it.
* `Complexity` - with a huge dependency tree and many layers of abstraction, developers cannot iterate quickly, and features suffer as a result.
* `Killing Innovation` - a/b testing a cutting-edge feature is hard to do without disrupting the rest of the app and the teams working on it.
* `Slow Onboarding` - new people coming into the team are overwhelmed.

Engines provide an antidote to these problems by allowing for distributed development, testing, and packaging of logically-grouped pieces of an application.

Engines are good for organizations that have multiple teams, where each team has their own area that is clearly separated from the others. The isolation is good when it matches organizational boundaries, but adds unnecessary complexity when there is not a good match.

Engines are used by a number of large organizations to power sites with millions of users.

If you are considering splitting up your application into engines just to reduce the amount of data that needs to be initially downloaded and increase the performance, Engines are not the right solution. Please check out the section on tree shaking and code splitting in projects like [Embroider](https://github.com/embroider-build/embroider).
