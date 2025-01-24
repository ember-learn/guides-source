<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-2/12-provider-components.md -->

In this chapter, we'll work on adding a new search feature, and refactor our `index.hbs` template into a new component along the way. We'll learn about a new pattern for passing data around between components, too! Once we're done, our page will look like this:

<!-- TODO: make this a gif instead -->

<img src="/images/tutorial/part-2/provider-components/filtered-results@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="833">

During this refactor, you will learn about:

- Using forms
- The provider component pattern
- Using block parameters when invoking components
- Yielding data to caller components

## Add input

As our app grows and as we add more features to it, one thing that would be really nice to have is some search functionality. It would be great if our users could just type a word into a search box and our app could just respond with matching and relevant rentals. So how could we go about implementing this feature?

Well, we can start simple. Before we worry about implementing the "search" part of this feature, let's just get something on the page. The first step is to add a form with an `<input>` tag to our `index` page, and make it look pretty with a class.

```handlebars { data-filename="app/templates/index.hbs" data-diff="+8,+9,+10,+11,+12,+13,+14" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

Now if we refresh the UI, it has an `<input>` element on the page.

<img src="/images/tutorial/part-2/provider-components/homepage-with-inert-search@2x.png" alt="The homepage with a search box, but it doesn't work yet." width="1024" height="1328">

Awesome, one step done. Now, this input looks great, but it doesn't actually _do_ anything.

## Refactoring the index template into a component

In order to make our search box actually work, we are going to need to retain and store the text that the user types in when they use the search box. This text is the search query, and it is a piece of _[state](../../../components/component-state-and-actions/)_ that is going to change whenever the user types something into the search box.

But where are we going to put this newly-introduced piece of state? In order to wire up the search box, we need a place to store the search query. At the moment, our search box lives on the `index.hbs` route template, which doesn't have a good place to store this search query state. Darn, this would be so much easier to do if we had a component, because we could just store the state directly on the component!

Wait...why don't we just refactor the search box into a component? Once we do that, this will all be a bit easier—hooray!

Let's start simple again and begin our refactor by creating a new template for our component, which we will call `rentals.hbs`.

```handlebars { data-filename="app/components/rentals.hbs" }
<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

There is one minor change to note here: while extracting our markup into a component, we also renamed the `@model` argument to be `@rentals` instead, just in order to be a little more specific about what we're iterating over in our `{{#each}}` loop. Otherwise, all we're doing here is copy-pasting what was on our `index.hbs` page into our new component template. Now we just need to actually use our new component in the index template where we started this whole refactor! Let's render our `<Rentals>` component in our `index.hbs` template.

```handlebars { data-filename="app/templates/index.hbs" data-diff="-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,+21" }
<Jumbo>
  <h2>Welcome to Super Rentals!</h2>
  <p>We hope you find exactly what you're looking for in a place to stay.</p>
  <LinkTo @route="about" class="button">About Us</LinkTo>
</Jumbo>

<div class="rentals">
  <form>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
    </label>
  </form>

  <ul class="results">
    {{#each @model as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
<Rentals @rentals={{@model}} />
```

Remember the small change we made in the markup when we extracted our `<Rentals>` component? We renamed the `@model` argument to be `@rentals`. Because we made that change in our component, we now need to pass the `@model` argument into the `<Rentals>` component as `@rentals`. Once we do this, everything should be wired up properly so that the `@model` is passed into `<Rentals>` as `@rentals`, just as we expect.

Let's check our UI as well to make sure that we didn't break anything during this refactor...

<img src="/images/tutorial/part-2/provider-components/homepage-with-rentals-component@2x.png" alt="The homepage looks exactly the same as before!" width="1024" height="1328">

Awesome, it looks exactly the same!

Now that we've finished our refactor and tried it out in the UI, let's write a test for it as well.

```js { data-filename="tests/integration/components/rentals-test.js" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders all given rental properties by default', async function (assert) {
    this.setProperties({
      rentals: [
        {
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
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });

    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });
});
```

Now, if we try running our tests, they should all pass after making this change.

<img src="/images/tutorial/part-2/provider-components/pass-1@2x.png" alt="The new test is passing." width="1024" height="1024">

## Using a `form`

Now that we have our component all set up, we can finally wire up our search box and store our search query! First things first: let's create a component class to store our query state and handle events from the `form` element:

```js { data-filename="app/components/rentals.js" }
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Rentals extends Component {
  @tracked query = '';

  @action
  updateQuery(event) {
    let formData = new FormData(event.currentTarget);
    this.query = formData.get('rental-search-term');
  }

  @action
  handleSubmit(event) {
    event.preventDefault();
    this.updateQuery(event);
  }
}
```

Next, we'll wire up our query state in the component template.

