The EmberData store provides an interface for retrieving records of a single type.

### Retrieving a Single Record

Use [`store.findRecord()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/findRecord?anchor=findRecord) to retrieve a record by its type and ID.
This will return a promise that fulfills with the requested record:

```javascript
// GET /blog-posts/1
this.store.findRecord('blog-post', 1)  // => GET /blog-posts/1
  .then(function(blogPost) {
      // Do something with `blogPost`
  });
```

Use [`store.peekRecord()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/peekRecord?anchor=peekRecord) to retrieve a record by its type and ID, without making a network request.
This will return the record only if it is already present in the store:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1); // => no network request
```

### Retrieving Multiple Records

Use [`store.findAll()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/findAll?anchor=findAll) to retrieve all of the records for a given type:

```javascript
// GET /blog-posts
this.store.findAll('blog-post') // => GET /blog-posts
  .then(function(blogPosts) {
    // Do something with `blogPosts`
  });
```

Use [`store.peekAll()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/peekAll?anchor=peekAll) to retrieve all of the records for a given type that are already loaded into the store, without making a network request:

```javascript
let blogPosts = this.store.peekAll('blog-post'); // => no network request
```

`store.findAll()` returns a `PromiseArray` that fulfills to a `RecordArray` and `store.peekAll` directly returns a `RecordArray`.

It's important to note that `RecordArray` is not a JavaScript array, it's an object that implements [`MutableArray`](https://api.emberjs.com/ember/6.0.0/classes/MutableArray).
This is important because, for example, if you want to retrieve records by index,
the `[]` notation will not work--you'll have to use `objectAt(index)` instead.

### Querying for Multiple Records

EmberData provides the ability to query for records that meet certain criteria.
Calling [`store.query()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/query?anchor=query) will make a `GET` request with the passed object serialized as query params.
This method returns a `PromiseArray` in the same way as `findAll`.

For example, we could search for all `person` models who have the name of
`Peter`:

```javascript
// GET to /persons?filter[name]=Peter
this.store.query('person', {
  filter: {
    name: 'Peter'
  }
}).then(function(peters) {
  // Do something with `peters`
});
```

### Querying for A Single Record

If you are using an adapter that supports server requests capable of returning a single model object,
EmberData provides a convenience method [`store.queryRecord()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/queryRecord?anchor=queryRecord) that will return a promise that resolves with that single record.
The request is made via a method `queryRecord()` defined by the adapter.

For example, if your server API provides an endpoint for the currently logged in user:

```text
// GET /api/current_user
{
  user: {
    id: 1234,
    username: 'admin'
  }
}
```

And if the adapter for the `User` model defines a `queryRecord()` method that targets that endpoint:

```javascript {data-filename=app/adapters/user.js}
import Adapter from '@ember-data/adapter';
import fetch from 'fetch';

export default class UserAdapter extends Adapter {
  queryRecord(store, type, query) {
    return fetch('/api/current_user');
  }
}
```

Then, calling [`store.queryRecord()`](https://api.emberjs.com/ember-data/5.3.0/classes/Store/methods/queryRecord?anchor=queryRecord) will retrieve that object from the server:

```javascript
store.queryRecord('user', {}).then(function(user) {
  let username = user.get('username');
  console.log(`Currently logged in as ${username}`);
});
```

As in the case of `store.query()`, a query object can also be passed to `store.queryRecord()` and is available for the adapter's `queryRecord()` to use to qualify the request.
However the adapter must return a single model object, not an array containing one element,
otherwise EmberData will throw an exception.

Note that Ember's default [JSON:API adapter](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPIAdapter) does not provide the functionality needed to support `queryRecord()` directly as it relies on REST request definitions that return result data in the form of an array.

If your server API or your adapter only provides array responses but you wish to retrieve just a single record, you can alternatively use the `query()` method as follows:

```javascript
// GET to /users?filter[email]=tomster@example.com
tom = store.query('user', {
  filter: {
    email: 'tomster@example.com'
  }
}).then(function(users) {
  return users[0]; // the first object
});
```

<!-- eof - needed for pages that end in a code block  -->
