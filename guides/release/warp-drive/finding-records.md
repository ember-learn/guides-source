You load records with `store.request()`.
You pass it a request object, and you get back the response.
Builders are functions that create request objects for you.
The builders in this guide come from `@warp-drive/utilities/json-api`.
They make the URLs and headers that most JSON:API servers expect.

To make `store` available, [inject the `store` service](../#toc_injecting-the-store).

### Retrieving a Single Record

Use the [`findRecord`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/findRecord) builder to load one record by its type and ID:

```javascript {data-filename=app/routes/blog-post.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { findRecord } from '@warp-drive/utilities/json-api';

export default class BlogPostRoute extends Route {
  @service store;

  async model(params) {
    // GET /blog-posts/1
    const { content } = await this.store.request(
      findRecord('blog-post', params.blog_post_id),
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

To also load related records in the same request, pass the `include` option:

```javascript
// GET /blog-posts/1?include=comments
const { content } = await this.store.request(
  findRecord('blog-post', '1', { include: ['comments'] }),
);
```

Use `store.peekRecord()` to get a record that is already in the store, without a network request:

```javascript
let blogPost = this.store.peekRecord('blog-post', '1'); // => no network request
```

`peekRecord` returns `null` if the store does not have the record.

### Retrieving Multiple Records

Use the [`query`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/query) builder to load all the records of a type:

```javascript
import { query } from '@warp-drive/utilities/json-api';

// GET /blog-posts
const { content } = await this.store.request(query('blog-post'));
const blogPosts = content.data;
```

`content.data` is an array of records.
You can use it like any other JavaScript array, such as `blogPosts[0]` or `blogPosts.length`.

### Querying for Multiple Records

The second argument of `query` is an object of query params.
The builder adds them to the URL of the `GET` request.

For example, we can search for all the `person` records with the name `Peter`:

```javascript
import { query } from '@warp-drive/utilities/json-api';

// GET /people?name=Peter
const { content } = await this.store.request(
  query('person', { name: 'Peter' }),
);
const peters = content.data;
```

The store caches the response for each URL.
A request with different query params is a different request, so it has its own cache entry.

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

For an endpoint like this, write your own builder.
A builder is a function that returns a request object.
Often the object only needs a `url` and a `method`:

```javascript {data-filename=app/builders/current-user.js}
export function getCurrentUser() {
  return {
    url: '/api/current-user',
    method: 'GET',
  };
}
```

Use your builder the same way as the built-in ones:

```javascript
import { getCurrentUser } from 'my-app/builders/current-user';

const { content } = await this.store.request(getCurrentUser());
const user = content.data;
console.log(`Currently logged in as ${user.username}`);
```

The response goes into the cache like any other response.
The record in `content.data` is the same object that `findRecord('user', '1234')` returns.

Builders are a good place to keep the details of your API in one place.
To learn more, read [Builders](https://warp-drive.io/guides/the-manual/requests/builders) in the WarpDrive guides.

### Handling Errors

If the server responds with an error, the promise from `store.request()` rejects.
The error has a `content` property with the body of the response:

```javascript
try {
  const { content } = await this.store.request(findRecord('blog-post', '1'));
  return content.data;
} catch (error) {
  // error.content is the error document from the server
  console.error(error.content?.errors);
}
```

In a route, you can let the error go up to the router instead.
Ember then shows your [error substate](../../routing/loading-and-error-substates/).
