Before you start writing any Ember code, it's a good idea to get an overview of how an
Ember application works.

![ember core concepts](/images/ember-core-concepts/ember-core-concepts.svg)

## Router and Route Handlers

Imagine we are writing a web app for a site that lets users list their properties to rent. At any given time, we should be able to answer questions about the current state like _What rental are they looking at?_ and _Are they editing it?_ In Ember, the answer to these questions is determined by the URL.
The URL can be set in a few ways:

* The user loads the app for the first time.
* The user changes the URL manually, such as by clicking the back button or by editing the address bar.
* The user clicks a link within the app.
* Some other event in the app causes the URL to change.

No matter how the URL gets set, the first thing that happens is that the Ember router maps the URL to a route handler.

The route handler then typically does two things:

* It loads a model.
* It renders a template, which has access to the model.

## Models

Models represent persistent state.

For example, a property rentals application would want to save the details of
a rental when a user publishes it, and so a rental would have a model defining
its details, perhaps called the _rental_ model. You may also need a _user_
model to keep track of who is currently logged in.

A model typically persists information to a web server, although models can be
configured to save to anywhere else, such as the browser's Local Storage.

By default new Ember apps include [EmberData](../../models/), which is a
separate data library that integrates with Ember and provides a solid,
conventional model layer. We'll see EmberData in action in the tutorial in
the next section.

You can also provide your own model layer using other data libraries such as
[Redux](https://github.com/ember-redux/ember-redux) or
[Apollo](https://github.com/ember-graphql/ember-apollo-client), or create your
own model layer using the tools that Ember provides for state, such as
[autotracking](../../components/component-state-and-actions/). We'll learn more
about these tools throughout the guides.

## Templates

Ember uses templates to build up the user interface in an application.

If you have written HTML before, you already know how to write a basic Ember
template. For example:

```handlebars {data-filename="app/templates/welcome.hbs"}
<div>Hi, this is a valid Ember template!</div>
```

In addition to static HTML content, Ember uses the syntax of [Handlebars](http://handlebarsjs.com)
to describe dynamic user interface elements.

For example, as mentioned before, the route handler makes the model available
to its template:

```handlebars {data-filename="app/templates/welcome.hbs"}
{{!-- The model for this route is the current user --}}

<div>
  Hi <img src="{{@model.profileImage}}" alt="{{@model.name}}'s profile picture"> {{@model.name}},
  this is a valid Ember template!
</div>

{{#if @model.isAdmin}}
  <div>Remember, with great power comes great responsibility!</div>
{{/if}}
```

This example combines several Handlebars features to create a personalized
experience for the user, something we couldn't do with just static HTML alone.
We used the comment syntax (`{{!-- ... --}}`) to leave a note for future
developers, the double curly braces syntax (`{{...}}`) to include dynamic
values, as well as using the `{{#if}}...{{/if}}` syntax to conditionally render
some extra content.

We will go into more details about each of these template features later on in
this guide.

## Components

Components allow you to break up your templates and organize them into small,
self-contained and reusable pieces.

In its most basic form, a component is just a piece of template that can be
referred to by name. Similar to functions in programming languages, they can
also take _arguments_, allowing them to be customized to the specific context
they are being rendered into.

For example, the example in the previous section is getting a bit long. We can
_extract_ the snippet for rendering the user's name and profile picture into
its own component:

```handlebars {data-filename="app/components/user-profile.hbs"}
<img src="{{@user.profileImage}}" alt="{{@user.name}}'s profile picture"> {{@user.name}}
```

Doing this allows us to simplify the original template like so:

```handlebars {data-filename="app/templates/welcome.hbs"}
{{!-- The model for this route is the current user --}}

<div>
  Hi <UserProfile @user={{@model}} /> this is a valid Ember template!
</div>

{{#if @model.isAdmin}}
  <div>Remember, with great power comes great responsibility!</div>
{{/if}}
```

Not only did we clean up the original template to be more readable, we now
have a `<UserProfile>` component that we can reuse whenever we need to render
information about a given user.

You can think of components as Ember's way for letting you create your own HTML
tags. In addition to rendering content, components can also have JavaScript
code associated with them, allowing you to add _behavior_, such as responding
to a user clicking on your component.

We will cover these advanced component features in a later chapter. For now,
let's see these core concepts in action by building a property rental
application in the next lesson.
