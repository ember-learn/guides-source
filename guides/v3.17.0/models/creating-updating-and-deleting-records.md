## Creating Records

You can create records by calling the
[`createRecord()`](https://api.emberjs.com/ember-data/3.17/classes/Adapter/methods/createRecord?anchor=createRecord)
method on the store.

```javascript
store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});
```

The store object is available in controllers and routes using `this.store`.

## Updating Records

Making changes to Ember Data records is as simple as setting the attribute you
want to change:

```javascript
this.store.findRecord('post', 1).then(function(post) {
  // ...after the record has loaded
  post.title = 'A new post';
});
```

## Persisting Records

Records in Ember Data are persisted on a per-instance basis.
Call [`save()`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/save?anchor=save)
on any instance of `Model` and it will make a network request.

Ember Data takes care of tracking the state of each record for
you. This allows Ember Data to treat newly created records differently
from existing records when saving.

By default, Ember Data will `POST` newly created records to their type URL.

```javascript
let post = store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});

post.save(); // => POST to '/posts'
```

Records that already exist on the backend are updated using the HTTP `PATCH` verb.

```javascript
store.findRecord('post', 1).then(function(post) {
  post.title; // => "Rails is Omakase"

  post.title = 'A new post';

  post.save(); // => PATCH to '/posts/1'
});
```

You can tell if a record has outstanding changes that have not yet been
saved by checking its
[`hasDirtyAttributes`](https://api.emberjs.com/ember-data/3.17/classes/Model/properties/hasDirtyAttributes?anchor=hasDirtyAttributes)
property. You can also see what parts of
the record were changed and what the original value was using the
[`changedAttributes()`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/changedAttributes?anchor=changedAttributes)
method. `changedAttributes` returns an object, whose keys are the changed
properties and values are an array of values `[oldValue, newValue]`.

```javascript
person.isAdmin; // => false
person.hasDirtyAttributes; // => false
person.isAdmin = true;
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }
```

At this point, you can either persist your changes via `save()` or you can roll
back your changes. Calling
[`rollbackAttributes()`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/rollbackAttributes?anchor=rollbackAttributes)
for a saved record reverts all the `changedAttributes` to their original value.
If the record `isNew` it will be removed from the store.

```javascript
person.hasDirtyAttributes; // => true
person.changedAttributes(); // => { isAdmin: [false, true] }

person.rollbackAttributes();

person.hasDirtyAttributes; // => false
person.isAdmin; // => false
person.changedAttributes(); // => {}
```

## Handling Validation Errors

If the backend server returns validation errors after trying to save, they will
be available on the `errors` property of your model. Here's how you might display
the errors from saving a blog post in your template:

```handlebars
{{#each this.post.errors.title as |error|}}
  <div class="error">{{error.message}}</div>
{{/each}}
{{#each this.post.errors.body as |error|}}
  <div class="error">{{error.message}}</div>
{{/each}}
```

## Promises

[`save()`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/save?anchor=save) returns
a promise, which makes it easy to asynchronously handle success and failure
scenarios. Here's a common pattern:

```javascript
let post = store.createRecord('post', {
  title: 'Rails is Omakase',
  body: 'Lorem ipsum'
});

let self = this;

function transitionToPost(post) {
  self.transitionToRoute('posts.show', post);
}

function failure(reason) {
  // handle the error
}

post
  .save()
  .then(transitionToPost)
  .catch(failure);

// => POST to '/posts'
// => transitioning to posts.show route
```

## Deleting Records

Deleting records is as straightforward as creating records. Call [`deleteRecord()`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/deleteRecord?anchor=deleteRecord)
on any instance of `Model`. This flags the record as `isDeleted`. The
deletion can then be persisted using `save()`. Alternatively, you can use
the [`destroyRecord`](https://api.emberjs.com/ember-data/3.17/classes/Model/methods/destroyRecord?anchor=destroyRecord) method to delete and persist at the same time.

```javascript
let post = store.peekRecord('post', 1);
post.deleteRecord();
post.isDeleted; // => true
post.save(); // => DELETE to /posts/1

// OR
post = store.peekRecord('post', 2);
post.destroyRecord(); // => DELETE to /posts/2
```

<!-- eof - needed for pages that end in a code block  -->
