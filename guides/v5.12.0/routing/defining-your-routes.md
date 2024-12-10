When your application starts, the router matches the current URL to the _routes_
that you've defined. The routes, in turn, are responsible for displaying
templates, loading data, and setting up application state.

To define a route, run

```bash
ember generate route route-name
```

This creates a route file at `app/routes/route-name.js`, a template for the route at `app/templates/route-name.hbs`,
and a unit test file at `tests/unit/routes/route-name-test.js`.
It also adds the route to the router.

## Basic Routes

The [`map()`](https://api.emberjs.com/ember/5.12.0/classes/EmberRouter/methods/map?anchor=map) method
of your Ember application's router can be invoked to define URL mappings. When
calling `map()`, you should pass a function that will be invoked with the value
`this` set to an object which you can use to create routes.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about', { path: '/about' });
  this.route('favorites', { path: '/favs' });
});
```

Now, when the user visits `/about`, Ember will render the `about`
template. Visiting `/favs` will render the `favorites` template.

You can leave off the path if it is the same as the route
name. In this case, the following is equivalent to the above example:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('about');
  this.route('favorites', { path: '/favs' });
});
```

Inside your templates, you can use [`<LinkTo />`](https://api.emberjs.com/ember/5.12.0/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo) to navigate between
routes, using the name that you provided to the `route` method.

```handlebars
<LinkTo @route="index">
  <img class="logo">
</LinkTo>

<nav>
  <LinkTo @route="about">About</LinkTo>
  <LinkTo @route="favorites">Favorites</LinkTo>
</nav>
```

The `<LinkTo />` component will also add an `active` class to the link that
points to the currently active route.

Multi-word route names are conventionally dasherized, such as:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('blog-post', { path: '/blog-post' });
});
```

The route defined above will by default use the `blog-post.js` route handler,
the `blog-post.hbs` template, and be referred to as `blog-post` in any
`<LinkTo />` components.

Multi-word route names that break this convention, such as:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('blog_post', { path: '/blog-post' });
});
```

will still by default use the `blog-post.js` route handler and the
`blog-post.hbs` template, but will be referred to as `blog_post` in any
`<LinkTo />` components.

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

Assuming you have already generated the `posts` route, to generate the above nested route you would run:

```bash
ember generate route posts/new
```

And then add the `{{outlet}}` helper to your template where you want the nested
template to display. You can also add a page title with the current page name (using [page-title helper](../../accessibility/page-template-considerations/#toc_page-title)), this will help users with assistive technology know where they are in the website.

```handlebars {data-filename=templates/posts.hbs}
{{page-title "Posts - Site Title"}}
<h1>Posts</h1>
{{!-- Display posts and other content --}}
{{outlet}}
```

This generates a route for `/posts` and for `/posts/new`. When a user
visits `/posts`, they'll simply see the `posts.hbs` template. (Below, [index
routes](#toc_index-routes) explains an important addition to this.) When the
user visits `posts/new`, they'll see the `posts/new.hbs` template rendered into
the `{{outlet}}` of the `posts` template.

A nested route name includes the names of its ancestors.
If you want to transition to a route (either
via `transitionTo` or `<LinkTo />`), make sure to use the full route
name (`posts.new`, not `new`).

## The application route

The `application` route is entered when your app first boots up. Like other
routes, it will load a template with the same name (`application` in
this case) by default.
You should put your header, footer, and any other decorative content
here. All other routes will render
their templates into the `application.hbs` template's `{{outlet}}`.

This route is part of every application, so you don't need to
specify it in your `app/router.js`.

## Index Routes

At every level of nesting (including the top level), Ember
automatically provides a route for the `/` path named `index`.
To see when a new level of nesting occurs, check the router,
whenever you see a `function`, that's a new level.

For example, if you write a simple router like this:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('favorites');
});
```

It is the equivalent of:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('favorites');
});
```

The `index` template will be rendered into the `{{outlet}}` in the
`application` template. If the user navigates to `/favorites`,
Ember will replace the `index` template with the `favorites`
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
Router.map(function() {
  this.route('index', { path: '/' });
  this.route('posts', function() {
    this.route('index', { path: '/' });
    this.route('favorites');
  });
});
```

Likewise, if the user navigates to `/posts`, the current route will be
`posts.index`, and the `posts/index` template
will be rendered into the `{{outlet}}` of the `posts` template.

If the user then navigates to `/posts/favorites`, Ember will
replace the `{{outlet}}` in the `posts` template with the
`posts/favorites` template.

The following scenarios may help with understanding the `index` route:

- The top-level index route is analogous to `index.html`. For example, when someone visits `https://some-ember-app.com`, the contents of the `template/index.hbs` file will be rendered. There is no need to add an entry `this.route('index', { path: '/' });` in `app/router.js` file. The `index` route is implicitly included in order to help reduce verbose declarations in the `app/router.js`. The `app/router.js` file could be empty, and the `index` would still be shown:

```javascript {data-filename=app/router.js}
Router.map(function() {
});
```
- When a user navigates to `/posts`, the contents of `index.hbs` will be rendered. This is similar to a user navigating to the child route of `/posts`. `/posts/index` is a child route like `/posts/comments` or `/posts/likes`.

