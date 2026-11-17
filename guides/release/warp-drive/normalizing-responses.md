The WarpDrive cache in new Ember apps, `JSONAPICache`, stores data in the
[JSON:API](https://jsonapi.org/) format.
If your server speaks JSON:API, you do not need to change anything.

If your server uses another format, you convert its responses in a handler.
You also decide the format of the data you send, in your builders.
Handlers and builders replace the serializers of older EmberData versions.

## JSON:API Documents

The cache expects a JSON:API document.
Here is a response with one record:

```json
{
  "data": {
    "type": "person",
    "id": "1",
    "attributes": {
      "firstName": "Jeff",
      "lastName": "Atwood"
    }
  }
}
```

The cache uses these rules:

- `type` is the type of a schema, such as `person`.
- `id` is a string.
- The keys in `attributes` are the field names of the schema, or the `sourceKey` of a field.
- Relationships go in `relationships`, as shown in the [Relationships](../relationships/) guide.

### Sideloaded Data

A response can contain records that are not the main data.
Put them in the top-level `included` array:

```json
{
  "data": {
    "type": "article",
    "id": "1",
    "attributes": { "title": "JSON:API paints my bikeshed!" },
    "relationships": {
      "comments": {
        "data": [{ "type": "comment", "id": "5" }]
      }
    }
  },
  "included": [
    {
      "type": "comment",
      "id": "5",
      "attributes": { "body": "First!" }
    }
  ]
}
```

The cache stores every record in `included`.
Later requests can use them without asking the server again.

## Small Differences

Some differences do not need a handler.

### Attribute Names

If the server uses other names for fields, such as `first_name`, use `sourceKey` in the schema.
The [Defining Schemas](../schemas/#toc_different-field-names) guide shows how.

### Value Types

If the server sends values in another type, such as dates as strings, use a transformation.
The [Defining Schemas](../schemas/#toc_transformations) guide shows how.

## Normalizing Responses in a Handler

If your server does not use JSON:API, write a handler that converts each response.
The handler calls `next()`, waits for the response, and returns the converted document.
The cache then stores the converted document.

Imagine your server returns a list of users like this:

```json
{
  "users": [
    { "id": 1, "first_name": "Chris", "last_name": "Thoburn" },
    { "id": 2, "first_name": "Krystan", "last_name": "HuffMenne" }
  ]
}
```

This handler converts it into JSON:API:

```javascript {data-filename=app/handlers/normalize-response.js}
import { dasherize, singularize } from '@warp-drive/utilities/string';

export const NormalizeResponseHandler = {
  async request(context, next) {
    const { content } = await next(context.request);
    return normalizeResponse(content);
  },
};

function normalizeResponse(content) {
  const data = [];

  for (const key of Object.keys(content)) {
    const type = dasherize(singularize(key));

    for (const rawResource of content[key]) {
      const { id, ...attributes } = rawResource;
      data.push({ type, id: String(id), attributes });
    }
  }

  return { data };
}
```

The result looks like this:

```json
{
  "data": [
    {
      "type": "user",
      "id": "1",
      "attributes": { "first_name": "Chris", "last_name": "Thoburn" }
    },
    {
      "type": "user",
      "id": "2",
      "attributes": { "first_name": "Krystan", "last_name": "HuffMenne" }
    }
  ]
}
```

The attribute names are still `first_name` and `last_name`.
The `user` schema can map them to `firstName` and `lastName` with `sourceKey`.

Add the handler to the `handlers` option of the store, as shown in the
[Request Handlers](../request-handlers/#toc_writing-a-handler) guide.

### Handlers for Some Requests

A handler runs for every request.
If only some endpoints need a conversion, check the request first.
When the handler does not apply, it returns `next(context.request)` without changes:

```javascript {data-filename=app/handlers/normalize-response.js}
export const NormalizeResponseHandler = {
  async request(context, next) {
    if (!context.request.url.includes('/legacy-api/')) {
      return next(context.request);
    }

    const { content } = await next(context.request);
    return normalizeResponse(content);
  },
};
```

## Request Bodies

Your builders make the body of each request, so you control exactly what goes to the server.
The [Creating, Updating and Deleting](../creating-updating-and-deleting-records/#toc_persisting-changes) guide
shows builders that send JSON:API documents.

If your server expects another format, make that format in the builder.
For example, this builder sends the changed attributes under a `user` key:

```javascript {data-filename=app/builders/user.js}
import { recordIdentifierFor } from '@warp-drive/core';
import { buildBaseURL } from '@warp-drive/utilities';

/** PATCH /users/:id */
export function updateUser(user, attributes) {
  return {
    url: buildBaseURL({
      op: 'updateRecord',
      identifier: { type: 'user', id: user.id },
      resourcePath: 'users',
    }),
    method: 'PATCH',
    body: JSON.stringify({ user: attributes }),
    op: 'updateRecord',
    records: [recordIdentifierFor(user)],
  };
}
```

The handler that converts the responses of your server also converts the response to this request.

To learn more, read [Handlers](https://warp-drive.io/guides/the-manual/requests/handlers)
and [Builders](https://warp-drive.io/guides/the-manual/requests/builders) in the WarpDrive guides.
