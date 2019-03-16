A model is a class that defines the properties and behavior of the
data that you present to the user. Anything that the user expects to see
if they leave your app and come back later (or if they refresh the page)
should be represented by a model.

When you want a new model for your application you need to create a new file
under the models folder and extend from `DS.Model`. This is more conveniently
done by using one of Ember CLI's generator commands. For instance, let's create
a `person` model:

```bash
ember generate model person
```

This will generate the following file:

```javascript {data-filename=src/models/person.js}
import DS from 'ember-data';
const { Model } = DS;

export default class Person extends Model {
}
```

After you have defined a model class, you can start [finding](../finding-records/)
and [working with records](../creating-updating-and-deleting-records/) of that type.


## Defining Attributes

The `person` model we generated earlier didn't have any attributes. Let's
add first and last name, as well as the birthday, using [`DS.attr`](https://www.emberjs.com/api/ember-data/release/classes/DS/methods/attr?anchor=attr):

```javascript {data-filename=src/models/person.js}
import DS from 'ember-data';
const { Model, attr } = DS;

export default class Person extends Model {
  @attr() firstName;
  @attr() lastName;
  @attr() birthday;
}
```

Attributes are used when turning the JSON payload returned from your
server into a record, and when serializing a record to save back to the
server after it has been modified.

You can use attributes like any other property, including from within [getter functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

```javascript {data-filename=src/models/person.js}
import DS from 'ember-data';
const { Model, attr } = DS;

export default class Person extends Model {
  @attr() firstName;
  @attr() lastName;

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

### Transforms

You may find the type of an attribute returned by the server does not
match the type you would like to use in your JavaScript code. Ember
Data allows you to define simple serialization and deserialization
methods for attribute types called transforms. You can specify that
you would like a transform to run for an attribute by providing the
transform name as the first argument to the `DS.attr` method. Ember Data
supports attribute types of `string`, `number`, `boolean`, and `date`,
which coerce the value to the JavaScript type that matches its name.

```javascript {data-filename=src/models/person.js}
import DS from 'ember-data';
const { Model, attr } = DS;

export default class Person extends Model {
  @attr('string') name;
  @attr('number') age;
  @attr('boolean') admin;
  @attr('date') birthday;
}
```

The `date` transform will transform an
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) string to a JavaScript
date object.

The `boolean` transform can handle values other than `true` or
`false`. The strings `"true"` or `"t"` in any casing, `"1"`, and the number
`1` will all coerce to `true`, and `false` otherwise.

Transforms are not required. If you do not specify a transform name
Ember Data will do no additional processing of the value.

#### Custom Transforms

You can also create custom transforms with Ember CLI's `transform` generator:

```bash
ember generate transform dollars
```

Here is a simple transform that converts values between cents and US dollars.

```javascript {data-filename=src/transforms/dollars.js}
import DS from 'ember-data';
const { Transform } = DS;

export default class DollarsTransform extends Transform {
  deserialize(serialized) {
    return serialized / 100; // returns dollars
  },

  serialize(deserialized) {
    return deserialized * 100; // returns cents
  }
}
```

A transform has two functions: `serialize` and `deserialize`. Deserialization
converts a value to a format that the client expects. Serialization does the
reverse and converts a value to the format expected by the persistence layer.

You would use the custom `dollars` transform like this:

```javascript {data-filename=src/models/product.js}
import DS from 'ember-data';
const { Model, attr } = DS;

export default class Product extends Model {
  @attr('dollars') spent;
}
```

### Options

`DS.attr` can also take a hash of options as a second parameter. At the moment
the only option available is `defaultValue`, which can use a value or a function
to set the default value of the attribute if one is not supplied.

In the following example we define that `verified` has a default value of
`false` and `createdAt` defaults to the current date at the time of the model's
creation:

```javascript {data-filename=src/models/user.js}
import DS from 'ember-data';
const { Model, attr } = DS;

export default class User extends Model {
  @attr('string') username;
  @attr('string') email;
  @attr('boolean', { defaultValue: false }) verified;
  @attr('date', {
    defaultValue() { return new Date(); }
  }) createdAt;
}
```

### Read-only Attributes

When the API returns a deeply nested, read-only object or array,
there is no need to create multiple models with `DS.attr('hasMany')` or `DS.attr('belongsTo')`
relationships. This could result in a potentially large amount of unnecessary
code. You can access these objects in the template without transforming them. This can be
done with `DS.attr()` (No attribute type).

The following example shows how to define these attributes without transforming them
and accessing them within a template:

```javascript
@attr() location;  // a read-only object
@attr() tags; // a read-only array
```

```handlebars
{{this.model.location.latitude}}
```
