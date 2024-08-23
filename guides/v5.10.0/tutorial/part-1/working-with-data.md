<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/08-working-with-data.md -->

In this chapter, we will remove the hard-coded data from our `<Rental>` component. By the end, your app would finally be displaying real data that came from the server:

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

In this chapter, you will learn about:

- Working with route files
- Returning local data from the model hook
- Accessing route models from templates
- Mocking server data with static JSON files
- Fetching remote data from the model hook
- Adapting server data
- Loops and local variables in templates with `{{#each}}`

## Working with Route Files

So far, we've been hard-coding everything into our `<Rental>` component. But that's probably not very sustainable, since eventually, we want our data to come from a server instead. Let's go ahead and move some of those hard-coded values out of the component in preparation for that.

We want to start working towards a place where we can eventually fetch data from the server, and then render the requested data as dynamic content from the templates. In order to do that, we will need a place where we can write the code for fetching data and loading it into the routes.

In Ember, _[route files](../../../routing/defining-your-routes/)_ are the place to do that. We haven't needed them yet, because all our routes are essentially just rendering static pages up until this point, but we are about to change that.

Let's start by creating a route file for the index route. We will create a new file at `app/routes/index.js` with the following content:

```js { data-filename="app/routes/index.js" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
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
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    };
  }
}
```

