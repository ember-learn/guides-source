While you can accomplish a lot in Ember using HTML templating, you'll need JavaScript to make your application interactive.

Let's start with a really simple example, a counter component. When the user presses the `+` button, the count will increase by 1. When the user presses the `-` button, the count will decrease by 1.

First, let's start with the HTML.

```handlebars {data-filename="app/components/counter.hbs"}
<p>0</p>

<button>+1</button>
<button>-1</button>
```

## Tracked Properties

To make this work, we will need to stop hardcoding the number, and we will need to wire up the buttons.

```js {data-filename="app/components/counter.js"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class extends Component {
  @tracked count = 0;
}
```

There's a bunch going on here, but the most important part is `@tracked count = 0`. This creates a dynamic value that you can stick in the template, instead of hardcoding it.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-1,+2"}
<p>0</p>
<p>{{this.count}}</p>

<button>+1</button>
<button>-1</button>
```

When we say `this.count` in the component template, we're referring to a property that we defined in the JavaScript class.

The output looks the same as before, but now the `0` comes from JavaScript, and we can change it from the button.

## HTML Modifiers and Actions

Next, we want to wire up the buttons. When the user presses `+1`, we want `this.count` to go up by 1. When the user presses `-1`, we want it to go down by 1.

To attach an event handler to an HTML tag, you use the `on` HTML modifier. HTML modifiers are an Ember syntax that allow you to attach logic to a tag.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button>+1</button>
<button {{on "click" this.increment}}>+1</button>
<button>-1</button>
<button {{on "click" this.decrement}}>-1</button>
```

To make those event handlers do something, we will need to define _actions_ in the component JavaScript. An action is a JavaScript method that can be used from a template.

```js {data-filename="app/components/counter.js" data-diff="+3,+8,+9,+10,+11,+13,+14,+15,+16"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class extends Component {
  @tracked count = 0;

  @action
  increment() {
    this.count = this.count + 1;
  }

  @action
  increment() {
    this.count = this.count - 1;
  }
}
```

## Passing Arguments to Actions

Our counter has two different actions, `increment` and `decrement`. But both actions are mostly doing the same thing. The only difference is that `increment` changes the count by `+1`, while `decrement` changes it by `-1`.

First, let's turn our `increment` and `decrement` methods into a single `update` method that takes the amount as a parameter.

```js {data-filename="app/components/counter.js" data-diff="+8,+9,+10,+11,-12,-13,-14,-15,-17,-18,-19,-20"}
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class extends Component {
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
  increment() {
    this.count = this.count - 1;
  }
}
```

Next, we'll update the template to turn the click handler into a function that passes the amount as an argument.

```handlebars {data-filename="app/components/counter.hbs" data-diff="-3,+4,-5,+6"}
<p>{{this.count}}</p>

<button {{on "click" this.increment}}>+1</button>
<button {{on "click" (fn this.change 1)}}>+1</button>
<button {{on "click" this.decrement}}>-1</button>
<button {{on "click" (fn this.change -1)}}>-1</button>
```

<div class="cta">
  <div class="cta-note">
    <div class="cta-note-body">
      <div class="cta-note-heading">Zoey says...</div>
      <div class="cta-note-message">
        An event handler takes a function as its second argument. When there are no arguments to the
        function, you can pass it directly, just like in JavaScript. Otherwise, you can build a
        function inline by using the <code>fn</code> syntax.        
      </div>
    </div>
    <img src="/images/mascots/zoey.png" role="presentation" alt="">
  </div>
</div>
