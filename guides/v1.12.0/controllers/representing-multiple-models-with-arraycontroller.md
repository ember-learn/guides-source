You can use [Ember.ArrayController](https://api.emberjs.com/classes/Ember.ArrayController.html) to represent an array of models. To tell an
`ArrayController` which models to represent, set its `model` property
in your route's `setupController` method.

You can treat an `ArrayController` just like its underlying array. For
example, imagine we want to display the current playlist. In our route,
we setup our `SongsController` to represent the songs in the playlist:

```javascript {data-filename=app/routes/songs.js}
export default Ember.Route.extend({
  setupController: function(controller, playlist) {
    controller.set('model', playlist.get('songs'));
  }
});
```

In the `songs` template, we can use the `{{#each}}` helper to display
each song:

```handlebars {data-filename=app/templates/songs.hbs}
<h1>Playlist</h1>

<ul>
  {{#each model as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>
```

You can use the `ArrayController` to collect aggregate information about
the models it represents. For example, imagine we want to display the
number of songs that are over 30 seconds long. We can add a new computed
property called `longSongCount` to the controller:

```javascript {data-filename=app/controllers/songs.js}
export default Ember.ArrayController.extend({
  longSongCount: function() {
    var longSongs = this.filter(function(song) {
      return song.get('duration') > 30;
    });
    return longSongs.get('length');
  }.property('@each.duration')
});
```

Now we can use this property in our template:

```handlebars {data-filename=app/templates/songs.hbs}
<ul>
  {{#each model as |song|}}
    <li>{{song.name}} by {{song.artist}}</li>
  {{/each}}
</ul>

{{longSongCount}} songs over 30 seconds.
```

### Sorting

The `Ember.ArrayController` uses the [Ember.SortableMixin](https://api.emberjs.com/classes/Ember.SortableMixin.html) to allow sorting
of content. There are two properties that can be set in order to set up sorting:

```javascript {data-filename=app/controllers/songs.js}
export default Ember.ArrayController.extend({
  sortProperties: ['name', 'artist'],
  sortAscending: true // false for descending
});
```

### Item Controller

It is often useful to specify a controller to decorate individual items in
the `ArrayController` while iterating over them. This can be done by
creating a `Controller`:

```javascript {data-filename=app/controllers/song.js}
export default Ember.Controller.extend({

  name: Ember.computed.alias('model.name'),
  artist: Ember.computed.alias('model.artist'),

  fullName: function() {
    return this.get('name') + ' by ' + this.get('artist');
  }.property('name', 'artist')
});
```

Then, the `ArrayController` `itemController` property must be set to
the decorating controller.

```javascript {data-filename=app/controllers/songs.js}
export default Ember.ArrayController.extend({
  itemController: 'song'
});
```

```handlebars {data-filename=app/templates/songs.hbs}
{{#each controller as |item|}}
  <li>{{item.fullName}}</li>
{{/each}}
```

or you could setup the `itemController` directly in the template:

```javascript {data-filename=app/controllers/songs.js}
export default Ember.ArrayController.extend({
});
```

```handlebars {data-filename=app/templates/songs.hbs}
{{#each controller itemController="song" as |item|}}
  <li>{{item.fullName}}</li>
{{/each}}
```

<!-- eof - needed for pages that end in a code block  -->
