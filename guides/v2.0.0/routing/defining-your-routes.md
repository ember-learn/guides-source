When your application starts, the router matches the current URL to the _routes_
that you've defined. The routes, in turn, are responsible for displaying
templates, loading data, and otherwise setting up application state.

## Basic Routes

The [map](https://api.emberjs.com/classes/Ember.Router.html#method_map) method
of your Ember application's router can be invoked to define URL mappings. When
calling `map`, you should pass a function that will be invoked with the value
`this` set to an object which you can use to create routes.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('favorites', { path: '/favs' });
});
```

Now, when the user visits `/about`, Ember.js will render the `about`
template. Visiting `/favs` will render the `favorites` template.

You can leave off the path if it is the same as the route
name. In this case, the following is equivalent to the above example:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about');
  this.route('favorites', { path: '/favs' });
});
```

Inside your templates, you can use `{{link-to}}` to navigate between
routes, using the name that you provided to the `route` method.

```handlebars
{{#link-to "index"}}<img class="logo">{{/link-to}}

<nav>
  {{#link-to "about"}}About{{/link-to}}
  {{#link-to "favorites"}}Favorites{{/link-to}}
</nav>
```

The `{{link-to}}` helper will also add an `active` class to the link that
points to the currently active route.

## Nested Routes

Often you'll want to have a template that displays inside another template.
For example, in a blogging application, instead of going from a list of blog
posts to creating a new post, you might want to have the post creation page
display next to the list.

In these cases, you can use nested routes to display one template inside
of another.

You can define nested routes by passing a callback to `this.route`:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

And then add the `{{outlet}}` helper to your template where you want the nested
template to display:

```handlebars {data-filename=templates/posts.hbs}
<h1>Posts</h1>
<!-- Display posts and other content -->
{{outlet}}
```

This router creates a route for `/posts` and for `/posts/new`. When a user
visits `/posts`, they'll simply see the `posts.hbs` template. (Below, [index
routes](#toc_index-routes) explains an important addition to this.) When the
user visits `posts/new`, they'll see the `posts/new.hbs` template rendered into
the `{{outlet}}` of the `posts` template.

A nested route's names includes the names of its ancestors.
If you want to transition to a route (either
via `transitionTo` or `{{#link-to}}`), make sure to use the full route
name (`posts.new`, not `new`).

## The application route

The `application` is entered when your app first boots up. Just like any
other route, it will load an `application` template by default.
You should put your header, footer, and any other decorative content
here. All other routes will render
their templates into the `application.hbs` templates's `{{outlet}}`.

This route is part of every application, so you don't need to
specify it in your `app/router.js`.

## Index Routes

At every level of nesting (including the top level), Ember.js
automatically provides a route for the `/` path named `index`.

For example, if you write a simple router like this:

```javascript {data-filename=app/router.js}
Router.map(function(){
  this.route('favorites');
});
```

It is the equivalent of:

```javascript {data-filename=app/router.js}
Router.map(function(){
  this.route('index', { path: '/' });
  this.route('favorites');
});
```

The `index` template will be rendered into the `{{outlet}}` in the
`application` template. If the user navigates to `/favorites`,
Ember.js will replace the `index` template with the `favorites`
template.

A nested router like this:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('favorites');
  });
});
```

Is the equivalent of:

```javascript {data-filename=app/router.js}
Router.map(function(){
  this.route('index', { path: '/' });
  this.route('posts', function() {
    this.route('index', { path: '/' });
    this.route('favorites');
  });
});
```

If the user navigates to `/posts`, the current route will be
`posts.index`, and the `posts/index` template
will be rendered into the `{{outlet}}` in the `posts` template.

If the user then navigates to `/posts/favorites`, Ember.js will
replace the `{{outlet}}` in the `posts` template with the
`posts/favorites` template.

## Dynamic Segments

One of the responsibilities of a route is to load a model.

For example, if we have the route `this.route('posts');`, our
route might load all of the blog posts for the app.

Because `/posts` represents a fixed model, we don't need any
additional information to know what to retrieve.  However, if we want a route
to represent a single post, we would not want to have to hardcode every
possible post into the router.

Enter _dynamic segments_.

A dynamic segment is a portion of a URL that starts with a `:` and is
followed by an identifier.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

If the user navigates to `/post/5`, the route will then have the `post_id` of
`5` to use to load the correct post. See [Specifying a Route's
Model](../specifying-a-routes-model/) for
more about how to load a model.

## Wildcard / globbing routes

You can define wildcard routes that will match multiple URL segments. This could be used, for example,
if you'd like a catch-all route which is useful when the user enters an incorrect URL not managed
by your app.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('page-not-found', { path: '/*wildcard' });
});
```

## Resetting Nested Route Namespace

When nesting routes, it may be beneficial for a child route to not inherit its ancestors name. This allows you to reference and reuse a given route in multiple route trees as well as keep the class name short.

You can reset the current "namespace" with the aptly named `resetNamespace: true` option.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('post', { path: '/post/:post_id' }, function() {
    this.route('edit');
    this.route('comments', { resetNamespace: true }, function() {
      this.route('new');
    });
  });
});
```

Just like before, the `comments` template will be rendered in the `post`
template's `{{outlet}}`, and all templates under `comments` (`comments/index`
and `comments/new`) will be rendered in the `comments` outlet.

However, the `/post/:id/comments` path will load the `comments.hbs` template,
rather than the `post/comments.hbs` template.

## Route Handlers

To have your route do something beyond render a template with the same name, you'll
need to create a route handler. The following guides will explore the different
features of route handlers. For more information on routes, see the API documentation
for [the router](https://api.emberjs.com/classes/Ember.Router.html) and for [route
handlers](https://api.emberjs.com/classes/Ember.Route.html).
