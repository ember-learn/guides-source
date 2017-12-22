In Ember Data, the Adapter determines how data is persisted to a
backend data store, such as the URL format and headers for a REST API.
(The format of the data itself is determined by the
[serializer](../customizing-serializers/).)
Ember Data's default Adapter has some built-in
assumptions of how a [REST API should look](http://jsonapi.org/). If
your backend conventions differ from these assumptions Ember Data
makes it easy to change its functionality by swapping out or extending
the default Adapter.

Some reasons for customizing an Adapter include using
`underscores_case` in your urls, using a medium other than REST to
communicate with your backend API or even using a
[local storage backend](https://github.com/locks/ember-localstorage-adapter).

Extending Adapters is a natural process in Ember Data. Ember takes the
position that you should extend an adapter to add different
functionality. This results in code that is
more testable, easier to understand and reduces bloat for people who
may want to subclass your adapter.

If your backend has some consistent rules you can define an
`adapter:application`. The `adapter:application` will get priority over
the default Adapter, however it will still be superseded by model
specific Adapters.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  // Application specific overrides go here
});
```

If you have one model that has exceptional rules for communicating
with its backend than the others you can create a Model specific
Adapter by running the command `ember generate adapter adapter-name`.
For example, running `ember generate adapter post` will create the
following file:

```app/adapters/post.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api/v1'
});
```

By default Ember Data comes with several built-in adapters. Feel free
to use these adapters as a starting point for creating your own custom
adapter.

- [DS.Adapter](http://emberjs.com/api/data/classes/DS.Adapter.html) is the basic adapter
with no functionality. It is generally a good starting point if you
want to create an adapter that is radically different from the other
Ember adapters.

- [DS.JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
The `JSONAPIAdapter` is the default adapter and follows JSON API
conventions to communicate with an HTTP server by transmitting JSON
via XHR.

- [DS.RESTAdapter](http://emberjs.com/api/data/classes/DS.RESTAdapter.html)
The `RESTAdapter` allows your store to communicate with an HTTP server
by transmitting JSON via XHR. Before Ember Data 2.0 this adapter was the default.


## Customizing the JSONAPIAdapter

The
[DS.JSONAPIAdapter](http://emberjs.com/api/data/classes/DS.JSONAPIAdapter.html)
has a handful of hooks that are commonly used to extend it to work
with non-standard backends.

### URL Conventions

The `JSONAPIAdapter` is smart enough to determine the URLs it
communicates with based on the name of the model. For example, if you
ask for a `Post` by ID:

```js
store.findRecord('post', 1).then(function(post) {
});
```

The JSON API adapter will automatically send a `GET` request to `/posts/1`.

The actions you can take on a record map onto the following URLs in the
JSON API adapter:

<table>
  <thead>
    <tr><th>Action</th><th>HTTP Verb</th><th>URL</th></tr>
  </thead>
  <tbody>
    <tr><th>Find</th><td>GET</td><td>/posts/123</td></tr>
    <tr><th>Find All</th><td>GET</td><td>/posts</td></tr>
    <tr><th>Update</th><td>PATCH</td><td>/posts/123</td></tr>
    <tr><th>Create</th><td>POST</td><td>/posts</td></tr>
    <tr><th>Delete</th><td>DELETE</td><td>/posts/123</td></tr>
  </tbody>
</table>

#### Pluralization Customization

To facilitate pluralizing model names when generating route urls Ember
Data comes bundled with
[Ember Inflector](https://github.com/stefanpenner/ember-inflector), an
ActiveSupport::Inflector compatible library for inflecting words
between plural and singular forms. Irregular or uncountable
pluralizations can be specified via `Ember.Inflector.inflector`.
A common way to do this is:

```app/app.js
// sets up Ember.Inflector
import './models/custom-inflector-rules';
```

```app/models/custom-inflector-rules.js
import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.irregular('formula', 'formulae');
inflector.uncountable('advice');

// Meet Ember Inspector's expectation of an export
export default {};
```

This will tell the JSON API adapter that requests for `formula`
should go to `/formulae/1` instead of `/formulas/1`, and that
requests for `advice` should go to `/advice/1` instead of `/advices/1`.

When specifying irregular inflection rules for compound words, only the final word or phrase should be specified. For example, to specify the plural of `redCow` as `redKine` or `red-cow` as `red-kine`, only the final word segments `cow` and `kine` should be specified:

```js
inflector.irregular('cow', 'kine');
```

#### Endpoint Path Customization

The `namespace` property can be used to prefix requests with a
specific url namespace.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  namespace: 'api/1'
});
```

Requests for `person` would now target `http://emberjs.com/api/1/people/1`.


#### Host Customization

By default the adapter will target the current domain. If you would
like to specify a new domain you can do so by setting the `host`
property on the adapter.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  host: 'https://api.example.com'
});
```

Requests for `person` would now target `https://api.example.com/people/1`.


#### Path Customization

By default the `JSONAPIAdapter` will attempt to pluralize and dasherize
the model name to generate the path name. If this convention does not
conform to your backend you can override the `pathForType` method.

For example, if you did not want to pluralize model names and needed
underscore_case instead of camelCase you could override the
`pathForType` method like this:

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  pathForType: function(type) {
    return Ember.String.underscore(type);
  }
});
```

Requests for `person` would now target `/person/1`.
Requests for `user-profile` would now target `/user_profile/1`.

#### Headers customization

Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
headers can be set as key/value pairs on the `JSONAPIAdapter`'s `headers`
object and Ember Data will send them along with each ajax request.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  headers: {
    'API_KEY': 'secret key',
    'ANOTHER_HEADER': 'Some header value'
  }
});
```

`headers` can also be used as a computed property to support dynamic
headers. In the example below, the headers are generated with a computed
property dependent on the `session` service.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service('session'),
  headers: Ember.computed('session.authToken', function() {
    return {
      'API_KEY': this.get('session.authToken'),
      'ANOTHER_HEADER': 'Some header value'
    };
  })
});
```

In some cases, your dynamic headers may require data from some
object outside of Ember's observer system (for example
`document.cookie`). You can use the
[volatile](http://emberjs.com/api/classes/Ember.ComputedProperty.html#method_volatile)
function to set the property into a non-cached mode causing the headers to
be recomputed with every request.

```app/adapters/application.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  headers: Ember.computed(function() {
    return {
      'API_KEY': Ember.get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
      'ANOTHER_HEADER': 'Some header value'
    };
  }).volatile()
});
```

#### Authoring Adapters

The `defaultSerializer` property can be used to specify the serializer
that will be used by this adapter. This is only used when a model
specific serializer or `serializer:application` are not defined.

In an application, it is often easier to specify an
`serializer:application`. However, if you are the author of a
community adapter it is important to remember to set this property to
ensure Ember does the right thing in the case a user of your adapter
does not specify an `serializer:application`.

```app/adapters/my-custom-adapter.js
import DS from 'ember-data';

export default DS.JSONAPIAdapter.extend({
  defaultSerializer: '-default'
});
```

## Community Adapters

If none of the built-in Ember Data Adapters work for your backend,
be sure to check out some of the community maintained Ember Data
Adapters. Some good places to look for Ember Data Adapters include:

- [Ember Observer](http://emberobserver.com/categories/data)
- [GitHub](https://github.com/search?q=ember+data+adapter&ref=cmdform)
- [Bower](http://bower.io/search/?q=ember-data-)
