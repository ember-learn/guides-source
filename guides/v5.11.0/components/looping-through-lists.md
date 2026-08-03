Oftentimes we'll need to repeat a component multiple times in a row, with
different data for each usage of the component. We can use the
[`{{#each}}`](https://api.emberjs.com/ember/5.11.0/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper to loop through lists of items like this, repeating a section of template
for each item in the list.

For instance, in a messaging app, we could have a `<Message>` component that we
repeat for each message that the users have sent to each other.

```handlebars {data-filename="app/components/messages.hbs"}
<div class="messages">
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="4:56pm"
  >
    <p>
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
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

  <NewMessageInput />
</div>
```

First, we would add a component class and extract the parts of each `<Message>`
component that are different into an array on that class. We would extract the
username, active value, local time, and the yielded content for each message.
For the yielded content, since it's plain HTML, we can extract it as a string.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '4:56pm',
      content: `
        <p>
          Hey Zoey, have you had a chance to look at the EmberConf
          brainstorming doc I sent you?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
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
      `
    }
  ];
}
```

Then, we can add an `{{each}}` helper to the template by passing
`this.messages` to it. `{{each}}` will receive each message as its first block
param, and we can use that item in the template block for the loop.

```handlebars {data-filename="app/components/messages.hbs" data-diff="+2,+3,+4,+5,+6,+7,+8,+9,+10,-11,-12,-13,-14,-15,-16,-17,-18,-19,-20,-21,-22,-23,-24,-25,-26,-27,-28,-29,-30,-31,-32,-33,-34,-35,-36,-37,-38,-39,-40,-41,-42,-43,-44,-45,-46,-47,-48,-49,-50,-51"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}
  <Message
    @username="Tomster"
    @userIsActive={{true}}
    @userLocalTime="4:56pm"
  >
    <p>
      Hey Zoey, have you had a chance to look at the EmberConf
      brainstorming doc I sent you?
    </p>
  </Message>
  <Message
    @username="Zoey"
    @userIsActive={{true}}
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

  <NewMessageInput />
</div>
```

Notice that we used triple curly brackets around `{{{message.content}}}`. This
is how Ember knows to insert the content directly as HTML, rather than directly
as a string.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
        Triple curly brackets are a convenient way to put dynamic HTML into Ember templates,
        but are not recommended for production apps.
        Inserting unknown HTML can create unexpected results and security issues.
        Be sure to sanitize the HTML before you render it.
        </p>
        <p>
        We can use the <a href="https://api.emberjs.com/ember/5.11.0/functions/@ember%2Ftemplate/htmlSafe">htmlSafe</a>
        function to mark a sanitized HTML as safe, then use double curly brackets to render the HTML.
        We can also create a <a href="../helper-functions">helper</a> that sanitizes the HTML, marks it as safe,
        and returns the output.
        </p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

### Updating Lists

Next, let's add a way for the user to send a new message. First, we need to
add an action for creating the new message. We'll add this to the
`<NewMessageInput />` component:

```handlebars {data-filename="app/components/new-message-input.hbs" data-diff="-1,+2,-3,+4"}
<form>
<form {{on "submit" this.createMessage}}>
  <input>
  <Input @value={{this.message}}>
  <button type="submit">
    Send
  </button>
