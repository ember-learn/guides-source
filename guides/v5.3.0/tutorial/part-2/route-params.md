<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/09-route-params.md -->

Now that we are fetching real data from our "server", let's add a new feature — dedicated pages for each of our rentals:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="The Super Rentals app (rentals page) by the end of the chapter" width="1024" height="1382">

While adding these rental pages, you will learn about:

- Routes with dynamic segments
- Links with dynamic segments
- Component tests with access to the router
- Accessing parameters from dynamic segments
- Sharing common setup code between tests

## Routes with Dynamic Segments

It would be great for our individual rental pages to be available through predictable URLs like `/rentals/grand-old-mansion`. Also, since these pages are dedicated to individual rentals, we can show more detailed information about each property on this page. It would also be nice to be able to have a way to bookmark a rental property, and share direct links to each individual rental listing so that our users can come back to these pages later on, after they are done browsing.

But first things first: we need to add a route for this new page. We can do that by adding a `rental` route to the router.

```js { data-filename="app/router.js" data-diff="+12" }
import EmberRouter from '@ember/routing/router';
import config from 'super-rentals/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('about');
  this.route('contact', { path: '/getting-in-touch' });
  this.route('rental', { path: '/rentals/:rental_id' });
});
```

Notice that we are doing something a little different here. Instead of using the default path (`/rental`), we're specifying a custom path. Not only are we using a custom path, but we're also passing in a `:rental_id`, which is what we call a _[dynamic segment](../../../routing/defining-your-routes/#toc_dynamic-segments)_. When these routes are evaluated, the `rental_id` will be substituted with the `id` of the individual rental property that we are trying to navigate to.

## Links with Dynamic Segments

Now that we have this route in place, we can update our `<Rental>` component to actually _link_ to each of our detailed rental properties!

```js { data-filename="app/components/rental.hbs" data-diff="-7,+8,+9,+10,+11,+12" }
<article class="rental">
  <Rental::Image
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />
  <div class="details">
    <h3>{{@rental.title}}</h3>
    <h3>
      <LinkTo @route="rental" @model={{@rental}}>
        {{@rental.title}}
      </LinkTo>
    </h3>
    <div class="detail owner">
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of {{@rental.title}}"
  />
</article>
```

Since we know that we're linking to the `rental` route that we just created, we also know that this route requires a dynamic segment. Thus, we need to pass in a `@model` argument so that the `<LinkTo>` component can generate the appropriate URL for that model.

Let's see this in action. If we go back to our browser and refresh the page, we should see our links, but something isn't quite right yet!

<img src="/images/tutorial/part-2/route-params/broken-links@2x.png" alt="Broken links" width="1024" height="1130">

The links are all pointing to `/rentals/undefined`. Yikes! This is because `<LinkTo>` tries to use the `id` property from our model in order to replace the dynamic segment and generate the URL.

So what's the problem here? Well, our model doesn't actually have an `id` property! So _of course_ the `<LinkTo>` component isn't going to be able to find it and use it to generate the URL. Oops!

Thankfully, we can fix this pretty easily. As it turns out, the data that is returned by our server—the JSON data that lives in our `public/api` folder—actually does have an `id` attribute on it. We can double check this by going to `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-2/route-params/data@2x.png" alt="Our data do have an id attribute" width="1024" height="512">

If we look at the JSON data here, we can see that the `id` is included right alongside the `attributes` key. So we have access to this data; the only trouble is that we're not including it in our model! Let's change our model hook in the `index` route so that it includes the `id`.

```js { data-filename="app/routes/index.js" data-diff="-11,+12,-21,+22" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let { id, attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { type, ...attributes };
      return { id, type, ...attributes };
    });
  }
}
```

Now that we've included our model's `id`, we should see the correct URLs to each rental property on our index page after refreshing the page.

## Component Tests with Access to the Router

Alright, we have just one more step left here: updating the tests. We can add an `id` to the rental that we defined in our test using `setProperties` and add an assertion for the expected URL, too.

```js { data-filename="tests/integration/components/rental-test.js" data-diff="+12,+34,+35,+36" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });

    await render(hbs`<Rental @rental={{this.rental}} />`);

    assert.dom('article').hasClass('rental');
    assert.dom('article h3').hasText('Grand Old Mansion');
    assert
      .dom('article h3 a')
      .hasAttribute('href', '/rentals/grand-old-mansion');
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

