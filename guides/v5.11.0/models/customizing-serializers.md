In EmberData, serializers format the data sent to and received from
the backend store. By default, EmberData serializes data using the
[JSON:API](http://jsonapi.org/) format. If your backend uses a different
format, EmberData allows you to customize the serializer or use a
different serializer entirely.

EmberData ships with 3 serializers. The
[`JSONAPISerializer`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer)
is the default serializer and works with JSON:API backends. The
[`JSONSerializer`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONSerializer)
is a simple serializer for working with single JSON object or arrays of records. The
[`RESTSerializer`](https://api.emberjs.com/ember-data/5.3.0/classes/RESTSerializer)
is a more complex serializer that supports sideloading and was the default
serializer before 2.0.

## JSONAPISerializer Conventions

When requesting a record, the `JSONAPISerializer` expects your server
to return a JSON representation of the record that conforms to the
following conventions.


### JSON:API Document

The `JSONAPISerializer` expects the backend to return a JSON:API
Document that follows the JSON:API specification and the conventions
of the examples found in the [JSON:API spec](http://jsonapi.org/format/). This means all
type names should be pluralized and attribute and relationship names
should be dash-cased. For example, if you request a record from
`/people/123`, the response should look like this:

```json
{
  "data": {
    "type": "people",
    "id": "123",
    "attributes": {
      "given-name": "Jeff",
      "family-name": "Atwood"
    }
  }
}
```

A response that contains multiple records may have an array in its
`data` property.

```json
{
  "data": [{
    "type": "people",
    "id": "123",
    "attributes": {
      "given-name": "Jeff",
      "family-name": "Atwood"
    }
  }, {
    "type": "people",
    "id": "124",
    "attributes": {
      "given-name": "Yehuda",
      "family-name": "Katz"
    }
  }]
}
```

### Sideloaded Data

Data that is not a part of the primary request but includes linked
relationships should be placed in an array under the `included`
key. For example, if you request `/articles/1` and the backend also
returned any comments associated with that person the response
should look like this:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "links": {
      "self": "http://example.com/articles/1"
    },
    "relationships": {
      "comments": {
        "data": [
          { "type": "comments", "id": "5" },
          { "type": "comments", "id": "12" }
        ]
      }
    }
  },
  "included": [{
    "type": "comments",
    "id": "5",
    "attributes": {
      "body": "First!"
    },
    "links": {
      "self": "http://example.com/comments/5"
    }
  }, {
    "type": "comments",
    "id": "12",
    "attributes": {
      "body": "I like XML better"
    },
    "links": {
      "self": "http://example.com/comments/12"
    }
  }]
}
```

## Customizing Serializers

EmberData uses the `JSONAPISerializer` by default, but you can
override this default by defining a custom serializer. There are two
ways to define a custom serializer. First, you can define a custom
serializer for your entire application by defining an "application"
serializer.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
}
```

You can also define a serializer for a specific model. For example, if
you had a `post` model you could also define a `post` serializer:

```javascript {data-filename=app/serializers/post.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PostSerializer extends JSONAPISerializer {
}
```

To change the format of the data that is sent to the backend store, you can use
the [`serialize()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/serialize?anchor=serialize)
hook. Let's say that we have this JSON:API response from EmberData:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "amount": 100,
      "currency": "SEK"
    }
  }
}
```

But our server expects data in this format:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "cost": {
        "amount": 100,
        "currency": "SEK"
      }
    }
  }
}
```

Here's how you can change the data:

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  serialize(snapshot, options) {
    let json = super.serialize(...arguments);

    json.data.attributes.cost = {
      amount: json.data.attributes.amount,
      currency: json.data.attributes.currency
    };

    delete json.data.attributes.amount;
    delete json.data.attributes.currency;

    return json;
  }
}
```

Similarly, if your backend store provides data in a format other than JSON:API,
you can use the
[`normalizeResponse()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/normalizeResponse?anchor=normalizeResponse)
hook. Using the same example as above, if the server provides data that looks
like:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "cost": {
        "amount": 100,
        "currency": "SEK"
      }
    }
  }
}
```

And we need to change it to look like this:

```json
{
  "data": {
    "id": "1",
    "type": "product",
    "attributes": {
      "name": "My Product",
      "amount": 100,
      "currency": "SEK"
    }
  }
}
```

Here's how we could do it:

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  normalizeResponse(store, primaryModelClass, payload, id, requestType) {
    payload.data.attributes.amount = payload.data.attributes.cost.amount;
    payload.data.attributes.currency = payload.data.attributes.cost.currency;

    delete payload.data.attributes.cost;

    return super.normalizeResponse(...arguments);
  }
}
```

To normalize only a single model, you can use the
[`normalize()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/normalize?anchor=normalize)
hook similarly.

