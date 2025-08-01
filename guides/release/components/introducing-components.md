You _could_ put all of your application HTML into a single file, but in practice, you'll probably want to break it apart into smaller files.

In Ember, those smaller pieces are called _components_.

Let's start with the sample HTML for a messaging app (that we introduced in the previous chapter, if you're reading the guides in order):

```gjs {data-filename="app/templates/application.gjs"}
<template>
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
        Hey Zoey, have you had a chance to look at the EmberConf brainstorming
        doc I sent you?
      </p>
    </section>

    <aside class="current-user">
      <div class="avatar" title="Zoey's avatar">Z</div>
    </aside>
    <section>
      <h4 class="username">Zoey</h4>

      <p>Hey!</p>

      <p>
        I love the ideas! I'm really excited about where this year's EmberConf
        is going, I'm sure it's going to be the best one yet. Some quick notes:
      </p>

      <ul>
        <li>
          Definitely agree that we should double the coffee budget this year (it
          really is impressive how much we go through!)
        </li>
        <li>
          A blimp would definitely make the venue very easy to find, but I think
          it might be a bit out of our budget. Maybe we could rent some
          spotlights instead?
        </li>
        <li>
          We absolutely will need more hamster wheels, last year's line was
          <em>way</em> too long. Will get on that now before rental season hits
          its peak.
        </li>
      </ul>

      <p>Let me know when you've nailed down the dates!</p>
    </section>

    <form>
      <label for="message">Message</label>
      <input id="message" />
      <button type="submit">
        Send
      </button>
    </form>
  </div>
</template>
```

## Breaking it into pieces

Let's take the large template and break it up into smaller pieces. We can see that there are 3 distinct parts:

