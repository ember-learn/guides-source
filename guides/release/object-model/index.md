One of the first things you'll notice when you generate JavaScript files in Ember is that most of the code you will write goes inside of an object. While an Ember Object might look a lot like an ES2015 JavaScript class, it has some special properties.

### Introducing: Ember Objects

The [Ember Object](https://www.emberjs.com/api/ember/release/classes/EmberObject) class extends plain JavaScript objects to provide core framework functions such as participating in Ember's [binding system](../object-model/bindings/) or how changes to an object automatically trigger updates to the user interface.

Most objects in Ember, including Routes, Models, Services, Mixins, Controllers, and Components extend the `EmberObject` class.

### Why Ember Objects?

The most important reason is that an Ember Object can be watched for changes – or _observed_. For example, being [observable](https://www.emberjs.com/api/ember/release/classes/Observable) is important for [computed properties](../object-model/computed-properties/). It is one of the fundamental ways that models, controllers and views communicate with each other in an Ember application.

### More on Ember Objects

The [@ember/object](https://www.emberjs.com/api/ember/release/modules/@ember%2Fobject) package also provides a class system, supporting features like mixins and constructor methods, and being observable.

Some features in Ember's object model are not present in JavaScript classes or common patterns, but all are aligned as much as possible with the language and proposed additions.

Ember also extends the JavaScript `Array` prototype with its [@ember/enumerable](https://emberjs.com/api/ember/release/classes/Enumerable) interface to provide change observation for arrays.

Finally, Ember extends the `String` prototype with a few [formatting and localization methods](https://www.emberjs.com/api/ember/release/classes/String).
