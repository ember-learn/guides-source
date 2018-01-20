Now, let's add a list of available rentals to the index template.
We know that rentals will not be static, since eventually users will be able to add, update, and delete them.
For this reason, we'll need a _rentals_ model to save information about the rentals.
To keep things simple at first, we'll use a hard-coded array of JavaScript objects.
Later, we'll switch to using Ember Data, a library for robustly managing data in our app.

Here's what our homepage will look like when we're done:

![super rentals homepage with rentals list](/images/models/super-rentals-index-with-list.png)

In Ember, route handlers art responsible for loading model data.
Let's open `app/routes/index.js` and add our hard-coded data as the return value of the `model` hook:

```javascript {data-filename=app/routes/index.js}
import Ember from 'ember';

var rentals = [{
  id: 1,
  title: 'Grand Old Mansion',
  owner: 'Veruca Salt',
  city: 'San Francisco',
  type: 'Estate',
  bedrooms: 15,
  image: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Crane_estate_(5).jpg'
}, {
  id: 2,
  title: 'Urban Living',
  owner: 'Mike TV',
  city: 'Seattle',
  type: 'Condo',
  bedrooms: 1,
  image: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Alfonso_13_Highrise_Tegucigalpa.jpg'
}, {
  id: 3,
  title: 'Downtown Charm',
  owner: 'Violet Beauregarde',
  city: 'Portland',
  type: 'Apartment',
  bedrooms: 3,
  image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Wheeldon_Apartment_Building_-_Portland_Oregon.jpg'
}];

export default Ember.Route.extend({
  model() {
    return rentals;
  },
});
```

Here, we are using the ES6 shorthand method definition syntax: `model()` is the same as writing `model: function()`.

The `model` function acts as a **hook**, meaning that Ember will call it for us as during different times in our app.
The model hook we've added to our `index` route handler will be called when a user enters the `index` route.

The `model` hook returns our _rentals_ array and passes it to our `index` template as the `model` property.

Now, let's switch over to our template.
We can use the model data to display our list of rentals.
Here, we'll use another common Handlebars helper called `{{each}}`.
This helper will let us loop through each of the objects in our model:

```handlebars {data-filename=app/templates/index.hbs}
<h1> Welcome to Super Rentals </h1>

We hope you find exactly what you're looking for in a place to stay.

{{#each model as |rental|}}
  <h2>{{rental.title}}</h2>
  <p>Owner: {{rental.owner}}</p>
  <p>Type: {{rental.type}}</p>
  <p>Location: {{rental.city}}</p>
  <p>Number of bedrooms: {{rental.bedrooms}}</p>
{{/each}}
```

In this template, we loop through each model object and call it _rental_.
For each rental, we then create a listing with information about the property.
