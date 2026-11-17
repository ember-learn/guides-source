You change data on the server with requests.
WarpDrive puts each response in the cache, and the records in your app update.

To make `store` available, you can [inject the `store` service](../#toc_injecting-the-store).

## Creating Records

To create a record, send a request with the data for the new record.
Write a builder for the request:

```javascript {data-filename=app/builders/post.js}
import { buildBaseURL } from '@warp-drive/utilities';

export function createPost(attributes) {
  return {
    url: buildBaseURL({ resourcePath: 'posts' }),
    method: 'POST',
    body: JSON.stringify({ data: { type: 'post', attributes } }),
    op: 'createRecord',
    cacheOptions: { types: ['post'] },
  };
}
```

`buildBaseURL` makes the URL from the `host` and `namespace` of your app and the `resourcePath`.
The body is a JSON:API document without an `id`, because the server assigns one.

Pass the result of the builder to `store.request()`:

```javascript
import { createPost } from 'my-app/builders/post';

const { content } = await this.store.request(
  createPost({ title: 'Rails is Omakase', body: 'Lorem ipsum' }),
); // => POST to '/posts'

const post = content.data;
post.id; // => the ID from the server
```

The server responds with the saved record, including its new `id`.
WarpDrive puts the response in the cache, and `content.data` is the new record.

The builder does not set the `Content-Type` header.
Most JSON:API servers reject a body without that header.
Add it once for all requests with a handler, as shown in
[Request Handlers](../request-handlers/#toc_content-type).

### Lists After a Create

A list that the store already loaded does not know about the new record.
The `op` and `cacheOptions` of the builder solve this.
After a `createRecord` request succeeds, the store marks every cached request for the type `post` as stale.

A request joins that group when it has the same `cacheOptions.types`:

```javascript {data-filename=app/builders/post.js}
import { query } from '@warp-drive/utilities/json-api';

export function queryPosts(params) {
  const request = query('post', params);
  request.cacheOptions.types = ['post'];
  return request;
}
```

The next time your app requests the list, the store loads it from the server again.

## Updating Records

Records that come from the server are immutable.
If you set a field on one, WarpDrive throws an error.
This keeps the record equal to the data on the server.

To change a record, check out an editable copy with `checkout()`.
`checkout()` returns a promise that resolves with the editable copy:

```javascript
import { checkout } from '@warp-drive/core/reactive';

let post = this.store.peekRecord('post', '1');
let editable = await checkout(post);

editable.title = 'A new post';

post.title; // => 'Rails is Omakase'
editable.title; // => 'A new post'
```

The change only shows on the editable copy.
The original record still shows the data from the server.

## Persisting Changes

To save the change, use the
[`updateRecord`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/updateRecord) builder.
Pass `{ patch: true }` to send a `PATCH` request.
Without it, the builder sends a `PUT` request.

The `serializePatch` function gives you only the fields that changed.
`cacheKeyFor(editable)` returns the key that the cache uses for the record:

```javascript
import { cacheKeyFor } from '@warp-drive/core';
import { serializePatch, updateRecord } from '@warp-drive/utilities/json-api';

const request = updateRecord(editable, { patch: true });
request.body = JSON.stringify(
  serializePatch(this.store.cache, cacheKeyFor(editable)),
);

await this.store.request(request); // => PATCH to '/posts/1'
```

The server responds with the updated record.
WarpDrive puts the response in the cache.
When the cache has the same values as the editable copy, WarpDrive commits the changes.
Now `post.title` is `'A new post'` too.

### Editing in a Form

Bind the form to the editable copy.
Do not copy record fields into `@tracked` properties: the editable copy already holds the form state.

This route loads the post and checks it out:

```javascript {data-filename=app/routes/posts/edit.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { checkout } from '@warp-drive/core/reactive';
import { findRecord } from '@warp-drive/utilities/json-api';

export default class PostsEditRoute extends Route {
  @service store;

  async model(params) {
    const { content } = await this.store.request(
      findRecord('post', params.post_id),
    );
    return checkout(content.data);
  }
}
```

The component reads the form data on submit, writes it to the copy, and saves the copy:

```gjs {data-filename=app/components/edit-post.gjs}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { cacheKeyFor } from '@warp-drive/core';
import { serializePatch, updateRecord } from '@warp-drive/utilities/json-api';

export default class EditPost extends Component {
  @service store;
  @service router;

  save = async (event) => {
    event.preventDefault();

    const post = this.args.post;
    const formData = new FormData(event.target);
    post.title = formData.get('title');

    const request = updateRecord(post, { patch: true });
    request.body = JSON.stringify(
      serializePatch(this.store.cache, cacheKeyFor(post)),
    );

    await this.store.request(request);
    this.router.transitionTo('posts.show', post.id);
  };

  <template>
    <form {{on "submit" this.save}}>
      <label>
        Title
        <input name="title" value={{@post.title}} />
      </label>
      <button type="submit">Save</button>
    </form>
  </template>
}
```

The route passes the editable copy to the component as `@post`.

### Discarding Changes

You can check if an editable copy has changes that you have not saved yet:

```javascript
this.store.cache.hasChangedAttrs(cacheKeyFor(editable)); // => true
this.store.cache.changedAttrs(cacheKeyFor(editable)); // => { title: ['Rails is Omakase', 'A new post'] }
```

`changedAttrs` returns an object.
Each key is a changed field, and each value is an array of `[oldValue, newValue]`.

To discard the changes, roll them back in the cache:

```javascript
this.store.cache.rollbackAttrs(cacheKeyFor(editable));

editable.title; // => 'Rails is Omakase'
```

## Handling Validation Errors

If the server rejects the change, the promise from `store.request()` rejects.
The error has a `content` property with the body of the response.
For a JSON:API server, `error.content.errors` is the list of errors:

```javascript
try {
  await this.store.request(request);
} catch (error) {
  const errors = error.content?.errors ?? [];
  // show the errors to the user
}
```

Each error in the list has a `detail` message.
It can also have a `source.pointer` that names the field, such as `/data/attributes/title`.
You can show the messages next to the matching inputs.

The editable copy keeps the changes, so the user can fix them and try again.

## Deleting Records

To delete a record, send a request from the
[`deleteRecord`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/deleteRecord) builder:

```javascript
import { deleteRecord } from '@warp-drive/utilities/json-api';

let post = this.store.peekRecord('post', '1');

await this.store.request(deleteRecord(post)); // => DELETE to '/posts/1'
```

The request tells the cache which record it deletes.
After the server confirms the delete, WarpDrive removes the record from the cache
and from every list that holds it.
If the request fails, the record stays as it was.
