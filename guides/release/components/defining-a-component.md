Component definitions consist of:

1. A template
2. An optional backing class definition

As we discussed before, the template is rendered wherever the component is used
in your application. If your component has a backing class, an _instance_ of
that class is created for every usage of the component:

```handlebars
<!--
  In this example, two BlogPost class instances
  are created, one for each component
-->

<BlogPost/>
<BlogPost/>
```

These class instances hold the _state_ of your component. We'll talk more about
state later on, but for now you can think of it as variables that are _internal_
to your component. This is different from _arguments_, which are variables that
are _external_ to your component, and something we'll talk about in the next
section.

### Component Folder Structure

Ember looks up components automatically based on the folder structure of your
app. It expects:

- Component templates to exist in `app/templates/components/`
- Component classes to exist in `app/components/`

Ember looks for files that are the `kebab-case` version of your component name.
So for instance, for a `<BlogPost/>` component, Ember would look for:

- `app/templates/components/blog-post.hbs`
- `app/components/blog-post.js`

#### Generating a Component

You can create these files automatically by generating a component using the
Ember CLI:

```bash
ember generate component blog-post
```

This will create a few different files:

```
installing component
  create app/components/blog-post.js
  create app/templates/components/blog-post.hbs
installing component-test
  create tests/integration/components/blog-post-test.js
```

This generates a JavaScript file:

```javascript {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class BlogPost extends Component {}
```

And a template file:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
{{yield}}
```

It also generates a test file, which you can use to test your component. This
will be covered later on in the guides.

### Component Templates

Templates in components use the Handlebars templating language, as discussed in
the [Templating](../../templating) section. A component's template is the layout
that is used when rendering the component. If we update the `HelloButton`'s
template to be:

```handlebars {data-filename=src/ui/components/hello-post/template.hbs}
<h1>Fun Facts About Tomster</h1>
<section>
  1. He's a hamster!
  2. But also a Tomster!
</section>
```

And then use the component like so:

```handlebars {data-filename=src/ui/routes/application/route.hbs}
<BlogPost/>
```

Then the rendered HTML will be:

```html
<h1>Fun Facts About Tomster</h1>
<section>
  1. He's a hamster! 2. But also a Tomster!
</section>
```

This template doesn't have anything dynamic in it yet, so the output is exactly
the same as the template. We can add dynamic values directly by using double
curly syntax:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{@title}}</h1>
<section class="{{this.sectionClass}}">
  {{@content}}
</section>
```

Here, we have two different kinds of dynamic values:

- `{{@title}}` and `{{@content}}` refer to _arguments_. These are values that
  are passed to the component where it is invoked, and are part of what makes a
  component reusable and composable. You can pass different values to a
  component's arguments each time you use it:

  ```handlebars
  <BlogPost @title="An Interview With Zoey"/>
  <BlogPost @title="Fun Facts About Tomster"/>
  ```

  We'll talk more about arguments in [the next
  section](../arguments-and-attributes). All arguments are prefixed with the `@`
  symbol, so whenever you see `{{@...` you know its referring to any argument.

- `{{this.sectionClass}}` refers to a _property_ of the component _instance_.
  Like we mentioned before, components that have class definitions also get a
  class instance every time they are created. In a component template,
  `{{this}}` always refers to that instance, and allows you to access methods,
  fields, and other properties on the class instance.

We say that these values are _bound_ to the template in those locations. It's
important to note that arguments and properties can be used interchangeably, so
we could for instance have used an argument for the `sectionClass`, and a
class property for title or post content:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{this.title}}</h1>
<section class="{{@sectionClass}}">
  {{this.content}}
</section>
```

Both arguments and properties can be used in any valid binding location (for
more details on where and how you can bind values, read through the [section on
templating](../../templating)). The reason you would choose an argument or
property is based on how you expect to use the component, and whether or not the
value should be based on internal logic within the component, or values passed
to the component where it is used.

You can also use template helpers, modifiers, and other components within your
component template:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{capitalize @title}}</h1>

<BlogSection>
  {{@content}}
</BlogSection>
```

We now have:

- The `{{capitalize}}` helper, which we're using to format the `@title`
  argument.
- The `<BlogSection>` component, replaces the `<section>` element and presumably
  has similar semantics, and some custom functionality (the implementation of
  this component is not included).

Using helpers, modifiers, and components allows you to have some logic in your
templates, and to nest components within each other, building up a component
_tree_.

Finally, component templates can use a special helper: `{{yield}}`. We'll cover
this helper in more detail in the [Yields](../yields) section later on, but this
helper allows us to specify that users can pass the component a _block_ of
children, and where those children should be placed. If we go back to our
`BlogPost` component, we can add a yield like this:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{@title}}</h1>
<section class="{{this.sectionClass}}">
  {{yield}}
</section>
```

We can then invoke this component with a block, like this:

```handlebars
<BlogPost @title="Fun Facts About Tomster">
  1. He's a hamster!
  2. But also a Tomster!
</BlogPost>
```

And this will place the block - the text that is in between `<BlogPost>` and
`</BlogPost>` - where the yield was in the original component when rendered:

```html
<h1>Fun Facts About Tomster</h1>
<section class="blog-post-section">
  1. He's a hamster! 2. But also a Tomster!
