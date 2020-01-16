One job of a route handler is rendering the
appropriate template to the screen.

By default, a route handler will render the template with the same name as the
route. Take this router:

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('posts', function() {
    this.route('new');
  });
});
```

Here, the `posts` route will render the `posts.hbs` template, and
the `posts.new` route will render `posts/new.hbs`.

Each template will be rendered into the `{{outlet}}` of its parent route's
template. For example, the `posts.new` route will render its template into the
`post.hbs`'s `{{outlet}}`, and the `posts` route will render its template into
the `application.hbs`'s `{{outlet}}`.

If you want to render a template other than the default one, implement the
`renderTemplate` hook:

```javascript {data-filename=app/routes/posts.js}
export default Ember.Route.extend({
  renderTemplate() {
    this.render('favoritePosts');
  }
});
```

<!-- eof - needed for pages that end in a code block  -->
