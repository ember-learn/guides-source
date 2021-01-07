While you can accomplish a lot in Ember using HTML templating, you'll need
JavaScript to make your application interactive.

Let's start with a small example, a counter component. When the user presses
the `+1` button, the count will increase by 1. When the user presses the `-1`
button, the count will decrease by 1.

First, let's start with the HTML.

```handlebars {data-filename="app/components/counter.hbs"}
<p>0</p>

<button type="button">+1</button>
<button type="button">-1</button>
```

## Tracked Properties

To make this work, we will need to stop hard coding the number, and we will need
to wire up the buttons.

```js {data-filename="app/components/counter.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CounterComponent extends Component {
  @tracked count = 0;
}
```

There are a few things going on here, but the most important part is
`@tracked count = 0`. This line creates a dynamic value called `count`, which
you can stick inside of the template instead of hard coding it.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-1,+2"}
<p>0</p>
<p>{{this.count}}</p>

<button type="button">+1</button>
<button type="button">-1</button>
```

When we use `{{this.count}}` in the component template, we're referring to a
property that we defined in the JavaScript class.

The output looks the same as before, but now the `0` comes from JavaScript, and
after some more work, we can change its value with the buttons.

## HTML Modifiers and Actions

Next, we want to wire up the buttons. When the user presses `+1`, we want
`this.count` to go up by 1. When the user presses `-1`, we want it to go down
by 1.

To attach an event handler to an HTML tag, we use the `on` HTML modifier. HTML
modifiers are an Ember syntax that allow us to attach logic to a tag.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type="button">+1</button>
<button type="button" {{on "click" this.increment}}>+1</button>
<button type="button">-1</button>
<button type="button" {{on "click" this.decrement}}>-1</button>
```

To make those event handlers do something, we will need to define _actions_ in
the component JavaScript. An action is a JavaScript method that can be used from
a template.

```js {data-filename="app/components/counter.js" data-diff="+3,+8,+9,+10,+11,+13,+14,+15,+16"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count = this.count + 1;
  }

  @action
  decrement() {
    this.count = this.count - 1;
  }
}
```

Now, when the `+1` and `-1` buttons get clicked, the number displayed will
change.

## Passing Arguments to Actions

Our counter has two different actions, `increment` and `decrement`. But both
actions are mostly doing the same thing. The only difference is that `increment`
changes the count by `+1`, while `decrement` changes it by `-1`.

First, let's turn our `increment` and `decrement` methods into a single `change`
method that takes the amount as a parameter.

```js {data-filename="app/components/counter.js" data-diff="+8,+9,+10,+11,-12,-13,-14,-15,-17,-18,-19,-20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  @action
  change(amount) {
    this.count = this.count + amount;
  }
  @action
  increment() {
    this.count = this.count + 1;
  }

  @action
  decrement() {
    this.count = this.count - 1;
  }
}
```

Next, we'll update the template to turn the click handler into a function that
passes an amount (for example, 1 and -1) in as an argument, using the `fn`
helper.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button type="button" {{on "click" this.increment}}>+1</button>
<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" this.decrement}}>-1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        An event handler takes a function as its second argument. When there are
        no arguments to the function, you can pass it directly, just like in
        JavaScript. Otherwise, you can build a function inline by using the
        <code>fn</code> syntax.
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Computed Values

Let's say we want to add a button to our counter that allows us to double the
current count. Every time we press the button, the current count doubles.

Based on what we've already learned, we'll need:

- A `multiple`, a piece of state that represents the number to multiply the
  `count` by
- An action to double the `multiple`
- A button in the template that calls the action

But we'll also need a way to multiply the `count` by the `multiple` and show it
in the template.

Let's start with what we know already. We'll add the `multiple` tracked property
and an action called `double` that doubles the `multiple`.

