<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/10-service-injection.md -->

As promised, we will now work on implementing the share button!

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-2/service-injection/share-button@2x.png" alt="The working share button by the end of the chapter" width="1024" height="1382">

While adding the share button, you will learn about:

- Splattributes and the `class` attribute
- The router service
- Ember services vs. global variables
- Mocking services in tests

## Scoping the Feature

In order to be able to share on Twitter, we'll need to make use of the Twitter [Web Intent API](https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent.html).

Conveniently, this API doesn't require us to procure any API keys; all we need to do is link to `https://twitter.com/intent/tweet`. This link will prompt the user to compose a new tweet. The API also supports us pre-populating the tweet with some text, hashtag suggestions, or even a link, all through the use of special query params.

For instance, let's say we would like to suggest a tweet with the following content:

```plain
Check out Grand Old Mansion on Super Rentals! https://super-rentals.example/rentals/grand-old-mansion
#vacation #travel #authentic #blessed #superrentals via @emberjs
```

We could open a new page to the <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fsuper-rentals.example%2Frentals%2Fgrand-old-mansion&text=Check+out+Grand+Old+Mansion+on+Super+Rentals%21&hashtags=vacation%2Ctravel%2Cauthentic%2Cblessed%2Csuperrentals&via=emberjs" target="_blank" rel="external nofollow noopener noreferrer">following URL</a>:

```plain
https://twitter.com/intent/tweet?
  url=https%3A%2F%2Fsuper-rentals.example%2Frentals%2Fgrand-old-mansion&
  text=Check+out+Grand+Old+Mansion+on+Super+Rentals%21&
  hashtags=vacation%2Ctravel%2Cauthentic%2Cblessed%2Csuperrentals&
  via=emberjs
```

Of course, the user will still have the ability to edit the tweet, or they can decide to just not tweet it at all.

For our app, it probably makes the most sense for our share button to automatically share the current page's URL.

## Splattributes and the `class` Attribute

Now that we have a better understanding of the scope of this feature, let's get to work and generate a `share-button` component.

```shell
$ ember generate component share-button --with-component-class
installing component
  create app/components/share-button.js
  create app/components/share-button.hbs
installing component-test
  create tests/integration/components/share-button-test.js

Running "lint:fix" script...
```

Let's start with the template that was generated for this component. We already have some markup for the share button in the `<Rental::Detailed>` component we made earlier, so let's just copy that over into our new `<ShareButton>` component.

```handlebars { data-filename="app/components/share-button.hbs" data-diff="-1,+2,+3,+4,+5,+6,+7,+8,+9,+10" }
{{yield}}
<a
  ...attributes
  href={{this.shareURL}}
  target="_blank"
  rel="external nofollow noopener noreferrer"
  class="share button"
>
  {{yield}}
</a>
```

Notice that we added `...attributes` to our `<a>` tag here. As [we learned earlier](../../part-1/reusable-components/) when working on our `<Map>` component, the order of `...attributes` relative to other attributes is significant. We don't want to allow `href`, `target`, or `rel` to be overridden by the invoker, so we specified those attributes after `...attributes`.

But what happens to the `class` attribute? Well, as it turns out, the `class` attribute is the one exception to how these component attributes are overridden! While all other HTML attributes follow the "last-write wins" rule, the values for the `class` attribute are merged together (concatenated) instead. There is a good reason for this: it allows the component to specify whatever classes that _it_ needs, while allowing the invokers of the component to freely add any extra classes that _they_ need for styling purposes.

We also have a `{{yield}}` inside of our `<a>` tag so that we can customize the text for the link later when invoking the `<ShareButton>` component.

## Accessing the Current Page URL

Whew! Let's look at the JavaScript class next.

