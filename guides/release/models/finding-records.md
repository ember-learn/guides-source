The EmberData store provides an interface for retrieving records of a single type.

### Retrieving a Single Record

Use [`findRecord()`](https://api.emberjs.com/ember-data/5.3/functions/@ember-data%2Fjson-api%2Frequest/findRecord) to retrieve a record by its type and ID.
This will return a response from the server which has a requested record:

```javascript
// GET /blog-post/1
import { service } from '@ember/service';
import { findRecord } from '@ember-data/json-api/request';

// somewhere in the app
const result = await this.store.request(findRecord('blog-post', '1'));
const blogPost = result.content.data;
```

Use [`store.peekRecord()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekRecord?anchor=peekRecord) to retrieve a record by its type and ID, without making a network request.
This will return the record only if it is already present in the store:

```javascript
let blogPost = this.store.peekRecord('blog-post', 1); // => no network request
```

### Retrieving Multiple Records

Use [`query()`](https://api.emberjs.com/ember-data/5.3/functions/@ember-data%2Fjson-api%2Frequest/query) to retrieve all of the records for a given type:

```javascript
// GET /blog-posts
import { query } from '@ember-data/json-api/request';

const result = await store.request(query('blog-post'));
const blogPosts = result.content.data;
```

Use [`store.peekAll()`](https://api.emberjs.com/ember-data/release/classes/Store/methods/peekAll?anchor=peekAll) to retrieve all of the records for a given type that are already loaded into the store, without making a network request:

```javascript
let blogPosts = this.store.peekAll('blog-post'); // => no network request
```

`findRecord()` returns a `PromiseArray` that fulfills to a `RecordArray` and `store.peekAll` directly returns a `RecordArray`.

It's important to note that `RecordArray` is not a JavaScript array, it's an object that implements [`MutableArray`](https://api.emberjs.com/ember/release/classes/MutableArray).
This is important because, for example, if you want to retrieve records by index,
the `[]` notation will not work--you'll have to use `objectAt(index)` instead.

### Querying for Multiple Records

EmberData provides the ability to query for records that meet certain criteria.
Calling [`query()`](https://api.emberjs.com/ember-data/5.3/functions/@ember-data%2Fjson-api%2Frequest/query) will make a `GET` request with the passed object serialized as query params.
This method returns a respone from the server in the same way as `findRecord`.

For example, we could search for all `person` models who have the name of
`Peter`:

```javascript
// GET to /persons?filter[name]=Peter
import { query } from '@ember-data/json-api/request';

const result = await store.request(query('person', {
  filter: {
    name: 'Peter'
  }
}));
const person = result.content.data;
```

### Querying for A Single Record

If you are using an builder that supports server requests capable of returning a single model object,
EmberData provides a convenience method [`findRecord()`](https://api.emberjs.com/ember-data/5.3/functions/@ember-data%2Fjson-api%2Frequest/findRecord) that will return a record.
The request is made via a method `findRecord()` defined by the builders.

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

And if the builders for the `User` model defines a `queryData()` method that targets that endpoint:

```javascript {data-filename=app/builders/user.js}
export function queryData() {
    return {
        url: `/api/current_user`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }
}
```

Then, calling `queryData()` will retrieve that object from the server:

```javascript
import { queryData } from './builders';

const user = await this.requestManager.request(queryData())
let username = user.get('username');
console.log(`Currently logged in as ${username}`);
```

As in the case of `query()`, a query object can also be passed to `query()` and is available for the builder's `query()` to use to qualify the request.
However the builder must return a single model object, not an array containing one element,
otherwise EmberData will throw an exception.

If your server API or your builder only provides array responses but you wish to retrieve just a single record, you can alternatively use the `query()` method as follows:

```javascript
// GET to /users?filter[email]=tomster@example.com
tom = requestManager.request(queryData('user', {
  filter: {
    email: 'tomster@example.com'
  }
})).then(function(users) {
  return users[0]; // the first object
});
```

<!-- eof - needed for pages that end in a code block  -->
