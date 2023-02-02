Ember developers have great options for how they handle data from
back end APIs. Ember itself works with any type of back end: REST,
JSON:API, GraphQL, or anything else. This guide will summarize how
and where to make API requests.
Follow the links within it to see examples and learn more.

## How to make API requests

Some common tools for making [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (create, read, update, delete) requests in Ember include:

- [EmberData](../../models/) is the official data persistence library for Ember. It has a powerful set of tools
for formatting requests, normalizing responses, and efficiently
managing a local cache of data. 
It is included by default in new Ember apps.
- Native JavaScript methods like [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). Install [`ember-fetch`](https://github.com/ember-cli/ember-fetch) in order to provide support for older browsers, and `import fetch from 'fetch'` to use it.
- [jQuery Ajax](https://api.jquery.com/jquery.ajax/) requests. See [the guide for optional features](../../configuring-ember/optional-features/) in order to be able to `import jQuery from 'jquery'` in your app.
- Other Ember-specific addons for data loading. Search for them on [Ember Observer](https://emberobserver.com)
- ...and many more general JavaScript data fetching libraries, which you can install following [this guide](../../addons-and-dependencies/managing-dependencies/).

## Where to make API requests

API requests can be made almost anywhere in an Ember app, however the most common place is the `model` hook of a Route.

### Requests in a Route's `model` hook

In almost every case, this is where your app should load data. You can see examples and more information in [Specifying a Route's Model](../../routing/specifying-a-routes-model/).

These are the main reasons to load data in a `model` hook:

- Respecting the URL results in better user experience
- Proper use of loading and error states result in better user experience
- Dealing with concurrency is a big source of bugs
- The router is designed to solve those problems for you in the majority of common situations

### Requests in Components

Some people choose to load data in their Components.
The drawback is that requires more work from developers to handle async, rendering,
errors, concurrency, and URL state themselves - functionality they would get automatically if
they used a Route's `model` hook.
However there are valid use cases for loading data in a component, for developers who are
comfortable handling the router's features themselves.

Some common use cases include:

- UI elements whose data is independent of a route. For example, a modal that could appear on many different routes, and the modal has its own unique data.
- loading data in parallel within deeply nested routes
- highly interactive loading, like a search bar with its own loading state, error handling, etc.

These Guides do not cover how to load data in components, since the majority
of data fetching should be done in a route's `model`.

### Requests in Services

If someone is connecting to a third-party API, such as a service for payment or mapping, and they need that state across many routes, a [Service](../../services/) might be a good place to make requests. Some common use cases include polling for data and managing websocket connections.

Requests in services have the same drawbacks as Components. Functions and state in a Service can be used almost anywhere in the app.

## Simulating API requests

You don't need to build a back end in order to see how your app might work once it has real data loading in!
Check out the [official Ember.js Tutorials](https://emberjs.com/learn) to learn how to simulate API requests
in an app and test your data loading.

## Things to know

Here are some top things to know if you are new to making API requests in a front end framework:

- Never store API keys or any sensitive data in a front end application
- Learn about the difference between the front end, API, and database. Front end frameworks connect to APIs, not directly to a database.
- If your app seems slow to load, check if the delay is caused by a slow response from the back end API. Use your browser's developer tools to investigate.
- Always check to see if someone has already written an addon or library that helps connect to your API host or style
- Read some blog posts about data loading in Ember. Apps and APIs come in so many different shapes and sizes that it's helpful to seek out examples that are similar to your goals before digging into the details.
- Visit each page of your app and refresh. Does it still work as expected? If not, you may need to refactor where your app makes data requests or use query params to track state.
