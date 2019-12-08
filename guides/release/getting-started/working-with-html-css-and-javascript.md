Ember is a framework for building applications that run in the browser, which
means that they are made with HTML, CSS, and JavaScript. You don't need to be an
expert in any of these technologies to write an Ember app, but it's good to have
some basic working knowledge of them in order to be able to work with Ember, and
to work through the guides.

## HTML

Hypertext Markup Language (HTML) is a language for specifying the layout of web
pages. It is not a _programming_ language; it is a markup language that defines
the structure of your content. Ember provides a templating language that extends
HTML and provides tools for making that structure dynamic.

If you're new to HTML, we recommend [Mozilla's HTML Tutorial][html-guide] is
fairly comprehensive, and the MDN is one of the best resources for learning
about web APIs.

[html-guide]: https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics

## CSS

CSS (Cascading Style Sheets) are used to style HTML. While HTML lays out the
basic structure, CSS provides the rules for how that structure should display in
the browser.

If you're new to CSS, we recommend [the MDN guide for learning it][css-guide],
as it is fairly comprehensive and up to date.

[css-guide]: https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps

## JavaScript

JavaScript is the primary scripting language of the web. You don't need to be an
expert in JavaScript to begin using Ember, but it helps to have some general
programming knowledge as well as some basic knowledge of JavaScript and how it
differs from other languages.

If you're new to JavaScript, here are some excellent introductory materials:

