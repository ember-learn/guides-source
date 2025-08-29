This guide assumes that you have read the [component guides](../../components/)
and are familiar with how Ember components work. We'll cover components in more
depth in this section. At the end, we'll present recommended component patterns.

## Argument Defaults

At some point, you may want to add default values to your arguments if one
wasn't passed to your component. Arguments are not mutable, so if you attempt to
reassign a value on `this.args`, it'll fail. Instead, you should define a getter
on your component that provides the default value if the argument was not
provided.

For instance, if you wanted to create a tooltip icon that had a standard icon
and class, you could do it like so:

```gjs {data-filename=app/components/tooltip.gjs}
import Component from '@glimmer/component';

export default class TooltipComponent extends Component {
  get icon() {
    return this.args.icon ?? 'icon-info';
  }

  get tooltipClass() {
    return this.args.tooltipClass + ' tooltip';
  }

  <template>
    <div class={{this.tooltipClass}}>
      <i class={{this.icon}}></i>
      {{@content}}
    </div>
  </template>
}
```

Now when called like so:

```gjs
import Tooltip from 'my-app/components/tooltip';

<template>
  <Tooltip @content="I'm a tooltip!"/>
</template>
```

The result will be:

```html
<div class="tooltip">
  <i class="icon-info"></i>
  I'm a tooltip!
</div>
```

Note that because arguments are prefixed with `@` in templates, and placed on
`args` in the component definition, we can use the same name for our `icon` and
`tooltipClass` getters, which is pretty convenient. We can also tell clearly
when we look at the template for the tooltip that `this.tooltipClass` and
`this.icon` are values that come from the class definition, and that means they
probably have been used in some kind of dynamic code (in this case, our
defaulting logic).

## Attributes

### Attribute Ordering

The positioning of `...attributes` matters, with respect to the other attributes
in the element it is applied to. Attributes that come _before_ `...attributes`
can be overridden, but attributes that come _after_ cannot:

```gjs
<template>
  <p
    data-overridable="you can override me"
    ...attributes
    data-non-overridable="but you can't override me!"
  >
    ...
  </p>
</template>
```

There is one exception to this, which is the `class` attribute. `class` will get
merged, since its more often the case that users of the component want to _add_
a class than completely override the existing ones. For `class`, the order of
`...attributes` will determine the order of merging. Putting it before:

```gjs
<template>
  <p ...attributes class="friend-greeting">
    Hello {{@friend}}, I'm {{this.name}}!
  </p>
</template>
```

Results in:

```html
<p class="red-alert friend-greeting">
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

And putting it after:

```gjs
<template>
  <p class="friend-greeting" ...attributes>
    Hello {{@friend}}, I'm {{this.name}}!
  </p>
</template>
```

Results in:

```html
<p class="friend-greeting red-alert">
  Hello {{@friend}}, I'm {{this.name}}!
</p>
```

### `aria` Attributes

There are some `aria` attributes that can have multiple values **and** the order of those values matter.
The most frequently used of these is `aria-describedby` and `aria-labelledby`.

In these cases, make sure to declare _all_ of the relevant values in the correct order.

```gjs
import MyInput from 'my-app/components/my-input';

<template>
  <MyInput @input-label="Password" aria-describedby="text-help-0 text-help-1" />
</template>
```

To learn more about `aria` roles and accessibility in Ember, check out the [Accessibility Guide](../../reference/accessibility-guide/).

## Conditional Component Rendering

Sometimes you want to defer the selection of a component to runtime. Suppose you have a blog post model that contains a string `postType` indicating that the post is either a "root" or a "reply".
Below is an example of choosing different components for
displaying different kinds of posts.  First, define your two components:


```gjs {data-filename=app/components/root-post.gjs}
<template>
  <h3>Hello from root!</h3>
  <p>{{@post.body}}</p>
</template>
```

```gjs {data-filename=app/components/reply-post.gjs}
<template>
  <h3>Hello from reply!</h3>
  <div>{{@post.author}}</div>
</template>
```

Then, you can choose which to render based on the string data. We can pass the `@post` into our `ShowPostComponent` and it can render the correct type for us: 

```gjs {data-filename=app/components/show-post.gjs}
import Component from '@glimmer/component';

import RootPost from  'my-app/components/root-post';
import ReplyPost from 'my-app/components/reply-post';