```js {data-filename="app/components/counter.js" data-diff="+7,+9,+10,+11,+12"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  @action
  double() {
    this.multiple = this.multiple * 2;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

Then, we'll update the template to call the `double` action. We'll also add
`this.multiple` to our output to help us confirm that our button is working.

```handlebars {data-filename="app/components/counter.hbs" data-diff="+2,+7"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

To get the multiplied number into the template, we'll use a
[JavaScript getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

```js {data-filename="app/components/counter.js" data-diff="+9,+10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  get total() {
    return this.count * this.multiple;
  }

  @action
  double() {
    this.multiple = this.multiple * 2;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

**The getter does not need any special annotations.** As long as you've marked
the properties that can change with `@tracked`, you can use JavaScript to
compute new values from those properties.

We can now update the template to use the `total` property:

```handlebars {data-filename="app/components/counter.hbs" data-diff="+3"}
<p>{{this.count}}</p>
<p>× {{this.multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

And we're all done! If we try to click the plus, minus, or double buttons in any
order, we can watch as these three outputs stay up-to-date perfectly.

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        <p>
          You might have been tempted to make <code>total</code> a <code>@tracked</code> property and update it in
          the <code>double</code> and <code>change</code> actions. But this kind of "push-based" approach creates a
          lot of bugs. What happens if you create a new way to update <code>multiple</code> or <code>amount</code>
          properties and forget to update <code>total</code> at the same time?
        </p>
        <p>
          When you use getters and functions to <em>derive</em> the state you need, you're taking advantage of
          the benefits of <strong>declarative</strong> programming. In declarative programming, you describe
          <em>what</em> you need, not <em>how</em> to get it, which reduces the number of places where you can
          make mistakes.
        </p>
        <p>Making a <code>total</code> getter that computed the total from the <code>amount</code> and
        <code>multiple</code> properties was more <strong>declarative</strong> than setting <code>total</code>
        in all of the places that could have affected it. If you had changed <code>total</code> directly, you
        would have taken the <em>"imperative" approach</em>).</p>
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>

## Combining Arguments and State

Instead of allowing the component itself to be responsible for the multiple,
let's allow it to be passed in.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} />

<button type="button" {{on "click" this.double}}>Double It</button>
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1;

  @action
  double() {
    this.multiple = this.multiple * 2;
  }
}
```

In the `Counter` component, instead of tracking the `multiple` internally, we
take it as an argument. In the template, we refer to the argument as
`@multiple`.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>
```

In templates, we refer to arguments by prefixing them with the `@` sign (in this
case `@multiple`). In order to compute `this.total`, we'll need to refer to the
`multiple` argument from JavaScript.

We refer to a component's argument from JavaScript by prefixing them with
`this.args.`.

In JavaScript, we refer to it as `this.args.multiple`.

```js {data-filename="app/components/counter.js" data-diff="-7,-10,+11"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;
  @tracked multiple = 1;

  get total() {
    return this.count * this.multiple;
    return this.count * this.args.multiple;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }
}
```

The `total` is now computed by multiplying a piece of _local state_
(`this.count`) with an argument (`this.args.multiple`). You can mix and match
local state and arguments however you wish, which allows you to easily break up
a component into smaller pieces.

## Combining Arguments and Actions

We can also pass actions down to components via their arguments, which allows
child components to communicate with their parents and notify them of changes
to state. For instance, if we wanted to add back the doubling button we had
previously, we could using an action passed down via arguments.

```handlebars {data-filename="app/components/counter.hbs"}
<p>{{this.count}}</p>
<p>× {{@multiple}}</p>
<p>= {{this.total}}</p>

<button type="button" {{on "click" (fn this.change 1)}}>+1</button>
<button type="button" {{on "click" (fn this.change -1)}}>-1</button>

<button type="button" {{on "click" this.double}}>Double It</button>
```

```js {data-filename="app/components/counter.js" data-diff="+9,+17,+18,+19,+20"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class CounterComponent extends Component {
  @tracked count = 0;

  get total() {
    return this.count * this.args.multiple;
  }

  @action
  change(amount) {
    this.count = this.count + amount;
  }

  @action
  double() {
    this.args.updateMultiple(this.args.multiple * 2);
  }
}
```

Now, the Counter calls the `updateMultiple` argument (which we expect to be a
function) with the new value for `multiple`, and the parent component can update
the multiple.

```handlebars {data-filename="app/components/double-it.hbs"}
<Counter @multiple={{this.multiple}} @updateMultiple={{this.updateMultiple}} />
```

```js {data-filename="app/components/double-it.js"}
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DoubleItComponent extends Component {
  @tracked multiple = 1;

  @action
  updateMultiple(newMultiple) {
    this.multiple = newMultiple;
  }
}
```

## Learn more

You will frequently create components in an app. Establishing patterns early can help reduce bugs and unforeseen issues. Learn more from the chapter [Patterns for Components](../../in-depth-topics/patterns-for-components/).

Actions are JavaScript methods that you can call from a template. Find out how you can use actions with recommended patterns from the chapter [Patterns for Actions](../../in-depth-topics/patterns-for-actions/).

<!-- eof - needed for pages that end in a code block  -->