```handlebars { data-filename="app/components/rentals.hbs" data-diff="-2,+3,-6,+7,+9" }
<div class="rentals">
  <form>
  <form {{on "input" this.updateQuery}} {{on "submit" this.handleSubmit}}>
    <label>
      <span>Where would you like to stay?</span>
      <input class="light">
      <input name="rental-search-term" class="light">
    </label>
    <p>The results below will update as you type.</p>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
  </ul>
</div>
```

[`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) is a built-in JavaScript object for handling forms. It requires the `name` attribute on the `input`. We handle both `submit` and `input` events for the form so that the query updates both when the user types into the input and when they submit the form.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>If you want to see this in action, try adding <code>&#x3C;p>{{this.query}}&#x3C;/p></code> to the component template and watch it update live as you type!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Adding the `<Rentals::Filter>` Provider Component

Now that our search query is wired up to our `<Rentals>` component, we can get into the really fun stuff! Namely, we can make our component _filter_ results based on our search query. In order to encapsulate this functionality, we'll create another component called `<Rentals::Filter>`.

```js { data-filename="app/components/rentals/filter.js" }
import Component from '@glimmer/component';

export default class RentalsFilter extends Component {
  get results() {
    let { rentals, query } = this.args;

    if (query) {
      rentals = rentals.filter((rental) => rental.title.includes(query));
    }

    return rentals;
  }
}
```

```handlebars { data-filename="app/components/rentals/filter.hbs" }
{{yield this.results}}
```

In the `<Rentals::Filter>` component class, we have created a getter to do the work of filtering through our rentals based on two arguments: `@rentals` and `@query`. Inside of our getter function, we have these arguments accessible to us from `this.args`.

In our component template, we are not actually _rendering_ anything. Instead, we're yielding to something, using the `{{yield}}` keyword, a syntax that [we have seen before](../../part-1/component-basics/). As we might recall, the purpose of `{{yield}}` is to render the _block_ that is passed in by the component's _caller_, which is the thing that is invoking the current component (a template or another component, for example). But in this specific case, we don't just have a `{{yield}}` keyword. Instead, we have `this.results` _inside_ of our `{{yield}}` keyword. What is that doing, exactly?

Well, in order to answer this question, let's look at how the data that we're yielding is being used in the `<Rentals>` component.

```handlebars { data-filename="app/components/rentals.hbs" data-diff="-11,-12,-13,+14,+15,+16,+17,+18" }
<div class="rentals">
  <form {{on "input" this.updateQuery}} {{on "submit" this.handleSubmit}}>
    <label>
      <span>Where would you like to stay?</span>
      <input name="rental-search-term" class="light">
    </label>
    <p>The results below will update as you type.</p>
  </form>

  <ul class="results">
    {{#each @rentals as |rental|}}
      <li><Rental @rental={{rental}} /></li>
    {{/each}}
    <Rentals::Filter @rentals={{@rentals}} @query={{this.query}} as |results|>
      {{#each results as |rental|}}
        <li><Rental @rental={{rental}} /></li>
      {{/each}}
    </Rentals::Filter>
  </ul>
</div>
```

Here, we're invoking `<Rentals::Filter>` similar to how we've invoked other components. We're passing in `@rentals` and `@query` as arguments, and we're also passing in a block. The block is the content that is enclosed in between the component's opening and closing tags (`<Rentals::Filter>...</Rentals::Filter>`). We have seen both of these before.

However, the main difference here is the use of `as |results|` when we are invoking our `<Rentals::Filter>` component. Incidentally, this new syntax goes hand-in-hand with the `{{yield this.results}}` syntax we were introduced to in the component template.

The `as |results|` syntax might look a little new to us, but it isn't the first time that we've seen this feature in action. Back when we first learned about the `{{#each}}` syntax, which we use to loop over a collection, we wrote something like this: `{{#each @items as |item|}}...some content here...{{/each}}`.

When we use this syntax, we are passing a block—the `...some content here...` in our example—to `{{#each}}`. Ember will iterate through the array we provided (`@items`) and render our block _once per item_ in the array.

Inside of our block, we need to be able to access the current item _somehow_. The `{{#each}}` syntax provides the item to our block via the `as |item|` declaration, which creates a local variable `item`, also known as a _[block parameter](../../../components/looping-through-lists/)_. In other words, as we iterate through `@items`, we will have access to the current item that we're looping over through the block parameter (`item`) The block parameter is only accessible from within inside of the block. Ember will fill in the block parameter with the current item of the iteration, and it will do this each time that it renders our block.

The need to provide some data to a block is not unique to the `{{#each}}` syntax. In this case, our `<Rentals::Filter>` component wants to take the unfiltered list of rental properties and match them against the user's query. Once the component has matched the rentals against the query, it will need to provide a filtered list of rental properties to its caller (the `<Rentals>` component).

As it turns out, this ability to provide block params is not a superpower that only built-in syntaxes like `{{#each}}` can use. We can do this with our own components as well. In fact, Ember allows us to pass arbitrary data to blocks in the form of passing in additional arguments to the `{{yield}}` keyword. Indeed, this is exactly what we did with `{{yield this.results}}` in the `<Rentals::Filter>` component.

In our `<Rentals>` component, we used the `as |results|` syntax when invoking `<Rentals::Filter>`. Just like with the `{{#each}}` syntax, this block parameter syntax allowed our block to access the yielded data using the local variable `results`. The yielded data came from `{{yield this.results}}`, where `this.results` is our filtered list of rental properties.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The local variable name <code>results</code> is arbitrary, and isn't special in any way! You could name it anything: <code>as |data|</code>, <code>as |filtered|</code>, or even <code>as |banana|</code>! In fact, the <code>... as |banana|</code> syntax is the same as declaring a local variable in JavaScript.
Just as we can create a variable like <code>let banana = ...</code>, and then have access to that variable whenever we call <code>banana</code>, we can also have access to the yielded item by using whatever variable name we gave to our block parameter. The important thing here is that however you name the block param is how you will have access to the yielded data from inside the block.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Interestingly, if we take a look at our `<Rentals::Filter>` component template, we see that we don't actually render any content. Instead, this component's only responsibility is to set up some piece of state (`this.results`, the list of filtered rental properties), and then yield that state back up to its caller (`<Rentals>`) in the form of a block parameter (`as |results|`).

This is called the _provider component pattern_, which we see in action with one component providing data up to its caller.

Okay, now that we have a better sense of which component is rendering what and the theory behind why all of this is happening, let's answer the big unanswered question: does this even work? If we try out our search box in the UI, what happens?

<img src="/images/tutorial/part-2/provider-components/filtered-results@2x.png" alt="Trying out the search box." width="1024" height="833">

Hooray, it works! Awesome. Now that we've tried this out manually in the UI, let's write a test for this new behavior as well.

```js { data-filename="tests/integration/components/rentals-test.js" data-diff="-3,+4,-10,+11,+67,+69,+90,+91,+92,+93,+94,+95,+96,+97,+98,+99,+100,+101,+102,+103,+104,+105,+106,+107,+108" }
import { module, test } from 'qunit';
import { setupRenderingTest } from 'super-rentals/tests/helpers';
import { render } from '@ember/test-helpers';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | rentals', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders all given rental properties by default', async function (assert) {
  hooks.beforeEach(function () {
    this.setProperties({
      rentals: [
        {
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
        {
          id: 'urban-living',
          title: 'Urban Living',
          owner: 'Mike Teavee',
          city: 'Seattle',
          location: {
            lat: 47.6062,
            lng: -122.3321,
          },
          category: 'Condo',
          type: 'Community',
          bedrooms: 1,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/2/20/Seattle_-_Barnes_and_Bell_Buildings.jpg',
          description:
            'A commuters dream. This rental is within walking distance of 2 bus stops and the Metro.',
        },
        {
          id: 'downtown-charm',
          title: 'Downtown Charm',
          owner: 'Violet Beauregarde',
          city: 'Portland',
          location: {
            lat: 45.5175,
            lng: -122.6801,
          },
          category: 'Apartment',
          type: 'Community',
          bedrooms: 3,
          image:
            'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg',
          description:
            'Convenience is at your doorstep with this charming downtown rental. Great restaurants and active night life are within a few feet.',
        },
      ],
    });
  });

  test('it renders all given rental properties by default', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 3 });

    assert
      .dom('.rentals .results li:nth-of-type(1)')
      .containsText('Grand Old Mansion');

    assert
      .dom('.rentals .results li:nth-of-type(2)')
      .containsText('Urban Living');

    assert
      .dom('.rentals .results li:nth-of-type(3)')
      .containsText('Downtown Charm');
  });

  test('it updates the results according to the search query', async function (assert) {
    await render(hbs`<Rentals @rentals={{this.rentals}} />`);

    assert.dom('.rentals').exists();
    assert.dom('.rentals input').exists();

    await fillIn('.rentals input', 'Downtown');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Downtown Charm');

    await fillIn('.rentals input', 'Mansion');

    assert.dom('.rentals .results').exists();
    assert.dom('.rentals .results li').exists({ count: 1 });
    assert.dom('.rentals .results li').containsText('Grand Old Mansion');
  });
});
```

Great! In the process of adding this test, we'll notice that we also extracted our setup (`setProperties`) into the before hooks. We also used the `fillIn` test helper in our newly-added test.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>This search functionality is not perfect. Ideally, it would also be case-insensitive, and also allow you to search by city, category, type, or description. If you're looking for a challenge, see if you can improve on our search!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

<img src="/images/tutorial/part-2/provider-components/pass-2@2x.png" alt="The new test is passing." width="1024" height="1024">
