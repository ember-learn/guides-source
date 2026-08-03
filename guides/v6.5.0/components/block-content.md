Component templates can leave one or more placeholders that users can fill with their own HTML.
These are called blocks.
Here's an example that provides a component with the implicit default block.

```handlebars
<ExampleComponent>
  This is the default <b>block content</b> that will
  replace `{{yield}}` (or `{{yield to="default"}}`)
  in the `ExampleComponent` template.
</ExampleComponent>
```

This is equivalent to explicitly naming the default block using the named block syntax.

```handlebars
<ExampleComponent>
  <:default>
    This is the default <b>block content</b> that will
    replace `{{yield}}` (or `{{yield to="default"}}`)
    in the `ExampleComponent` template.
  </:default>
</ExampleComponent>
```

Through Block Content, users of the component can add additional styling and
behavior by using HTML, modifiers, and other components within the block.

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

```handlebars {data-filename="app/components/sent-message.hbs"}
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

```handlebars {data-filename=app/components/error-dialog.hbs}
<dialog>
  {{#if (has-block)}}
    {{yield}}
  {{else}}
    An unknown error occurred!
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
  An unknown error occurred!
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
<h2>{{@post.author}}</h2>

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
<h2>{{@post.author}}</h2>

{{yield @post.body}}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postBody}}

  <AuthorBio @author={{@blogPost.author}} />
</BlogPost>
```

We can yield back multiple values as well, separated by spaces.

```handlebars {data-filename=app/components/blog-post.hbs}
{{yield @post.title @post.author @post.body }}
```

```handlebars
<!-- usage -->
<BlogPost @post={{@blogPost}} as |postTitle postAuthor postBody|>
  <img alt="" role="presentation" src="./blog-logo.png">

  {{postTitle}}

  {{postBody}}

  <AuthorBio @author={{postAuthor}} />
</BlogPost>
```

## Named Blocks

If you want to yield content to different spots in the same component, you can use named blocks. You just need to specify a name for the yielded block, like this:

```handlebars
{{yield to="somePlace"}}
```

You could also want to pass some values. This is the same process as the default `yield`, but you just have to pass `to` as the last argument. An example would be the popover:

```handlebars {data-filename=app/components/popover.hbs}
<div class="popover">
  <div class="popover__trigger">
    {{yield this.isOpen to="trigger"}}
  </div>
  {{#if this.isOpen}}
    <div class="popover__content">
      {{yield to="content"}}
    </div>
  {{/if}}
</div>
```

Without named blocks, we would certainly have to pass components as `args` to the popover. But this is much more practical!

Here’s how we would call our named blocks as a consumer:

```handlebars
<Popover>
  <:trigger as |open|>
    <button type="button">Click to {{if open "close" "open"}}  the popover!</button>
  </:trigger>
  <:content>
     This is what is shown when I'm opened!
  </:content>
</Popover>
```

We know the state of the popover because we passed it as an argument to the `yield`. To access its value, use the block parameters at the named block scope. It will not be accessible at the `Popover` level, so if you want the value to be available for all the blocks, you will have to pass it for each of them.

Rendering the previous code example would give this as result:

```html
<!-- rendered -->
<div class="popover">
  <div class="popover__trigger">
    <button type="button">Click to close the popover!</button>
  </div>
  <div class="popover__content">
    This is what is showed when I'm opened!
  </div>
</div>
```

Don't worry, you can also still use `yield` by itself, and mix it with named blocks. Let’s take a card example:

```handlebars {data-filename=app/components/card.hbs}
<div class="card">
  {{#if (has-block "title")}}
    <div class="card__title">
      {{yield to="title"}}
    </div>
  {{/if}}
  <div class="card__content">
    {{yield}}
  </div>
</div>
```

A yielded block without a name is called `default`. So to access it, it’s like any other named blocks.

```handlebars
<Card>
  <:title>
    <h3>It's nice to have me. Sometimes</h3>
  </:title>
  <:default>
    The card content will appear here!
  </:default>
</Card>
```

The title being optional when you create a card, you can use the `(has-block)` helper with the named block by adding its name as a first parameter. That means you could also create this card:

```handlebars
<Card>
  I don't want any title, and I only have a default content!
</Card>
```

As you are not using named blocks, you can simply yield the content you would like to add, which becomes the default yield block.



<!-- eof - needed for pages that end in a code block  -->