```js { data-filename="app/components/share-button.js" data-diff="-3,+4,+5,+6,+7,+8,+9,+10,+11,+12,+13,+14,+15,+16,+17,+18,+19,+20,+21,+22,+23,+24,+25,+26,+27,+28,+29,+30" }
import Component from '@glimmer/component';

export default class ShareButton extends Component {}
const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButton extends Component {
  get currentURL() {
    return window.location.href;
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

The key functionality of this class is to build the appropriate URL for the Twitter Web Intent API, which is exposed to the template via the `this.shareURL` getter. It mainly involves "gluing together" the component's arguments and setting the appropriate query params on the resulting URL. Conveniently, the browser provides a handy [`URL` class](https://javascript.info/url) that handles escaping and joining of query params for us.

The other notable functionality of this class has to do with getting the current page's URL and automatically adding it to the Twitter Intent URL. To accomplish this, we defined a `currentURL` getter that simply used the browser's global [`Location` object](https://developer.mozilla.org/en-US/docs/Web/API/Window/location), which we could access at `window.location`. Among other things, it has a `href` property (`window.location.href`) that reports the current page's URL.

Let's put this component to use by invoking it from the `<Rental::Detailed>` component!

```handlebars { data-filename="app/components/rental/detailed.hbs" data-diff="-4,+5,+6,+7,+8,+9,-11,+12" }
<Jumbo>
  <h2>{{@rental.title}}</h2>
  <p>Nice find! This looks like a nice place to stay near {{@rental.city}}.</p>
  <a href="#" target="_blank" rel="external nofollow noopener noreferrer" class="share button">
  <ShareButton
    @text="Check out {{@rental.title}} on Super Rentals!"
    @hashtags="vacation,travel,authentic,blessed,superrentals"
    @via="emberjs"
  >
    Share on Twitter
  </a>
  </ShareButton>
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

With that, we should have a working share button!

<img src="/images/tutorial/part-2/service-injection/share-button@2x.png" alt="A share button that works!" width="1024" height="1382">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>Feel free to try sending the tweet! However, keep in mind that your followers cannot access your local server at <code>http://localhost:4200/</code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Why We Can't Test `window.location.href`

To be sure, let's add some tests! Let's start with an acceptance test:

```js { data-filename="tests/acceptance/super-rentals-test.js" data-diff="-2,+3,+39,+40,+41,+42,+43,+44,+45,+46,+47,+48,+49" }
import { module, test } from 'qunit';
import { click, visit, currentURL } from '@ember/test-helpers';
import { click, find, visit, currentURL } from '@ember/test-helpers';
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
    assert.dom('.share.button').hasText('Share on Twitter');

    let button = find('.share.button');

    let tweetURL = new URL(button.href);
    assert.strictEqual(tweetURL.host, 'twitter.com');

    assert.strictEqual(
      tweetURL.searchParams.get('url'),
      `${window.location.origin}/rentals/grand-old-mansion`,
    );
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

The main thing we want to confirm here, from an acceptance test level, is that 1) there is a share button on the page, and 2) it correctly captures the current page's URL. Ideally, we would simulate clicking on the button to confirm that it actually works. However, that would navigate us away from the test page and stop the test!

Therefore, the best we could do is to look at the `href` attribute of the link, and check that it has roughly the things we expect in there. To do that, we used the `find` test helper to find the element, and used the browser's `URL` API to parse its `href` attribute into an object that is easier to work with.

The `href` attribute contains the Twitter Intent URL, which we confirmed by checking that the `host` portion of the URL matches `twitter.com`. We could be _more_ specific, such as checking that it matches `https://twitter.com/intent/tweet` exactly. However, if we include too many specific details in our acceptance test, it may fail unexpectedly in the future as the `<ShareButton>` component's implementation evolves, resulting in a _brittle_ test that needs to be constantly updated. Those details are better tested in isolation with component tests, which we will add later.

The main event here is that we wanted to confirm the Twitter Intent URL includes a link to our current page's URL. We checked that by comparing its `url` query param to the expected URL, using `window.location.origin` to get the current protocol, hostname and port, which should be `http://localhost:4200`.

If we run the tests in the browser, everything should...

<img src="/images/tutorial/part-2/service-injection/fail@2x.png" alt="The test failed" width="1024" height="768">

...wait a minute, our tests didn't work...again!

Looking at the failure closely, the problem seems to be that the component had captured `http://localhost:4200/tests` as the "current page's URL". The issue here is that the `<ShareButton>` component uses `window.location.href` to capture the current URL. Because we are running our tests at `http://localhost:4200/tests`, that's what we got. _Technically_ it's not wrong, but this is certainly not what we meant. Gotta love computers!

This brings up an interesting question – why does the `currentURL()` test helper not have the same problem? In our test, we have been writing assertions like `assert.strictEqual(currentURL(), '/about');`, and those assertions did not fail.

