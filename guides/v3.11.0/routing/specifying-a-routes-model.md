A route's JavaScript file is one of the best places in an app to make requests to an API.
In this section of the guides, you'll learn how to use the
[`model`](https://api.emberjs.com/ember/3.11/classes/Route/methods/model?anchor=model)
method to fetch data by making a HTTP request, and render it in a route's `hbs` template, or pass it down to a component.

For example, take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favorite-posts');
});
```

In Ember, functions that automatically run during rendering or setup are commonly referred to as "hooks".
When a user first visits the `/favorite-posts` route, the `model` hook in `app/routes/favorite-posts.js` will automatically run.
Here's an example of a model hook in use within a route:

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    console.log('The model hook just ran!')
    return "Hello Ember!";
  }
});
```

`model` hooks have some special powers:

1. When you return data from this model, it becomes automatically available in the route's `.hbs` file as `this.model`
2. A `model` hook can return just about any type of data, like a string, object, or array, but the most common pattern is to return a JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
3. If you return a Promise from the model hook, your route will wait for the Promise to resolve before it renders the template
4. Since the `model` hook is Promise-aware, it is great for making API requests (using tools like [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)) and returning the results.
5. When using the `model` hook to load data, you can take advantage of other niceties that Ember provides, like
[automatic route transitions](../preventing-and-retrying-transitions/)
after the data is returned,
[loading screens, error handling](../loading-and-error-substates/),
and more
6. The `model` hook may automatically re-run in certain conditions, as you'll read about below.

## Using the `model` hook