</section>
```

You can also include any valid HTML, template helpers, components, or other
statements in a component block, and these will be inserted in the yield:

```handlebars
<BlogPost @title="Fun Facts About Tomster">
  <ol>
    <li>He's a hamster!</li>
    <li>But also a Tomster!</li>
  </ol>
</BlogPost>
```

A final thing that component templates can have is `...attributes`, which can be
placed on any HTML element or component within the component's template:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{@title}}</h1>
<section ...attributes class="{{this.sectionClass}}">
  {{yield}}
</section>
```

We'll talk more about attributes in [the next
section](../arguments-and-attributes). They are values that get applied directly
to elements, and can be used to customize the HTML of a component. Unlike
arguments, they are _not_ prefixed with the `@` symbol:

```handlebars
<BlogPost @title="Fun Facts About Tomster" class="featured">
  <ol>
    <li>He's a hamster!</li>
    <li>But also a Tomster!</li>
  </ol>
</HelloButton>
```

#### Template-only components

Components can have a template _without_ a backing class definition. These types
of components are known as Template-Only components, as well as presentational
or functional components, and their major difference is that they do not have an
_instance_ or any instance state.

What this means in practice is that using properties in the template
(`{{this.myProperty}}`) will result in an error. In a template-only component
you can only use arguments (`{{@myArgument}}`).

Template-Only components are useful for components that don't need to have their
own state, such as components that focus on presentation and formatting of data.
For example, you could make a Template-Only greeting component that receives the
name of a friend and greets them:

```handlebars {data-filename=src/ui/components/greeting/template.hbs}
<p>Hello {{@friend}}</p>
```

```handlebars {data-filename=src/ui/routes/application/template.hbs}
<Greeting @friend="Toby"/>
```

### Component Classes

Component classes are defined using native JavaScript class syntax, which is
discussed in detail in the [Working With
JavaScript](../../working-with-javascript/native-classes) section of the guides.
You can define a component class like so:

```js {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class BlogPost extends Component {}
```

> You may notice that we're importing the component from `@glimmer` instead of
> `@ember`. The Glimmer VM is the underlying rendering engine in Ember, and
> Glimmer.js is a minimal component framework built on top of the Glimmer VM.
> Ember and Glimmer.js use the same component class, which allows you to share
> code between Ember and Glimmer.js apps. For more details on Glimmer.js, check
> out [its documentation](https://glimmerjs.com/)

You can add methods and fields to the component, and then access them from the
component's template. For instance, we could add the `sectionClass` property
that is referenced in the template for the `BlogPost` component from earlier:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{@title}}</h1>
<section ...attributes class="{{this.sectionClass}}">
  {{yield}}
</section>
```

```js {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class HelloButton extends Component {
  sectionClass = 'blog-post-section';
}
```

You can also use JavaScript accessors (_getters_ and \_setters) to derive values
that need to be calculated. For instance, we could provide a default title to
the blog post if one wasn't provided:

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{this.title}}</h1>
<section ...attributes class="{{this.sectionClass}}">
  {{yield}}
</section>
```

```js {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class HelloButton extends Component {
  get title() {
    return this.args.title || 'Untitled';
  }
}
```

Notice that in the component class, we access arguments via `this.args`. These
are the same values as they are in the templates, they're just accessed
differently in the class.

Methods can also be defined on the class and called from the template. These are
known as _actions_, and are decorated with the `@action` decorator.

```handlebars {data-filename=src/ui/components/blog-post/template.hbs}
<h1>{{this.title}}</h1>
<section ...attributes class="{{this.sectionClass}}">
  {{yield}}

  <button onclick={{this.likePost}} class="like-button">
    Like!
  </button>
</section>
```

```js {data-file=src/ui/components/blog-post/component.js}
import Component from '@glimmer/component';

export default class HelloButton extends Component {
  get title() {
    return this.args.title || 'Untitled';
  }

  @action
  likePost() {
    fetch('https://www.example.blog/likes', { method: 'POST' }).then(() => {
      console.log('Successfully liked!');
    });,
  }
}
```

Any method that you use in a template should be decorated with this decorator.
It'll be covered in more detail in the section on [Actions](../actions).

#### Component Hooks and Properties

Components have the following class signature (this given as a TypeScript class
signature for clarity and brevity, if you don't know TypeScript, don't worry!
We'll explain what it all means in just a minute):

```ts
declare class GlimmerComponent {
  args: object;

  isDestroying: boolean;
  isDestroyed: boolean;

  constructor(owner: unknown, args: object);
  willDestroy();
}
```

The component class has 3 properties:

- `args`: The arguments that were passed to the component
- `isDestroying`: A boolean flag that indicates that the component is in the
  process of being torn down
- `isDestroyed`: A boolean flag that indicates that the component has been
  completely torn down.

In addition to that, it has two methods:

- The `constructor` which receives a couple of arguments, the `owner` which is
  related to _dependency injection_ (something we'll cover later) and the
  `args`, the initial arguments to the component. Generally, these should just
  be passed directly to `super`, where they will be assigned, and then used
  through injections and `this.args` respectively:

  ```js
  class Tooltip extends Component {
    constructor(owner, args) {
      super(owner, args);

      if (this.args.fadeIn === true) {
        // fade in logic here
      }
    }
  }
  ```

- The `willDestroy` hook, which can be used to cleanup the component instance
  when it's being removed.

These are the only hooks and properties that exist on the component, and the
only ones you need to worry about! Now, onto Arguments and Attributes.
