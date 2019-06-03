## The `<LinkTo>` Component

You create a link to a route using the
[`<LinkTo>`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=link-to)
component.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photos', function(){
    this.route('edit', { path: '/:photo_id' });
  });
});
```

```handlebars {data-filename=app/templates/photos.hbs}
<ul>
  {{#each this.photos as |photo|}}
    <li><LinkTo @route="photos.edit" @model="photo">{{photo.title}}</LinkTo></li>
  {{/each}}
</ul>
```

If the model for the `photos` template is a list of three photos, the
rendered HTML would look something like this:

```html
<ul>
  <li><a href="/photos/1">Happy Kittens</a></li>
  <li><a href="/photos/2">Puppy Running</a></li>
  <li><a href="/photos/3">Mountain Landscape</a></li>
</ul>
```

The `<LinkTo>` component takes one or two arguments:

* The name of a route. In this example, it would be `index`, `photos`, or
  `photos.edit`.
* At most one model for each [dynamic segment](../../routing/defining-your-routes/#toc_dynamic-segments).
  By default, Ember.js will replace each segment with the value of the corresponding object's `id` property.
  In the example above, the second argument is each `photo` object, and the `id` property is used to fill in
  the dynamic segment with either `1`, `2`, or `3`. If there is no model to pass to the component, you can provide
  an explicit value instead:

```handlebars {data-filename=app/templates/photos.hbs}
<LinkTo @route="photos.edit" @model={{1}}>
  First Photo Ever
</LinkTo>
```

When the rendered link matches the current route, and the same
object instance is passed into the component, then the link is given
`class="active"`. For example, if you were at the URL `/photos/2`,
the first example above would render as:

```html
<ul>
  <li><a href="/photos/1">Happy Kittens</a></li>
  <li><a href="/photos/2" class="active">Puppy Running</a></li>
  <li><a href="/photos/3">Mountain Landscape</a></li>
</ul>
```

### Example for Multiple Segments

If the route is nested, you can supply a model or an identifier for each dynamic
segment.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photos', function(){
    this.route('photo', { path: '/:photo_id' }, function(){
      this.route('comments');
      this.route('comment', { path: '/comments/:comment_id' });
    });
  });
});
```

```handlebars {data-filename=app/templates/photo/index.hbs}
<div class="photo">
  {{this.body}}
</div>

<p><Linkto @route="photos.photo.comment" @model=this.primaryComment}}Main Comment</LinkTo></p>
```

If you specify only one model, it will represent the innermost dynamic segment `:comment_id`.
The `:photo_id` segment will use the current photo.

Alternatively, you could pass both a photo's ID and a comment to the component:

```handlebars {data-filename=app/templates/photo/index.hbs}
<p>
  <LinkTo @route="photo.comment" @models={{array 5 this.primaryComment}}>
    Main Comment for the Next Photo
  </LinkTo>
</p>
```

In the above example, the model hook for `PhotoRoute` will run with `params.photo_id = 5`.  The `model` hook for
`CommentRoute` _won't_ run since you supplied a model object for the `comment` segment. The comment's id will
populate the URL according to `CommentRoute`'s `serialize` hook.

### Setting query-params

The `query-params` helper can be used to set query params on a link:

```handlebars
// Explicitly set target query params
<LinkTo @route="posts" @query={{hash direction="asc"}}>Sort</LinkTo>

// Binding is also supported
<LinkTo @route="posts" @query={{hash direction=this.otherDirection}}>Sort</LinkTo>
```

For more information on how to use query parameters see the [query parameters](../../routing/query-params/) section in Routing.

### Adding additional attributes on a link

When generating a link you might want to set additional attributes for it. You can do this with additional
arguments to the `LinkTo` component:

```handlebars
<p>
  <LinkTo @route="photo.edit" @model={{this.photo}} class="btn btn-primary">Edit this photo</LinkTo>
</p>
```

Many of the common HTML properties you would want to use like `class`, and `rel` will work. When
adding class names, Ember will also apply the standard `ember-view` and possibly `active` class names.

### Replacing history entries

The default behavior for
[`LinkTo`](https://www.emberjs.com/api/ember/release/classes/Ember.Templates.helpers/methods/get?anchor=link-to)
is to add entries to the browser's history when transitioning between the
routes. However, to replace the current entry in the browser's history you
can use the `replace=true` option:

```handlebars
<p>
  <LinkTo @route="photo.comment" @models={{array 5 this.primaryComment}} @replace={{true}}>
    Main Comment for the Next Photo
  </LinkTo>
</p>
```