</form>
```

We're using the `submit` event on the form itself here rather than adding a
`click` event handler to the button since it is about submitting the form as a
whole. We also updated the `input` tag to instead use the built in `<Input>`
component, which automatically updates the value we pass to `@value`. Next,
let's add the component class:

```javascript {data-filename="app/components/new-message-input.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class NewMessageInputComponent extends Component {
  @tracked message;

  @action
  createMessage(event) {
    event.preventDefault();

    if (this.message && this.args.onCreate) {
      this.args.onCreate(this.message);

      // reset the message input
      this.message = '';
    }
  }
}
```

This action uses the `onCreate` argument to expose a public API for defining
what happens when a message is created. This way, the `<NewMessageInput>`
component doesn't have to worry about the external details - it can focus on
getting the new message input.

Next, we'll update the parent component to use this new argument.

```handlebars {data-filename="app/components/messages.hbs" data-diff="-12,+13"}
<div class="messages">
  {{#each this.messages as |message|}}
    <Message
      @username={{message.username}}
      @userIsActive={{message.active}}
      @userLocaltime={{message.localTime}}
    >
      {{{message.content}}}
    </Message>
  {{/each}}

  <NewMessageInput />
  <NewMessageInput @onCreate={{this.addMessage}} />
</div>
```

And in the component class, we'll add the `addMessage` action. This action will
create the new message from the text that the `<NewMessageInput>` component
gives us, and push it into the messages array.

```js {data-filename="app/components/messages.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MessagesComponent extends Component {
  username = 'Zoey';

  @action
  addMessage(messageText) {
    this.messages = [...this.messages, {
      username: this.username,
      active: true,
      content: `<p>${messageText}</p>`
    }];
  }

  @tracked messages = [
    {
      username: 'Tomster',
      active: true,
      localTime: '4:56pm',
      content: `
        <p>
          Hey Zoey, have you had a chance to look at the EmberConf
          brainstorming doc I sent you?
        </p>
      `
    },
    {
      username: 'Zoey',
      active: true,
      content: `
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
      `
    }
  ];
}
```

Now, whenever we type a value and submit it in the form, a new message object
will be added to the array, and the `{{each}}` will update with the new item.

### Item Indexes

The index of each item in the array is provided as a second block param. This
can be useful at times if you need the index, for instance if you needed to
print positions in a queue

```javascript
import Component from '@glimmer/component';

export default class SomeComponent extends Component {
  queue = [
    { name: 'Yehuda' },
    { name: 'Jen' },
    { name: 'Rob' }
  ];
}
```

```handlebars
<ul>
  {{#each this.queue as |person index|}}
    <li>Hello, {{person.name}}! You're number {{index}} in line</li>
  {{/each}}
</ul>
```

### Empty Lists

The [`{{#each}}`](https://api.emberjs.com/ember/5.11.0/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper can also have a corresponding `{{else}}`. The contents of this block will
render if the array passed to `{{#each}}` is empty:

```handlebars
{{#each this.people as |person|}}
  Hello, {{person.name}}!
{{else}}
  Sorry, nobody is here.
{{/each}}
```

## Looping Through Objects

There are also times when we need to loop through the keys and values of an
object rather than an array, similar to JavaScript's `for...in` loop. We can use
the [`{{#each-in}}`](https://api.emberjs.com/ember/5.11.0/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in)
helper to do this:

```javascript {data-filename=/app/components/store-categories.js}
import Component from '@glimmer/component';

export default class StoreCategoriesComponent extends Component {
  // Set the "categories" property to a JavaScript object
  // with the category name as the key and the value a list
  // of products.
  categories = {
    'Bourbons': ['Bulleit', 'Four Roses', 'Woodford Reserve'],
    'Ryes': ['WhistlePig', 'High West']
  };
}
```

```handlebars {data-filename=/app/components/store-categories.hbs}
<ul>
  {{#each-in this.categories as |category products|}}
    <li>{{category}}
      <ol>
        {{#each products as |product|}}
          <li>{{product}}</li>
        {{/each}}
      </ol>
    </li>
  {{/each-in}}
</ul>
```

The template inside of the `{{#each-in}}` block is repeated once for each key in the passed object.
The first block parameter (`category` in the above example) is the key for this iteration,
while the second block parameter (`products`) is the actual value of that key.

The above example will print a list like this:

```html
<ul>
  <li>Bourbons
    <ol>
      <li>Bulleit</li>
      <li>Four Roses</li>
      <li>Woodford Reserve</li>
    </ol>
  </li>
  <li>Ryes
    <ol>
      <li>WhistlePig</li>
      <li>High West</li>
    </ol>
  </li>
</ul>
```

### Ordering

An object's keys will be listed in the same order as the array returned from
calling `Object.keys` on that object. If you want a different sort order, you
should use `Object.keys` to get an array, sort that array with the built-in JavaScript
tools, and use the [`{{#each}}`](https://api.emberjs.com/ember/5.11.0/classes/Ember.Templates.helpers/methods/each?anchor=each)
helper instead.

### Empty Lists

The [`{{#each-in}}`](https://api.emberjs.com/ember/5.11.0/classes/Ember.Templates.helpers/methods/each-in?anchor=each-in)
helper can have a matching `{{else}}`. The contents of this block will render if
the object is empty, null, or undefined:

```handlebars
{{#each-in this.people as |name person|}}
  Hello, {{name}}! You are {{person.age}} years old.
{{else}}
  Sorry, nobody is here.
{{/each-in}}
```

<!-- eof - needed for pages that end in a code block  -->
