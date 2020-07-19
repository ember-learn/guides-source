Component templates can leave a placeholder that users of the component can fill
with their own HTML.

To make that more concrete, let's take a look at two similar components
representing different user's messages.

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

Instead of having two different components, one for sent messages and one for
received messages, we could instead try to create a single message component.
Inside of this message component, we could substitute the avatar and username
with generic components, too.

Their structure is pretty straightforward and similar, so we can use arguments
and conditionals to handle the differences in content between them (see the
previous chapters for details on how to do this).

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  ...
</section>
```

This works pretty well, but the message content is very different. It's also
pretty long, so it wouldn't really be easy to pass the message content through
as an argument. What we really want is to leave a placeholder for any content
supplied by the `<Message>` tag.

The way to do this in Ember is by using the `{{yield}}` syntax.

```handlebars {data-filename="app/components/message.hbs"}
<Message::Avatar
  @title={{@avatarTitle}}
  @initial={{@avatarInitial}}
  @isActive={{@userIsActive}}
  class="{{if @isCurrentUser "current-user"}}"
/>
<section>
  <Message::Username
    @name={{@username}}
    @localTime={{@userLocalTime}}
  />

  {{yield}}
</section>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <code>{{yield}}</code> is named after a similar concept in scripting languages,
        including Ruby, JavaScript and Python. You don't need to understand the connection
        in order to use it, but if you're in the mood for a tangent, check out
        <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield">
          the yield operator in JavaScript
        </a>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

You can think of using `{{yield}}` as leaving a placeholder for the content of the
`<Message>` tag.

```handlebars {data-filename="app/components/received-message.hbs"}
<Message
  @username="Tomster"
  @userIsActive={{true}}
  @userLocalTime="4:56pm"

  @avatarTitle="Tomster's avatar"
  @avatarInitial="T"
>
  <p>
    Hey Zoey, have you had a chance to look at the EmberConf
    brainstorming doc I sent you?
  </p>
</Message>
```

```handlebars {app/components/sent-message.hbs}
<Message
  @username="Zoey"
  @isCurrentUser={{true}}

  @avatarTitle="Zoey's avatar"
  @avatarInitial="Z"
>
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
</Message>
```

As shown here, we can pass different content into the tag. The content
of the tag is also referred to as _the block_. The `{{yield}}` syntax
yields to the block once the block is passed into the component.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        You can think of the <code>Message</code> component like a function,
        and the block as a <a href="https://developer.mozilla.org/en-US/docs/Glossary/Callback_function"><em>callback</em></a>
        that you're passing to the component. From this perspective, the <code>{{yield}}</code> syntax
        calls the callback.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Conditional Blocks

Sometimes, we may want to provide some default content if the user of a component
hasn't provided a block. For instance, consider an error message dialog that has
a default message in cases where we don't know what error occurred. We could show
the default message using the `(has-block)` syntax in an `ErrorDialog` component.

```handlebars {data-filename=app/templates/components/error-dialog.hbs}
<dialog>
  {{#if (has-block)}}
    {{yield}}
  {{else}}
    An unknown error occured!
  {{/if}}
</dialog>
```

Now, if we use our `ErrorDialog` component without a block, we'll get the
default message.

```handlebars
<ErrorDialog/>
```
```html
<!-- rendered -->
<dialog>
  An unknown error occured!
</dialog>
```

If we had a more detailed message, though, we could use the block to pass it to
the dialog.

```handlebars
<ErrorDialog>
  <Icon type="no-internet" />
  <p>You are not connected to the internet!</p>
</ErrorDialog>
```

## Block Parameters

Blocks can also pass values back into the template, similar to a callback
function in JavaScript. Consider for instance a simple `BlogPost` component.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h1>

{{@post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} />
```

We may want to give the user the ability to put extra content before or after
the post, such as an image or a profile. Since we don't know what the
user wants to do with the body of the post, we can instead pass the body back
to them.

```handlebars {data-filename=app/components/blog-post.hbs}
<h1>{{@post.title}}</h1>
<h2>{{@post.author}}</h1>

{{yield @post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |body|>
  <img src="./blog-logo.png">

  {{body}}

  <AuthorBio @author={{@blogPost.author}} />
</BlogPost>
```

We can yield back multiple values as well, separated by spaces.

```handlebars {data-filename=app/components/blog-post.hbs}
{{yield @post.title @post.author @post.body }}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |title author body|>
  <img src="./blog-logo.png">
  {{title}}

  {{body}}

  <AuthorBio @author={{author}} />
</BlogPost>
```

<!-- eof - needed for pages that end in a code block  -->
