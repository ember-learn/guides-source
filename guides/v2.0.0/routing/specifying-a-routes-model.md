Often, you'll want a template to display data from a model. Loading the
appropriate model is one job of a route.

For example, take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favoritePosts');
});
```

To load a model for the `favoritePosts` route, you would use the `model` hook in
the `posts` route handler:

```javascript {data-filename=app/routes/favorite-posts.js}
export default Ember.Route.extend({
  model() {
    return this.store.query('post', { favorite: true });
  }
});
```

Typically, the `model` hook should return an [Ember Data](../../models/) record,
but it can also return any [promise](https://www.promisejs.org/) object (Ember
Data records are promises/), or a plain JavaScript object or array. Ember will
wait until the data finishes loading (until the promise is resolved/) before
rendering the template.

The return value from the `model` hook is then available in your template and
controller with the `model` property:

```handlebars {data-filename=app/templates/favorite-post.hbs}
<h1>Favorite Posts</h1>
{{#each model as |post|}}
  <p>{{post.body}}</p>
{{/each}}
```

## Dynamic Models

Some routes always display the same model. For example, the `/photos`
route will always display the same list of photos available in the
application. If your user leaves this route and comes back later, the
model does not change.

However, you will often have a route whose model will change depending
on user interaction. For example, imagine a photo viewer app. The
`/photos` route will render the `photos` template with the list of
photos as the model, which never changes. But when the user clicks on a
particular photo, we want to display that model with the `photo`
template. If the user goes back and clicks on a different photo, we want
to display the `photo` template again, this time with a different model.

In cases like this, it's important that we include some information in
the URL about not only which template to display, but also which model.

In Ember, this is accomplished by defining routes with [dynamic
segments](../defining-your-routes/#toc_dynamic-segments).

Once you have defined a route with a dynamic segment,
Ember will extract the value of the dynamic segment from the URL for
you and pass them as a hash to the `model` hook as the first argument:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photo', { path: '/photos/:photo_id' });
});
```

```javascript {data-filename=app/routes/photo.js}
export default Ember.Route.extend({
  model(params) {
    return this.store.findRecord('photo', params.photo_id);
  }
});
```

In the `model` hook for routes with dynamic segments, it's your job to
turn the ID (something like `47` or `post-slug`) into a model that can
be rendered by the route's template. In the above example, we use the
photo's ID (`params.photo_id`) as an argument to Ember Data's `findRecord`
method.

Note: A route with a dynamic segment will only have its `model` hook called
when it is entered via the URL. If the route is entered through a transition
(e.g. when using the [link-to](../../templates/links/) Handlebars helper/), then a model context is
already provided and the hook is not executed. Routes without dynamic segments
will always execute the model hook.

## Multiple Models

Multiple models can be returned through an
[Ember.RSVP.hash](https://api.emberjs.com/classes/RSVP.html#method_hash).
The `Ember.RSVP.hash` takes
parameters that return promises, and when all parameter promises resolve, then
the `Ember.RSVP.hash` promise resolves. For example:

```javascript {data-filename=app/routes/songs.js}
export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
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
  {{#each model.songs as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>

<h1>Albums</h1>

<ul>
  {{#each model.albums as |album|}}
    <li>{{album.title}} by {{album.artist}}</li>
  {{/each}}
</ul>
```

<!-- eof - needed for pages that end in a code block  -->
