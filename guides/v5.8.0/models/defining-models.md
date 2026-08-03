A model is a class that defines the properties and behavior of the
data that you present to the user. Anything that the user expects to see
if they leave your app and come back later (or if they refresh the page)
should be represented by a model.

When you want a new model for your application you need to create a new file
under the models folder and extend from `Model`. This is more conveniently
done by using one of Ember CLI's generator commands. For instance, let's create
a `person` model:

```bash
ember generate model person
```

This will generate the following file:

```javascript {data-filename=app/models/person.js}
import Model from '@ember-data/model';

export default class PersonModel extends Model {
}
```

After you have defined a model class, you can start [finding](../finding-records/)
and [working with records](../creating-updating-and-deleting-records/) of that type.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        EmberData models are normally setup using the singular form (which is why we use `person` instead of `people` here)
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Defining Attributes

The `person` model we generated earlier didn't have any attributes. Let's
add first and last name, as well as the birthday, using [`attr`](https://api.emberjs.com/ember-data/5.3.0/functions/@ember-data%2Fmodel/attr):

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr title;
  @attr name;
  @attr birthday;
}
```

Attributes are used when turning the JSON payload returned from your
server into a record, and when serializing a record to save back to the
server after it has been modified.

You can use attributes like any other property, including from within [getter functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr title;
  @attr name;

  get fullName() {
    return `${this.title} ${this.name}`;
  }
}
```

### Transforms

You may find the type of an attribute returned by the server does not
match the type you would like to use in your JavaScript code. Ember
Data allows you to define simple serialization and deserialization
methods for attribute types called transforms. You can specify that
you would like a transform to run for an attribute by providing the
transform name as the first argument to the `attr` method. EmberData
supports attribute types of `string`, `number`, `boolean`, and `date`,
which coerce the value to the JavaScript type that matches its name.

```javascript {data-filename=app/models/person.js}
import Model, { attr } from '@ember-data/model';

export default class PersonModel extends Model {
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
EmberData will do no additional processing of the value.

#### Custom Transforms

You can also create custom transforms with Ember CLI's `transform` generator:

```bash
ember generate transform dollars
```

Here is a simple transform that converts values between cents and US dollars.

```javascript {data-filename=app/transforms/dollars.js}
import Transform from '@ember-data/serializer/transform';

export default class DollarsTransform extends Transform {
  deserialize(serialized) {
    return serialized / 100; // returns dollars
  }

  serialize(deserialized) {
    return deserialized * 100; // returns cents
  }
}
```

A transform has two functions: `serialize` and `deserialize`. Deserialization
converts a value to a format that the client expects. Serialization does the
reverse and converts a value to the format expected by the persistence layer.

You would use the custom `dollars` transform like this:

```javascript {data-filename=app/models/product.js}
import Model, { attr } from '@ember-data/model';

export default class ProductModel extends Model {
  @attr('dollars') spent;
}
```

### Options

`attr` can also take a hash of options as a second parameter. At the moment
the only option available is `defaultValue`, which can use a value or a function
to set the default value of the attribute if one is not supplied.

In the following example we define that `verified` has a default value of
`false` and `createdAt` defaults to the current date at the time of the model's
creation:

```javascript {data-filename=app/models/user.js}
import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
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
there is no need to create multiple models with `attr('hasMany')` or `attr('belongsTo')`
relationships. This could result in a potentially large amount of unnecessary
code. You can access these objects in the template without transforming them. This can be
done by using `@attr` without specifying a transform:

```javascript {data-filename=app/models/place.js}
import Model, { attr } from '@ember-data/model';

export default class PlaceModel extends Model {
  @attr location; // a read-only object
  @attr tags; // a read-only array
}
```

```handlebars
{{@model.location.latitude}}
```

<!-- eof - needed for pages that end in a code block  -->
