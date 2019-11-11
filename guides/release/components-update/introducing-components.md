You can put all of your application HTML into a single file, but in practice,
you'll probably want to break it apart into smaller files.

In Ember, you break your application into smaller pieces called "components".

Let's start with the sample HTML for a messaging app that we introduced in the
previous chapter:

```html {data-filename="app/templates/application.hbs"}
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

## Breaking it into pieces

Let's take the large template and break it up into smaller pieces. We can see
there are 3 pretty distinct parts of this template:

- The received message (Tomster's message).
- The sent message (Zoey's message).
- The new message input.

### The Received Message

First, let's copy Tomster's message into its own component:

```handlebars {data-filename="app/components/received-message.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We've just created our first component! A component is kind of like your own
custom HTML tag.

HTML tags start with lowercase letters (`<div>`, `<p>`, `<table>`), and Ember
components start with capital letters. Our component is called
`<ReceivedMessage>`, based on its name on the file system.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        A component's name is the same as its name on the file system,
        capitalizing the first letter and every letter following a `-`, and
        removing the `-` ("pascal case").
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

We can include it into our application using HTML tag syntax.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-2,-3,-4,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,+16"}
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
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </section>
  <ReceivedMessage/>

  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
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

### The Sent Message

Let's do it again. Pull out the sent message, and then include it in our
application template.

```handlebars {data-filename="app/components/sent-message.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
<section>
  <h4 class="username">Zoey</h4>

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

```handlebars {data-filename="app/templates/application.hbs" data-diff="-4,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,+37"}
<div class="messages">
  <ReceivedMessage />

  <aside>
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's
      EmberConf is going, I'm sure it's going to be the best one yet.
      Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this
        year (it really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but
        I think it might be a bit out of our budget. Maybe we could
        rent some spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line
        was <em>way</em> too long. Will get on that now before rental
        season hits its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>
  <SentMessage />

  <form>
    <input>
    <button>
      Send
    </button>
  </form>
</div>
```

### The New Message Input

Finally, let's pull out the new message input.

```handlebars {data-filename="app/components/new-message-input.hbs"}
<form>
  <input>
  <button>
    Send
  </button>
</form>
```

And include it in the application.

```handlebars {data-filename="app/templates/application.hbs" data-diff="-6,-7,-8,-9,-10,-11,+12"}
<div class="messages">
  <ReceivedMessage />

  <SentMessage />

  <form>
    <input>
    <button>
      Send
    </button>
  </form>
  <NewMessageInput />
</div>
```

## Breaking Components Down Further

Components can be used _within_ other components, so we can continue to break
down our template if we want. For instance, Tomster's avatar could be made
into its own component that is then used within the `<ReceivedMessage>`.

```handlebars {data-filename="app/components/received-message-avatar.hbs"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
```

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-1,-2,-3,+4"}
<aside>
  <div class="avatar is-active" title="Tomster's avatar">T</div>
</aside>
<ReceivedMessageAvatar />
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We could also extract the username from the message:

```handlebars {data-filename="app/components/received-message-username.hbs"}
<h4 class="username">
  Tomster
  <span class="local-time">their local time is 4:56pm</span>
</h4>
```

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-3,-4,-5,-6,+7"}
<ReceivedMessageAvatar />
<section>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>
  <ReceivedMessageUsername />

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

We can do the same for the `<SentMessage>` component:

```handlebars {data-filename="app/components/sent-message-avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message-username.hbs"}
<h4 class="username">Zoey</h4>
```

```handlebars {data-filename="app/components/sent-message.hbs" data-diff="-3,+4"}
<SentMessageAvatar />
<section>
  <h4 class="username">Zoey</h4>
  <SentMessageUsername />

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

Components can be broken down to any level, and included in each other and
reused.

### Nesting Components in Folders

The avatar and username components are really pretty directly related to the
respective sent and received message components. In some cases, it can be
helpful to group related components together in the filesystem directly. We can
do this by moving them into subfolders within `app/components`.

```handlebars {data-filename="" data-diff="-4,-5,+6,+7,+8,-9,-10,-11,+12,+13,+14"}
app/
  components/
    received-message.hbs
    received-message-avatar.hbs
    received-message-username.hbs
    received-message/
      avatar.hbs
      username.hbs
    sent-message.hbs
    sent-message-avatar.hbs
    sent-message-username.hbs
    sent-message/
      avatar.hbs
      username.hbs
```

We can then use the `::` separator in templates to access components within a
folder:

```handlebars {data-filename="app/components/received-message.hbs" data-diff="-1,+2,-4,+5"}
<ReceivedMessageAvatar />
<ReceivedMessage::Avatar />
<section>
  <ReceivedMessageUsername />
  <ReceivedMessage::Username />

  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</section>
```

```handlebars {data-filename="app/components/sent-message.hbs" data-diff="-1,+2,-4,+5"}
<SentMessageAvatar />
<SentMessage::Avatar />
<section>
  <SentMessageUsername />
  <SentMessage::Username />

  <p>Hey!</p>

  <p>
    I love the ideas! I'm really excited about where this year's
    EmberConf is going, I'm sure it's going to be the best one yet.
    Some quick notes:
  </p>

  <ul>
    <li>
      Definitely agree that we should double the coffee budget this
      year (it really is impressive how much we go through!)
    </li>
    <li>
      A blimp would definitely make the venue very easy to find, but
      I think it might be a bit out of our budget. Maybe we could
      rent some spotlights instead?
    </li>
    <li>
      We absolutely will need more hamster wheels, last year's line
      was <em>way</em> too long. Will get on that now before rental
      season hits its peak.
    </li>
  </ul>

  <p>Let me know when you've nailed down the dates!</p>
</section>
```

The `index.hbs` of a component directory can also be referred to directly:

```handlebars {data-filename="" data-diff="-3,+6,-9,+11"}
app/
  components/
    received-message.hbs
    received-message/
      index.hbs
      avatar.hbs
      username.hbs
    sent-message.hbs
    sent-message/
      index.hbs
      avatar.hbs
      username.hbs
```

These two file paths are equivalent, so you wouldn't need to update the usage of
the component anywhere. Components can be nested in multiple sub folders this
way, allowing you to organize them as you see fit.

## Summary

We've taken a big HTML file and broken it up into **components** to make it
easier to understand and maintain.

A component is a chunk of HTML that can be included in another component using
HTML tag syntax.