To start, here's an example of returning a simple array from the `model` hook. Even if we eventually plan to fetch this data over a network, starting with something simple makes initial development of a new route quick and easy.

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return [
      { title: 'Ember Roadmap' },
      { title: 'Accessibility in Ember' },
      { title: 'EmberConf Recap' }
    ]
  }
});
```

Now that data can be used in the `favorite-posts`  template:

```handlebars {data-filename=app/templates/favorite-posts.hbs}
{{#each this.model as |post|}}
  <div>
    {{post.title}}
  </div>
{{/each}}
```

Behind the scenes, what is happening is that the [route's controller](https://api.emberjs.com/ember/3.11/classes/Route/methods/model?anchor=setupController) receives the results of the model hook, and makes those results available to the template. Your app may not have a controller file for the route, but the behavior is the same regardless.

Let's compare some examples using the model hook to make asynchronous HTTP requests to a server somewhere.

### Fetch example

First, here's an example using a core browser API called [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), which returns a Promise.
Install [`ember-fetch`](https://github.com/ember-cli/ember-fetch) with the command `ember install ember-fetch`, if it is not already in the app's `package.json`.

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';
import fetch from 'fetch';

export default Route.extend({
  model() {
    return fetch('/my-cool-end-point.json').then(function(response) {
      return response.json();
    });
  }
});
```

Older browsers may not have `fetch`, but the `ember-fetch` library includes a polyfill, so we don't have to worry about backwards compatibility!

### Ember Data example

Ember Data is a powerful (but optional) library included by default in new Ember apps.
In the next example, we will use Ember Data's [`findAll`](https://api.emberjs.com/ember-data/3.10/classes/DS.Store/methods/findAll?anchor=findAll) method, which returns a Promise, and resolves with an array of [Ember Data records](../../models/).

_Note that Ember Data also has a feature called a [`Model`](https://api.emberjs.com/ember-data/3.10/classes/DS.Model), but it's a separate concept from a route's [`model`](https://api.emberjs.com/ember/3.11/classes/Route/methods/model?anchor=model) hook._

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  model() {
    return this.get('store').findAll('posts');
  }
});
```

## Multiple Models

What should you do if you need the `model` to return the results of multiple API requests?

Multiple models can be returned through an
[RSVP.hash](https://api.emberjs.com/ember/3.11/classes/rsvp/methods/hash?anchor=hash).
The `RSVP.hash` method takes an object containing multiple promises.
If all of the promises resolve, the returned promise will resolve to an object that contains the results of each request. For example:

```javascript {data-filename=app/routes/songs.js}
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      songs: this.store.findAll('song'),
      albums: this.store.findAll('album')
    });
  }
});
```

In the `songs` template, we can specify both models and use the `{{#each}}` helper to display
each record in the song model and album model:

```handlebars {data-filename=app/templates/songs.hbs}
<h1>Playlist</h1>

<ul>
  {{#each this.model.songs as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>

<h1>Albums</h1>

<ul>
  {{#each this.model.albums as |album|}}
    <li>{{album.title}} by {{album.artist}}</li>
  {{/each}}
</ul>
```

## Dynamic Models

In the examples above, we showed a route that will always return the same data, a collection of favorite posts. Even when the user leaves and re-enters the `/posts` route, they will see the same thing.
But what if you need to request different data after user interaction?
What if a specific post should load based on the URL that the user visited, like `posts/42`?
In Ember, this can be accomplished by defining routes with [dynamic
segments](../defining-your-routes/#toc_dynamic-segments), or by using [query parameters](../query-params/), and then using the dynamic data to make requests.

In the previous Guides topic, we showed making a dynamic segment in the app's `router.js`:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

Whatever shows up in the URL at the `:post_id`, the dynamic segment, will be available in the params for the route's `model` hook:

```javascript {data-filename=app/routes/photo.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    console.log('This is the dynamic segment data: ' + params.post_id)
    // make an API request that uses the id
  }
});
```

If you do not define a model hook for a route, it will default to using Ember Data to look up the record, as shown below:

```js
model(params) {
 return this.store.find('post', params.post_id);
}
```

### Linking to a dynamic segment

There are two ways to link to a dynamic segment from an `.hbs` template using [`<LinkTo>`](../../templates/links/).
Depending on which approach you use, it will affect whether that route's `model` hook is run.
To learn how to link to a dynamic segment from within the JavaScript file, see the API documentation on
[`transitionTo`](https://api.emberjs.com/ember/3.11/classes/RouterService/methods/transitionTo?anchor=transitionTo)
instead.

When you provide a string or number to the `<LinkTo>`, the dynamic segment's `model` hook will run when the app transitions to the new route.
In this example, `photo.id` might have an id of `4`:

```handlebars
{{#each model as |photo|}}
  <LinkTo @route="photo" @model={{photo.id}}>
    link text to display
  </LinkTo>
{{/each}}
```

However, if you provide the entire model context, the model hook for that URL segment will _not_ be run.
For this reason, many Ember developers choose to pass only ids to `<LinkTo>` so that the behavior is consistent.

Here's what it looks like to pass the entire `photo` record:

```handlebars
{{#each model as |photo|}}
  <LinkTo @route="photo" @model={{photo}}>
    link text to display
  </LinkTo>
{{/each}}
```

If you decide to pass the entire model, be sure to cover this behavior in your [acceptance tests](../../testing/acceptance/).

If a route you are trying to link to has multiple dynamic segments, like `/photos/4/comments/18`, be sure to specify all the necessary information for each segment:

```handlebars
<LinkTo @route="photos.photo.comments.comment" @models={{array 4 18}}>
  link text to display
</LinkTo>
```

Routes without dynamic segments will always execute the model hook.

## Reusing Route Context

Sometimes you need to fetch a model, but your route doesn't have the parameters, because it's
a child route and the route directly above or a few levels above has the parameters that your route
needs.
You might run into this if you have a URL like `/photos/4/comments/18`, and when you're in the comments route, you need a photo ID.

In this scenario, you can use the `paramsFor` method to get the parameters of a parent route.

```javascript {data-filename=app/routes/album/index.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let { album_id } = this.paramsFor('album');

    return this.store.query('song', { album: album_id });
  }
});
```

This is guaranteed to work because the parent route is loaded. But if you tried to
do `paramsFor` on a sibling route, you wouldn't have the results you expected.

This is a great way to use the parent context to load something that you want.
Using `paramsFor` will also give you the query params defined on that route's controller.
This method could also be used to look up the current route's parameters from an action
or another method on the route, and in that case we have a shortcut: `this.paramsFor(this.routeName)`.

In our case, the parent route had already loaded its songs, so we would be writing unnecessary fetching logic.
Let's rewrite the same route, but use `modelFor`, which works the same way, but returns the model
from the parent route.

```javascript {data-filename=app/routes/album/index.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let { songs } = this.modelFor('album');

    return songs;
  }
});
```

In the case above, the parent route looked something like this:

```javascript {data-filename=app/routes/album.js}
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model({ album_id }) {
    return RSVP.hash({
      album: this.store.findRecord('album', album_id),
      songs: this.store.query('songs', { album: album_id })
    });
  }
});
```

And calling `modelFor` returned the result of the `model` hook.

## Debugging models

If you are having trouble getting a model's data to show up in the template, here are some tips:

- Use the [`{{debugger}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/debugger?anchor=debugger) or [`{{log}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/debugger?anchor=log) helper to inspect the `{{model}}` from the template
- return hard-coded sample data as a test to see if the problem is really in the model hook, or elsewhere down the line
- study JavaScript Promises in general, to make sure you are returning data from the Promise correctly
- make sure your `model` hook has a `return` statement
- check to see whether the data returned from a `model` hook is an object, array, or JavaScript Primitive. For example, if the result of `model` is an array, using `{{this.model}}` in the template won't work. You will need to iterate over the array with an [`{{#each}}`](https://api.emberjs.com/ember/3.11/classes/Ember.Templates.helpers/methods/each?anchor=each) helper. If the result is an object, you need to access the individual attribute like `{{this.model.title}}` to render it in the template.
- use your browser's development tools to examine the outgoing and incoming API responses and see if they match what your code expects
- If you are using Ember Data, use the [Ember Inspector](../../ember-inspector/) browser plugin to explore the View Tree/Model and Data sections.
