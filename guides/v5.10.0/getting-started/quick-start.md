Welcome to Ember! Follow this guide to build a simple web app using HTML, JavaScript, the command line, and some of Ember's best features.
Each step has code you can copy and paste directly or modify to make it your own.
Along the way, you will be introduced to the Ember community so that you know who to ask for help and how to continue your learning journey.

We'll cover these steps:

1. Installing Ember.
2. Creating a new application.
3. Defining a route.
4. Writing a UI component.
5. Building your app to be deployed to production.
6. Deploying your app to Netlify.

## Install Ember

You can install Ember with a single command using npm,
the Node.js package manager.
Type this into your terminal:

```bash
npm install -g ember-cli
```

Don't have npm? [Learn how to install Node.js and npm here](https://docs.npmjs.com/getting-started/installing-node).
For a full list of dependencies necessary for an Ember CLI project, visit the [Ember CLI Guides - Installing](https://cli.emberjs.com/release/basic-use/).

## Create a New Application

Once you've installed Ember CLI via npm,
you will have access to a new `ember` command in your terminal.
You can use the `ember new` command to create a new application.

```bash
ember new ember-quickstart --lang en
```

This one command will create a new directory called `ember-quickstart` and set up a new Ember application inside of it.
The `--lang en` option sets the app's primary language to English to help improve [accessibility](../../accessibility/application-considerations/).
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
npm start
```

After a few seconds, you should see output that looks like this:

```text
Livereload server on http://localhost:7020
Serving on http://localhost:4200/
```

(To stop the server at any time, type Ctrl-C in your terminal.)

Open [`http://localhost:4200`](http://localhost:4200) in your browser of choice.
You should see an Ember welcome page and not much else.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        If you are having trouble getting this running, other Ember developers would be happy to help!
        Visit <a href="https://emberjs.com/community/"> The Ember Community Page</a> to join chat groups or forums.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Congratulations! You just created and booted your first Ember app.

## Write some HTML in a template

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
which means that any route will be rendered in that place.

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
{{page-title "Scientists"}}
<h2>List of Scientists</h2>
```

In your browser, open [`http://localhost:4200/scientists`](http://localhost:4200/scientists).
You should see the `<h2>` we put in the `scientists.hbs` template right below the `<h1>` from our `application.hbs` template.

Since the scientist route is nested under the application route, Ember will render its content inside the application route template's `{{outlet}}` directive.

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
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
```

Here, we use the `each` _helper_ to loop over each item in the array we
provided from the `model()` hook. Ember will render the _block_ contained
inside the `{{#each}}...{{/each}}` helper once for each item (each scientist in
our case) in the array. The item (the scientist) that is being rendered
currently will be made available in the `scientist` variable, as denoted by
`as |scientist|` in the `each` helper.

The end result is that there will be one `<li>` element corresponding to each
scientist in the array inside the `<ul>` unordered list.

## Create a UI Component

As your application grows, you will notice you are sharing UI elements between multiple pages,
or using them multiple times on the same page.
Ember makes it easy to refactor your templates into reusable components.

Let's create a `<PeopleList>` component that we can use in multiple places to show a list of people.

As usual, there's a generator that makes this easy for us.
Make a new component by typing:

```bash
ember generate component people-list
```

Copy and paste the `scientists` template into the `<PeopleList>` component's template and edit it to look as follows:

```handlebars {data-filename=app/components/people-list.hbs}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>{{person}}</li>
  {{/each}}
</ul>
```

Note that we've changed the title from a hard-coded string ("List of Scientists")
to `{{@title}}`. The `@` indicates that `@title` is an argument that will be
passed into the component, which makes it easier to reuse the same component in
other parts of the app we are building.

We've also renamed `scientist` to the more-generic `person`,
decreasing the coupling of our component to where it's used.

Our component is called `<PeopleList>`, based on its name on the file system. Please note that the letters P and L are capitalized.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        A component's name is derived from its file name.
        We capitalize the first letter and every letter after <code>-</code>, then remove the hyphens.
        This is known as pascal case.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

Save this template and switch back to the `scientists` template.

We're going to tell our component:

1. What title to use, via the `@title` argument.
2. What array of people to use, via the `@people` argument. We'll
   provide this route's `@model` as the list of people.

We'll need to make some changes to the code we wrote before.

In the rest of the code examples in this tutorial, whenever we add or remove code, we will show a "diff." The lines you need to remove have a minus sign in front of them, and the lines you should add have a plus sign. If you are using a screen reader while you go through the Guides, we recommend using Firefox and NVDA or Safari and VoiceOver for the best experience.

Let's replace all our old code with our new componentized version:

```handlebars {data-filename="app/templates/scientists.hbs" data-diff="-1,-2,-3,-4,-5,-6,-7,+8,+9,+10,+11"}
<h2>List of Scientists</h2>

<ul>
  {{#each @model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
<PeopleList 
  @title="List of Scientists" 
  @people={{@model}} 
/>
```

Go back to your browser and you should see that the UI looks identical.
The only difference is that now we've componentized our list into a version that's more reusable and more maintainable.

You can see this in action if you create a new route that shows a different list of people.
As an additional exercise (that we won't cover),
you can try to create a `programmers` route that shows a list of famous programmers.
If you re-use the `<PeopleList>` component, you can do it with almost no code at all.

## Responding to user interactions

So far, our application is listing data, but there is no way for the user to
interact with the information. In web applications we often want to respond to
user actions like clicks or hovers. Ember makes this easy to do.

First, we can modify the `<PeopleList>` component to include a button:

```handlebars {data-filename="app/components/people-list.hbs"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Now that we have a button, we need to wire it up to do _something_ when a user
clicks on it. For simplicity, let's say we want to show an `alert` dialog with
the person's name when the button is clicked.

So far, our `<PeopleList>` component is purely presentational – it takes some
inputs as arguments and renders them using a template. To introduce _behavior_
to our component – handling the button click in this case, we will need to
attach some _code_ to the component.

In addition to the template, a component can also have a JavaScript file for
this exact purpose. Go ahead and create a `.js` file with the same name and in
the same directory as our template (`app/components/people-list.js`),
and paste in the following content:

```javascript {data-filename="app/components/people-list.js"}
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class PeopleListComponent extends Component {
  @action
  showPerson(person) {
    alert(`The person's name is ${person}!`);
  }
}
```

_Note: If you want this file created for you, you may pass the `-gc` flag when running the component generator._

Here, we created a basic component class and added a method that accepts a
person as an argument and brings up an alert dialog with their name. The
`@action` _decorator_ indicates we want to use this method as an _action_
in our template, in response to user interaction.

Now that we have implemented the desired behavior, we can go back to
the component's template and wire everything up:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button">{{person}}</button>
      <button type="button" {{on 'click' this.showPerson}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Here, we used the `on` _modifier_ to attach the `this.showPerson` action to
the button in the template.

There is a problem with this though – if you tried this in the browser, you
will quickly discover that clicking on the buttons will bring up an alert
dialog that said "The person's name is `[Object MouseEvent]`!" – eek!

The cause of this bug is that we wrote our action to take an argument – the
person's name – and we forgot to pass it. The fix is easy enough:

```handlebars {data-filename="app/components/people-list.hbs" data-diff="-6,+7"}
<h2>{{@title}}</h2>

<ul>
  {{#each @people as |person|}}
    <li>
      <button type="button" {{on 'click' this.showPerson}}>{{person}}</button>
      <button type="button" {{on 'click' (fn this.showPerson person)}}>{{person}}</button>
    </li>
  {{/each}}
</ul>
```

Instead of passing the action to the `on` modifier directly, we used the `fn`
helper to pass the `person` as an argument which our action expects.

Feel free to try this in the browser. Finally, everything should behave exactly
as we hoped!

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
To make sure all routes are handled by `index.html`,
add the following directive to the application's virtual host configuration:

```apacheconf
FallbackResource index.html
```

## Deploying your app to Netlify

[Netlify](http://netlify.com/products) is a one of many ways to deploy your app to the web so you can share it with others!

![About Netlify](/images/quick-guide/netlify/netlify-product.png)

Why Netlify?

It does not require a high level of knowledge for you to deploy your website to production.
Netlify offers a free account option and no credit card is required.
These Guides themselves are hosted on Netlify, while other parts of `emberjs.com` are hosted using Heroku, Fastly, GitHub pages, and AWS.
Overall, Ember developers have many options for how they deploy their apps! Netlify is just one of the many options you have.

Following these steps will help you get your site up and running in minutes:

First you need to [sign up for a Netlify account](https://app.netlify.com/signup) if you do not already have one:

![deploying to Netlify](/images/quick-guide/netlify/create-netlify-account.png)

The next step is to let the web app server know how to handle URLs. There are 2 ways to do so.

One, you can create a file in your `ember-quickstart/public` folder called
`_redirects`. Add `/* /index.html 200` to the first line and save the file. 
This will let the server know to redirect all pages to `index.html` file. 
Once redirected, Ember.js app itself will generate the matching html for URLs such as `/scientists`.

Two, you can use an addon created by the community, such as [ember-cli-netlify](https://github.com/shipshapecode/ember-cli-netlify), to handle URLs.

Now you are ready to deploy your app to production on Netlify platform. There are two ways to do this:

1. Deploying to Netlify using drag and drop
2. Deploying to Netlify using Git (specifically GitHub)

**Deploying to Netlify using drag and drop**

You may need to re-create your `dist` directory to include changes made to `_redirects` file by running this command

```bash
ember build --environment=production
```

Once you are logged-in to your Netlify account and in the "Sites" section, you should see the Netlify drag and drop area

  ![Netlify Drag and Drop Area](/images/quick-guide/netlify/drag-and-drop/02.png)

Next, locate your `dist` folder on your local machine and drag and drop it into this area

When your files have been successfully uploaded, you should see the status of your deployment in the "Getting started" section

![Getting Started using Drag and Drop on Netlify](/images/quick-guide/netlify/drag-and-drop/03.png)

Once you see "Your site is deployed" as shown above, your website is now live and you can click on the link provided above the "Getting started" section to view your site

![View your site on Netlify](/images/quick-guide/netlify/drag-and-drop/04.png)

Congratulations! Your site is now live and in production!

**Deploying to Netlify using Git (specifically GitHub)**

Make sure you are logged-in to your Netlify account and in the "Sites" section

Click the button that says "New site from Git".

![Netlify Continuous Deployment Git](/images/quick-guide/netlify/github/new-site-from-git.png)

Click the "GitHub" button under "Continuous Deployment" to connect to your GitHub account. Please note you will be taken to a series of GitHub login screens and asked to select your GitHub preferences related to Netlify

![Netlify choose your GitHub repository to deploy](/images/quick-guide/netlify/github/connect-to-github.png)

Once you have successfully connected your GitHub account with Netlify, you should see a list of repositories to choose from. Select or search for your GitHub repository that you wish to deploy

![Netlify Ember Default Deploy Settings](/images/quick-guide/netlify/github/select-github-repo.png)

If you have successfully selected your repo and it is an Ember application, Netlify will automatically generate the deploy settings as shown below. These instructions assume you do not want to change any of the default settings generated by Netlify. So if everything looks good to you, go ahead and click the "Deploy site" button

![Netlify GitHub Deploy Overview](/images/quick-guide/netlify/github/github-create-new-site.png)

Once you click the "Deploy site" button, you will be taken to your website "Overview" and you should see the status of your deployment

![Netlify GitHub Deploy Confirmation](/images/quick-guide/netlify/github/github-deploy-confirmation.png)

Once you see "Your site is deployed" as shown above, your website is now live and you can click on the link provided above the "Getting started" section to view your site

![View your site on Netlify](/images/quick-guide/netlify/github/github-live.png)

Congratulations! Your site is now live and in production!
  
## Next steps

Now that your app is deployed, what should you do next?

### Advance to the next level

There is an official, free tutorial here in the Guides that delves deeper into some of the features you used today.
[Give it a try!](../../tutorial/part-1/)

### Explore the ecosystem

Now that you have the basics down, are you feeling creative and adventurous?
The Ember community has created hundreds of addons that you can use for free in your app.
Addons let you quickly add features like calendars, navbars, payments, authentication, themes, and more.
Visit [Ember Observer](https://emberobserver.com) to browse the possibilities!

### Style it up

That app we made is a bit plain. Do you know any CSS? Put your styles in `app/styles/app.css`, which is automatically included in your app build.

### Connect with the Ember Community

One thing that makes Ember special is that every app you create has a _lot_ in common with apps that other people have made.
This means that chances are good that you can connect with other developers who share both your interests and technical challenges.
Visit the [Ember Community page](https://emberjs.com/community/) to learn about the ways you can get connected. Find a nearby meetup, ask questions, follow a newsletter, and more!
We hope to see you around!
