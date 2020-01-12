One of the most important jobs of a route handler is rendering the
appropriate template to the screen.

By default, a route handler will render the template into the closest
parent with a template.

```javascript {data-filename=app/router.js}
Router.map(function() {
  this.route('post');
});
```

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend();
```

If you want to render a template other than the one associated with the
route handler, implement the `renderTemplate` hook:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  renderTemplate() {
    this.render('favoritePost');
  }
});
```

If you want to use a different controller than the route handler's
controller, pass the controller's name in the `controller` option:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  renderTemplate() {
    this.render({ controller: 'favoritePost' });
  }
});
```

Ember allows you to name your outlets. For instance, this code allows
you to specify two outlets with distinct names:

```handlebars {data-filename=app/templates/application.hbs}
<div class="toolbar">{{outlet "toolbar"}}</div>
<div class="sidebar">{{outlet "sidebar"}}</div>
```

So, if you want to render your posts into the `sidebar` outlet, use code
like this:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  renderTemplate() {
    this.render({ outlet: 'sidebar' });
  }
});
```

All of the options described above can be used together in whatever
combination you'd like:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  renderTemplate() {
    var controller = this.controllerFor('favoritePost');

    // Render the `favoritePost` template into
    // the outlet `post`, and use the `favoritePost`
    // controller.
    this.render('favoritePost', {
      outlet: 'post',
      controller: controller
    });
  }
});
```

If you want to render two different templates into outlets of two different rendered templates of a route:

```javascript {data-filename=app/routes/post.js}
export default Ember.Route.extend({
  renderTemplate() {
    this.render('favoritePost', {   // the template to render
      into: 'posts',                // the template to render into
      outlet: 'post',              // the name of the outlet in that template
      controller: 'blogPost'        // the controller to use for the template
    });
    this.render('comments', {
      into: 'favoritePost',
      outlet: 'comment',
      controller: 'blogPost'
    });
  }
});
```

<!-- eof - needed for pages that end in a code block  -->