export default class ShowPostComponent extends Component {
  // returns either RootPost or ReplyPost (default: RootPost)
  get postComponent(postType) {
    return this.args.post?.postType === 'reply' ? ReplyPost : RootPost;
  }

  <template>
    <this.postComponent @author={{@post.author}} @body={{@post.body}} />
  </template>
}
```

This is great when `RootPost` and `ReplyPost` take the same arguments, like `author` and `body` in the above example. But what if the components accept different arguments? One way would be to move the selection conditional into the template, like so:

```gjs {data-filename=app/components/show-post.gjs}
import RootPost from 'my-app/components/root-post';
import ReplyPost from 'my-app/components/reply-post';

const eq = (a, b) => a === b;

<template>
  {{!-- Post is either RootPost or ReplyPost --}}
  {{#if (eq @post.postType "reply")}}
    <ReplyPost
      @author={{post.author}}
      @body={{post.body}}
      @replyTo={{post}}
    />
  {{else}}
    <RootPost
      @author={{post.author}}
      @body={{post.body}}
      @category={{post.topic}}
    />
  {{/if}}
</template>
```

## Contextual Components

The built-in [`{{component}}`](https://api.emberjs.com/ember/release/classes/Ember.Templates.helpers/methods/component?anchor=component)
helper allows us to partially apply some component arguments.

The first parameter of the helper is a component to render. So `{{component BlogPost}}` is the same as using `<BlogPost />`.  Any named arguments are passed as arguments to the component, so `{{component BlogPost author="Sam"}}` is the same as `<BlogPost @author="sam" />`.

The `component` helper is often used when yielding components to blocks. For example the layout for a SuperForm component might be implemented as:

```gjs {data-filename=app/components/super-form.gjs}
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import SuperInput from 'my-app/components/super-input';
import SuperTextarea from 'my-app/components/super-textarea';
import SuperSubmit from 'my-app/components/super-submit';

export default class SuperFormComponent extends Component {
  get data() {
    return this.args.post;
  }

  <template>
    <form>
      {{yield (hash
        Input=(component SuperInput form=this model=this.data)
        Textarea=(component SuperTextarea form=this model=this.data)
        Submit=(component SuperSubmit form=this model=this.data)
      )}}
    </form>
  </template>
}
```

And be used as:

```gjs {data-filename=app/templates/index.gjs}
import SuperForm from 'my-app/components/super-form';

<template>
  <SuperForm @post={{@model}} as |f|>
    <f.Input @name="title" />
    <f.Textarea @name="body" />
    <f.Submit />
  </SuperForm>
</template>
```

The `{{component}}` helper is a powerful tool for improving code modularity.

### Contextual helpers & modifiers

We can even use helpers and modifiers in the same way. Let's extend the SuperForm component:

```gjs {data-filename=app/components/super-form.gjs}
import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import SuperInput from 'my-app/components/super-input';
import SuperTextarea from 'my-app/components/super-textarea';
import SuperSubmit from 'my-app/components/super-submit';
import superIsValid from 'my-app/helpers/super-is-valid';
import superErrorFor from 'my-app/helpers/super-error-for';
import superAutoResize from 'my-app/modifiers/super-auto-resize';

export default class SuperFormComponent extends Component {
  get data() {
    return this.args.post;
  }

  <template>
    <form>
      {{yield (hash
        Input=(component SuperInput form=this model=this.data)
        Textarea=(component SuperTextarea form=this model=this.data)
        Submit=(component SuperSubmit form=this model=this.data)

        is-valid=(helper superIsValid form=this model=this.data)
        error-for=(helper superErrorFor form=this model=this.data)

        auto-resize=(modifier superAutoResize)
      )}}
    </form>
  </template>
}
```

And be used as:

```gjs {data-filename=app/templates/index.gjs}
import SuperForm from 'my-app/components/super-form';

<template>
  <SuperForm @model={{this.post}} as |f|>

    {{! Invoke a contextual component }}
    <f.Input @name="title" />

    {{! Invoke contextual helpers }}
    {{#unless (f.is-valid "title")}}
      <div class="error">This field {{f.error-for "title"}}</div>
    {{/unless}}

    {{! Invoke a contextual modifier on a contextual component invocation }}
    <f.Textarea @name="body" {{f.auto-resize maxHeight="500"}} />

    <f.Submit />
  </SuperForm>
</template>
```

These APIs open the doors for the creation of new, more powerful UI abstractions.
