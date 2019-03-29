A route's JavaScript file is one of the best places in an app to make requests to a back-end server.
In this section of the guides, you'll learn how to use the
[`model`](http://api.emberjs.com/ember/3.8/classes/Route/methods/model?anchor=model)
function to fetch data and render it in a route's `hbs` template, or pass it down to a component.

For example, take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favorite-posts');
});
```

When a user first visits the `/favorite-posts` route, the `model` hook in `app/routes/favorite-posts.js` will automatically run.
In Ember, functions that automatically run during rendering or setup are commonly referred to as "hooks". 
Here's an example of a model hook in use within a route:

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    console.log('The model hook just ran!')
    // write code to return a Promise or some static data
  }
});
```

`model` hooks have some special powers:

1. When you return data from this model, it becomes automatically available in the route's `.hbs` file as `this.model`
2. A `model` hook can return either a JavaScript [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises), or static sample data, like a string, object, or array
3. If you return a Promise from the model hook, your route will wait for the Promise to resolve before it renders the template
4. `model` hooks work great with
[Ember Data](../../models/),
[`ember-ajax`](https://github.com/ember-cli/ember-ajax),
or a JavaScript data fetching library of your choice
5. When you load data in a `model`, you can take advantage of other hooks, like 
[automatic route transitions](/preventing-and-retrying-transitions)
after the data is returned,
[error handling](/loading-and-error-substates),
and more
6. An optional feature of routes is the ability to show a [`loading` template](/loading-and-error-substates) while the app is waiting for the `model` hook to resolve
7. The `model` hook can be automatically re-run under certain conditions, described later in this topic.

## Using the `model` hook

To start, here's an example of returning static sample data from a `model`. This is helpful while you are doing the initial development of a new route:

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

Let's compare with examples that have outgoing, asynchronous requests to the back end.

This next example uses Ember Data's `findAll` method, which returns a Promise, and resolves with an array of [Ember Data records](../../models/). Ember Data is a powerful (but optional) library included by default in new Ember apps. Note that Ember Data also has a feature called a `Model`, but it's a separate concept from a route's `model` hook.

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('posts');
  }
});
```

Now let's look at [`ember-ajax`](https://github.com/ember-cli/ember-ajax), an different data-fetching library that you could install in your app.
It's a convenient wrapper around `jQuery.ajax`, a popular general JavaScript library. Like Ember Data, it returns data from within a Promise:

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';
import { inject as service } from `@ember/service`

export default Route.extend({
  ajax: Ember.inject.service(),
  model(params) {
    return this.get('ajax').request('https://some-api-endpoint.com/posts', {
      method: 'GET'
    });
  }
});
```

Lastly, you could hand-write a promise that you return from the model hook:

```javascript {data-filename=app/routes/favorite-posts.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return new Promise((resolve, reject) => {
      // get some data
      resolve( /* data goes here */);
    })
  }
});
```

Just like in the static data example, the results of an asynchronous request in the `model` hook can be used in the template:

```handlebars {data-filename=app/templates/favorite-posts.hbs}
{{#each this.model as |post|}}
  <div>
    {{post.title}}
  </div>
{{/each}}
```

Behind the scenes, what is happening is that the route's controller receives the results of the model hook, and makes those results available to the template. Your app may not have a controller file for the route, but the behavior is the same regardless.

## Multiple Models

What should you do if you need the `model` to return the results of multiple API requests?

