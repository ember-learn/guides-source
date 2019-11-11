At its core, Ember is a _template_ driven framework - every part of the UI that
is shown to the user is defined in a template somewhere in your application.
Because of this, templates are central to Ember, and one of the most important
parts of the framework.

We'll discuss the capabilities and core concepts of templates in the following
chapters, but before we do that, we should get started the basics, and the
simplest way to get started on an Ember template is with some HTML!

## The Application Template

The central template in an Ember application is the
`app/templates/application.hbs` file. We can copy HTML into this file, and it
will work without any changes. For instance, you can copy the following example
HTML for a simple messaging app:

```html {data-filename=app/templates/application.hbs}
<div class="messages">
  <aside>
    <div class="avatar is-active" title="Tomster's avatar">T</div>
  </aside>
  <section>
    <h4 class="username">
      Tomster
      <span class="local-time">their local time is 4:56pm</span>
    </h4>

    <p>
      Hey Zoey, have you had a chance to look at the EmberConf brainstorming doc I
      sent you?
    </p>
  </section>

  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf is
      going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think it
        might be a bit out of our budget. Maybe we could rent some spotlights
        instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits its
        peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>

  <form>
    <input>
    <button>
      Send
    </button>
  </form>
</div>
```

And if you serve the app, you'll see the HTML rendered, though it will be
unstyled. You can copy these styles as well to `app/styles/app.css` to style the
example components:

```css {data-filename=styles/app.css}
body {
  max-width: 800px;
  margin: auto;
  padding: 2em;
  font-family: sans-serif;
  background-color: #fdfdfd;
}

.messages {
  display: grid;
  grid-template-columns: 80px 1fr;
  padding: 2em;
  border-radius: 0.5em;
  box-shadow: 0 0.25em 1.5em 0.25em rgba(0,0,0,0.1);
}

.messages > section {
  margin-bottom: 1.5em;
  line-height: 1.5em;
}

.messages p,
.messages ul,
.username {
  margin: 0.5em 0;
}

.local-time {
  font-size: 0.8em;
  color: #da6c4d;
  font-weight: normal;
  margin-left: 10px;
}

.avatar {
  position: relative;
  border-radius: 50%;
  width: 60px;
  height: 60px;

  text-align: center;
  line-height: 60px;

  color: white;
  font-weight: bold;
  background-color: #ff907b;
}

.avatar.is-active:after {
  content: " ";
  height: 14px;
  width: 14px;
  border: solid 3px white;
  border-radius: 50%;
  background-color: #8bc34a;
  position: absolute;
  bottom: 0;
  right: 0;
}

.current-user .avatar {
  background-color: #30aba5;
}

form {
  display: grid;
  grid-column: span 2;
  grid-template-columns: 1fr 6em;
}

form > input {
  padding: 0.5em;
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
  border: 1px solid #cccccc;
  border-right: none;
  font-size: 1em;
}

form > button {
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
  border: 1px solid #cccccc;
  font-size: 1em;
}
```

![screenshot of styled message app](/images/ember-core-concepts/messaging-app-1.png)

You start building parts of an Ember application using HTML, so if you already know HTML and CSS, you know how to build a basic Ember application!

You can even use SVG or web components without any changes. As long as your HTML is valid, Ember will render it.

# Self-Closing Tags

In addition to normal HTML syntax, Ember allows you to use self-closing syntax (`<div />`) as a shorthand for an opening and closing tag (`<div></div>`).

You don't **need** to use this syntax for "void" HTML tags such as `img` or `br`, which are already defined as self-closing by the HTML spec, but you **can** use this syntax as a shorthand for tags that are not self-closing.

# Supported Features

This means that all of the following HTML features work as-is:

- Web components
- SVG
- HTML comments
- Whitespace has the same rules as normal HTML
- Special HTML elements like `<table>` and `<select>`

# Restrictions

There are a handful of restrictions on the HTML that you can put in an Ember template:

- Valid HTML only
- No `<script>` tags
- You can only use HTML that is valid in `<body>`

Other than that, go to town!
