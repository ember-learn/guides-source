This guide will teach you how to build a simple app using Ember from scratch.

We'll cover these steps:

1. Installing Ember.
2. Creating a new application.
3. Defining a route.
4. Writing a UI component.
5. Building your app to be deployed to production.

## Install Ember

You can install Ember with a single command using npm,
the Node.js package manager.
Type this into your terminal:

```bash
npm install -g ember-cli
```

Don't have npm? [Learn how to install Node.js and npm here](https://docs.npmjs.com/getting-started/installing-node).
For a full list of dependencies necessary for an Ember CLI project,
consult our [Installing Ember](../../getting-started/) guide.

## Create a New Application

Once you've installed Ember CLI via npm,
you will have access to a new `ember` command in your terminal.
You can use the `ember new` command to create a new application.

<!-- needs-octane-release-update -->
```bash
ember new ember-quickstart -b @ember/octane-app-blueprint
```

This one command will create a new directory called `ember-quickstart` and set up a new Ember application inside of it.
Out of the box, your application will include:

* A development server.
* Template compilation.
* JavaScript and CSS minification.
* Modern features via Babel.

By providing everything you need to build production-ready web applications in an integrated package,
Ember makes starting new projects a breeze.

Let's make sure everything is working properly.
`cd` into the application directory `ember-quickstart` and start the development server by typing:

```bash
cd ember-quickstart
ember serve
```

After a few seconds, you should see output that looks like this:

```text
Livereload server on http://localhost:7020
Serving on http://localhost:4200/
```

(To stop the server at any time, type Ctrl-C in your terminal.)