It turns out that this is something Ember's router handled for us. In an Ember app, the router is responsible for handling navigation and maintaining the URL. For example, when you click on a `<LinkTo>` component, it will ask the router to execute a _[route transition](../../../routing/preventing-and-retrying-transitions/)_. Normally, the router is set up to update the browser's address bar whenever it transitions into a new route. That way, your users will be able to use the browser's back button and bookmark functionality just like any other webpage.

However, during tests, the router is configured to maintain the "logical" URL internally, without updating the browser's address bar and history entries. This way, the router won't confuse the browser and its back button with hundreds of history entries as you run through your tests. The `currentURL()` taps into this piece of internal state in the router, instead of checking directly against the actual URL in the address bar using `window.location.href`.

## The Router Service

To fix our problem, we would need to do the same. Ember exposes this internal state through the _[router service](https://api.emberjs.com/ember/6.0.0/classes/RouterService)_, which we can _[inject](../../../services/#toc_accessing-services)_ into our component:

```js { data-filename="app/components/share-button.js" data-diff="+1,+7,+8,-10,+11" }
import { service } from '@ember/service';
import Component from '@glimmer/component';

const TWEET_INTENT = 'https://twitter.com/intent/tweet';

export default class ShareButton extends Component {
  @service router;

  get currentURL() {
    return window.location.href;
    return new URL(this.router.currentURL, window.location.origin);
  }

  get shareURL() {
    let url = new URL(TWEET_INTENT);

    url.searchParams.set('url', this.currentURL);

    if (this.args.text) {
      url.searchParams.set('text', this.args.text);
    }

    if (this.args.hashtags) {
      url.searchParams.set('hashtags', this.args.hashtags);
    }

    if (this.args.via) {
      url.searchParams.set('via', this.args.via);
    }

    return url;
  }
}
```

Here, we added the `@service router;` declaration to our component class. This injects the router service into the component, making it available to us as `this.router`. The router service has a `currentURL` property, providing the current "logical" URL as seen by Ember's router. Similar to the test helper with the same name, this is a relative URL, so we would have to join it with `window.location.origin` to get an absolute URL that we can share.

With this change, everything is now working the way we intended.

<img src="/images/tutorial/part-2/service-injection/pass-1@2x.png" alt="The previously failing test is now green" width="1024" height="960">

## Ember Services vs. Global Variables

In Ember, services serve a similar role to global variables, in that they can be easily accessed by any part of your app. For example, we can inject any available service into components, as opposed to having them passed in as an argument. This allows deeply nested components to "skip through" the layers and access things that are logically global to the entire app, such as routing, authentication, user sessions, user preferences, etc. Without services, every component would have to pass through a lot of the same arguments into every component it invokes.

A major difference between services and global variables is that services are scoped to your app, instead of all the JavaScript code that is running on the same page. This allows you to have multiple scripts running on the same page without interfering with each other.

More importantly, services are designed to be easily _swappable_. In our component class, all we did was request that Ember inject the service named `router`, without specifying where that service comes from. This allows us to _replace_ Ember's router service with a different object at runtime.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>By default, Ember infers the name of an injected service from the name of the property. If you would like the router service to be available at, say, <code>this.emberRouter</code>, you can specify <code>@service('router') emberRouter;</code> instead. <code>@service router;</code> is simply a shorthand for <code>@service('router') router;</code>.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Mocking Services in Tests

We will take advantage of this capability in our component test:

```js { data-filename="tests/integration/components/share-button-test.js" data-diff="+3,-7,-8,+9,+10,+11,+12,-14,-15,-16,+17,+18,+19,+20,+21,-23,+24,+25,-27,+28,+29,+30,-32,-33,-34,-35,-36,-37,+38,+39,-41,+42,+43,+44,+45,+46,+47,+48,+49,+50,+51,+52" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);
const MOCK_URL = new URL(
  '/foo/bar?baz=true#some-section',
  window.location.origin,
);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

    await render(hbs`<ShareButton />`);
module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

    assert.dom().hasText('');
  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);
  });

    // Template block usage:
    await render(hbs`
      <ShareButton>
        template block text
      </ShareButton>
    `);
  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);

    assert.dom().hasText('template block text');
    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute(
        'href',
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(MOCK_URL.href)}`
      )
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');
  });
});
```

In this component test, we _[registered](../../../applications/dependency-injection/#toc_factory-registrations)_ our own router service with Ember in the `beforeEach` hook. When our component is rendered and requests the router service to be injected, it will get an instance of our `MockRouterService` instead of the built-in router service.

This is a pretty common testing technique called _mocking_ or _stubbing_. Our `MockRouterService` implements the same interface as the built-in router service – the part that we care about anyway; which is that it has a `currentURL` property that reports the current "logical" URL. This allows us to fix the URL at a pre-determined value, making it possible to easily test our component without having to navigate to a different page. As far as our component can tell, we are currently on the page `/foo/bar/baz?some=page#anchor`, because that's the result it would get when querying the router service.

