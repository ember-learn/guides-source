<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/07-reusable-components.md -->

The last missing feature for the `<Rental>` component is a map to show the location of the rental, which is what we're going to work on next:

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="1130">

While adding the map, you will learn about:

- Managing application-level configurations
- Parameterizing components with arguments
- Accessing component arguments
- Interpolating values in templates
- Overriding HTML attributes in `...attributes`
- Refactoring with getters and auto-track
- Getting JavaScript values into the test context

## Managing Application-level Configurations

We will use the [Mapbox](https://www.mapbox.com) API to generate maps for our rental properties. You can [sign up](https://www.mapbox.com/signup/) for free and without a credit card.

Mapbox provides a [static map images API](https://docs.mapbox.com/api/maps/#static-images), which serves map images in PNG format. This means that we can generate the appropriate URL for the parameters we want and render the map using a standard `<img>` tag. Pretty neat!

If you're curious, you can explore the options available on Mapbox by using the [interactive playground](https://docs.mapbox.com/help/interactive-tools/static-api-playground/).

Once you have signed up for the service, grab your _[default public token](https://account.mapbox.com/access-tokens/)_ and paste it into `config/environment.js`:

```js { data-filename="config/environment.js" data-diff="+48,+49" }
'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'super-rentals',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      RAISE_ON_DEPRECATION: true,
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  ENV.MAPBOX_ACCESS_TOKEN = 'paste your Mapbox access token here';

  return ENV;
};
```

As its name implies, `config/environment.js` is used to _configure_ our app and store API keys like these. These values can be accessed from other parts of our app, and they can have different values depending on the current environment (which might be development, test, or production).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you prefer, you can <a href="https://account.mapbox.com/access-tokens/">create different Mapbox access tokens</a> for use in different environments. At a minimum, the tokens will each need to have the "styles:tiles" scope in order to use Mapbox's static images API.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

After saving the changes to our configuration file, we will need to restart our development server to pick up these file changes. Unlike the files we have edited so far, `config/environment.js` is not automatically reloaded.

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

You can stop the server by finding the terminal window where `npm start` is running, then type `Ctrl + C`. That is, typing the "C" key on your keyboard _while_ holding down the "Ctrl" key at the same time. Once it has stopped, you can start it back up again with the same `npm start` command.

```shell
$ npm start

> super-rentals@0.0.0 start
> ember serve

building... 

Build successful (13286ms) – Serving on http://localhost:4200/
```

## Generating a Component with a Component Class

With the Mapbox API key in place, let's generate a new component for our map.

```shell
$ ember generate component map --component-class=@glimmer/component
installing component
  create app/components/map.gjs
installing component-test
  create tests/integration/components/map-test.gjs

Running "lint:fix" script...
```

Since not every component will necessarily have some defined behavior associated with it, the component generator does not generate the JavaScript parts of the file for us by default. As we saw earlier, we can always add the JavaScript class to a component later on.

However, in the case of our `<Map>` component, we are pretty sure that we are going to need a JavaScript file for some behavior that we have yet to define! To save a step later, we can pass the `--component-class=@glimmer/component` flag to the component generator so that we have everything we need from the get-go.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Too much typing? Use <code>ember g component map -gc</code> instead. The <code>-gc</code> flag stands for <strong>G</strong>limmer <strong>c</strong>omponent, but you may also remember it as <strong>g</strong>enerate <strong>c</strong>lass.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Parameterizing Components with Arguments

Let's update our component:

```gjs { data-filename="app/components/map.gjs" data-diff="+2,+5,+6,+7,+8,-10,+11,+12,+13,+14,+15,+16,+17,+18" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

export default class Map extends Component {
  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }

  <template>
    {{yield}}
    <div class="map">
      <img
        alt="Map image at coordinates {{@lat}},{{@lng}}"
        ...attributes
        src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
        width={{@width}} height={{@height}}
      >
    </div>
  </template>
}
```

Here, we import the access token from the config file and return it from a `token` _[getter](https://javascript.info/property-accessors)_. This allows us to access our token as `this.token` both inside the `Map` class body, as well as the template section. It is also important to [URL-encode](https://javascript.info/url#encoding-strings) the token, just in case it contains any special characters that are not URL-safe.

First, we have a container element for styling purposes.

Then we have an `<img>` tag to request and render the static map image from Mapbox.

Our component's template contains several values that don't yet exist—`@lat`, `@lng`, `@zoom`, `@width`, and `@height`. These are _[arguments](../../../components/component-arguments-and-html-attributes/#toc_arguments)_ to the `<Map>` component that we will supply when invoking it.

By _parameterizing_ our component using arguments, we made a reusable component that can be invoked from different parts of the app and customized to meet the needs for those specific contexts. We have already seen this in action when using the `<LinkTo>` component [earlier](../building-pages/); we had to specify a `@route` argument so that it knew what page to navigate to.

We supplied a reasonable default value for the `alt` attribute based on the values of the `@lat` and `@lng` arguments. You may notice that we are directly _interpolating_ values into the `alt` attribute's value. Ember will automatically concatenate these interpolated values into a final string value for us, including doing any necessary HTML-escaping.

## Overriding HTML Attributes in `...attributes`

Next, we used `...attributes` to allow the invoker to further customize the `<img>` tag, such as passing extra attributes such as `class`, as well as _overriding_ our default `alt` attribute with a more specific or human-friendly one.

_The ordering is important here!_ Ember applies the attributes in the order that they appear. By assigning the default `alt` attribute first (_before_ `...attributes` is applied), we are explicitly providing the invoker the _option_ to provide a more tailored `alt` attribute according to their use case.

Since the passed-in `alt` attribute (if any exists) will appear _after_ ours, it will override the value we specified. On the other hand, it is important that we assign `src`, `width`, and `height` after `...attributes`, so that they don't get accidentally overwritten by the invoker.

The `src` attribute interpolates all the required parameters into the URL format for Mapbox's [static map image API](https://docs.mapbox.com/api/maps/#static-images), including the URL-escaped access token from `this.token`.

Finally, since we are using the `@2x` "retina" image, we should specify the `width` and `height` attributes. Otherwise, the `<img>` will be rendered at twice the size than what we expected!

We just added a lot of behavior into a single component, so let's write some tests! In particular, we should make sure to have some _[test coverage](../../../testing/)_ for the overriding-HTML-attributes behavior we discussed above.

```gjs { data-filename="tests/integration/components/map-test.gjs" data-diff="-3,+4,+5,-11,-12,-13,-14,-15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30,+31,+32,+33,+34,+35,+36,+37,+38,+39,+40,+41,+42,+43,+44,+45,+46,-48,+49,+50,+51,+52,-54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,-76,+77,-79,-80,-81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,-94,+95,+96,+97,+98,+99" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, find } from '@ember/test-helpers';
import ENV from 'super-rentals/config/environment';
import Map from 'super-rentals/components/map';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Updating values is achieved using autotracking, just like in app code. For example:
    // class State { @tracked myProperty = 0; }; const state = new State();
    // and update using state.myProperty = 1; await rerender();
    // Handle any actions with function myAction(val) { ... };
  test('it renders a map image for the specified parameters', async function (assert) {
    await render(<template>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
      />
    </template>);

    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"',
    );

    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    await render(<template><Map /></template>);
    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    assert.dom().hasText('');
    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token',
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(<template>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
        alt="A map of San Francisco"
      />
    </template>);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

    // Template block usage:
  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(<template>
      <Map>
        template block text
      </Map>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
        src="/assets/images/teaching-tomster.png"
        width="200"
        height="300"
      />
    </template>);

    assert.dom().hasText('template block text');
    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

Note that the `hasAttribute` test helper from [`qunit-dom`](https://github.com/simplabs/qunit-dom/blob/master/API.md) supports using _[regular expressions](https://javascript.info/regexp-introduction)_. We used this feature to confirm that the `src` attribute starts with `https://api.mapbox.com/`, as opposed to requiring it to be an exact match against a string. This allows us to be reasonably confident that the code is working correctly, without being overly-detailed in our tests.

_Fingers crossed..._ Let's run our tests.

<img src="/images/tutorial/part-1/reusable-components/pass@2x.png" alt="Tests passing with the new &lt;Map&gt; tests" width="1024" height="768">

Hey, all the tests passed! But does that mean it actually works in practice? Let's find out by invoking the `<Map>` component from the `<Rental>` component's template:

```gjs { data-filename="app/components/rental.gjs" data-diff="+2,+25,+26,+27,+28,+29,+30,+31,+32" }
import RentalImage from 'super-rentals/components/rental/image';
import Map from 'super-rentals/components/map';

<template>
  <article class="rental">
    <RentalImage
      src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg"
      alt="A picture of Grand Old Mansion"
    />
    <div class="details">
      <h3>Grand Old Mansion</h3>
      <div class="detail owner">
        <span>Owner:</span> Veruca Salt
      </div>
      <div class="detail type">
        <span>Type:</span> Standalone
      </div>
      <div class="detail location">
        <span>Location:</span> San Francisco
      </div>
      <div class="detail bedrooms">
        <span>Number of bedrooms:</span> 15
      </div>
    </div>
    <Map
      @lat="37.7749"
      @lng="-122.4194"
      @zoom="9"
      @width="150"
      @height="150"
      alt="A map of Grand Old Mansion"
    />
  </article>
</template>
```

Hey! That's a map!

<img src="/images/tutorial/part-1/reusable-components/three-old-mansions@2x.png" alt="Three Grand Old Mansions" width="1024" height="1130">

<!-- TODO: https://github.com/ember-cli/ember-cli/issues/8782 -->

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If the map image failed to load, make sure you have the correct <code>MAPBOX_ACCESS_TOKEN</code> set in <code>config/environment.js</code>. Don't forget to restart the development and test servers after editing your config file!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

For good measure, we will also add an assertion to the `<Rental>` tests to make sure we rendered the `<Map>` component successfully.

```gjs { data-filename="tests/integration/components/rental-test.gjs" data-diff="+19" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import Rental from 'super-rentals/components/rental';

module('Integration | Component | rental', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders information about a rental property', async function (assert) {
    await render(<template><Rental /></template>);

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

## Refactoring with Getters and Auto-track

At this point, a big part of our `<Map>` component's template section is devoted to the `<img>` tag's `src` attribute, which is getting pretty long. One alternative is to move this computation into the JavaScript class instead.

From within our JavaScript class, we have access to our component's arguments using the `this.args.*` API. Using that, we can move the URL logic up from the template into a new getter.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p><code>this.args</code> is an API provided by the Glimmer component superclass. You may come across other component superclasses, such as "classic" components in legacy codebases, that provide different APIs for accessing component arguments from JavaScript code.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

```js { data-filename="app/components/map.gjs" data-diff="+4,+5,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,-26,+27" }
import Component from '@glimmer/component';
import ENV from 'super-rentals/config/environment';

const MAPBOX_API = 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static';

export default class Map extends Component {
  get src() {
    let { lng, lat, width, height, zoom } = this.args;

    let coordinates = `${lng},${lat},${zoom}`;
    let dimensions = `${width}x${height}`;
    let accessToken = `access_token=${this.token}`;

    return `${MAPBOX_API}/${coordinates}/${dimensions}@2x?${accessToken}`;
  }

  get token() {
    return encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);
  }

  <template>
    <div class="map">
      <img
        alt="Map image at coordinates {{@lat}},{{@lng}}"
        ...attributes
        src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/{{@lng}},{{@lat}},{{@zoom}}/{{@width}}x{{@height}}@2x?access_token={{this.token}}"
        src={{this.src}}
        width={{@width}} height={{@height}}
      >
    </div>
  </template>
}
```

Much nicer! And all of our tests still pass!

<img src="/images/tutorial/part-1/reusable-components/pass-2@2x.png" alt="Tests passing after the src getter refactor" width="1024" height="768">

Note that we did not mark our getter as `@tracked`. Unlike instance variables, getters cannot be "assigned" a new value directly, so it does not make sense for Ember to monitor them for changes.

That being said, the values _produced_ by getters can certainly change. In our case, the value produced by our `src` getter depends on the values of `lat`, `lng`, `width`, `height` and `zoom` from `this.args`. Whenever these _dependencies_ get updated, we would expect `{{this.src}}` from our template to be updated accordingly.

Ember does this by automatically tracking any variables that were accessed while computing a getter's value. As long as the dependencies themselves are marked as `@tracked`, Ember knows exactly when to invalidate and re-render any templates that may potentially contain any "stale" and outdated getter values. This feature is also known as _[auto-track](../../../in-depth-topics/autotracking-in-depth/)_. All arguments that can be accessed from `this.args` (in other words, `this.args.*`) are implicitly marked as `@tracked` by the Glimmer component superclass. Since we inherited from that superclass, everything Just Works™.

## Getting JavaScript Values into the Test Context

Just to be sure, we can add a test for this behavior:

```gjs { data-filename="tests/integration/components/map-test.gjs" data-diff="-3,+4,+7,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93,+94,+95,+96,+97,+98,+99,+100,+101,+102,+103,+104,+105,+106,+107,+108,+109,+110,+111,+112,+113,+114,+115,+116,+117,+118,+119" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render, find } from '@ember/test-helpers';
import { render, find, rerender } from '@ember/test-helpers';
import ENV from 'super-rentals/config/environment';
import Map from 'super-rentals/components/map';
import { tracked } from '@glimmer/tracking';

module('Integration | Component | map', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a map image for the specified parameters', async function (assert) {
    await render(<template>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
      />
    </template>);

    assert
      .dom('.map img')
      .exists()
      .hasAttribute('alt', 'Map image at coordinates 37.7797,-122.4184')
      .hasAttribute('src')
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');

    let { src } = find('.map img');
    let token = encodeURIComponent(ENV.MAPBOX_ACCESS_TOKEN);

    assert.ok(
      src.startsWith('https://api.mapbox.com/'),
      'the src starts with "https://api.mapbox.com/"',
    );

    assert.ok(
      src.includes('-122.4184,37.7797,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    assert.ok(
      src.includes(`access_token=${token}`),
      'the src should include the escaped access token',
    );
  });

  test('it updates the `src` attribute when the arguments change', async function (assert) {
    class State { 
      @tracked lat = 37.7749;
      @tracked lng = -122.4194;
      @tracked zoom = 10;
      @tracked width = 150;
      @tracked height = 120;
    };

    const state = new State();

    await render(<template>
      <Map
        @lat={{state.lat}}
        @lng={{state.lng}}
        @zoom={{state.zoom}}
        @width={{state.width}}
        @height={{state.height}}
      />
    </template>);

    let img = find('.map img');

    assert.ok(
      img.src.includes('-122.4194,37.7749,10'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('150x120@2x'),
      'the src should include the width,height and @2x parameter',
    );

    state.width = 300;
    state.height = 200;
    state.zoom = 12;

    await rerender();

    assert.ok(
      img.src.includes('-122.4194,37.7749,12'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter',
    );

    state.lat = 47.6062;
    state.lng = -122.3321;

    await rerender();

    assert.ok(
      img.src.includes('-122.3321,47.6062,12'),
      'the src should include the lng,lat,zoom parameter',
    );

    assert.ok(
      img.src.includes('300x200@2x'),
      'the src should include the width,height and @2x parameter',
    );
  });

  test('the default alt attribute can be overridden', async function (assert) {
    await render(<template>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
        alt="A map of San Francisco"
      />
    </template>);

    assert.dom('.map img').hasAttribute('alt', 'A map of San Francisco');
  });

  test('the src, width and height attributes cannot be overridden', async function (assert) {
    await render(<template>
      <Map
        @lat="37.7797"
        @lng="-122.4184"
        @zoom="10"
        @width="150"
        @height="120"
        src="/assets/images/teaching-tomster.png"
        width="200"
        height="300"
      />
    </template>);

    assert
      .dom('.map img')
      .hasAttribute('src', /^https:\/\/api\.mapbox\.com\//)
      .hasAttribute('width', '150')
      .hasAttribute('height', '120');
  });
});
```

In this test, we create a local class called `State` and an instance of that class called `state`. There is nothing special about the name `State`—it's just a regular JavaScript class we use to keep track of data we might want to pass into our component. We use the `@tracked` decorator just like in the application code so whenever we make a change, Ember will update the page automatically.

In tests like this, whenever we make changes to state that is rendered, we call `await rerender()`. This gives Ember a chance to update the display before continuing with the queries and assertions that follow. Following this pattern allows us to update these values as needed from the test function.

With all our tests passing, we are ready to move on!

<img src="/images/tutorial/part-1/reusable-components/pass-3@2x.png" alt="All our tests are passing" width="1024" height="768">
