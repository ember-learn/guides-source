One job of a route handler is rendering the appropriate template to the screen.

By default, a route handler will render the template with the same name as the
route. Take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

Here, the `posts` route will render the `posts.gjs` template, and
the `posts.new` route will render `posts/new.gjs`.

Each template will be rendered into the `{{outlet}}` of its parent route's
template. For example, the `posts.new` route will render its template into the
`posts.gjs`'s `{{outlet}}`, and the `posts` route will render its template into
the `application.gjs`'s `{{outlet}}`.
