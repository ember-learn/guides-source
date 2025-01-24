<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/02-building-pages.md -->

In this chapter, you will build the first few pages of your Ember app and set up links between them. By the end of this chapter, you should have two new pages – an about page and a contact page. These pages will be linked to from your landing page:

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="The Super Rentals app (homepage) by the end of the chapter" width="1024" height="251">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="The Super Rentals app (about page) by the end of the chapter" width="1024" height="275">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="The Super Rentals app (contact page) by the end of the chapter" width="1024" height="445">

While building these pages, you will learn about:

- Defining routes
- Using route templates
- Customizing URLs
- Linking pages with the `<LinkTo>` component
- Passing arguments and attributes to components

## Defining Routes

With our [first page](../orientation/) down, let's add another one!

This time, we would like the page to be served on the `/about` URL. In order to do this, we will need to tell Ember about our plan to add a page at that location. Otherwise, Ember will think we have visited an invalid URL!

The place to manage what pages are available is the _router_. Go ahead and open `app/router.js` and make the following change:

```js { data-filename="app/router.js" data-diff="-9,+10,+11,+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {});
Router.map(function () {
  this.route('about');
});
```

This adds a _[route](../../../routing/defining-your-routes/)_ named "about", which is served at the `/about` URL by default.

## Using Route Templates

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

<img src="/images/tutorial/part-1/building-pages/about@2x.png" alt="About page" width="1024" height="250">

With that, our second page is done!

## Defining Routes with Custom Paths

We're on a roll! While we're at it, let's add our third page. This time, things are a little bit different. Everyone at the company calls this the "contact" page. However, the old website we are replacing already has a similar page, which is served at the legacy URL `/getting-in-touch`.

We want to keep the existing URLs for the new website, but we don't want to have to type `getting-in-touch` all over the new codebase! Fortunately, we can have the best of both worlds:

```js { data-filename="app/router.js" data-diff="+11" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
});
```

Here, we added the `contact` route, but explicitly specified a path for the route. This allows us to keep the legacy URL, but use the new, shorter name for the route, as well as the template filename.

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

Ember comes with strong _conventions_ and sensible defaults—if we were starting from scratch, we wouldn't mind the default `/contact` URL. However, if the defaults don't work for us, it is no problem at all to customize Ember for our needs!

Once you have added the route and the template above, we should have the new page available to us at `http://localhost:4200/getting-in-touch`.

<img src="/images/tutorial/part-1/building-pages/contact@2x.png" alt="Contact page" width="1024" height="395">

## Linking Pages with the `<LinkTo>` Component

We just put so much effort into making these pages, we need to make sure people can find them! The way we do that on the web is by using _[hyperlinks](https://developer.mozilla.org/docs/Learn/HTML/Introduction_to_HTML/Creating_hyperlinks)_, or _links_ for short.

Since Ember offers great support for URLs out-of-the-box, we _could_ just link our pages together using the `<a>` tag with the appropriate `href`. However, clicking on those links would require the browser to make a _full-page refresh_, which means that it would have to make a trip back to the server to fetch the page, and then load everything from scratch again.

With Ember, we can do better than that! Instead of the plain-old `<a>` tag, Ember provides an alternative called `<LinkTo>`. For example, here is how you would use it on the pages we just created:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+5" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/about.hbs" data-diff="+9" }
<div class="jumbo">
  <div class="right tomster"></div>
  <h2>About Super Rentals</h2>
  <p>
    The Super Rentals website is a delightful project created to explore Ember.
    By building a property rental site, we can simultaneously imagine traveling
    AND building Ember applications.
  </p>
  <LinkTo @route="contact" class="button">Contact Us</LinkTo>
</div>
```

```handlebars { data-filename="app/templates/contact.hbs" data-diff="+17" }
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
  <LinkTo @route="about" class="button">About</LinkTo>
</div>
```

There is quite a bit going on here, so let's break it down.

`<LinkTo>` is an example of a _[component](../../../components/introducing-components/)_ in Ember—you can tell them apart from regular HTML tags because they start with an uppercase letter. Along with regular HTML tags, components are a key building block that we can use to build up an app's user interface.

We have a lot more to say about components later, but for now, you can think of them as a way to provide _custom tags_ to supplement the built-in ones that came with the browser.

The `@route=...` part is how we pass _[arguments](../../../components/component-arguments-and-html-attributes/)_ into the component. Here, we use this argument to specify _which_ route we want to link to. (Note that this should be the _name_ of the route, not the path, which is why we specified `"about"` instead of `"/about"`, and `"contact"` instead of `"/getting-in-touch"`.)

In addition to arguments, components can also take the usual HTML attributes as well. In our example, we added a `"button"` class for styling purposes, but we could also specify other attributes as we see fit, such as the [ARIA](https://webaim.org/techniques/aria/) [`role` attribute](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles). These are passed without the `@` symbol (`class=...` as opposed to `@class=...`), so that Ember will know they are just regular HTML attributes.

Under the hood, the `<LinkTo>` component generates a regular `<a>` tag for us with the appropriate `href` for the specific route. This `<a>` tag works just fine with _[screen readers](https://webaim.org/projects/screenreadersurvey/)_, as well as allowing our users to bookmark the link or open it in a new tab.

However, when clicking on one of these special links, Ember will intercept the click, render the content for the new page, and update the URL—all performed locally without having to wait for the server, thus avoiding a full page refresh.

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-1/building-pages/index-with-link@2x.png" alt="Index page after adding the link" width="1024" height="251">

<img src="/images/tutorial/part-1/building-pages/about-with-link@2x.png" alt="About page after adding the link" width="1024" height="275">

<img src="/images/tutorial/part-1/building-pages/contact-with-link@2x.png" alt="Contact page after adding the link" width="1024" height="445">

We will learn more about how all of this works soon. In the meantime, go ahead and click on the link in the browser. Did you notice how snappy that was?

Congratulations, you are well on your way to becoming a master page-crafter!
