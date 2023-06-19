Ember is a framework for building applications that run in the browser, which
means that they are made with HTML, CSS, and JavaScript. It is very helpful to
be familiar with these technologies. If you find yourself getting stuck or
confused as you learn Ember, come back to this page and see if there is a
general topic below that you could explore.

## HTML

Hypertext Markup Language (HTML) is a language for specifying the layout of web
pages. It is a markup language that defines the structure of your content
declaratively, which makes it very powerful. Ember provides a templating
language that extends HTML and provides tools for making that structure dynamic.

If you're new to HTML, we recommend [Mozilla's HTML Tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
is fairly comprehensive, and the MDN site is one of the best resources for
learning about web APIs.

## CSS

CSS (Cascading Style Sheets) are used to style HTML. While HTML lays out the
basic structure, CSS provides the rules for how that structure should display in
the browser.

If you're new to CSS, we recommend [the MDN guide for learning it](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps),
as it is fairly comprehensive and up to date.

## JavaScript

JavaScript is the primary scripting language of the web. Most Ember apps have
some amount of JavaScript code in them.

Since Ember is a template-oriented framework, not all developers need to
use JavaScript when working on Ember apps. Some developers may be more
focused on the structure of an app's templates, its styles, or the
accessibility of an app. However, it's good to have some
general knowledge of JavaScript for the places where it is used.

If you're new to JavaScript, here are some excellent introductory materials:

- [Mozilla's JavaScript Tutorial](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
  is pretty comprehensive, and the MDN documentation is the go-to source for
  learning about JavaScript and web APIs.
- [javascript.info](https://javascript.info) is a detailed interactive guide
  that takes you through from the basics to the details. This one is pretty good
  for beginners with no programming experience, since it starts from scratch and
  ramps up.
- [ES6 for humans](https://github.com/metagrover/ES6-for-humans) is a great
  resource if you're already familiar with JavaScript in general, but haven't
  had a chance to get to know some of its latest features that were finalized in 2015.

We recommend familiarizing yourself with the following concepts in particular to
make the most out of these guides and of Ember:

* **Classes** - classes are one of the most fundamental constructs
  in JavaScript, and are used frequently in Ember. See the next section for more
  details on them.
* **Modules** - you will better understand [Ember CLI's](https://ember-cli.com/)
  project structure and import paths if you are comfortable with
  [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
* **Events** - The native way to deal with user input in browser based web
  applications. Events are not part of the language of JavaScript itself, but
  they are part of the browser environment that JavaScript runs in, and they are
  used commonly in Ember. You can read the [MDN introduction to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
  for more details.
* **Promises** - the native way to deal with asynchrony in your JavaScript code.
  See the relevant [Mozilla Developer Network](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
  section. In addition, modern [`async/await` function syntax](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
  is good to know.

## JavaScript Classes

Ember uses [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
for many of its constructs, such as Components, Routes, Services, and more:

```js
export default class PermissionController extends Controller {
  @tracked isAdmin = false;
  @tracked isManager = false;

  get canEdit() {
    return this.isAdmin || this.isManager;
  }
}
```

Some of the features that Ember relies on, such as [class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations)
and [decorators](https://github.com/tc39/proposal-decorators) have not yet been
fully finalized in JavaScript just yet, so we'll cover these here with the
assumption that you've had a chance to familiarize yourself with classes before.
If you haven't, you can also check out [our detailed class primer](../../in-depth-topics/native-classes-in-depth/).

### Fields

Class fields allow you to assign properties to an instance of the class on
construction. You can define a field like this:

```js
class Permission {
  canEdit = false;
}
```

This is very similar to defining the `Permission` class with a constructor like
this:

```js
class Permission {
  constructor() {
    this.canEdit = false;
  }
}
```

Class fields are somewhat like object properties, but they have some key
differences. They are created and assigned to every instance of the class,
meaning that instance gets a _unique_ version of the field. This doesn't matter
if the field is a primitive, like a string or a number, but does matter if it's
an object or an array:

```js
class Permission {
  roles = [];
}

let tom = new Permission();
let yehuda = new Permission();

tom.roles === yehuda.roles;
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
can be applied to classes directly as well:

```js
@observable
class Permission {}
```

Some decorators can also receive arguments:

```js
class Permission {
  canEdit = false;

  @alias('canEdit') editable;
}

let current = new Permission();
console.log(current.editable); // false
```

Ember provides a number of decorators, such as the `@tracked` decorator, that
will be described in greater detail later on in the guides.

> _Note: Decorators are still being actively developed in JavaScript, which means
> that there may be small changes in the future. The decorators provided by
> Ember should remain stable through these changes, but it is recommended that
> you exercise caution if using any external decorator libraries which may not
> have the same stability guarantees._

### Classic Classes

Classic classes are deprecated, but it is still useful to be able
to recognize them when looking at older code or blog posts.
Ember used its own custom class syntax before native JavaScript classes existed,
which looks like this:

```js
export default Controller.extend({
  isAdmin: tracked({ value: false }),
  isManager: tracked({ value: false }),

  canEdit: descriptor({
    get() {
      return this.isAdmin || this.isManager;
    },
  }),
});
```

This syntax is known as _classic class_ syntax. You can check out the
[pre-Octane guides on classic classes](../../../v3.12.0/object-model/)
for more information on how to convert a classic class to modern Ember.

## Cross-Browser Support

Just like the JavaScript language changes over time, web browsers change too!
Ember helps you to write code that can work across many different browsers and
their versions.

Behind the scenes, Ember uses [Babel](https://babeljs.io/) to compile modern
JavaScript to something that can work on _all_ browsers. Without this step, you
could accidentally end up shipping code that works for your version of Chrome but
breaks for someone using Edge. Ember has you covered and let you write modern
JavaScript and use the latest features without any additional setup!

> _Note: Some features require you to [enable the Babel polyfill](https://github.com/babel/ember-cli-babel#polyfill).
> This adds some extra weight to your application, but ensures you'll be
> compatible with any new features that are added to JavaScript._