Multiple models can be returned through an
[RSVP.hash](https://www.emberjs.com/api/ember/release/classes/rsvp/methods/hash?anchor=hash).
The `RSVP.hash` method takes an object with promises or values as properties as an argument, and returns a single promise.
When all of the promises in the object resolve, the returned promise will resolve with an object of all of the promise values. For example:

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

If you use [Ember Data](../../models/) and you are building an `RSVP.hash` with the model's relationship, consider instead properly setting up your [relationships](../../models/relationships/) and letting Ember Data take care of loading them.

## Dynamic Models

In the examples above, we showed a route that will always return the same data, a collection of favorite posts. Even when the user leaves and re-enters the `/favorite-posts` route, they will see the same thing.
But what if you need to request different data after user interaction?
What if a specific post should load based on the URL that the user visited, or a selection that was made?
In Ember, this is accomplished by defining routes with [dynamic
segments](../defining-your-routes/#toc_dynamic-segments), or by using [query parameters](/query-params).
This section will focus on dynamic segments, sometimes also referred to as "dynamic models or routes."

### What does a dynamic segment look like?

Here's what it would look like in the URL if a route has a dynamic segment: `http://localhost:4200/posts/42`. The number `42` is the "dynamic" part.
A user could follow a link taking them to `http://localhost:4200/posts/3` and see post number 3 instead.
What's important here is that the data that should be displayed is tied to the url.
When you are doing routing well, a user could refresh the page, or visit a bookmarked page, and they would see the right data.

URLs are one of the main superpowers of browser-based apps, and your app should take advantage of them.

### Creating a dynamic segment

A dynamic segment can be created using the Ember CLI:

```bash
ember generate route photo --path "photos/:id"
```

This command will create a `.js` file, an `.hbs` file, and add a route in `router.js`:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photo', { path: '/photos/:id' });
});
```

Whatever shows up in the URL at the `:id`, the dynamic segment, will be available in the params for the route's `model` hook.

```javascript {data-filename=app/routes/photo.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    console.log('This came from the URL: ', params.id)
  }
});
```

The `:id` name here isn't something special.
Whatever name you give the dynamic segment, that's the key it will show up as in the `model` parameters.
You could call it `:puppies` in `router.js` if you wanted to, and access it in the model as `params.puppies`.

In the `model` hook for routes with dynamic segments, it's your job to
use the ID (something like `47` or `post-slug`) when you make a data request.

For example, if your app uses Ember Data to make API requests, you could include the ID in a `findRecord`:

```javascript {data-filename=app/routes/photo.js}
import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    this.store.findRecord('photo', params.id)
  }
});
```

### Linking to a dynamic segment

There are two ways to link to a dynamic segment from an `.hbs` template using the
[link-to](../../templates/links/)
helper.
Depending on which approach you use, it will affect whether that route's model hook is run.
To learn how to link to a dynamic segment from within the JavaScript file, see the API documentation on
[`transitionTo`](https://api.emberjs.com/ember/3.8/classes/RouterService/methods/transitionTo?anchor=transitionTo)
instead.

When you provide a string or number to the `link-to`, the dynamic segment's model hook will run when the app transitions to the new route.
In this example, `photo.id` might have a value that's an ID like `4`:

```handlebars
{{#each model as |photo|}}
  {{#link-to "photo" photo.id}}
    link text to display
  {{/link-to}}
{{/each}}
```

However, if you provide the entire model context, the model hook for that URL segment will _not_ be run. In this example, we are passing the entire `photo` record:

```handlebars
{{#each model as |photo|}}
  {{#link-to "photo" photo}}
    link text to display
  {{/link-to}}
{{/each}}
```

If a route you are trying to link to has multiple dynamic segments, be sure to specify all the necessary information for each segment. For example, a route like `/photos/4/comments/18` would need:

```handlebars
{{#link-to "photos.photo.comments.comment" 4 18}}
  link text to display
{{/link-to}}
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

- return static, sample data as a test to see if the problem is really in the model hook, or elsewhere down the line
- study JavaScript Promises in general, to make sure you are returning data from the Promise correctly
- make sure your `model` hook has a `return`
- check to see whether the data returned from a `model` hook is an object, array, or JavaScript Primitive. For example, if the results of `model` are an array, using `{{this.model}}` in the template won't work. You will need to iterate over the results with an `{{#each}}` helper. If the results of `model` are a single object, you need to access the individual attributes like `{{this.model.title}}` to see anything rendered
- use your browser's development tools to examine the outgoing and incoming API responses and see if they match what your code expects
- if you are using Ember Data, use the [Ember Inspector](../../ember-inspector/) browser plugin to see if the records made it into the store
