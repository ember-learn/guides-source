With our first page down, let's add another one!

This time, we would like the page to be served on the `/about` URL. In order to do this, we will need to tell Ember our plan to add a page at that location, otherwise Ember will think we have visited an invalid URL!

The place to manage what pages are available is the _[router]\(TODO: link to router)_. Go ahead and open `app/router.js` and make the following change:

```js { data-filename="app/router.js" data-diff="+10" }
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('about');
});
```

This adds a _[route]\(TODO: link to route)_ named "about", which is served at the `/about` URL by default.

With that in place, we can create a new `app/templates/about.hbs` template with the following content:

```handlebars { data-filename="app/templates/about.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
</div>
```

To see this in action, navigate to `http://localhost:4200/about`.

<!-- TODO: screenshot? -->

With that, our second page is done!

We're on a roll! While we're at it, let's add our third page. This time, things are a little bit different. Everyone at the company calls this the "contact" page. However, the old website we are replacing already has a similar page, which is served at the legacy URL `/getting-in-touch`.

We want to keep the existing URLs for the new website, but `getting-in-touch` is a mouthful to type and say out loud all the time! Fortunately, we can have the best of the both worlds:

```js { data-filename="app/router.js" data-diff="+11" }
import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});
```

Here, we add the `contact` route, but explicitly specify a path for the route. This allows us to keep the legacy URL, but use the new, shorter name for the route as well as the template filename.

Speaking of the template, let's create that as well. We'll add a `app/templates/contact.hbs` file:

```handlebars { data-filename="app/templates/contact.hbs" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Contact Us</h2>
  <p>
    Super Rentals Representatives would love to help you<br>
    choose a destination or answer any questions you may have.
  </p>
  <address>
    Super Rentals HQ
    <p>
      1212 Test Address Avenue<br>
      Testington, OR 97233
    </p>
    <a href="tel:503.555.1212">+1 (503) 555-1212</a><br>
    <a href="mailto:superrentalsrep@emberjs.com">superrentalsrep@emberjs.com</a>
  </address>
</div>
```

Ember comes with strong _[conventions]\(TODO: link to conventions)_ and sensible defaults — if we were starting from scratch, we wouldn't mind the default `/contact` URL. However, if the defaults don't work for us, it is no problem at all to customize Ember for our needs!

Once you have added the route and the template above, we should have the new page available to us at `http://localhost:4200/getting-in-touch`.

<!-- TODO: screenshot? -->

Congratulations, you have completed your training as a master page-crafter!
