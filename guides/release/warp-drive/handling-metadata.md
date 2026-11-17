Along with records, a response can carry _metadata_.
Metadata is data about the response itself, not about one record.

Pagination is a common example.
Imagine a blog with far more posts than you can show at once.
You might query it like this:

```javascript
import { query } from '@warp-drive/utilities/json-api';

// GET /posts?limit=10&offset=0
const { content } = await this.store.request(
  query('post', { limit: 10, offset: 0 }),
);
```

To get the next page, you change the offset by 10.
But how do you know how many pages there are?
Your server needs to return the total number of posts as metadata.

In JSON:API, metadata goes in the top-level `meta` member of the response:

```json
{
  "data": [
    {
      "type": "post",
      "id": "1",
      "attributes": { "title": "Progressive Enhancement is Dead" }
    }
  ],
  "meta": {
    "total": 100
  },
  "links": {
    "next": "/posts?limit=10&offset=10"
  }
}
```

### Reading Metadata

`content` is the response document.
Besides `data`, it has the `meta` and `links` of the response:

```javascript
const { content } = await this.store.request(
  query('post', { limit: 10, offset: 0 }),
);

content.data; // => an array of post records
content.meta.total; // => 100
content.links.next; // => '/posts?limit=10&offset=10'
```

You can use `meta.total` to compute how many pages of posts there are.

To use the metadata in a template, return the whole document from the `model` hook instead of only `content.data`:

```javascript {data-filename=app/routes/posts.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { query } from '@warp-drive/utilities/json-api';

export default class PostsRoute extends Route {
  @service store;

  async model() {
    const { content } = await this.store.request(
      query('post', { limit: 10, offset: 0 }),
    );
    return content;
  }
}
```

```gjs {data-filename=app/templates/posts.gjs}
<template>
  <p>Showing {{@model.data.length}} of {{@model.meta.total}} posts</p>

  <ul>
    {{#each @model.data as |post|}}
      <li>{{post.title}}</li>
    {{/each}}
  </ul>
</template>
```

### Following Pagination Links

If the response has pagination links, the document can request the other pages for you.
`content.next()` requests the page that `links.next` points to:

```javascript
const nextPage = await content.next();

nextPage.data; // => the next 10 posts
```

`next()` resolves with `null` if there is no next link.
The document also has `prev()`, `first()`, and `last()`.

### Metadata on Relationships

A relationship can have its own `meta` and `links`, too.
For a `hasMany`, you read them on the relationship:

```javascript
let post = this.store.peekRecord('post', '1');

post.comments.meta; // => the meta of the comments relationship
post.comments.links; // => the links of the comments relationship
```

If your server puts metadata somewhere else in the response, a [handler](../normalizing-responses/) can move it into `meta`.
