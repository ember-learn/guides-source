As you're developing your Ember app, you are likely to run into common scenarios that aren't addressed by Ember itself.
Perhaps you want to use a CSS preprocessor to write your stylesheets, or you want to use a popular JS library, or maybe
you want to import components written by a different department within your organization.

Ember provides a common format called [Ember Addons](#toc_addons) for distributing reusable libraries to solve some
of these problems.  Additionally, you may want to make use of front-end dependencies like a CSS framework or a JavaScript
datepicker that aren't specific to Ember apps.

## Addons

Addons are JavaScript packages that integrate with Ember. For example, [`ember-concurrency`](https://github.com/machty/ember-concurrency) provides a concurrency primitive that you can use in your Ember app as well as a [Babel](https://babeljs.io/) plugin that makes it easier to use in an Ember application. You can install it just like any other npm package:

```bash
npm install --save-dev ember-concurrency
```

And then follow any additional instructions in the README of the addon. Some addons (like `ember-concurrency`) will give instructions for extra steps that you might need like installing a Babel plugin so it's always worthwhile reading the installation documentation.

The Ember community publishes and maintains many addons, and it can be difficult to know if one (or many!) exists that covers
your needs. The website [Ember Observer](https://www.emberobserver.com/) keeps an up-to-date index of Ember Addons, sorted by
categories, and rated according to objective metrics. If you are looking for an addon, we recommend that you start there!

## Regular npm packages

For newly generated Ember apps, the majority of the build is managed by [Vite](https://vite.dev/) which means that any npm packages or other assets can just be imported as you might expect in a modern build system or bundler.

In previous versions of Ember (before we moved to using Vite) there were other concepts that you would need to know to include 3rd party packages or assets in your app. If you are working on an Ember app that hasn't yet been upgraded to Vite you should look at [previous versions of this guide](/v6.7.0/addons-and-dependencies/) to get more information about the legacy build system.

To know more about how Vite can be configured, e.g. how it [handles static assets](https://vite.dev/guide/assets), you can consult their guides: [https://vite.dev/guide/](https://vite.dev/guide/)

<!-- eof - needed for pages that end in a code block  -->
