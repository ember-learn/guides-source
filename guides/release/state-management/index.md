You may have heard the term _state_ before, but if you haven't, it generally is
used to refer to the values of the _variables_ in your application as a whole.
All applications in all languages consist primarily of two categories of things:

1. _Static constructs_, such as module, class, and function definitions in
   JavaScript. These are things which generally _can't_ (or _shouldn't_) change
   during the runtime of the program. They contain the _logic_ of the program.
2. _State_, which is everything that _can_ change in the program. The variables,
   objects, class instances, arrays, and so-on. This includes values that change
   _on_ objects and class instances as well, fields and properties.

There are different _kinds_ of state in every JavaScript application, including:

1. Local state
2. Closure state
3. Object state
4. Global state

We breakdown these different types of state a bit more below, but in general
when we talk about _state management_, we're talking about how to manage state
that is _long-lived_. That generally refers to _closure_, _object_, and _global_
state. Local state, on the other hand, is something that is _usually_ easier to
reason about, since it only exists while a function is executing.

Long-lived state, on the other hand, can get tricky. There are lots of places
where you might update an object or array in your program, and oftentimes you
might miss one when refactoring a program, or not consider a sequence of events
that causes you to end up in a strange, buggy state. This is the source of many
bugs, across many apps, written in many languages, so don't worry if you've ever
had trouble debugging something that deals with long-lived state!

## State in Ember Applications

In Ember, we care mostly about _object_ state in the form of:

- **Component state**
- **Controller state**
- **Service state**

In the [Patterns for State](./patterns-for-state) section, we discuss how you can store your
application's state in these different types of objects, and how to think about
state in general in Ember apps.

Most often, Ember cares about the state that should cause it to _rerender_. If a
change occurs somehow, but it doesn't change anything in the UI, then Ember
shouldn't do anything at all. But, if something _should_ change, like the text
in a popup, the page you're on, or the color of a button, Ember needs to respond
to that change!

Ember primary system for detecting changes to state are _tracked properties_.
If you read the section on Glimmer components, you'll probably recognize these,
they're properties that are decorated with the `@tracked` decorator:

```js
export default class Person extends Component {
  @tracked firstName = 'Alex';
  @tracked lastName = 'Navasardyan';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

There is also an older system that centered mostly around a concept called
_computed properties_. Both systems work in Ember today, but for new
applications and most use-cases, tracked properties are recommended.

Of course, you can also have state in the form of objects, arrays, or your own
custom classes in your Ember app. Maybe you have a custom data layer, or you're
loading and saving data from `localStore`. Tracked properties can be used
throughout your custom code and classes, or in an interop layer if needed. When
we talk about Component/Controller/Service state, we're also talking about the
state of any objects or class instances that exist _within_ the state of those
constructs.

## Types of State in JavaScript

Before we move on, if you're interested in the different types of state in
JavaScript as a _whole_, outside of just Ember, let's break those down.

### Local State

Local state is state that is local to a section of code, like a function. When
you create a variable in a function in JavaScript, it is only around for as long
as the function is executing (usually):

```js
function sayHello() {
  let message = 'Hello';

  message += ', world!';

  console.log(message);
}

sayHello(); // 'Hello, world!'

// This will throw an error since
// 'message' is not defined
console.log(message);
```

When we start the program, there is no `message` string at all. When we call
`sayHello`, we first create the `message` variable, then assign it `'Hello'` as
its value. We then _update_ that value, changing the variable. It's state has
_mutated_, as we say, it has changed from one value to another. Finally, we log
the value and exit the function.

Once we exit the function, the `message` variable is removed from the program,
and its state is automatically cleaned up. There's no way for us to access it
later on, and it can't affect the runtime of our program.

### Closure State

In JavaScript, you can also _nest_ function definitions. This means that
functions can access the local variables wherever they are defined:

```js
function sayHello() {
  let message = 'Hello';

  function printMessage() {
    console.log(message);
  }

  message += ', world!';

  return printMessage;
}

let printer = sayHello();

printer(); // 'Hello, world!'
```

When we call the `sayHello` function, it allocates the `message` variable like
before. It then creates a _new_ function. This function is created _uniquely_
every time we call `sayHello`, and returned so we can use it later. It also
stores a reference to the `message` variable declared in `sayHello`, so it can
access it when it's time for it to run.

We then _mutate_ the `message` variable like before. For `printMessage` that's
completely OK, since it's storing a reference to the _variable_, not its value.
Finally, we return the `printMessage` function and set it on the `printer`
variable.

This stores the `printMessage` function, _and_ it's reference to the `message`
variable that we created, so the `message` variable _doesn't_ get cleaned up.
Its state is living along with the _closure_ of the `printMessage` function.

### Object State

Object state refers to the state of an _object_, _array_, or _class instance_.
We could also store our message on an object like this:

```js
function sayHello(state) {
  state.message = 'Hello, world!';
}

let state = {};

console.log(state.message); // undefined

sayHello(state);

console.log(state.message); // 'Hello, world!'
```

Now our `sayHello` function isn't storing it's message locally, and it's not
storing it via closure. Instead, its setting it on an object which was declared
_outside_ of its scope, and passed as an argument to the function. The `message`
property on that object will contain the string `'Hello, world!'` for as long
as the object is around. In some cases, this might be until the end of a
function. If the object is store in a closure or on another object, however, it
could stick around for a long time.

### Global State

Global state is state that is universal to _all_ parts of the program. In
JavaScript, this is the state of the global objects, `window` in browsers and
`global` in Node. These are objects that exist in _every_ JavaScript program,
and so any properties that are set on them exist for the lifetime of the
program.

Global state is _generally_ something that should be avoided, unless it's a
built in API where it makes sense, like `window.location`. The reason being that
it's possible to update the state _anywhere_ in your application, which means
its very likely that it _will_ be updated all over the place, and it'll make
reasoning about all the places it is updated very hard. Instead, it's best to
ensure that there is some level of control over how state gets updated, in part
by controlling access.

#### Global State vs. Service State

> _Note: We haven't discussed Services yet, so you may want to come back to this
> section later on._

Services in Ember are kind of similar to global state - they are accessible from
any other service or component they are injected into, and they exist as long as
the application does. However, they are _more_ controlled than globals like
`window` because:

1. They can _only_ be injected into other Ember objects, not custom classes.
2. They can _only_ be used in places where they are injected. Random functions
   can't access a service for a one of change.

This means that you can narrow down changes to state in services to a number of
locations, and generally control the data flow more easily.
