Ember is a frontend framework written in _JavaScript_, the primary scripting
language of the web. You don't need to be an expert in JavaScript to begin using
Ember, but it helps to have some general programming knowledge as well as some
basic knowledge of JavaScript and how it differs from other languages.

If you're new to JavaScript, here are some excellent introductory materials:

- [Mozilla's JavaScript Tutorial][1] is pretty comprehensive, and the MDN
  documentation is the go-to source for looking JavaScript and web APIs.
- [javascript.info][2] is a detailed interactive guide that takes you through
  from the basics to the details. This one is pretty good for beginners with no
  programming experience, since it starts from scratch and ramps up.
- [ES6 for humans][3] is a great resource if you're already familiar with
  JavaScript in general, but haven't had a chance to get to know some of its
  latest features that were finalized in 2015.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript
[2]: https://javascript.info
[3]: https://github.com/metagrover/ES6-for-humans


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
use [Babel][7] to compile modern JavaScript to something that
can work on _all_ browsers. This means you can write modern JavaScript and use
the latest features without any additional setup!

[7]: https://babeljs.io/

> _Note: Some features require you to [enable the Babel polyfill][8]. This adds
> some extra weight to your application, but ensures you'll be compatible with
> any new features that are added to JavaScript._

[8]: https://github.com/babel/ember-cli-babel#polyfill

## Classes

Ember uses [JavaScript classes][4] for many of its constructs, such as
Components, Routes, Services, and more:

[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

```js
export default class PersonController extends Controller {
  @tracked firstName = 'Yehuda';
  @tracked lastName = 'Katz';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
```

Some of the features that Ember relies on, such as [class fields][5] and
[decorators][6] have not yet been fully finalized in JavaScript just yet, so
we'll cover these here with the assumption that you've had a chance to
familiarize yourself with classes before. If you haven't, you can also check
out [our detailed class primer](../in-depth-topics/native-classes).

[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
[6]: https://github.com/tc39/proposal-decorators

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
[pre-Octane guides on classic classes](https://guides.emberjs.com/release/object-model/)
for more information on them.