Open [`http://localhost:4200`](http://localhost:4200) in your browser of choice.
You should see an Ember welcome page and not much else.
Congratulations! You just created and booted your first Ember app.

We will start by editing the `application` template.
This template is always on screen while the user has your application loaded.
In your editor, open `app/templates/application.hbs` and change it to the following:

```handlebars {data-filename=app/templates/application.hbs}
<h1>PeopleTracker</h1>

{{outlet}}
```

Ember detects the changed file and automatically reloads the page for you in the background.
You should see that the welcome page has been replaced by "PeopleTracker".
You also added an `{{outlet}}` to this page,
which means that any nested route will be rendered in that place.

## Define a Route

Let's build an application that shows a list of scientists.
To do that, the first step is to create a route.
For now, you can think of routes as being the different pages that make up your application.

Ember comes with _generators_ that automate the boilerplate code for common tasks.
To generate a route, type this in a new terminal window in your `ember-quickstart` directory:

```bash
ember generate route scientists
```

You'll see output like this:

```text
installing route
  create app/routes/scientists.js
  create app/templates/scientists.hbs
updating router
  add route scientists
installing route-test
  create tests/unit/routes/scientists-test.js
```

That is Ember telling you that it has created:

1. A template to be displayed when the user visits `/scientists`.
2. A `Route` object that fetches the model used by that template.
3. An entry in the application's router (located in `app/router.js`).
4. A unit test for this route.

Open the newly-created template in `app/templates/scientists.hbs` and add the following HTML:

```handlebars {data-filename=app/templates/scientists.hbs}
<h2>List of Scientists</h2>
```

In your browser, open [`http://localhost:4200/scientists`](http://localhost:4200/scientists).
You should see the `<h2>` you put in the `scientists.hbs` template,
right below the `<h1>` from our `application.hbs` template.

Now that we've got the `scientists` template rendering,
let's give it some data to render.
We do that by specifying a _model_ for that route,
and we can specify a model by editing `app/routes/scientists.js`.

We'll take the code created for us by the generator and add a `model()` method to the `Route`:

```javascript {data-filename="app/routes/scientists.js"}
import Route from '@ember/routing/route';

export default class ScientistsRoute extends Route {
  model() {
    return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
  }
}
```

This code example uses a feature of JavaScript called classes.
Learn more with this [overview of the latest JavaScript features](https://ponyfoo.com/articles/es6).

In a route's `model()` method, you return whatever data you want to make available to the template.
If you need to fetch data asynchronously,
the `model()` method supports any library that uses [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

Now let's tell Ember how to turn that array of strings into HTML.
Open the `scientists` template and add the following code to loop through the array and print it:

```handlebars {data-filename="app/templates/scientists.hbs"}
<h2>List of Scientists</h2>

<ul>
  {{#each this.model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
```

Here, we use the `each` helper to loop over each item in the array we provided from the `model()` hook and print it inside an `<li>` element.

## Create a UI Component

As your application grows, you will notice you are sharing UI elements between multiple pages,
or using them multiple times on the same page.
Ember makes it easy to refactor your templates into reusable components.

Let's create a `PeopleList` component that we can use in multiple places to show a list of people.

As usual, there's a generator that makes this easy for us.
Make a new component by typing:

```bash
ember generate component people-list
```

Copy and paste the `scientists` template into the `PeopleList` component's template and edit it to look as follows:

```handlebars {data-filename=app/templates/components/people-list.hbs}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

Note that we've changed the title from a hard-coded string ("List of Scientists") to a dynamic property (`{{@title}}`).
The `@` indicates that `@title` is an argument that was passed to the component.

We've also renamed `scientist` to the more-generic `person`,
decreasing the coupling of our component to where it's used.

Save this template and switch back to the `scientists` template.
Replace all our old code with our new componentized version.

We're going to tell our component:

1. What title to use, via the `title` attribute.
2. What array of people to use, via the `people` attribute. We'll
   provide this route's `model` as the list of people.

```handlebars {data-filename="app/templates/scientists.hbs"}
<PeopleList @title="List of Scientists" @people={{this.model}} />
```

Go back to your browser and you should see that the UI looks identical.
The only difference is that now we've componentized our list into a version that's more reusable and more maintainable.

You can see this in action if you create a new route that shows a different list of people.
As an exercise for the reader,
you may try to create a `programmers` route that shows a list of famous programmers.
By re-using the `PeopleList` component, you can do it in almost no code at all.

## Click Events

So far, your application is listing data,
but there is no way for the user to interact with the information.
In web applications you often want to listen for user events like clicks or hovers.
Ember makes this easy to do.

Create a button inside the `li` with the following syntax:

```handlebars {data-filename="app/templates/components/people-list.hbs"}
<h2>{{this.title}}</h2>

<ul>
  {{#each this.people as |person|}}
    <li>
      <button {{on "click" (fn this.showPerson person)}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Let us break it down.

First we have `on`.
`on` allows you to call a function when a certain DOM event has been triggered.
In this case, we are listening for the click event, `{{on "click" …}}`.

Next, we have `fn`.
This allows you to create a function that wraps another function and populates some of the arguments.
In this specific case, `(fn this.showPerson person)` means that the function created by `fn` will call `this.showPerson` and pass it the argument `person`.

Putting them together, we can see that whenever the button is clicked, the `showPerson` method of the component will be called, which `person` as the first argument.


_Note: While the button element will ensure that your code is accessible, you may require an extra style or two if you wish to have it look like regular text. You might be tempted to use a regular link here, but that will cause your accessibility tests to fail._

Add the action to the `people-list.js` file:

```javascript {data-filename="app/components/people-list.js"}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PeopleList extends Component {
  @action
  showPerson(person) {
    alert(person);
  }
}
```

The `@action` syntax is a JavaScript feature called a decorator.
It is necessary in Ember applications so you can use it in the component's template, like shown above.

Now in the browser when a scientist's name is clicked,
this function is called and the person's name is alerted.

## Building For Production

Now that we've written our application and verified that it works in development,
it's time to get it ready to deploy to our users.

To do so, run the following command:

```bash
ember build --environment=production
```

The `build` command packages up all of the assets that make up your
application&mdash;JavaScript, templates, CSS, web fonts, images, and
more.

In this case, we told Ember to build for the production environment via the `--environment` flag.
This creates an optimized bundle that's ready to upload to your web host.
Once the build finishes,
you'll find all of the concatenated and minified assets in your application's `dist/` directory.

The Ember community values collaboration and building common tools that everyone relies on.
If you're interested in deploying your app to production in a fast and reliable way,
check out the [Ember CLI Deploy](http://ember-cli-deploy.com/) addon.

If you deploy your application to an Apache web server, first create a new virtual host for the application.
To make sure all routes are handled by index.html,
add the following directive to the application's virtual host configuration:

```apacheconf
FallbackResource index.html
```
