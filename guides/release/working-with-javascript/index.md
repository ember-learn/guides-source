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
[decorators][6] have not yet been fully finished in JavaScript, so we have [a
more detailed primer](./native-classes/) on them in the next section.

[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes#Field_declarations
[6]: https://github.com/tc39/proposal-decorators

Ember also used its own custom class syntax before native JavaScript classes
existed, which looks like this:

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
you may encounter this syntax, so we've also included [a detailed
primer](./classic-classes/) for it in the guides.

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