### When to use an index route

The index route is most helpful for rendering a view when the route has [dynamic segments](#toc_dynamic-segments) defined in it or there are nested routes. In other words, an `index` template is used to show content that should not be present on sibling and child routes. For example, a blog app might have an `index` route that shows a list of all posts, but if a user clicks on a post, they should only see the content for the individual post. Here is how that looks in practice:

A `templates/posts.hbs` file has the following:

```handlebars {data-filename=templates/posts.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
{{outlet}}
```

The `templates/posts/index.hbs` file has the following:

```handlebars {data-filename=templates/posts/index.hbs}
{{page-title "Posts"}}
<p>This is the posts/index template with a list of posts</p>
```

The `templates/posts/post.hbs` file has the following:

```handlebars {data-filename=templates/posts/post.hbs}
{{page-title "Post"}}
<p>This is an individual post, from the posts/post template, used when we enter the /posts/:post_id route</p>
```

This is equivalent to having the following entry in `app/router.js` file

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('post', { path: '/:post_id' });
    this.route('index', { path: '/' });
  })
});
```

When the user navigates to `/posts/123`, the following markup will be seen:

```handlebars {data-filename=templates/posts/post.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
<p>This is an individual post, from the posts/post template, used when we enter the /posts/:post_id route</p>
```

When the user navigates to `/posts/`, the following markup will be seen:

```handlebars {data-filename=templates/posts/index.hbs}
{{page-title "Posts"}}
<h1>This is the posts template, containing headers to show on all child routes</h1>
<p>This is the posts/index template with a list of posts</p>
```

## Dynamic Segments

One of the responsibilities of a route is to load a model.

For example, if we have the route `this.route('posts');`, our
route might load all of the blog posts for the app.

Because `/posts` represents a fixed model, we don't need any
additional information to know what to retrieve.  However, if we want a route
to represent a single post, we would not want to have to hardcode every
possible post into the router.

Enter _dynamic segments_.

A dynamic segment is a portion of a URL that starts with a `:` and is followed by an identifier.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts');
  this.route('post', { path: '/post/:post_id' });
});
```

If the user navigates to `/post/5`, the route will then have the `post_id` of
`5` to use to load the correct post.
Ember follows the convention of `:model-name_id` because `params` is an object, and can only have one value associated with a key.
To put it in code, the following will _not_ work properly:

```javascript {data-filename=app/router.js}
// This won't work! The dynamic segments will collide.
Router.map(function() {
  this.route('photo', { path: '/photo/:id' }, function() {
    this.route('comment', { path: '/comment/:id' });
  });
});
```

But the following will:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('photo', { path: '/photo/:photo_id' }, function() {
    this.route('comment', { path: '/comment/:comment_id' });
  });
});
```

In the next section, [Specifying a Route's Model](../specifying-a-routes-model/), you will learn more about how to load a model.

## Wildcard / globbing routes

You can define wildcard routes that will match multiple URL segments.
This could be used, for example, if you'd like a catch-all route which is useful when the user enters an incorrect URL not managed by your app.
Wildcard routes begin with an asterisk.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('not-found', { path: '/*path' });
});
```

```handlebars {data-filename=app/templates/not-found.hbs}
{{page-title "Not found"}}
<p>Oops, the page you're looking for wasn't found</p>
```

In the above example we have successfully used a wildcard route to handle all routes not managed by our application
so that when a user navigates to `/a/non-existent/path` they will be shown a message that says the page they're looking for wasn't found.

Note that if you want to manually transition to this wildcard route, you need to pass an arbitrary (not empty) argument. For example, using EmberData to find a record:

```javascript {data-filename=app/routes/some-route.js}
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class SomeRouteRoute extends Route {
  @service store;
  @service router;
  // …
  @action
  async visitUserProfile(id) {
    this.store.findRecord('user', id).then(function (user) {
      // Success callback
      this.router.transitionTo('user.profile', user);
    }).catch(function () {
      // Error callback
      this.router.transitionTo('not-found', 404);
    }
  }
}
```
## Route Handlers

To have your route do something beyond render a template with the same name, you'll
need to create a route handler. The following guides will explore the different
features of route handlers. For more information on routes, see the API documentation
for [the router](https://api.emberjs.com/ember/5.12.0/classes/EmberRouter) and for [route
handlers](https://api.emberjs.com/ember/5.12.0/classes/Route).

## Transitioning Between Routes
Once the routes are defined, how do we go about transitioning between them within our application? It depends on where the transition needs to take place:

- From a template, use [`<LinkTo />`](https://api.emberjs.com/ember/5.12.0/classes/Ember.Templates.components/methods/LinkTo?anchor=LinkTo) as mentioned above
- From anywhere else in your application, such as a component, inject the [Router Service](https://api.emberjs.com/ember/5.12.0/classes/RouterService) and use the [`transitionTo()`](https://api.emberjs.com/ember/5.12.0/classes/RouterService/methods/transitionTo?anchor=transitionTo) method