By using service injections and mocks, Ember allows us to build _loosely coupled_ components that can each be tested in isolation, while acceptance tests provide end-to-end coverage that ensures that these components do indeed work well together.

While we are here, let's add some more tests for the various functionalities of the `<ShareButton>` component:

```js { data-filename="tests/integration/components/share-button-test.js" data-diff="-4,+5,+24,+25,+26,+27,+28,+29,-39,-40,-41,-42,+43,+47,+48,+49,+50,+51,+52,+53,+54,+55,+56,+57,+58,+59,+60,+61,+62,+63,+64,+65,+66,+67,+68,+69,+70,+71,+72,+73,+74,+75,+76,+77,+78,+79,+80,+81,+82,+83,+84,+85,+86,+87,+88,+89,+90,+91,+92,+93,+94" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import Service from '@ember/service';
import { render } from '@ember/test-helpers';
import { find, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const MOCK_URL = new URL(
  '/foo/bar?baz=true#some-section',
  window.location.origin,
);

class MockRouterService extends Service {
  get currentURL() {
    return '/foo/bar?baz=true#some-section';
  }
}

module('Integration | Component | share-button', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:router', MockRouterService);

    this.tweetParam = (param) => {
      let link = find('a');
      let url = new URL(link.href);
      return url.searchParams.get(param);
    };
  });

  test('basic usage', async function (assert) {
    await render(hbs`<ShareButton>Tweet this!</ShareButton>`);

    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute(
        'href',
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(MOCK_URL.href)}`
      )
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/)
      .hasClass('share')
      .hasClass('button')
      .containsText('Tweet this!');

    assert.strictEqual(this.tweetParam('url'), MOCK_URL.href);
  });

  test('it supports passing @text', async function (assert) {
    await render(
      hbs`<ShareButton @text="Hello Twitter!">Tweet this!</ShareButton>`,
    );

    assert.strictEqual(this.tweetParam('text'), 'Hello Twitter!');
  });

  test('it supports passing @hashtags', async function (assert) {
    await render(
      hbs`<ShareButton @hashtags="foo,bar,baz">Tweet this!</ShareButton>`,
    );

    assert.strictEqual(this.tweetParam('hashtags'), 'foo,bar,baz');
  });

  test('it supports passing @via', async function (assert) {
    await render(hbs`<ShareButton @via="emberjs">Tweet this!</ShareButton>`);
    assert.strictEqual(this.tweetParam('via'), 'emberjs');
  });

  test('it supports adding extra classes', async function (assert) {
    await render(
      hbs`<ShareButton class="extra things">Tweet this!</ShareButton>`,
    );

    assert
      .dom('a')
      .hasClass('share')
      .hasClass('button')
      .hasClass('extra')
      .hasClass('things');
  });

  test('the target, rel and href attributes cannot be overridden', async function (assert) {
    await render(
      hbs`<ShareButton target="_self" rel="" href="/">Not a Tweet!</ShareButton>`,
    );

    assert
      .dom('a')
      .hasAttribute('target', '_blank')
      .hasAttribute('rel', 'external nofollow noopener noreferrer')
      .hasAttribute('href', /^https:\/\/twitter\.com\/intent\/tweet/);
  });
});
```

The main goal here is to test the key functionalities of the component individually. That way, if any of these features regresses in the future, these tests can help pinpoint the source of the problem for us. Because a lot of these tests require parsing the URL and accessing its query params, we setup our own `this.tweetParam` test helper function in the `beforeEach` hook. This pattern allows us to easily share functionality between tests. We were even able to refactor the previous test using this new helper!

With that, everything should be good to go, and our `<ShareButton>` component should now work everywhere!

<img src="/images/tutorial/part-2/service-injection/pass-2@2x.png" alt="All the tests pass!" width="1024" height="960">
