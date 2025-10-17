<!-- Heads up! This is a generated file, do not edit directly. You can find the source at https://github.com/ember-learn/super-rentals-tutorial/blob/master/src/markdown/tutorial/part-1/01-orientation.md -->

In this chapter, you will install _[Ember CLI](https://cli.emberjs.com/release/)_, use it to generate a new Ember project, and add some basic templates and styles to your new app. By the end of this chapter, you should have a landing page with Professor Tomster's cute little face featured on it:

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="The Super Rentals app by the end of the chapter" width="1024" height="250">

While building your landing page, you will learn about:

- Installing Ember CLI
- Creating a new Ember app with Ember CLI
- Starting and stopping the development server
- Editing files and live reload
- Working with HTML, CSS and assets in an Ember app

## Installing Ember CLI

You can install the latest version of Ember CLI by running the following command. If you've already done this by following the [Quick Start](../../../getting-started/quick-start/) guide, feel free to skip ahead!

```shell
$ npm install -g ember-cli
```

To verify that your installation was successful, run:

```shell
$ ember --version
ember-cli: 6.8.0
node: 20.19.5
os: linux x64
```

If a version number is shown, you're ready to go.

## Creating a New Ember App with Ember CLI

We can create a new project using Ember CLI's `new` command. It follows the pattern `ember new <project-name>`. In our case, the project name would be `super-rentals`. We will also include a `--lang en` option. This sets our app's primary language to English and improves the website's [accessibility](../../../accessibility/application-considerations/).

```shell
$ ember new super-rentals --lang en --strict
installing app-blueprint
Creating a new Ember app in /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals:
  create .editorconfig
  create .ember-cli
  create .env.development
  create .github/workflows/ci.yml
  create .prettierignore
  create .prettierrc.mjs
  create .stylelintignore
  create .stylelintrc.cjs
  create .template-lintrc.mjs
  create .watchmanconfig
  create README.md
  create /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals/babel.config.cjs
  create /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals/eslint.config.mjs
  create app/app.js
  create app/components/.gitkeep
  create app/config/environment.js
  create app/controllers/.gitkeep
  create app/deprecation-workflow.js
  create app/helpers/.gitkeep
  create app/models/.gitkeep
  create app/router.js
  create app/routes/.gitkeep
  create app/services/.gitkeep
  create app/styles/app.css
  create /home/runner/work/super-rentals-tutorial/super-rentals-tutorial/dist/code/super-rentals/app/templates/application.gjs
  create config/ember-cli-update.json
  create config/environment.js
  create config/optional-features.json
  create config/targets.js
  create ember-cli-build.js
  create .gitignore
  create index.html
  create package.json
  create public/robots.txt
  create testem.cjs
  create tests/helpers/index.js
  create tests/index.html
  create tests/integration/.gitkeep
  create tests/test-helper.js
  create tests/unit/.gitkeep
  create vite.config.mjs

Installing packages... This might take a couple of minutes.
npm: Installing dependencies ...
npm: Installed dependencies

Initializing git repository.
Git: successfully initialized.

Successfully created project super-rentals.
Get started by typing:

  $ cd super-rentals
  $ npm start

Happy coding!
```

This should have created a new folder for us called `super-rentals`. We can navigate into it using the `cd` command.

```shell
$ cd super-rentals
```

For the rest of the tutorial, all commands should be run within the `super-rentals` folder. This folder has the following structure:

```plain
super-rentals
├── .github
│   └── workflows
│       └── ci.yml
├── app
│   ├── components
│   │   └── .gitkeep
│   ├── config
│   │   └── environment.js
│   ├── controllers
│   │   └── .gitkeep
│   ├── helpers
│   │   └── .gitkeep
│   ├── models
│   │   └── .gitkeep
│   ├── routes
│   │   └── .gitkeep
│   ├── services
│   │   └── .gitkeep
│   ├── styles
│   │   └── app.css
│   ├── templates
│   │   └── application.gjs
│   ├── app.js
│   ├── deprecation-workflow.js
│   └── router.js
├── config
│   ├── ember-cli-update.json
│   ├── environment.js
│   ├── optional-features.json
│   └── targets.js
├── dist
│   ├── @embroider
│   │   └── virtual
│   │       ├── app.css
│   │       ├── test-support.css
│   │       ├── test-support.js
│   │       ├── vendor.css
│   │       └── vendor.js
│   ├── assets
│   │   ├── app-BsLReVUA.css
│   │   ├── app-pzWalck4.js
│   │   ├── main-CdDm1GLL.js
│   │   ├── modules-4-12-DZBwh_jw.js
│   │   ├── tests-DP3uERZX.js
│   │   └── tests-DuyDhxzu.css
│   ├── ember-welcome-page
│   │   └── images
│   │       └── construction.png
│   ├── tests
│   │   └── index.html
│   ├── index.html
│   ├── robots.txt
│   └── testem.js
├── public
│   └── robots.txt
├── tests
│   ├── helpers
│   │   └── index.js
│   ├── integration
│   │   └── .gitkeep
│   ├── unit
│   │   └── .gitkeep
│   ├── index.html
│   └── test-helper.js
├── tmp
│   └── compat-prebuild
│       └── .stage2-output
├── .editorconfig
├── .ember-cli
├── .env.development
├── .gitignore
├── .prettierignore
├── .prettierrc.mjs
├── .stylelintignore
├── .stylelintrc.cjs
├── .template-lintrc.mjs
├── .watchmanconfig
├── README.md
├── babel.config.cjs
├── ember-cli-build.js
├── eslint.config.mjs
├── index.html
├── package.json
├── package-lock.json
├── testem.cjs
└── vite.config.mjs

28 directories, 58 files
```

We'll learn about the purposes of these files and folders as we go. For now, just know that we'll spend most of our time working within the `app` folder.

## Starting and Stopping the Development Server

Ember CLI comes with a lot of different commands for a variety of development tasks, such as the `ember new` command that we saw earlier. It also comes with a _development server_, which we can launch within the project with the `npm start` command:

```shell
$ npm start

> super-rentals@0.0.0 start
> vite

Building

Environment: development

building... 


Build successful (9761ms)

Slowest Nodes (totalTime >= 5%) | Total (avg)
-+-
Babel: @embroider/macros (1) | 403ms



  VITE v7.1.10  ready in 3779 ms

  ➜  Local:   http://localhost:4200/
```

The development server is responsible for compiling our app and serving it to the browsers. It may take a while to boot up. Once it's up and running, open your favorite browser and head to <http://localhost:4200>. You should see the following welcome page:

<img src="/images/tutorial/part-1/orientation/welcome@2x.png" alt="Welcome to Ember!" width="1024" height="919">

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The <code>localhost</code> address in the URL means that you can only access the development server from your local machine. If you would like to share your work with the world, you will have to <em><a href="https://cli.emberjs.com/release/basic-use/deploying/">deploy</a></em> your app to the public Internet. We'll cover how to do that in Part 2 of the tutorial.</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can exit out of the development server at any time by typing `Ctrl + C` into the terminal window where `npm start` is running. That is, typing the "C" key on your keyboard _while_ holding down the "Ctrl" key at the same time. Once it has stopped, you can start it back up again with the same `npm start` command. We recommend having two terminal windows open: one to run the server in background, another to type other Ember CLI commands.

## Editing Files and Live Reload

The development server has a feature called _live reload_, which monitors your app for file changes, automatically re-compiles everything, and refreshes any open browser pages. This comes in really handy during development, so let's give that a try!

As text on the welcome page pointed out, the source code for the page is located in `app/templates/application.gjs`. Let's try to edit that file and replace it with our own content:

```gjs { data-filename="app/templates/application.gjs" data-diff="-1,-2,-3,-5,-6,-7,-8,-9,-10,-11,+12" }
import { pageTitle } from 'ember-page-title';
import { WelcomePage } from 'ember-welcome-page';

<template>
  {{pageTitle "SuperRentals"}}

  {{outlet}}

  {{! The following component displays Ember's default welcome message. }}
  <WelcomePage />
  {{! Feel free to remove this! }}
  Hello World!!!
</template>
```

Soon after saving the file, your browser should automatically refresh and render our greetings to the world. Neat!

<img src="/images/tutorial/part-1/orientation/hello-world@2x.png" alt="Hello World!!!" width="1024" height="250">

When you are done experimenting, go ahead and delete the `app/templates/application.gjs` file. We won't be needing this for a while, so let's start afresh. We can add it back later when we have a need for it.

Again, if you still have your browser tab open, your tab will automatically re-render a blank page as soon as you delete the file. This reflects the fact that we no longer have an application template in our app.

## Working with HTML, CSS and Assets in an Ember App

Create a `app/templates/index.gjs` file and paste the following markup.

```gjs { data-filename="app/templates/index.gjs" }
<template>
  <div class="jumbo">
    <div class="right tomster"></div>
    <h2>Welcome to Super Rentals!</h2>
    <p>We hope you find exactly what you're looking for in a place to stay.</p>
  </div>
</template>
```

If you are thinking, "Hey, that looks like HTML!", then you would be right! In their simplest form, Ember templates are really just HTML wrapped in a `<template>` tag. If you are already familiar with HTML, you should feel right at home here.

Of course, unlike HTML, Ember templates can do a lot more than just displaying static content. We will see that in action soon.

After saving the file, your browser tab should automatically refresh, showing us the welcome message we just worked on.

<img src="/images/tutorial/part-1/orientation/unstyled@2x.png" alt="Welcome to Super Rentals! (unstyled)" width="1024" height="250">

Before we do anything else, let's add some styling to our app. We spend enough time staring at the computer screen as it is, so we must protect our eyesight against unstyled markup!

Fortunately, our designer sent us some CSS to use, so we can <a href="/downloads/style.css" download="app.css">download the stylesheet file</a> and copy it into `app/styles/app.css`. This file has all the styles we need for building the rest of the app.

```css { data-filename="app/styles/app.css" }
@import url(https://fonts.googleapis.com/css?family=Lato:300,300italic,400,700,700italic);

/**
 * Base Elements
 */

* {
  margin: 0;
  padding: 0;
}

body,
h1,
h2,
h3,
h4,
h5,
h6,
p,
div,
span,
a,
button {
  font-family: 'Lato', 'Open Sans', 'Helvetica Neue', 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.5;
}

body {
  background: #f3f3f3;
}

/* ...snip... */
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>The CSS file is pretty long, so we didn't show the entire file here. Be sure to use the link above to download the complete file!</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

If you are familiar with CSS, feel free to customize these styles to your liking! Just keep in mind that you may see some visual differences going forward, should you choose to do so.

When you are ready, save the CSS file; our trusty development server should pick it up and refresh our page right away. No more unstyled content!

<img src="/images/tutorial/part-1/orientation/styled@2x.png" alt="Welcome to Super Rentals! (styled)" width="1024" height="250">

To match the mockup from our designer, we will also need to download the `teaching-tomster.png` image, which was referenced from our CSS file:

```css { data-filename=app/styles/app.css }
.tomster {
  background: url(../assets/images/teaching-tomster.png);
  /* ...snip... */
}
```

As we learned earlier, the Ember convention is to place your source code in the `app` folder. For other assets like images and fonts, the convention is to put them in the `public` folder. We will follow this convention by <a href="/downloads/teaching-tomster.png" download="teaching-tomster.png">downloading the image file</a> and saving it into `public/assets/images/teaching-tomster.png`.

Both Ember CLI and the development server understand these folder conventions and will automatically make these files available to the browser.

You can confirm this by navigating to
`http://localhost:4200/assets/images/teaching-tomster.png`. The image should also show up in the welcome page we have been working on. You may need to do a manual refresh for the browser to pick up the new file.

<img src="/images/tutorial/part-1/orientation/styled-with-tomster@2x.png" alt="Welcome to Super Rentals! (with Tomster)" width="1024" height="250">
