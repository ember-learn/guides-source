WarpDrive sends every request through a chain of _handlers_.
A handler can change a request before it goes to the server.
It can also change the response before it goes into the cache.

Builders and handlers work together:

- A builder describes one request: its URL, method, headers, and body.
- A handler applies a rule to many requests, such as adding an `Authorization` header.

Handlers and builders replace the adapters of older EmberData versions.

## Configuring URLs

`@warp-drive/utilities/json-api` has general builders that you call inside your own builders.
They follow these URL conventions:

| Action | Builder        | HTTP Verb | URL        |
| ------ | -------------- | --------- | ---------- |
| Find   | `findRecord`   | GET       | /posts/123 |
| Delete | `deleteRecord` | DELETE    | /posts/123 |

The builders pluralize the type to make the path, so the type `post` uses the path `/posts`.

For a list, or to create or update a record, write the request object yourself.
[Finding Records](../finding-records/#toc_retrieving-multiple-records) and
[Creating, Updating and Deleting](../creating-updating-and-deleting-records/#toc_creating-records) show how.
The `buildBaseURL` function from `@warp-drive/utilities` makes the URL.
It uses the same `host` and `namespace` as the general builders.

### Host and Namespace

If your API lives on another domain, or under a path prefix, set the `host` and the `namespace`.
Call `setBuildURLConfig` once, for example in `app/app.js`:

```javascript {data-filename=app/app.js}
import { setBuildURLConfig } from '@warp-drive/utilities/json-api';

setBuildURLConfig({
  host: 'https://api.example.com',
  namespace: 'api/v1',
});
```

Now `findRecord('post', '1')` requests `https://api.example.com/api/v1/posts/1`.
`buildBaseURL({ resourcePath: 'posts' })` returns `https://api.example.com/api/v1/posts`.

### Options for One Request

Each general builder also takes options for one request.
For example, the `resourcePath` option replaces the path that the builder makes from the type:

```javascript {data-filename=app/builders/person.js}
import { findRecord } from '@warp-drive/utilities/json-api';

/** GET /person/:id instead of /people/:id */
export function getPerson(id) {
  return findRecord('person', id, { resourcePath: 'person' });
}
```

The builders also accept the `host` and `namespace` options.
They override the values from `setBuildURLConfig` for that request.

Because the option is in your builder, every part of your app that calls `getPerson` uses the same URL.

## Writing a Handler

A handler is an object with a `request` method.
The method gets a `context` and a `next` function:

- `context.request` is the request object.
- `next(request)` passes a request to the next handler, and returns a promise for the response.

Requests are immutable, so a handler makes a copy when it wants to change something.
This handler adds `.json` to the end of every URL:

```javascript {data-filename=app/handlers/json-suffix.js}
export const JsonSuffixHandler = {
  request(context, next) {
    const { request } = context;
    const updatedRequest = Object.assign({}, request, {
      url: request.url + '.json',
    });

    return next(updatedRequest);
  },
};
```

Add the handler to the `handlers` option of the store:

```javascript {data-filename=app/services/store.js}
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { JsonSuffixHandler } from 'my-app/handlers/json-suffix';
import { PostSchema } from 'my-app/schemas/post';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [JsonSuffixHandler],
  schemas: [PostSchema],
});

export default Store;
```

The handlers run in the order of the array.
After your handlers, the store adds a `Fetch` handler that sends the request to the server.

## Headers Customization

A handler can add headers to every request.
Copy the headers into a new `Headers` object, add yours, and pass on a new request.

### Content Type

JSON:API servers expect the `application/vnd.api+json` media type in the `Accept` and `Content-Type` headers.
The general builders set `Accept`, but they do not set `Content-Type`.
A request object that you write yourself has neither.
Add both headers in one handler, so that no builder can forget them:

```javascript {data-filename=app/handlers/json-api.js}
const JSON_API = 'application/vnd.api+json';

export const JsonApiHandler = {
  request(context, next) {
    const headers = new Headers(context.request.headers);
    headers.set('Accept', JSON_API);
    headers.set('Content-Type', JSON_API);

    return next(Object.assign({}, context.request, { headers }));
  },
};
```

Add `JsonApiHandler` to the `handlers` option of the store.
Your builders then do not need to set these headers.

### Other Headers

Some APIs need extra headers, such as an API key:

```javascript {data-filename=app/handlers/api-key.js}
export const ApiKeyHandler = {
  request(context, next) {
    const headers = new Headers(context.request.headers);
    headers.append('API_KEY', 'secret key');

    return next(Object.assign({}, context.request, { headers }));
  },
};
```

### Handlers That Use Services

Sometimes a header comes from a service, such as the token of a session service.
A handler is not created by Ember, so it does not get services on its own.

Pass a function as the `handlers` option.
The function gets the store, which has an owner.
Give that owner to your handler with `setOwner`:

```javascript {data-filename=app/handlers/auth.js}
import { service } from '@ember/service';

export class AuthHandler {
  @service session;

  request(context, next) {
    const headers = new Headers(context.request.headers);
    headers.append('Authorization', `Bearer ${this.session.accessToken}`);

    return next(Object.assign({}, context.request, { headers }));
  }
}
```

```javascript {data-filename=app/services/store.js}
import { getOwner, setOwner } from '@ember/owner';
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { AuthHandler } from 'my-app/handlers/auth';
import { PostSchema } from 'my-app/schemas/post';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: (store) => {
    const authHandler = new AuthHandler();
    setOwner(authHandler, getOwner(store));
    return [authHandler];
  },
  schemas: [PostSchema],
});

export default Store;
```

The store calls this function once, the first time it sends a request.

To learn more, read [Handlers](https://warp-drive.io/guides/the-manual/requests/handlers)
and the [authentication handler cookbook](https://warp-drive.io/guides/the-manual/cookbook/auth-handlers) in the WarpDrive guides.

## Responses in Other Formats

If your API does not use JSON:API, a handler can convert its responses.
The [Normalizing Responses](../normalizing-responses/) guide shows how.