There's a lot happening here that we haven't seen before, so let's walk through this. First, we're importing the _[`Route` class](https://api.emberjs.com/ember/5.10.0/classes/Route)_ into the file. This class is used as a starting point for adding functionality to a route, such as loading data.

Then, we are extending the `Route` class into our _own_ `IndexRoute`, which we also _[`export`](https://javascript.info/import-export#export-default)_ so that the rest of the application can use it.

## Returning Local Data from the Model Hook

So far, so good. But what's happening inside of this route class? We implemented an _[async](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Concepts)_ method called `model()`. This method is also known as the _model hook_.

The model hook is responsible for fetching and preparing any data that you need for your route. Ember will automatically call this hook when entering a route, so that you can have an opportunity to run your own code to get the data you need. The object returned from this hook is known as the _[model](../../../routing/specifying-a-routes-model/)_ for the route (surprise!).

Usually, this is where we'd fetch data from a server. Since fetching data is usually an asynchronous operation, the model hook is marked as `async`. This gives us the option of using the `await` keyword to wait for the data fetching operations to finish.

We'll get to that bit later on. At the moment, we are just returning the same hard-coding model data, extracted from the `<Rental>` component, but in a _[JavaScript object](https://developer.mozilla.org/docs/Learn/JavaScript/Objects/Basics)_ format.

## Accessing Route Models from Templates

So, now that we've prepared some model data for our route, let's use it in our template. In route templates, we can access the model for the route as `@model`. In our case, that would contain the POJO returned from our model hook.

To test that this is working, let's modify our template and try to render the `title` property from our model:

```handlebars { data-filename="app/templates/index.hbs" data-diff="+7,+8" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
  </ul>
</div>
```

If we look at our page in the browser, we should see our model data reflected as a new header.

<img src="/images/tutorial/part-1/working-with-data/model-header@2x.png" alt="New header using the @model data" width="1024" height="512">

Awesome!

Okay, now that we know that we have a model to use at our disposal, let's remove some of the hard-coding that we did earlier! Instead of explicitly hard-coding the rental information into our `<Rental>` component, we can pass the model object to our component instead.

Let's try it out.

First, let's pass in our model to our `<Rental>` component as the `@rental` argument. We will also remove the extraneous `<h1>` tag we added earlier, now that we know things are working:

```handlebars { data-filename="app/templates/index.hbs" data-diff="-7,-8,-11,-12,-13,+14,+15,+16" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<h1>{{@model.title}}</h1>

<div class="rentals">
  <ul class="results">
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
  </ul>
</div>
```

By passing in `@model` into the `<Rental>` component as the `@rental` argument, we will have access to our "Grand Old Mansion" model object in the `<Rental>` component's template! Now, we can replace our hard-coded values in this component by using the values that live on our `@rental` model.

```handlebars { data-filename="app/components/rental.hbs" data-diff="-3,-4,+5,+6,-9,+10,-12,+13,-16,+17,-20,+21,-24,+25,-29,-30,+31,+32,-36,+37" }
<article class="rental">
  <Rental::Image
    src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
    alt="A picture of Grand Old Mansion"
    src={{@rental.image}}
    alt="A picture of {{@rental.title}}"
  />
  <div class="details">
    <h3>Grand Old Mansion</h3>
    <h3>{{@rental.title}}</h3>
    <div class="detail owner">
      <span>Owner:</span> Veruca Salt
      <span>Owner:</span> {{@rental.owner}}
    </div>
    <div class="detail type">
      <span>Type:</span> Standalone
      <span>Type:</span> {{@rental.type}}
    </div>
    <div class="detail location">
      <span>Location:</span> San Francisco
      <span>Location:</span> {{@rental.city}}
    </div>
    <div class="detail bedrooms">
      <span>Number of bedrooms:</span> 15
      <span>Number of bedrooms:</span> {{@rental.bedrooms}}
    </div>
  </div>
  <Map
    @lat="37.7749"
    @lng="-122.4194"
    @lat={{@rental.location.lat}}
    @lng={{@rental.location.lng}}
    @zoom="9"
    @width="150"
    @height="150"
    alt="A map of Grand Old Mansion"
    alt="A map of {{@rental.title}}"
  />
</article>
```

Since the model object contains exactly the same data as the previously-hard-coded "Grand Old Mansion", the page should look exactly the same as before the change.

<img src="/images/tutorial/part-1/working-with-data/using-model-data@2x.png" alt="New header using the @model data" width="1024" height="512">

Now, we have one last thing to do: update the tests to reflect this change.

Because component tests are meant to render and test a single component in isolation from the rest of the app, they do not perform any routing, which means we won't have access to the same data returned from the `model` hook.

Therefore, in our `<Rental>` component's test, we will have to feed the data into it some other way. We can do this using the `setProperties` we learned about from the [previous chapter](../reusable-components/).

```js { data-filename="tests/integration/components/rental-test.js" data-diff="-10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(hbs`<Rental />`);
    this.setProperties({
      rental: {
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
    assert.dom('article .detail.owner').includesText('Veruca Salt');
    assert.dom('article .detail.type').includesText('Standalone');
    assert.dom('article .detail.location').includesText('San Francisco');
    assert.dom('article .detail.bedrooms').includesText('15');
    assert.dom('article .image').exists();
    assert.dom('article .map').exists();
  });
});
```

Notice that we also need to update the invocation of the `<Rental>` component in the `render` function call to also have a `@rental` argument passed into it. If we run our tests now, they should all pass!

<img src="/images/tutorial/part-1/working-with-data/pass@2x.png" alt="All our tests are passing" width="1024" height="768">

## Mocking Server Data with Static JSON Files

Now that we have things in place, let's do the fun part of removing _all_ our hard-coded values from the model hook and actually fetch some data from the server!

In a production app, the data that we'd fetch would most likely come from a remote API server. To avoid setting up an API server just for this tutorial, we will put some JSON data into the `public` folder instead. That way, we can still request this JSON data with regular HTTP requests—just like we would with a real API server —but without having to write any server logic.

But where will the data come from? You can <a href="/downloads/data.zip" download="data.zip">download this data file</a>, where we have prepared some JSON data and bundled it into a `.zip` file format. Extract its content into the `public` folder.

When you are done, your `public` folder should now have the following content:

```plain
public
├── api
│   ├── rentals
│   │   ├── downtown-charm.json
│   │   ├── grand-old-mansion.json
│   │   └── urban-living.json
│   └── rentals.json
├── assets
│   └── images
│       └── teaching-tomster.png
└── robots.txt

4 directories, 6 files
```

You can verify that everything is working correctly by navigating to `http://localhost:4200/api/rentals.json`.

<img src="/images/tutorial/part-1/working-with-data/data@2x.png" alt="Our server serving up our rental properties as JSON data" width="1024" height="512">

Awesome! Our "server" is now up and running, serving up our rental properties as JSON data.

## Fetching Remote Data from the Model Hook

Now, let's turn our attention to our model hook again. We need to change it so that we actually fetch the data from the server.

```js { data-filename="app/routes/index.js" data-diff="-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,+19,+20,+21" }
import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  async model() {
    return {
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
      image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg',
      description: 'This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests.',
    };
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
  }
}
```

What's happening here?

First off, we're using the browser's _[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)_ to request that JSON data from our server's API at `public/api/rentals.json`, the same URL we visited earlier.

As mentioned above, fetching data from the server is usually an asynchronous operation. The Fetch API takes this into account, which is why `fetch` is an `async` function, just like our model hook. To consume its response, we will have to pair it with the `await` keyword.

The Fetch API returns a _[response object](https://developer.mozilla.org/docs/Web/API/Response)_ asynchronously. Once we have this object, we can convert the server's response into whatever format we need; in our case, we knew the server sent the data using the JSON format, so we can use the `json()` method to _[parse](https://developer.mozilla.org/docs/Web/API/Body/json)_ the response data accordingly. Parsing the response data is _also_ an asynchronous operation, so we'll just use the `await` keyword here, too.

## Adapting Server Data

Before we go any further, let's pause for a second to look at the server's data again.

```json { data-filename="public/api/rentals.json" }
{
  "data": [
    {
      "type": "rental",
      "id": "grand-old-mansion",
      "attributes": {
        "title": "Grand Old Mansion",
        "owner": "Veruca Salt",
        "city": "San Francisco",
        "location": {
          "lat": 37.7749,
          "lng": -122.4194
        },
        "category": "Estate",
        "bedrooms": 15,
        "image": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg",
        "description": "This grand old mansion sits on over 100 acres of rolling hills and dense redwood forests."
      }
    },
    {
      "type": "rental",
      "id": "urban-living",
      "attributes": {
        "title": "Urban Living",
        "owner": "Mike Teavee",
        "city": "Seattle",
        "location": {
          "lat": 47.6062,
          "lng": -122.3321
        },
        "category": "Condo",
        "bedrooms": 1,
        "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg",
        "description": "A commuters dream. This rental is within walking distance of 2 bus stops and the Metro."
      }
    },
    {
      "type": "rental",
      "id": "downtown-charm",
      "attributes": {
        "title": "Downtown Charm",
        "owner": "Violet Beauregarde",
        "city": "Portland",
        "location": {
          "lat": 45.5175,
          "lng": -122.6801
        },
        "category": "Apartment",
        "bedrooms": 3,
        "image": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg",
        "description": "Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet."
      }
    }
  ]
}
```

This data follows the _[JSON:API](https://jsonapi.org/)_ format, which is _slightly_ different than the hard-coded data that we were returning from the model hook before.

First off, the JSON:API format returns an array nested under the `"data"` key, rather than just the data for a single rental property. If we think about this, though, it makes sense; we now want to show a whole list of rental properties that are coming from our server, not just one, so an array of rental property objects is just what we need.

The rental property objects contained in the array also have a slightly different structure. Every data object has a `type` and `id`, which we don't intend to use in our template (yet!). For now, the only data we really need is nested within the `attributes` key.

There's one more key difference here, which perhaps only those with very sharp eyes will be able to catch: the data coming from the server is missing the `type` property, which previously existed on our hard-coded model object. The `type` property could either be `"Standalone"` or `"Community"`, depending on the type of rental property, which is required by our `<Rental>` component.

In [Part 2](../../part-2/) of this tutorial, we will learn about a more convenient way to consume data in the JSON:API format. For now, we can just fix up the data and deal with these differences in formats ourselves.

We can handle it all in our model hook:

```js { data-filename="app/routes/index.js" data-diff="+3,+4,-8,-9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23" }
import Route from '@ember/routing/route';

const COMMUNITY_CATEGORIES = ['Condo', 'Townhouse', 'Apartment'];

export default class IndexRoute extends Route {
  async model() {
    let response = await fetch('/api/rentals.json');
    let parsed = await response.json();
    return parsed;
    let { data } = await response.json();

    return data.map((model) => {
      let { attributes } = model;
      let type;

      if (COMMUNITY_CATEGORIES.includes(attributes.category)) {
        type = 'Community';
      } else {
        type = 'Standalone';
      }

      return { type, ...attributes };
    });
  }
}
```

After parsing the JSON data, we extracted the nested `attributes` object, added back the missing `type` attribute manually, then returned it from the model hook. That way, the rest of our app will have no idea that this difference ever existed.

Awesome! Now we're in business.

## Loops and Local Variables in Templates with `{{#each}}`

The last change we'll need to make is to our `index.hbs` route template, where we invoke our `<Rental>` components. Previously, we were passing in `@rental` as `@model` to our components. However, `@model` is no longer a single object, but rather, an array! So, we'll need to change this template to account for that.

Let's see how.

```handlebars { data-filename="app/templates/index.hbs" data-diff="-9,-10,-11,+12,+13,+14" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <ul class="results">
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    <li><Rental @rental={{@model}} /></li>
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

We can use the `{{#each}}...{{/each}}` syntax to iterate and loop through the array returned by the model hook. For each iteration through the array—for each item in the array—we will render the block that is passed to it once. In our case, the block is our `<Rental>` component, surrounded by `<li>` tags.

Inside of the block we have access to the item of the _current_ iteration with the `{{rental}}` variable. But why `rental`? Well, because we named it that! This variable comes from the `as |rental|` declaration of the `each` loop. We could have just as easily called it something else, like `as |property|`, in which case we would have to access the current item through the `{{property}}` variable.

Now, let's go over to our browser and see what our index route looks like with this change.

<img src="/images/tutorial/part-1/working-with-data/three-properties@2x.png" alt="Three different rental properties" width="1024" height="1130">

Hooray! Finally we're seeing different rental properties in our list. And we got to play with `fetch` and write a loop. Pretty productive, if you ask me.

Better yet, all of our tests are still passing too!

<img src="/images/tutorial/part-1/working-with-data/pass-2@2x.png" alt="All our tests are passing" width="1024" height="768">
