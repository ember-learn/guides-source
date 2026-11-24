You load records with `store.request()`.
You pass it a request object, and you get back the response.

A _builder_ is a function that returns a request object.
Give every request in your app its own builder, with a name that says what the request is for.
Keep the builders in one folder, such as `app/builders/`.
The rest of your app then calls a builder, and does not need to know the URLs of your API.

WarpDrive has tools to write builders with:

- `@warp-drive/utilities/json-api` has general builders, such as `findRecord`. Call them inside your own builders.
- `@warp-drive/utilities` has `buildBaseURL` and `buildQueryParams`, which make URLs.

To make `store` available, [inject the `store` service](../#toc_injecting-the-store).
The examples in this guide also need the `JsonApiHandler` from
[Request Handlers](../request-handlers/#toc_content-type), which adds the JSON:API headers to each request.

### Retrieving a Single Record

Use the [`findRecord`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/findRecord) builder to load one record by its type and ID:

```javascript {data-filename=app/builders/blog-post.js}
import { findRecord } from '@warp-drive/utilities/json-api';

/** GET /blog-posts/:id */
export function getBlogPost(id) {
  return findRecord('blog-post', id);
}
```

```javascript {data-filename=app/routes/blog-post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getBlogPost } from 'my-app/builders/blog-post';

export default class BlogPostRoute extends Route {
  @service store;

  async model(params) {
    const { content } = await this.store.request(
      getBlogPost(params.blog_post_id),
    );
    return content.data;
  }
}
```

`store.request()` returns a promise.
The promise resolves with an object that has a `content` property.
`content` is the response document, and `content.data` is the record.

If the store already has a fresh response for the same request, it does not ask the server again.
It resolves with the cached record.

To also load related records in the same request, pass the `include` option in the builder:

```javascript {data-filename=app/builders/blog-post.js}
/** GET /blog-posts/:id?include=comments */
export function getBlogPostWithComments(id) {
  return findRecord('blog-post', id, { include: ['comments'] });
}
```

Use `store.peekRecord()` to get a record that is already in the store, without a network request:

```javascript
let blogPost = this.store.peekRecord('blog-post', '1'); // => no network request
```

`peekRecord` returns `null` if the store does not have the record.

### Retrieving Multiple Records

A builder for a list is a function that returns the request object directly:

```javascript {data-filename=app/builders/blog-post.js}
import { buildBaseURL } from '@warp-drive/utilities';

/** GET /blog-posts */
export function getBlogPosts() {
  return {
    url: buildBaseURL({ resourcePath: 'blog-posts' }),
    method: 'GET',
    op: 'query',
    cacheOptions: { types: ['blog-post'] },
  };
}
```

`buildBaseURL` makes the URL from the `host` and `namespace` of your app and the `resourcePath`.

The last two properties register the request as a list of blog posts.
When your app creates a blog post, the store marks each registered list as stale.
A list without `cacheOptions.types` does not learn about new records.

```javascript
import { getBlogPosts } from 'my-app/builders/blog-post';

const { content } = await this.store.request(getBlogPosts());
const blogPosts = content.data;
```

`content.data` is an array of records.
You can use it like any other JavaScript array, such as `blogPosts[0]` or `blogPosts.length`.

### Rendering a Request

The `<Request>` component sends a request and renders a block for each state of it.
Pass the result of a builder as `@query`:

```gjs {data-filename=app/components/blog-post-list.gjs}
import { Request } from '@warp-drive/ember';
import { getBlogPosts } from 'my-app/builders/blog-post';

<template>
  <Request
    @query={{(getBlogPosts)}}
    @autorefresh={{true}}
    @autorefreshBehavior="refresh"
  >
    <:loading>
      <p>Loading...</p>
    </:loading>

    <:content as |content|>
      <ul>
        {{#each content.data as |blogPost|}}
          <li>{{blogPost.title}}</li>
        {{/each}}
      </ul>
    </:content>

    <:error as |error|>
      <p>{{error.message}}</p>
    </:error>
  </Request>
</template>
```

`(getBlogPosts)` calls the builder from the template.

With `@autorefresh={{true}}`, the component sends the request again when the store marks it as stale.
With `@autorefreshBehavior="refresh"`, the current list stays on screen until the new response arrives.
Use these two arguments for each list, so that the list shows records that your app creates later.

If two components render the same request, the store sends one network request and answers both.
You do not need to load data in one place and pass it down.

A route can also start the request, and pass it to the template without `await`.
Return it inside an object, because the router waits for a promise that `model()` returns directly:

```javascript {data-filename=app/routes/blog-posts.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { getBlogPosts } from 'my-app/builders/blog-post';

export default class BlogPostsRoute extends Route {
  @service store;

  model() {
    return { blogPosts: this.store.request(getBlogPosts()) };
  }
}
```

In the template, pass it as `@request` in place of `@query`:

```handlebars
<Request
  @request={{@model.blogPosts}}
  @autorefresh={{true}}
  @autorefreshBehavior="refresh"
>
  ...
</Request>
```

### Querying for Multiple Records

To filter a list, add query params to the URL with `buildQueryParams`.

For example, this builder searches for all the `person` records with a given name:

```javascript {data-filename=app/builders/person.js}
import { buildBaseURL, buildQueryParams } from '@warp-drive/utilities';

/** GET /people?name=:name */
export function getPeopleByName(name) {
  const url = buildBaseURL({ resourcePath: 'people' });

  return {
    url: `${url}?${buildQueryParams({ name })}`,
    method: 'GET',
    op: 'query',
    cacheOptions: { types: ['person'] },
  };
}
```

```javascript
import { getPeopleByName } from 'my-app/builders/person';

// GET /people?name=Peter
const { content } = await this.store.request(getPeopleByName('Peter'));
const peters = content.data;
```

The store caches the response for each URL.
A request with different query params is a different request, so it has its own cache entry.
`buildQueryParams` sorts the params, so the same params always make the same URL.

To read query params from the URL of your app, see the [query parameters](../../routing/query-params/) guide.

### Querying for a Single Record

Some APIs have endpoints that do not follow the JSON:API URL conventions.
For example, your API can have an endpoint for the user who is logged in:

```text
GET /api/current-user

{
  "data": {
    "type": "user",
    "id": "1234",
    "attributes": {
      "username": "admin"
    }
  }
}
```

A builder for this endpoint only needs a `url` and a `method`:

```javascript {data-filename=app/builders/current-user.js}
/** GET /api/current-user */
export function getCurrentUser() {
  return {
    url: '/api/current-user',
    method: 'GET',
  };
}
```

```javascript
import { getCurrentUser } from 'my-app/builders/current-user';

const { content } = await this.store.request(getCurrentUser());
const user = content.data;
console.log(`Currently logged in as ${user.username}`);
```

The response goes into the cache like any other response.
The record in `content.data` is the same object that a request for the user `1234` returns.

To learn more, read [Builders](https://warp-drive.io/guides/the-manual/requests/builders) in the WarpDrive guides.

### Handling Errors

If the server responds with an error, the promise from `store.request()` rejects.
The error has a `content` property with the body of the response:

```javascript
try {
  const { content } = await this.store.request(getBlogPost('1'));
  return content.data;
} catch (error) {
  // error.content is the error document from the server
  console.error(error.content?.errors);
}
```

In a route, you can let the error go up to the router instead.
Ember then shows your [error substate](../../routing/loading-and-error-substates/).
The `<Request>` component renders its `<:error>` block.
