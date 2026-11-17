You change data on the server with requests.
WarpDrive puts each response in the cache, and the records in your app update.

To make `store` available, you can [inject the `store` service](../#toc_injecting-the-store).

## Creating Records

To create a record, send a request with the data for the new record.
Write a builder for the request:

```javascript {data-filename=app/builders/post.js}
import { buildBaseURL } from '@warp-drive/utilities';

/** POST /posts */
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

The body is a JSON:API document without an `id`, because the server assigns one.

Most JSON:API servers reject a body without the `Content-Type` header.
The builder does not set it.
The `JsonApiHandler` from [Request Handlers](../request-handlers/#toc_content-type)
adds the header to every request, so add that handler to your store first.

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

### Lists After a Create

A list that the store already loaded does not know about the new record.
The `op` and `cacheOptions` of the builder solve this.
After a `createRecord` request succeeds, the store marks every list that is registered for the type `post` as stale.

A list is registered when its builder has the same `cacheOptions.types`, as shown in
[Finding Records](../finding-records/#toc_retrieving-multiple-records).
A list on screen loads again when its `<Request>` component has `@autorefresh`, as shown in
[Rendering a Request](../finding-records/#toc_rendering-a-request).

The form that creates the post does not need to know which lists exist.

## Updating Records

Records that come from the server are immutable.
If you set a field on one, WarpDrive throws an error.
This keeps the record equal to the data on the server.

To change a record, check out an editable copy with `checkout()`.
`checkout()` returns a promise that resolves with the editable copy:

```javascript
import { checkout } from '@warp-drive/core/reactive';

let editable = await checkout(post);

editable.title = 'A new post';

post.title; // => 'Rails is Omakase'
editable.title; // => 'A new post'
```

The change only shows on the editable copy.
The original record, and every other part of your app, still shows the data from the server.

## Persisting Changes

To save a change, write a builder for a `PATCH` request.
The builder takes the record and the attributes to save:

```javascript {data-filename=app/builders/post.js}
import { recordIdentifierFor } from '@warp-drive/core';
import { buildBaseURL } from '@warp-drive/utilities';

/** PATCH /posts/:id */
export function updatePost(post, attributes) {
  return {
    url: buildBaseURL({
      op: 'updateRecord',
      identifier: { type: 'post', id: post.id },
      resourcePath: 'posts',
    }),
    method: 'PATCH',
    body: JSON.stringify({
      data: { type: 'post', id: post.id, attributes },
    }),
    op: 'updateRecord',
    records: [recordIdentifierFor(post)],
  };
}
```

The body holds only the attributes that you pass, so the request sends only what changed.

`recordIdentifierFor(post)` returns the key that the cache uses for the record.
The `op` and `records` properties tell the cache which record the request saves.

```javascript
import { updatePost } from 'my-app/builders/post';

await this.store.request(
  updatePost(editable, { title: editable.title }),
); // => PATCH to '/posts/1'
```

The server responds with the updated record.
WarpDrive puts the response in the cache, and the editable copy has no unsaved changes.
Now `post.title` is `'A new post'` too, in every list and component that shows the post.

### Editing in a Form

Bind the form to the editable copy.
Do not copy record fields into `@tracked` properties: the editable copy already holds the form state.

This route loads the post and checks it out.
`getPost` is a builder that calls `findRecord('post', id)`:

```javascript {data-filename=app/routes/posts/edit.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { checkout } from '@warp-drive/core/reactive';
import { getPost } from 'my-app/builders/post';

export default class PostsEditRoute extends Route {
  @service store;

  async model(params) {
    const { content } = await this.store.request(getPost(params.post_id));
    return checkout(content.data);
  }
}
```

The component writes each change to the copy, and saves the copy on submit:

```gjs {data-filename=app/components/edit-post.gjs}
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { on } from '@ember/modifier';
import { updatePost } from 'my-app/builders/post';

export default class EditPost extends Component {
  @service store;
  @service router;

  setTitle = (event) => {
    this.args.post.title = event.target.value;
  };

  save = async (event) => {
    event.preventDefault();

    const post = this.args.post;
    await this.store.request(updatePost(post, { title: post.title }));

    this.router.transitionTo('posts.show', post.id);
  };

  <template>
    <form {{on "submit" this.save}}>
      <label>
        Title
        <input value={{@post.title}} {{on "input" this.setTitle}} />
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
import { recordIdentifierFor } from '@warp-drive/core';

const key = recordIdentifierFor(editable);

this.store.cache.hasChangedAttrs(key); // => true
this.store.cache.changedAttrs(key); // => { title: ['Rails is Omakase', 'A new post'] }
```

`changedAttrs` returns an object.
Each key is a changed field, and each value is an array of `[oldValue, newValue]`.

To discard the changes, roll them back in the cache:

```javascript
this.store.cache.rollbackAttrs(key);

editable.title; // => 'Rails is Omakase'
```

### Lists After an Update

Every list that holds the record shows the saved change.
But the cache does not know what the filter of a list means.
If the change moves the record into or out of a filtered list, that list does not change on its own.

You can load the list again, or you can change the cached list yourself.
[Patching The Cache](https://warp-drive.io/guides/the-manual/mutations/operations) in the WarpDrive guides shows both.

## Handling Validation Errors

If the server rejects the change, the promise from `store.request()` rejects.
The error has a `content` property with the body of the response.
For a JSON:API server, `error.content.errors` is the list of errors:

```javascript
try {
  await this.store.request(updatePost(post, { title: post.title }));
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

To delete a record, send a request from a builder that calls
[`deleteRecord`](https://warp-drive.io/api/@warp-drive/utilities/json-api/functions/deleteRecord):

```javascript {data-filename=app/builders/post.js}
import { deleteRecord } from '@warp-drive/utilities/json-api';

/** DELETE /posts/:id */
export function deletePost(post) {
  return deleteRecord(post);
}
```

```javascript
import { deletePost } from 'my-app/builders/post';

await this.store.request(deletePost(post)); // => DELETE to '/posts/1'
```

The request tells the cache which record it deletes.
After the server confirms the delete, WarpDrive removes the record from the cache
and from every list that holds it.
If the request fails, the record stays as it was.