For more hooks to customize the serializer with, see the [EmberData serializer
API documentation](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer).

### IDs

In order to keep track of unique records in the store EmberData
expects every record to have an `id` property in the payload. Ids
should be unique for every unique record of a specific type. If your
backend uses a key other than `id` you can use the
serializer's `primaryKey` property to correctly transform the id
property to `id` when serializing and deserializing data.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  primaryKey = '_id';
}
```

### Attribute Names

In EmberData the convention is to camelize attribute names on a
model. For example:

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') givenName;
  @attr('string') familyName;
  @attr('boolean') isPersonOfTheYear;
}
```

However, the `JSONAPISerializer` expects attributes to be dasherized
in the document payload returned by your server:

```json
{
  "data": {
    "id": "44",
    "type": "people",
    "attributes": {
      "given-name": "Zaphod",
      "family-name": "Beeblebrox",
      "is-person-of-the-year": true
    }
  }
}
```

If the attributes returned by your server use a different convention
you can use the serializer's
[`keyForAttribute()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/keyForAttribute?anchor=keyForAttribute)
method to convert an attribute name in your model to a key in your JSON
payload. For example, if your backend returned attributes that are
`under_scored` instead of `dash-cased` you could override the `keyForAttribute`
method like this.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForAttribute(attr) {
    return attr.replace(/_/g, '-'); // blog_post_comment becomes blog-post-comment 
  }
}
```

Irregular keys can be mapped with a custom serializer. The `attrs`
object can be used to declare a simple mapping between property names
on `Model` records and payload keys in the serialized JSON object
representing the record. An object with the property key can also be
used to designate the attribute's key on the response payload.


If the JSON for `person` has a key of `familyNameOfPerson`, and the
desired attribute name is simply `familyName`, then create a custom
Serializer for the model and override the `attrs` property.

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') familyName;
}
```

```javascript {data-filename=app/serializers/person.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class PersonSerializer extends JSONAPISerializer {
  attrs = {
    familyName: 'familyNameOfPerson'
  };
}
```

### Relationships

References to other records should be done by ID. For example, if you
have a model with a `hasMany` relationship:

```javascript {data-filename=app/models/post.js}
import Model, { hasMany } from '@ember-data/model';

export default class PostModel extends Model {
  @hasMany('comment', { async: true }) comments;
}
```

The JSON should encode the relationship as an array of IDs and types:

```json
{
  "data": {
    "type": "posts",
    "id": "1",
    "relationships": {
      "comments": {
        "data": [
          { "type": "comments", "id": "1" },
          { "type": "comments", "id": "2" },
          { "type": "comments", "id": "3" }
        ]
      }
    }
  }
}
```

`Comments` for a `post` can be loaded by `post.get('comments')`. The
JSON:API adapter will send 3 `GET` requests to `/comments/1/`,
`/comments/2/` and `/comments/3/`.

Any `belongsTo` relationships in the JSON representation should be the
dasherized version of the property's name. For example, if you have
a model:

```javascript {data-filename=app/models/comment.js}
import Model, { belongsTo } from '@ember-data/model';

export default class CommentModel extends Model {
  @belongsTo('post') originalPost
}
```

The JSON should encode the relationship as an ID to another record:

```json
{
  "data": {
    "type": "comment",
    "id": "1",
    "relationships": {
      "original-post": {
        "data": { "type": "post", "id": "5" },
      }
    }
  }
}
```
If needed these naming conventions can be overwritten by implementing
the
[`keyForRelationship()`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPISerializer/methods/keyForRelationship?anchor=keyForRelationship)
method.

```javascript {data-filename=app/serializers/application.js}
import JSONAPISerializer from '@ember-data/serializer/json-api';

export default class ApplicationSerializer extends JSONAPISerializer {
  keyForRelationship(key, relationship) {
    return key + 'Ids';
  }
}
```


## Creating Custom Transformations

In some circumstances, the built-in attribute types of `string`,
`number`, `boolean`, and `date` may be inadequate. For example, a
server may return a non-standard date format.

EmberData can have new JSON transforms
registered for use as attributes:

```javascript {data-filename=app/transforms/coordinate-point.js}
import Transform from '@ember-data/serializer/transform';
import EmberObject from '@ember/object';

export default class CoordinatePointTransform extends Transform {
  serialize(value) {
    return [value.get('x'), value.get('y')];
  }
  deserialize(value) {
    return EmberObject.create({ x: value[0], y: value[1] });
  }
}
```

```javascript {data-filename=app/models/cursor.js}
import Model, { attr } from '@ember-data/model';

export default class Cursor extends Model {
  @attr('coordinate-point') position;
}
```

When `coordinatePoint` is received from the API, it is
expected to be an array:

```json
{
  cursor: {
    position: [4,9]
  }
}
```

But once loaded on a model instance, it will behave as an object:

```javascript
let cursor = store.findRecord('cursor', 1);
cursor.get('position.x'); //=> 4
cursor.get('position.y'); //=> 9
```

If `position` is modified and saved, it will pass through the
`serialize` function in the transform and again be presented as
an array in JSON.

## JSONSerializer

Not all APIs follow the conventions that the `JSONAPISerializer` uses
with a data namespace and sideloaded relationship records. Some
legacy APIs may return a simple JSON payload that is just the requested
resource or an array of serialized records. The `JSONSerializer` is a
serializer that ships with EmberData that can be used alongside the
`RESTAdapter` to serialize these simpler APIs.

To use it in your application you will need to define a
`serializer:application` that extends the `JSONSerializer`.

```javascript {data-filename=app/serializers/application.js}
import JSONSerializer from '@ember-data/serializer/json';

export default class ApplicationSerializer extends JSONSerializer {
  // ...
}
```

For requests that are only expected to return 1 record
(e.g. `store.findRecord('post', 1)`) the `JSONSerializer` expects the response
to be a JSON object that looks similar to this:

```json
{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "comments": ["1", "2"]
}
```

For requests that are only expected to return 0 or more records
(e.g. `store.findAll('post')` or `store.query('post', { filter: { status: 'draft' } })`)
the `JSONSerializer` expects the response to be a JSON array that
looks similar to this:

```json
[{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "comments": ["1", "2"]
}, {
  "id": "2",
  "title": "I'm Running to Reform the W3C's Tag",
  "tag": "w3c",
  "comments": ["3"]
}]
```

The `JSONAPISerializer` is built on top of the `JSONSerializer` so they share
many of the same hooks for customizing the behavior of the
serialization process. Be sure to check out the
[API docs](https://api.emberjs.com/ember-data/5.3.0/classes/JSONSerializer)
for a full list of methods and properties.


## EmbeddedRecordMixin

Although EmberData encourages you to sideload your relationships,
sometimes when working with legacy APIs you may discover you need to
deal with JSON that contains relationships embedded inside other
records. The `EmbeddedRecordsMixin` is meant to help with this problem.

To set up embedded records, include the mixin when extending a
serializer then define and configure embedded relationships.

For example, if your `post` model contained an embedded `author` record
that looks similar to this:


```json
{
  "id": "1",
  "title": "Rails is omakase",
  "tag": "rails",
  "authors": [
    {
      "id": "2",
      "name": "Steve"
    }
  ]
}
```

You would define your relationship like this:

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    authors: {
      serialize: 'records',
      deserialize: 'records'
    }
  };
}
```

If you find yourself needing to both serialize and deserialize the
embedded relationship you can use the shorthand option of `{ embedded:
'always' }`. The example above could therefore be expressed as such:

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    authors: { embedded: 'always' }
  };
}
```


The `serialize` and `deserialize` keys support 3 values:

* `records` is used to signal that the entire record is expected
* `ids` is used to signal that only the id of the record is expected
* `false` is used to signal that the record is not expected

For example you may find that you want to read an embedded record when
extracting a JSON payload but only include the relationship's id when
serializing the record. This is possible by using the `serialize:
'ids'` option. You can also opt out of serializing a relationship by
setting `serialize: false`.

```javascript {data-filename=app/serializers/post.js}
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class PostSerializer extends JSONSerializer.extend(EmbeddedRecordsMixin) {
  attrs = {
    author: {
      serialize: false,
      deserialize: 'records'
    },
    comments: {
      deserialize: 'records',
      serialize: 'ids'
    }
  };
}
```

### EmbeddedRecordsMixin Defaults

If you do not overwrite `attrs` for a specific relationship, the
`EmbeddedRecordsMixin` will behave in the following way:

belongsTo: `{ serialize: 'id', deserialize: 'id' }`
hasMany   `{ serialize: false, deserialize: 'ids' }`


There is an option of not embedding JSON in the serialized payload by
using serialize: 'ids'. If you do not want the relationship sent at
all, you can use `serialize: false`.

## Authoring Serializers

If you would like to create a custom serializer, it is recommended that you
start with the `JSONAPISerializer` or `JSONSerializer` and extend one of
those to match your needs.
However, if your payload is extremely different from one of these
serializers you can create your own by extending the `Serializer`
base class.

A serializer has two main roles in EmberData.
First, it is responsible for taking a response from an adapter and
serializing it into the normalized JSON format that EmberData
understands.
Secondly, it transforms snapshots of records into a payload the
adapter will send to the server when creating, updating, or deleting a
record.

### EmberData's Normalized JSON Format

The normalized JSON format that EmberData expects is a
[JSON:API](http://jsonapi.org/) document with a couple of additional
restrictions.

First, it is important to make sure that the `type` name of a record
in the normalized JSON object exactly matches the filename of the
model defined for this record type.
By convention Model names are singular in EmberData, however, the
example type names shown in the
[JSON:API spec](http://jsonapi.org/format/) are pluralized.
The JSON:API spec itself is agnostic about inflection rules, however,
EmberData's own `JSONAPISerializer` assumes types are plural and it
will automatically singularize the types.

Second, attribute and relationship names in the JSON:API document
should exactly match the name and casing of the `@attr`,
`@belongsTo` and `@hasMany`, properties defined on the
Model.

By convention these property names are camelCase in EmberData models.
As with the `type` names, this is different from the example attribute
and relationship names shown in the
[JSON:API spec](http://jsonapi.org/format/).
The examples in the spec use dash-case for attribute and relationship
names. However, the spec does not require attribute or relationship
names to follow any specific casing convention.
If you are using EmberData's own `JSONAPISerializer` it will assume
the attribute and relationship names from your API are dash-case and
automatically transform them to camelCase when it creates the
normalized JSON object.

Other than these two restrictions, EmberData's normalized JSON object
follows the [JSON:API](http://jsonapi.org/) specification.

Example: given this `post` model.

```javascript {data-filename=app/models/post.js}
import Model, { attr, hasMany } from '@ember-data/model';

