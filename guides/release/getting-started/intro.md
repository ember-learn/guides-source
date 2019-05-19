## What is Ember?

Ember is a JavaScript front-end framework designed to help you build websites with rich and complex user interactions.
It does so by providing developers both with many features that are essential to manage complexity in modern web applications,
as well as an integrated development toolkit that enables rapid iteration.

Some of these features that you'll learn about in the guides are:

* [Ember CLI](./configuring-ember/configuring-ember-cli/) - A robust development toolkit to create, develop, and build Ember applications. When you see an `$ ember <command>` instruction throughout the guides, that's Ember CLI!
* [Routing](./routing) - The central part of an Ember application. Enables developers to drive the application state from the URL.
* [Templating engine](./templates/handlebars-basics/) - Use Handlebars syntax to write your application's templates
* [Data layer](./models/) - Ember Data provides a consistent way to communicate with external APIs and manage application state
* [Ember Inspector](./ember-inspector/) - A browser extension, or bookmarklet, to inspect your application live. It's also useful for spotting Ember applications in the wild, try to install it and open up the [NASA website](https://www.nasa.gov/)!

## Organization

On the left side of each Guides page is a table of contents,
organized into sections that can be expanded to show the topics
they cover. Both the sections and the topics within each section are
ordered from basic to advanced concepts.

The Guides are intended to contain practical explanations of how to
build Ember apps, focusing on the most widely-used features of Ember.js.
For comprehensive documentation of every Ember feature and API, see the
[Ember.js API documentation](http://emberjs.com/api/).

The Guides begin with an explanation of how to get started with Ember,
followed by a tutorial on how to build your first Ember app.
If you're brand new to Ember,
we recommend you start off by following along with these first two sections of the Guides.

## Assumptions

While we try to make the Guides as beginner-friendly as we can,
we must establish a baseline so that the guides can keep focused on Ember.js functionality.
We will try to link to appropriate documentation whenever a concept is introduced.

To make the most out of the guides, you should have a working knowledge of:

* **HTML, CSS, JavaScript** - the building blocks of web pages. You can find documentation of each of these technologies at the [Mozilla Developer Network][mdn].
* **Promises** - the native way to deal with asynchrony in your JavaScript code. See the relevant [Mozilla Developer Network][promises] section.
* **ES2015 modules** - you will better understand [Ember CLI's][ember-cli] project structure and import paths if you are comfortable with [JavaScript Modules][js-modules].
* **ES2015 syntax** - Ember CLI comes with Babel.js by default so you can
take advantage of newer language features such as arrow functions, template
strings, destructuring, and more. You can check the
[Babel.js documentation][babeljs] or read [Understanding ECMAScript 6][es6]
online.

## A Note on Mobile Performance

Ember will do a lot to help you write fast apps, but it can't prevent you from
writing a slow one. This is especially true on mobile devices. To deliver a great
experience, it's important to measure performance early and often, and with a diverse
set of devices.

Make sure you are testing performance on real devices. Simulated mobile
environments on a desktop computer give an optimistic-at-best representation of
what your real world performance will be like. The more operating systems and
hardware configurations you test, the more confident you can be.

Due to their limited network connectivity and CPU power, great performance on
mobile devices rarely comes for free. You should integrate performance testing
into your development workflow from the beginning. This will help you avoid
making costly architectural mistakes that are much harder to fix if you only
notice them once your app is nearly complete.

In short:

1. Always test on real, representative mobile devices.
2. Measure performance from the beginning, and keep testing as your app
   develops.

These tips will help you identify problems early so they can be addressed systematically, rather than
in a last-minute scramble.

## Reporting a problem

Typos, missing words, and code samples with errors are all considered
documentation bugs. If you spot one of them, or want to otherwise improve
the existing guides, we are happy to help you help us!

Some of the more common ways to report a problem with the guides are:

* Using the pencil icon on the top-right of each guide page
* Opening an issue or pull request to [the GitHub repository][gh-guides]

Clicking the pencil icon will bring you to GitHub's editor for that
guide so you can edit right away, using the Markdown markup language.
This is the fastest way to correct a typo, a missing word, or an error in
a code sample.

If you wish to make a more significant contribution be sure to check our
[issue tracker][gh-guides-issues] to see if your issue is already being
addressed. If you don't find an active issue, open a new one.

If you have any questions about styling or the contributing process, you
can check out our [contributing guide][gh-guides-contributing]. If your
question persists, reach us in the `#dev-ember-learning` channel on the [Ember Community Discord][discord].

Good luck!

[ember-cli]: https://ember-cli.com/

[mdn]: https://developer.mozilla.org/en-US/docs/Web
[promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[js-modules]: http://jsmodules.io/
[babeljs]: https://babeljs.io/docs/learn-es2015/
[es6]: https://leanpub.com/understandinges6/read

[gh-guides]: https://github.com/ember-learn/guides-source/
[gh-guides-issues]: https://github.com/ember-learn/guides-source/issues
[gh-guides-contributing]: https://github.com/ember-learn/guides-source/blob/master/CONTRIBUTING.md

[discord]: https://discordapp.com/invite/zT3asNS
