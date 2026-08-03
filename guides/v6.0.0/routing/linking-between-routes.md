It is important to be able to switch between routes and link to different parts of
your application. We can do this declaratively in templates using the `<LinkTo>`
component.

## The `<LinkTo />` Component

You create a link to a route using the
[`<LinkTo />`](https://api.emberjs.com/ember/6.0.0/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo)
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
  {{#each this.photos as |p|}}
    <li>
      <LinkTo @route="photos.edit" @model={{p}}>{{p.title}}</LinkTo>
    </li>
  {{/each}}
</ul>
```

The `@route` argument is the name of the route to link to, and the `@model`
argument is a model object to fill in the [dynamic segment](../../routing/defining-your-routes/#toc_dynamic-segments)
for the route.

For example, if `this.photos` is a list of three photos, the rendered HTML
would look something like this:

```html
<ul>
  <li>
    <a href="/photos/1">Happy Kittens</a>
  </li>
  <li>
    <a href="/photos/2">Puppy Running</a>
  </li>
  <li>
    <a href="/photos/3">Mountain Landscape</a>
  </li>
</ul>
```

By default, Ember.js will replace each dynamic segment in the URL with the
model object's `id` property. In the example above, the `@model` argument
is the `photo` objects, and their `id` properties are used to fill in the
dynamic segment in the URL; in this case, either `1`, `2`, or `3`. This
behavior can be customized within `PhotoEditRoute`'s `serialize` hook.

Alternatively, you can explicitly provide a serialized `id`, in place of
passing a model object:

```handlebars {data-filename=app/templates/photos.hbs}
<LinkTo @route="photos.edit" @model="1">First Photo Ever</LinkTo>
```

In this case, the provided `id` will be used to populate the URL's dynamic
segment directly, bypassing the `serialize` hook entirely:

```html
<a href="/photos/1">First Photo Ever</a>
```

When the user clicks on the link, Ember will run the `PhotoEditRoute`'s `model`
hook with `params.photo_id = 1`. On the other hand, if a model object was
passed instead of the `id`, the model hook will _not_ run.

### Active CSS Class

When the generated link matches the current URL, then the generated link tag
will be given the `active` CSS class. For example, if you were at the URL
`/photos/2`, the first example above would render as:

```html
<ul>
  <li>
    <a href="/photos/1">Happy Kittens</a>
  </li>
  <li>
    <a href="/photos/2" class="active">Puppy Running</a>
  </li>
  <li>
    <a href="/photos/3">Mountain Landscape</a>
  </li>
</ul>
```

### Multiple Dynamic Segments

Sometimes, you may need to generate links for nested routes which can
have multiple [dynamic segments](../../routing/defining-your-routes/#toc_dynamic-segments).
For example, consider the following route definitions:

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

Here, the `photos.photo.comment` route have two dynamic segments:
`:photo_id` and `:comment_id`.

When passing a `@model` object to the `<LinkTo />` component, that single model
object will be used to populate the innermost dynamic segment. In this case,
that would be `:comment_id`. The `:photo_id` will be inferred from the current
URL.

For example, if we are currently on `/photos/2`, then the following template:

```handlebars {data-filename=app/templates/photos/photo.hbs}
{{#each this.photo.comments as |comment|}}
  <LinkTo @route="photos.photo.comment" @model={{comment}}>
    {{excerpt comment.body}}...
  </LinkTo>
{{/each}}
```

...will render something like this:

```html
<a href="/photos/2/comment/37">
  Aww this is...
</a>
<a href="/photos/2/comment/44">
  Great puppy...
</a>
<a href="/photos/2/comment/45">
  5/5 would pet...
</a>
```

Note that while `:comment_id` is populated with each comment's `id` (based on
the `@model` argument), the `:photo_id` segment is automatically assumed to be
the same as the corresponding segment in current URL, i.e. `2`.

Ember is only able to infer the dynamic segments because the `photo` route is
currently active. If we were to invoke the `<LinkTo />` component for the same
`photos.photo.comment` route, but from the `photos` route's template, it will
result in an error, as we did not pass enough model objects to populate all the
dynamic segments needed to generate the URL.

To solve this problem, or maybe to cross-link comments from photos other than
the currently active one, you can pass an array of model objects using the
`@models` argument and the `{{array}}` helper:

```handlebars {data-filename=app/templates/photos.hbs}
<h1>Latest Comments</h1>

<ul>
  {{#each this.latestComments as |comment|}}
    <li>
      <LinkTo @route="photos.photo.comment" @models={{array comment.photo comment}}>
        {{excerpt comment.body}}...
      </LinkTo>
    </li>
  {{/each}}
</ul>
```

Here, we are passing an array of model objects (the photo, then the comment),
which is exactly what is needed to populate all the dynamic segments.

The `@model` argument is merely a special case for the more general `@models`
argument. Therefore, it is an error to pass _both_ arguments at the same time.

### Query Params

The `@query` argument, along with the `{{hash}}` helper, can be used to set
query params on a link:

```handlebars
// Explicitly set target query params
<LinkTo @route="posts" @query={{hash direction="asc"}}>Sort</LinkTo>

// Binding is also supported
<LinkTo @route="posts" @query={{hash direction=this.otherDirection}}>Sort</LinkTo>
```

For more information on how to use query parameters see the [query parameters](../../routing/query-params/) section in Routing.

### HTML Attributes

When generating a link, you may want to customize its HTML attributes. For
example, it is quite common to want to add additional CSS classes to the
generated link tag, or specifying the appropriate ARIA attributes. You can
simply pass them along with the invocation:

```handlebars {data-filename=app/templates/photos/edit.hbs}
<LinkTo @route="photos" class="btn btn-primary" role="button" aria-pressed="false">
  Discard Changes
</LinkTo>
```

CSS classes passed this way will be _in addition to_ the standard `ember-view`
and possibly `active` classes.

### Replacing history entries

The default behavior for the `<LinkTo />` component is to add entries to the
browser's history when transitioning between routes. However, to replace the
current entry in the browser's history instead, you can use the `@replace`
option:

```handlebars
<LinkTo @route="photo.comment" @model={{this.topComment}} @replace={{true}}>
  Top comment for the current photo
</Link>
```

<!-- eof - needed for pages that end in a code block  -->