- The received message (Tomster's message).
- The sent message (Zoey's message).
- The "new message" input.

We'll break apart the larger HTML file into files containing each of these parts.

### The Received Message

First, let's copy Tomster's message into its own component. Components that are not Route components go in the `app/components` directory. Again, we will use a `.gjs` file for this.

```gjs {data-filename="app/components/received-message.gjs"}
<template>
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
</template>
```

We've just created our first component!

We can include our new component into our application by importing the component at the top of our  Application route component (`application.gjs`) and invoking it in the template.

```gjs {data-filename="app/templates/application.gjs" data-diff="+1,+2,-5,-6,-7,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,+19"}
import ReceivedMessage from 'my-app/components/received-message';

<template>
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
        Hey Zoey, have you had a chance to look at the EmberConf brainstorming
        doc I sent you?
      </p>
    </section>
    <ReceivedMessage />

    <aside class="current-user">
      <div class="avatar" title="Zoey's avatar">Z</div>
    </aside>
    <section>
      <h4 class="username">Zoey</h4>

      <p>Hey!</p>

      <p>
        I love the ideas! I'm really excited about where this year's EmberConf
        is going, I'm sure it's going to be the best one yet. Some quick notes:
      </p>

      <ul>
        <li>
          Definitely agree that we should double the coffee budget this year (it
          really is impressive how much we go through!)
        </li>
        <li>
          A blimp would definitely make the venue very easy to find, but I think
          it might be a bit out of our budget. Maybe we could rent some
          spotlights instead?
        </li>
        <li>
          We absolutely will need more hamster wheels, last year's line was
          <em>way</em> too long. Will get on that now before rental season hits
          its peak.
        </li>
      </ul>

      <p>Let me know when you've nailed down the dates!</p>
    </section>

    <form>
      <label for="message">Message</label>
      <input id="message" />
      <button type="submit">
        Send
      </button>
    </form>
  </div>
</template>
```

A _component_ is kind of like your own custom HTML tag. When we imported the component we gave it the name `ReceivedMessage`. In general, you should always give your components names that start with a capital letter. Built-in HTML tags start with lowercase letters (`<div>`, `<p>`, `<table>`).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
      <p>
        Importing a component like this is sometimes called "strict mode" because nearly everything that is not HTML must be imported into a <code>.gjs</code> file before it can be used.
        </p>
        <p>
        It's also important to know that <code>my-app</code> in your import path is the same as the <code>"name"</code> field in your package.json file.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### The Sent Message

Let's do it again. We'll copy the sent message content into a new component, and then include it in our application route component.

```gjs {data-filename="app/components/sent-message.gjs"}
<template>
  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
  <section>
    <h4 class="username">Zoey</h4>

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf
      is going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think
        it might be a bit out of our budget. Maybe we could rent some
        spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits
        its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>
</template>
```

```gjs {data-filename="app/templates/application.gjs" data-diff="+2,-8,-9,-10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,-37,-38,-39,+40"}
import ReceivedMessage from 'my-app/components/received-message';
import SentMessage from 'my-app/components/sent-message';

<template>
  <div class="messages">
    <ReceivedMessage />

    <aside class="current-user">
      <div class="avatar" title="Zoey's avatar">Z</div>
    </aside>
    <section>
      <h4 class="username">Zoey</h4>

      <p>Hey!</p>

      <p>
        I love the ideas! I'm really excited about where this year's EmberConf
        is going, I'm sure it's going to be the best one yet. Some quick notes:
      </p>

      <ul>
        <li>
          Definitely agree that we should double the coffee budget this year (it
          really is impressive how much we go through!)
        </li>
        <li>
          A blimp would definitely make the venue very easy to find, but I think
          it might be a bit out of our budget. Maybe we could rent some
          spotlights instead?
        </li>
        <li>
          We absolutely will need more hamster wheels, last year's line was
          <em>way</em> too long. Will get on that now before rental season hits
          its peak.
        </li>
      </ul>

      <p>Let me know when you've nailed down the dates!</p>
    </section>
    <SentMessage />

    <form>
      <label for="message">Message</label>
      <input id="message" />
      <button type="submit">
        Send
      </button>
    </form>
  </div>
</template>
```

### The New Message Input

We have one last component to extract. Let's pull out the new message input.

```gjs {data-filename="app/components/new-message-input.gjs"}
<template>
  <form>
    <label for="message">Message</label>
    <input id="message" />
    <button type="submit">
      Send
    </button>
  </form>
</template>
```

And include it in our `application.gjs` file.

```gjs {data-filename="app/templates/application.gjs" data-diff="+3,-11,-12,-13,-14,-15,-16,-17,+18"}
import ReceivedMessage from 'my-app/components/received-message';
import SentMessage from 'my-app/components/sent-message';
import NewMessageInput from 'my-app/components/new-message-input';

<template>
  <div class="messages">
    <ReceivedMessage />

    <SentMessage />

    <form>
      <label for="message">Message</label>
      <input id="message" />
      <button type="submit">
        Send
      </button>
    </form>
    <NewMessageInput />
  </div>
</template>
```

## Breaking Components Down Further

We can use components _within_ other components, so we can continue to break down our template into smaller pieces if we want. For instance, Tomster's avatar could be made into its own component that is then used within the `<ReceivedMessage>`.

```gjs {data-filename="app/components/received-message-avatar.gjs"}
<template>
  <aside>
    <div class="avatar is-active" title="Tomster's avatar">T</div>
  </aside>
</template>
```

```gjs {data-filename="app/components/received-message.gjs" data-diff="+1,+2,-4,-5,-6,+7"}
import ReceivedMessageAvatar from 'my-app/components/received-message-avatar';

<template>
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
</template>
```

We could also extract the username from the message:

```gjs {data-filename="app/components/received-message-username.gjs"}
<template>
  <h4 class="username">
    Tomster
    <span class="local-time">their local time is 4:56pm</span>
  </h4>
</template>
```

```gjs {data-filename="app/components/received-message.gjs" data-diff="+2,-7,-8,-9,-10,+11"}
import ReceivedMessageAvatar from 'my-app/components/received-message-avatar';
import ReceivedMessageUsername from 'my-app/components/received-message-username';

<template>
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
</template>
```

We can do the same for the `<SentMessage>` component:

```gjs {data-filename="app/components/sent-message-avatar.gjs"}
<template>
  <aside class="current-user">
    <div class="avatar" title="Zoey's avatar">Z</div>
  </aside>
</template>
```

```gjs {data-filename="app/components/sent-message-username.gjs"}
<template>
  <h4 class="username">Zoey</h4>
</template>
```

```gjs {data-filename="app/components/sent-message.gjs"}
import SentMessageAvatar from 'my-app/components/sent-message-avatar';
import SentMessageUsername from 'my-app/components/sent-message-username';

<template>
  <SentMessageAvatar />
  <section>
    <SentMessageUsername />

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf
      is going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think
        it might be a bit out of our budget. Maybe we could rent some
        spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits
        its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>
</template>
```

Components can be broken down to any level, included in each other and reused.

## Nesting Components in Folders

The avatar and username components are directly related to the sent and received message components. Right now, they're grouped at the top level. As you get more components, this could make a big mess! Instead, we want to group the related components together in the filesystem. We can do this by moving them into subfolders within app/components.

```hbs {data-filename="" data-diff="-4,-5,+6,+7,+8,-9,-10,-11,+12,+13,+14"}
app/
  components/
    received-message.gjs
    received-message-avatar.gjs
    received-message-username.gjs
    received-message/
      avatar.gjs
      username.gjs
    sent-message.gjs
    sent-message-avatar.gjs
    sent-message-username.gjs
    sent-message/
      avatar.gjs
      username.gjs
```
Then, only the import path needs to be changed to the new location.

```gjs {data-filename="app/components/received-message.gjs" data-diff="-1,+2,-3,+4"}
import ReceivedMessageAvatar from 'my-app/components/received-message-avatar';
import ReceivedMessageAvatar from 'my-app/components/received-message/avatar';
import ReceivedMessageUsername from 'my-app/components/received-message-username';
import ReceivedMessageUsername from 'my-app/components/received-message/username';

<template>
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
</template>
```

```gjs {data-filename="app/components/sent-message.gjs" data-diff="-1,+2,-3,+4"}
import SentMessageAvatar from 'my-app/components/sent-message-avatar';
import SentMessageAvatar from 'my-app/components/sent-message/avatar';
import SentMessageUsername from 'my-app/components/sent-message-username';
import SentMessageUsername from 'my-app/components/sent-message/username';

<template>
  <SentMessageAvatar />
  <section>
    <SentMessageUsername />

    <p>Hey!</p>

    <p>
      I love the ideas! I'm really excited about where this year's EmberConf
      is going, I'm sure it's going to be the best one yet. Some quick notes:
    </p>

    <ul>
      <li>
        Definitely agree that we should double the coffee budget this year (it
        really is impressive how much we go through!)
      </li>
      <li>
        A blimp would definitely make the venue very easy to find, but I think
        it might be a bit out of our budget. Maybe we could rent some
        spotlights instead?
      </li>
      <li>
        We absolutely will need more hamster wheels, last year's line was
        <em>way</em> too long. Will get on that now before rental season hits
        its peak.
      </li>
    </ul>

    <p>Let me know when you've nailed down the dates!</p>
  </section>
</template>
```

Components can be nested in multiple sub folders this way, allowing you to organize them as you see fit.

## Summary

We've taken a big HTML file and broken it up into _components_ to make the content easier to understand and maintain.

A _component_ is a chunk of HTML that can be included in another component using HTML tag syntax.
