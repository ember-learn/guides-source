In EmberData, an Adapter determines how data is persisted to a
backend data store. Things such as the backend host, URL format
and headers used to talk to a REST API can all be configured
in an adapter.

EmberData's default Adapter has some built-in assumptions about
how a [REST API should look](http://jsonapi.org/). If your backend conventions
differ from those assumptions, EmberData allows either slight adjustments
or you can switch to a different adapter if your backend works noticeably
differently.

_(If you're looking to adjust how the data sent to the backend is formatted,
check the [serializer](../customizing-serializers/) page.)_

Extending Adapters is a natural process in EmberData. Ember takes the
position that you should extend an adapter to add different
functionality. This results in code that is
more testable, easier to understand and reduces bloat for people who
may want to subclass your adapter.

If your backend has some consistent rules you can define an
`adapter:application`. The `adapter:application` will get priority over
the default Adapter, however it will still be superseded by model
specific Adapters.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  // Application specific overrides go here
}
```

If there is a model that does not follow the backend's typical conventions, you
can create an adapter that is specific to that model. The model-specific adapter
will override the rules in the `application` adapter.

To create a model-specific adapter, run the command `ember generate adapter <model-name>`.
For example, suppose there is a `post` model that needs to talk to the `v1` API
in the backend. We can run `ember generate adapter post` to create the adapter,
then specify the `post` adapter's namespace:

```javascript {data-filename=app/adapters/post.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class PostAdapter extends JSONAPIAdapter {
  namespace = 'api/v1';
}
```

EmberData comes with several built-in adapters.
Feel free to use these adapters as a starting point for creating your own custom adapter.

- [`Adapter`](https://api.emberjs.com/ember-data/5.3.0/classes/Adapter) is the basic adapter
with no functionality. It is generally a good starting point if you
want to create an adapter that is radically different from the other
Ember adapters.

- [`JSONAPIAdapter`](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPIAdapter)
The `JSONAPIAdapter` is the default adapter and follows JSON:API
conventions to communicate with an HTTP server by transmitting JSON
via XHR.

- [`RESTAdapter`](https://api.emberjs.com/ember-data/5.3.0/classes/RESTAdapter)
The `RESTAdapter` allows your store to communicate with an HTTP server
by transmitting JSON via XHR. Before EmberData 2.0 this adapter was the default.


## Customizing the JSONAPIAdapter

The
[JSONAPIAdapter](https://api.emberjs.com/ember-data/5.3.0/classes/JSONAPIAdapter)
has a handful of hooks that are commonly used to extend it to work
with non-standard backends.

### URL Conventions

The `JSONAPIAdapter` is smart enough to determine the URLs it
communicates with based on the name of the model. For example, if you
ask for a `Post` by ID:

```javascript
store.findRecord('post', 1).then(function(post) {
});
```

The JSON:API adapter will automatically send a `GET` request to `/posts/1`.

The actions you can take on a record map onto the following URLs in the
JSON:API adapter:

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

To facilitate pluralizing model names when generating route URLs Ember
Data comes bundled with
[Ember Inflector](https://github.com/stefanpenner/ember-inflector), an
ActiveSupport::Inflector compatible library for inflecting words
between plural and singular forms. Irregular or uncountable
pluralizations can be specified via `Ember.Inflector.inflector`.

To do this, create an [Initializer](../../applications/initializers/) file containing your customizations. The Ember CLI's `initializer` generator can be used `ember generate initializer custom-inflector-rules` to create the file. Update its content as follows:

```javascript {data-filename=app/initializers/custom-inflector-rules.js}
import Inflector from 'ember-inflector';

export function initialize(/* application */) {
  const inflector = Inflector.inflector;

  // Tell the inflector that the plural of "campus" is "campuses"
  inflector.irregular('campus', 'campuses');

  // Tell the inflector that the plural of "advice" is "advice"
  inflector.uncountable('advice');
}

export default {
  name: 'custom-inflector-rules',
  initialize
};
```

The JSON:API adapter will now make requests for `Campus` models to
`/campuses` and `/campuses/1` (instead of `/campus/` and `/campus/1`),
and requests for `advice` to `/advice` and `/advice/1` (instead of
`/advices/` and `/advices/1`).

When specifying irregular inflection rules for compound words, only the final word or phrase should be specified. For example, to specify the plural of `redCow` as `redKine` or `red-cow` as `red-kine`, only the final word segments `cow` and `kine` should be specified:

```javascript
inflector.irregular('cow', 'kine');
```

#### Endpoint Path Customization

The `namespace` property can be used to prefix requests with a
specific URL namespace.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  namespace = 'api/1';
}
```

Requests for `person` would now target `https://api.emberjs.com/api/1/people/1`.


#### Host Customization

By default, the adapter will target the current domain. If you would
like to specify a new domain you can do so by setting the `host`
property on the adapter.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  host = 'https://api.example.com';
}
```

Requests for `person` would now target `https://api.example.com/people/1`.


#### Path Customization

By default, the `JSONAPIAdapter` will attempt to pluralize and dasherize
the model name to generate the path name. If this convention does not
conform to your backend you can override the `pathForType` method.

For example, if you did not want to pluralize model names and needed
underscore_case instead of dash-case you could override the
`pathForType` method like this:

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  pathForType(type) {
    return type.replace(/-/g, '_'); // blog-post-comment becomes blog_post_comment 
  }
}
```

Requests for `person` would now target `/person/1`.
Requests for `user-profile` would now target `/user_profile/1`.

#### Headers customization

Some APIs require HTTP headers, e.g. to provide an API key. Arbitrary
headers can be set as key/value pairs on the `JSONAPIAdapter`'s `headers`
object and EmberData will send them along with each ajax request.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';

export default class ApplicationAdapter extends JSONAPIAdapter {
  headers = {
    'API_KEY': 'secret key',
    'ANOTHER_HEADER': 'Some header value'
  };
}
```

You can combine tracked properties with ES6 getters to make `headers` dynamic. For example, you may have a `session` service with a tracked property called `authToken`:

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service session;

  get headers() {
    return {
      'API_KEY': this.session.authToken,
      'ANOTHER_HEADER': 'Some header value'
    };
  }
}
```

[Getters](../../in-depth-topics/autotracking-in-depth/) recompute with each
access, so you could just as easily rely upon another dynamic value such as
`document.cookie`.

```javascript {data-filename=app/adapters/application.js}
import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { get } from '@ember/object';

export default class ApplicationAdapter extends JSONAPIAdapter {
  get headers() {
    return {
      'API_KEY': get(document.cookie.match(/apiKey\=([^;]*)/), '1'),
      'ANOTHER_HEADER': 'Some header value'
    };
  }
}
```

## Community Adapters

If none of the built-in EmberData Adapters work for your backend,
be sure to check out some of the community maintained EmberData
Adapters. Some good places to look for EmberData Adapters include:

- [Ember Observer](http://emberobserver.com/categories/data)
- [GitHub](https://github.com/search?q=ember+data+adapter&ref=cmdform)
