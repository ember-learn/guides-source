Along with the records returned from your store, you'll likely need to handle some kind of metadata. _Metadata_ is data that goes along with a specific _model_ or _type_ instead of a record.

Pagination is a common example of using metadata. Imagine a blog with far more posts than you can display at once. You might query it like so:

```javascript
let result = this.store.query('post', {
  limit: 10,
  offset: 0
});
```

To get different _pages_ of data, you'd simply change your offset in increments of 10. So far, so good. But how do you know how many pages of data you have? Your server would need to return the total number of records as a piece of metadata.

Each serializer will expect the metadata to be returned differently. For example, EmberData's JSON deserializer looks for a `meta` key:

```javascript
{
  "post": {
    "id": 1,
    "title": "Progressive Enhancement is Dead",
    "comments": ["1", "2"],
    "links": {
      "user": "/people/tomdale"
    },
    // ...
  },

  "meta": {
    "total": 100
  }
}
```

Regardless of the serializer used, this metadata is extracted from the response. You can then read it with `.meta`.

This can be done on the result of a `store.query()` call:

```javascript
store.query('post').then(result => {
  let meta = result.meta;
});
```

On a belongsTo relationship:

```javascript
let post = store.peekRecord('post', 1);

let author = await post.author;
let meta = author.meta;
```

Or on a hasMany relationship:

```javascript
let post = store.peekRecord('post', 1);

let comments = await post.comments;
let meta = comments.meta;
```

After reading it, `meta.total` can be used to calculate how many pages of posts you'll have.

To use the `meta` data outside of the `model` hook, you need to return it:

```javascript {data-filename=app/routes/users.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class UsersRoute extends Route {
  @service store;
  
  model() {
    return this.store.query('user', {}).then((results) => {
      return {
        users: results,
        meta: results.meta
      };
    });
  }
  setupController(controller, { users, meta }) {
    super.setupController(controller, users);
    controller.meta = meta;
  }
}
```

To customize metadata extraction, check out the documentation for your serializer.