If we run the tests in the browser, everything should just pass!

<img src="/images/tutorial/part-2/route-params/pass@2x.png" alt="Tests are passing" width="1024" height="768">

## Accessing Parameters from Dynamic Segments

Awesome! We're making such great progress.

Now that we have our `rental` route, let's finish up our `rental` page. The first step to doing this is making our route actually _do_ something. We added the route, but we haven't actually implemented it. So let's do that first by creating the route file.

```js { data-filename="app/routes/rental.js" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class RentalRoute extends Route {
  async model(params) {
    let response = await fetch(`/api/rentals/${params.rental_id}.json`);
    let { data } = await response.json();

    let { id, attributes } = data;
    let type;

    if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
      type = 'Community';
    } else {
      type = 'Standalone';
    }

    return { id, type, ...attributes };
  }
}
```

We'll notice that the model hook in our `RentalRoute` is _almost_ the same as our `IndexRoute`. There is one major difference between these two routes, and we can see that difference reflected here.

Unlike the `IndexRoute`, we have a `params` object being passed into our model hook. This is because we need to fetch our data from the `/api/rentals/${id}.json` endpoint, _not_ the `/api/rentals.json` endpoint we were previously using. We already know that the individual rental endpoints fetch a single rental object, rather than an array of them, and that the route uses a `/:rental_id` dynamic segment to figure out which rental object we're trying to fetch from the server.

But how does the dynamic segment actually get to the `fetch` function? Well, we have to pass it into the function. Conveniently, we have access to the value of the `/:rental_id` dynamic segment through the `params` object. This is why we have a `params` argument in our model hook here. It is being passed through to this hook, and we use the `params.rental_id` attribute to figure out what data we want to `fetch`.

Other than these minor differences though, the rest of the route is pretty much the same to what we had in our index route.

## Displaying Model Details with a Component

Next, let's make a `<Rental::Detailed>` component.

```shell
$ ember generate component rental/detailed
installing component
  create app/components/rental/detailed.hbs
  skip app/components/rental/detailed.ts
  tip to add a class, run `ember generate component-class rental/detailed`
installing component-test
  create tests/integration/components/rental/detailed-test.js

Running "lint:fix" script...
```

```handlebars { data-filename="app/components/rental/detailed.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45" }
{{yield}}
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
    Share on Twitter
  </a>
</Jumbo>

<article class="rental detailed">
  <Rental::Image
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />

  <div class="details">
    <h3>About {{@rental.title}}</h3>

    <div class="detail owner">
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> {{@rental.type}} – {{@rental.category}}
    </div>
    <div class="detail location">
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
    <div class="detail description">
      <p>{{@rental.description}}</p>
    </div>
  </div>

  <Map
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="12"
    @width="894"
    @height="600"
    alt="A map of {{@rental.title}}"
    class="large"
  />
</article>
```

This component is similar to our `<Rental>` component, except for the following differences.

- It shows a banner with a share button at the top (Implementation to come later).
- It shows a bigger image by default, with some additional detailed information.
- It shows a bigger map.
- It shows a description.

## Sharing Common Setup Code Between Tests

Now that we have this template in place, we can add some tests for this new component of ours.

