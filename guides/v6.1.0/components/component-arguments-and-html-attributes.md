Components become useful building blocks of our app if we make them _reusable_. When we reuse components efficiently, we can avoid having to recreate parts of our app again and again. If you want to _reuse_ a component in multiple places, you'll need a way to template out parts of it.

Let's start with two similar but not identical avatar components, that represent
different users:

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<aside>
  <div class="avatar" title="Tomster's avatar">T</div>
</aside>
```

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<aside class="current-user">
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

The _structure_ of these components is identical, but they have somewhat
different content (the user's first initial) and attributes (the `title` and `class`
attributes).

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-message">
        You may notice that the <code>is-active</code> class on the
        received message avatar from the previous chapters is missing here.
        We'll cover that in the next chapter on
        <a href="../conditional-content">Conditional Content</a>.
      </div>
    </div>
  </div>
</div>

## Arguments

We can create a component that can be used in both situations by _templating_
the parts of the HTML that are different.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

The syntax `{{@initial}}` means that the contents inside the `<div>` tag are
_dynamic_ and will be specified by the `<Avatar>` tag. Likewise, the
`{{@title}}` syntax means that the contents of the `title` attribute are dynamic
and will be specified in the same way. We can now replace the received message
avatar by using the `<Avatar>` tag and providing it with some arguments.

```handlebars {data-filename="app/components/received-message/avatar.hbs"}
<Avatar @title="Tomster's avatar" @initial="T" />
```

This code includes the `<Avatar>` component, which expects two _arguments_:
`@title` and `@initial`.

You are probably familiar with HTML attributes, which tell the _browser_ how to
draw an HTML element. The syntax `@title=` is similar, but instead of telling
the _browser_ what to do, it's telling your custom tag what to do.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might be wondering why Ember uses the `@` syntax for its
          components instead of normal HTML attribute syntax. We'll learn why
          in the next section.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## HTML Attributes

Let's try to use our `<Avatar>` component for the sent message avatar.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar @title="Zoey's avatar" @initial="Z" />
```

We're really, really close.

```handlebars {data-filename="output" data-diff="-1,+2"}
<aside class="current-user">
<aside>
  <div class="avatar" title="Zoey's avatar">Z</div>
</aside>
```

We're just missing the `current-user` class on the HTML `<aside>` element. To
make that work, we'll specify the HTML attribute `class` on the `<Avatar>` tag.

```handlebars {data-filename="app/components/sent-message/avatar.hbs"}
<Avatar
  @title="Zoey's avatar"
  @initial="Z"
  class="current-user"
/>
```

The avatar component also needs to specify where to put attributes that were
specified on the tag.

```handlebars {data-filename="app/components/avatar.hbs"}
<aside ...attributes>
  <div class="avatar" title={{@title}}>{{@initial}}</div>
</aside>
```

The `...attributes` syntax determines where the attributes from a tag should
appear in the component's template. Any number of attributes can be specified on
the avatar component now, and they will all end up on the element that has
`...attributes`.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          In general, you should place <code>...attributes</code> after any attributes you
          specify to give people using your component an opportunity to override your attribute.
          If <code>...attributes</code> appears <em>after</em> an attribute,
          it overrides that attribute. If it appears <em>before</em> an attribute, it
          does not.</p>
        <p>
          Place <code>...attributes</code>
          <strong>before</strong> your attributes only if you want to disallow tags from
          overriding your attributes. This is likely to be unusual.
        </p>
        <p>
          In addition, the <code>class</code> attribute is special, and will be
          <em>merged</em> with any existing classes on the element rather than
          overwriting them. This allows you to progressively add CSS classes to
          your components, and makes them more flexible overall.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