export default class Post extends Model {
  @attr('string') title;
  @attr('string') tag;
  @hasMany('comment', { async: false }) comments;
  @hasMany('post') relatedPosts;
}
```

The normalized JSON object that EmberData expects a serializer to
return looks like this:

```json
{
  data: {
    id: "1",
    type: "post",
    attributes: {
      title: "Rails is omakase",
      tag: "rails",
    },
    relationships: {
      comments: {
        data: [{ id: "1", type: "comment" },
               { id: "2", type: "comment" }],
      },
      relatedPosts: {
        links: {
          related: "/api/v1/posts/1/related-posts/"
        }
      }
    }
}
```

Note that the type is `"post"` to match the post model and the
`relatedPosts` relationship in the document matches the
`relatedPosts: hasMany('post')` on the model.

### Normalizing adapter responses

When creating a custom serializer you will need to define a
[normalizeResponse](https://api.emberjs.com/ember-data/5.3.0/classes/Serializer/methods/normalizeResponse?anchor=normalizeResponse)
method to transform the response from the adapter into the normalized
JSON object described above.

This method receives the `store`, the Model class for the request, the
payload, the id of the record request (or `null` if there is
no id associated with the request), and the request type (a string with
the possible values of: `'findRecord'`, `'queryRecord'`, `'findAll'`,
`'findBelongsTo'`, `'findHasMany'`, `'findMany'`, `'query'`,
`'createRecord'`, `'deleteRecord'`, and `'updateRecord'`) as arguments.

A custom serializer will also need to define a
[normalize](https://api.emberjs.com/ember-data/5.3.0/classes/Serializer/methods/normalize?anchor=normalize)
method.
This method is called by `store.normalize(type, payload)` and is often
used for normalizing requests made outside of EmberData because they
do not fall into the normal CRUD flow that the adapter provides.

### Serializing records

Finally a serializer will need to implement a
[serialize](https://api.emberjs.com/ember-data/5.3.0/classes/Serializer/methods/serialize?anchor=serialize)
method.
EmberData will provide a record snapshot and an options hash and this
method should return an object that the adapter will send to the
server when creating, updating or deleting a record.


## Community Serializers

If none of the built-in EmberData Serializers work for your backend,
be sure to check out some of the community maintained EmberData
Adapters and Serializers.
A good place to search for them is
[Ember Observer](http://emberobserver.com/categories/data).