```handlebars { data-filename="tests/integration/components/rental/detailed-test.js" data-diff="-9,-10,-11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,-34,+35,+36,-38,+39,+40,+41,+42,+43,+44,+45,-47,-48,-49,-50,-51,-52,+53,+54,-56,+57,+58,+59,+60,+61,+62,+63,+64" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental/detailed', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
  hooks.beforeEach(function () {
    this.setProperties({
      rental: {
        id: 'grand-old-mansion',
        title: 'Grand Old Mansion',
        owner: 'Veruca Salt',
        city: 'San Francisco',
        location: {
          lat: 37.7749,
          lng: -122.4194,
        },
        category: 'Estate',
        type: 'Standalone',
        bedrooms: 15,
        image:
          'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
        description:
          'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
      },
    });
  });

    await render(hbs`<Rental::Detailed />`);
  test('it renders a header with a share button', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom().hasText('');
    assert.dom('.jumbo').exists();
    assert.dom('.jumbo h2').containsText('Grand Old Mansion');
    assert
      .dom('.jumbo p')
      .containsText('a nice place to stay near San Francisco');
    assert.dom('.jumbo a.button').containsText('Share on Twitter');
  });

    // Template block usage:
    await render(hbs`
      <Rental::Detailed>
        template block text
      </Rental::Detailed>
    `);
  test('it renders detailed information about a rental property', async function (assert) {
    await render(hbs`<Rental::Detailed @rental={{this.rental}} />`);

    assert.dom().hasText('template block text');
    assert.dom('article').hasClass('rental');
    assert.dom('article h3').containsText('About Grand Old Mansion');
    assert.dom('article .detail.owner').containsText('Veruca Salt');
    assert.dom('article .detail.type').containsText('Standalone – Estate');
    assert.dom('article .detail.location').containsText('San Francisco');
    assert.dom('article .detail.bedrooms').containsText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

We can use the `beforeEach` hook to share some boilerplate code, which allows us to have two tests that each focus on a different, single aspect of the component. This feels similar to other tests that we've already written—hopefully it feels easy, too!

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>As its name implies, the <code>beforeEach</code> hook runs <em>once</em> before each <code>test</code> function is executed. This hook is the ideal place to set up anything that might be needed by all test cases in the file. On the other hand, if you need to do any cleanup after your tests, there is an <code>afterEach</code> hook!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

<img src="/images/tutorial/part-2/route-params/pass-2@2x.png" alt="Tests are passing as expected" width="1024" height="768">

## Adding a Route Template

Finally, let's add a `rental` template to actually _invoke_ our `<Rental::Detailed>` component, as well as adding an acceptance test for this new behavior in our app.

```handlebars { data-filename="app/templates/rental.hbs" }
<Rental::Detailed @rental={{@model}} />
```

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'super-rentals/tests/helpers';

module('Acceptance | super rentals', function (hooks) {
  setupApplicationTest(hooks);

  test('visiting /', async function (assert) {
    await visit('/');

    assert.strictEqual(currentURL(), '/');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Welcome to Super Rentals!');

    assert.dom('.jumbo a.button').hasText('About Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('viewing the details of a rental property', async function (assert) {
    await visit('/');
    assert.dom('.rental').exists({ count: 3 });

    await click('.rental:first-of-type a');
    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
  });

  test('visiting /rentals/grand-old-mansion', async function (assert) {
    await visit('/rentals/grand-old-mansion');

    assert.strictEqual(currentURL(), '/rentals/grand-old-mansion');
    assert.dom('nav').exists();
    assert.dom('h1').containsText('SuperRentals');
    assert.dom('h2').containsText('Grand Old Mansion');
    assert.dom('.rental.detailed').exists();
  });

  test('visiting /about', async function (assert) {
    await visit('/about');

    assert.strictEqual(currentURL(), '/about');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('About Super Rentals');

    assert.dom('.jumbo a.button').hasText('Contact Us');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/getting-in-touch');
  });

  test('visiting /getting-in-touch', async function (assert) {
    await visit('/getting-in-touch');

    assert.strictEqual(currentURL(), '/getting-in-touch');
    assert.dom('nav').exists();
    assert.dom('h1').hasText('SuperRentals');
    assert.dom('h2').hasText('Contact Us');

    assert.dom('.jumbo a.button').hasText('About');
    await click('.jumbo a.button');

    assert.strictEqual(currentURL(), '/about');
  });

  test('navigating using the nav-bar', async function (assert) {
    await visit('/');

    assert.dom('nav').exists();
    assert.dom('nav a.menu-index').hasText('SuperRentals');
    assert.dom('nav a.menu-about').hasText('About');
    assert.dom('nav a.menu-contact').hasText('Contact');

    await click('nav a.menu-about');
    assert.strictEqual(currentURL(), '/about');

    await click('nav a.menu-contact');
    assert.strictEqual(currentURL(), '/getting-in-touch');

    await click('nav a.menu-index');
    assert.strictEqual(currentURL(), '/');
  });
});
```

Now, when we visit `http://localhost:4200/rentals/grand-old-mansion`, this is what we see:

<img src="/images/tutorial/part-2/route-params/grand-old-mansion@2x.png" alt="A dedicated page for the Grand Old Mansion" width="1024" height="1382">

And if we run our tests now...

<img src="/images/tutorial/part-2/route-params/pass-3@2x.png" alt="All tests passing!" width="1024" height="768">

...they all pass! Great work!

This page _looks_ done, but we have a share button that doesn't actually work. We'll address this in the next chapter.
