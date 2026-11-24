A schema describes the fields of one type of record.
Anything that the user expects to see after they leave your app and come back
should be described by a schema.

A schema is plain data. It lists fields, but it contains no code.
Logic, such as a value computed from other fields, lives in plain functions that the schema names.

## Creating a Schema

Put each schema in its own file in the `app/schemas` folder.
Let's create a schema for the `person` type:

```javascript {data-filename=app/schemas/person.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const PersonSchema = withDefaults({
  type: 'person',
  fields: [
    { kind: 'field', name: 'firstName' },
    { kind: 'field', name: 'lastName' },
    { kind: 'field', name: 'birthday' },
  ],
});
```

The `type` is the name of the record type.
Use the singular form, such as `person` instead of `people`.

The `withDefaults` function adds the settings that most schemas need.
For example, it adds the `id` field.
Every record has an `id`, so you do not list it in `fields`.

## Registering a Schema

The store must know about a schema before it can make records of that type.
Add the schema to the `schemas` option in `app/services/store.js`:

```javascript {data-filename=app/services/store.js}
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { PersonSchema } from 'my-app/schemas/person';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [],
  schemas: [PersonSchema],
});

export default Store;
```

After you register a schema, you can start [finding](../finding-records/)
and [working with records](../creating-updating-and-deleting-records/) of that type.

## Defining Fields

A field with the kind `field` holds one value from the server.
The value can be a string, a number, a boolean, an object, or an array.

The names in `fields` match the `attributes` that the server sends.
For example, the server can send this JSON:API resource for a person:

```json
{
  "data": {
    "type": "person",
    "id": "1",
    "attributes": {
      "firstName": "Zoey",
      "lastName": "Tomster",
      "birthday": "2011-12-05"
    }
  }
}
```

You read the fields with dot notation, such as `person.firstName`.
Fields are reactive.
When a field changes, Ember updates every template that shows it.

In development, a record throws an error if you read a field that its schema does not list.
This helps you find typos early.
In a production build, the read returns `undefined`.

### Read-only Nested Data

Sometimes the server sends a nested object or array, such as a location or a list of tags.
You can store it in a normal `field`:

```javascript {data-filename=app/schemas/place.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const PlaceSchema = withDefaults({
  type: 'place',
  fields: [
    { kind: 'field', name: 'location' }, // an object
    { kind: 'field', name: 'tags' }, // an array
  ],
});
```

```handlebars
{{@model.location.latitude}}
```

WarpDrive does not track changes inside the value of a `field`.
For an object or an array of simple values that must be reactive, use the `object` or `array` kind instead.

If the nested data has a fixed shape of its own, you can describe it with a `schema-object` field.
Read [Complex Fields](https://warp-drive.io/guides/the-manual/schemas/complex-fields) in the WarpDrive guides to learn how.

### Different Field Names

Sometimes the name in the API is not the name you want in your app.
Use `sourceKey` to give the name that the server uses:

```javascript {data-filename=app/schemas/person.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const PersonSchema = withDefaults({
  type: 'person',
  fields: [
    { kind: 'field', name: 'firstName', sourceKey: 'first_name' },
    { kind: 'field', name: 'lastName', sourceKey: 'last_name' },
  ],
});
```

Your app reads `person.firstName`.
The cache stores the value under `first_name`, the name from the server.

## Derived Fields

A derived field computes its value from other fields.
For example, a person has a `fullName` that combines the first and last names.

First, write a plain function that takes the record and returns the value.
Then give the function a name with the `Type` symbol:

```javascript {data-filename=app/schemas/person.js}
import { withDefaults } from '@warp-drive/core/reactive';
import { Type } from '@warp-drive/core/types/symbols';

export const PersonSchema = withDefaults({
  type: 'person',
  fields: [
    { kind: 'field', name: 'firstName' },
    { kind: 'field', name: 'lastName' },
    { kind: 'derived', name: 'fullName', type: 'full-name' },
  ],
});

export function fullName(person) {
  return `${person.firstName} ${person.lastName}`;
}
fullName[Type] = 'full-name';
```

The `type` option of the derived field is the name of the function.
This function is called a _derivation_.
Register it with the `derivations` option of the store:

```javascript {data-filename=app/services/store.js}
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { PersonSchema, fullName } from 'my-app/schemas/person';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [],
  schemas: [PersonSchema],
  derivations: [fullName],
});

export default Store;
```

When you read `person.fullName`, WarpDrive calls `fullName(person)` and returns the result.
Ember tracks the fields that the derivation reads.
When `firstName` or `lastName` changes, `fullName` updates.

To learn more, read [Derivations](https://warp-drive.io/guides/the-manual/schemas/derivations) in the WarpDrive guides.

## Transformations

Sometimes the type of a value from the server is not the type you want in your code.
For example, the server sends a date as a string, but your code wants a `Date` object.
A _transformation_ converts the value in both directions.

A transformation is an object with these functions:

- `hydrate` converts the value from the cache into the value your app reads.
- `serialize` converts the value your app writes into the value for the cache.
- `defaultValue` is optional. It returns the cache value to use when the server sends nothing.

WarpDrive calls `hydrate` each time you read the field, so keep these functions fast and free of side effects.

### Custom Transforms

Here is a transformation that converts between a date string and a `Date` object:

```javascript {data-filename=app/transformations/date.js}
import { Type } from '@warp-drive/core/types/symbols';

export const DateTransformation = {
  hydrate(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return new Date(value);
  },

  serialize(value) {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toISOString();
  },

  defaultValue() {
    return null;
  },

  [Type]: 'date',
};
```

Use the name of the transformation as the `type` of a field:

```javascript {data-filename=app/schemas/person.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const PersonSchema = withDefaults({
  type: 'person',
  fields: [
    { kind: 'field', name: 'name' },
    { kind: 'field', name: 'birthday', type: 'date' },
  ],
});
```

Then register the transformation with the `transformations` option of the store:

```javascript {data-filename=app/services/store.js}
import { useRecommendedStore } from '@warp-drive/core';
import { JSONAPICache } from '@warp-drive/json-api';
import { PersonSchema } from 'my-app/schemas/person';
import { DateTransformation } from 'my-app/transformations/date';

const Store = useRecommendedStore({
  cache: JSONAPICache,
  handlers: [],
  schemas: [PersonSchema],
  transformations: [DateTransformation],
});

export default Store;
```

Now `person.birthday` is a `Date` object.
The cache keeps the string, and the string is what goes back to the server.

A field without a `type` has no transformation.
WarpDrive gives you the value exactly as the server sent it.

To learn more, read [Transformations](https://warp-drive.io/guides/the-manual/schemas/transformations) in the WarpDrive guides.

## Relationships

A schema can also describe how records relate to each other.
For example, a blog post has many comments, and each comment belongs to one post.
The [Relationships](../relationships/) guide shows how to define them.