- [Mozilla's JavaScript Tutorial][mdn-js-guide] is pretty comprehensive, and the
  MDN documentation is the go-to source for looking JavaScript and web APIs.
- [javascript.info][js-info-guide] is a detailed interactive guide that takes
  you through from the basics to the details. This one is pretty good for
  beginners with no programming experience, since it starts from scratch and
  ramps up.
- [ES6 for humans][es6-for-humans] is a great resource if you're already
  familiar with JavaScript in general, but haven't had a chance to get to know
  some of its latest features that were finalized in 2015.

[mdn-js-guide]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
[js-info-guide]: https://javascript.info
[es6-for-humans]: https://github.com/metagrover/ES6-for-humans

We recommend familiarizing yourself with the following concepts in particular to
make the most out of these guides and of Ember:

* **Classes** - classes are one of the most fundamental constructs
  in JavaScript, and are used frequently in Ember. See the next section for more
  details on them.
* **Modules** - you will better understand [Ember CLI's](https://ember-cli.com/)
  project structure and import paths if you are comfortable with
  [JavaScript Modules][modules-guide].
* **Events** - The native way to deal with user input in browser based web
  applications. Events are not part of the language of JavaScript itself, but
  they are part of the browser environment that JavaScript runs in, and they are
  used commonly in Ember. You can read the [MDN introduction to events][events-guide]
  for more details.
* **Promises** - the native way to deal with asynchrony in your JavaScript code.
  See the relevant [Mozilla Developer Network][promises-guide] section. In
  addition, modern [`async/await` function syntax][async-await-guide] is good to
  know.

[modules-guide]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[events-guide]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events
[promises-guide]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[async-await-guide]: https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await

## JavaScript Classes

Ember uses [JavaScript classes][classes-reference] for many of its constructs,
such as Components, Routes, Services, and more:

[classes-reference]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

```js
export default class PersonController extends Controller {
  @tracked firstName = 'Yehuda';
  @tracked lastName = 'Katz';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Some of the features that Ember relies on, such as [class fields][class-fields]
and [decorators][decorators-proposal] have not yet been fully finalized in
JavaScript just yet, so we'll cover these here with the assumption that you've
had a chance to familiarize yourself with classes before. If you haven't, you
can also check out [our detailed class primer](../../in-depth-topics/native-classes-in-depth/).

[class-fields]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
[decorators-proposal]: https://github.com/tc39/proposal-decorators

### Fields

Class fields allow you to assign properties to an instance of the class on
construction. You can define a field like this:

```js
class Person {
  name = 'Yehuda Katz';
}
```

This is the very similar to defining the `Person` class with a constructor like
this:

```js
class Person {
  constructor() {
    this.name = 'Yehuda Katz';
  }
}
```

Class fields are somewhat like object properties, but they have some key
differences. They are created and assigned to every instance of the class,
meaning that instance gets a _unique_ version of the field. This doesn't matter
if the field is a primitive, like a string or a number, but does matter if it's
an object or an array:

```js
class Person {
  friends = [];
}

let tom = new Person();
let yehuda = new Person();

tom.friends === yehuda.friends;
// false, they're different arrays
```

Fields can also access the class instance using `this` when they are being
assigned:

```js
class Child {
  constructor(parent) {
    this.parent = parent;
  }
}

class Parent {
  child = new Child(this);
}
```

Fields are assigned before any code in the `constructor` method is run, which is
why we can rely on them being assigned correctly by the time it runs. Fields do
_not_ exist on the class itself, nor do they exist on the class's prototype,
they only exist on the _instance_ of the class. However, they can be added to
the class directly using the `static` keyword, like other class elements.

### Decorators

Decorators are user defined modifiers that can be applied to a class or class
element such as a field or method to change its behavior. For instance, you
could create a `@cache` decorator that caches the return value of a getter the
first time it is calculated:

```js
import { cache } from 'my-cache-decorator';

class Counter {
  _count = 0;

  @cache
  get count() {
    return this._count++;
  }
}

let counter = new Counter();

console.log(counter.count); // 0
console.log(counter.count); // 0
```

Decorators are _normal_ JavaScript functions that get applied with a special
syntax, which is why you import them like any other function, but you use the
`@` symbol when applying them. Decorators come in a variety of flavors, and some
can be applied to class's directly as well:

```js
@observable
class Person {}
```

Some decorators can also receive arguments:

```js
class Person {
  fullName = 'Matthew Beale';

  @alias('fullName') name;
}

let matt = new Person();
console.log(matt.name); // Matthew Beale
```

Ember provides a number of decorators, such as the `@tracked` decorator, that
will be described in greater detail later on in the guides.

> Note: Decorators are still being actively developed in JavaScript, which means
> that there may be small changes in the future. The decorators provided by
> Ember should remain stable through these changes, but it is recommended that
> you exercise caution if using any external decorator libraries which may not
> have the same stability guarantees.

### Classic Classes

Ember used its own custom class syntax before native JavaScript classes existed,
which looks like this:

```js
export default Controller.extend({
  firstName: tracked({ value: 'Yehuda' }),
  lastName: tracked({ value: 'Katz' }),

  fullName: descriptor({
    get() {
      return `${this.firstName} ${this.lastName}`;
    },
  }),
});
```

This syntax is known as _classic class_ syntax, and if you're starting out on a
new Ember application it's recommended that you stick with native classes
instead. However, if you are working in an older application, or in an addon,
you may encounter this syntax, so you can check out the
[pre-Octane guides on classic classes](../../../v3.12.0/object-model/)
for more information on them.

## Cross-Browser Support

As you may already know, or as you'll find out as you learn more about it,
JavaScript is an ever-evolving language based on the ECMAScript standard. Every
web browser has its own JavaScript engine, and each time the browser updates
they may add some of the new features that have been added to the language
recently. As you can imagine, this makes writing code that works across all
browsers tricky! If Chrome supports a feature, but Safari or Edge or IE don't,
you may end up accidentally shipping code that works for you but breaks on other
people's machines.

Luckily, Ember comes with a solution out of the box for this. Ember applications
use [Babel](https://babeljs.io/) to compile modern JavaScript to something that
can work on _all_ browsers. This means you can write modern JavaScript and use
the latest features without any additional setup!

> _Note: Some features require you to [enable the Babel polyfill][babel-polyfill].
> This adds some extra weight to your application, but ensures you'll be
> compatible with any new features that are added to JavaScript._

[babel-polyfill]: https://github.com/babel/ember-cli-babel#polyfill
