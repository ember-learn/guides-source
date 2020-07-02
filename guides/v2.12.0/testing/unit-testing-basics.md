Unit tests are generally used to test a small piece of code and ensure that it
is doing what was intended. Unlike acceptance tests, they are narrow in scope
and do not require the Ember application to be running.

As it is the basic object type in Ember, being able to test a simple
[`Ember.Object`][1] sets the foundation for testing more specific parts of your
Ember application such as controllers, components, etc. Testing an `Ember.Object`
is as simple as creating an instance of the object, setting its state, and
running assertions against the object. By way of example, let's look at a few
common cases.

[1]: https://api.emberjs.com/classes/Ember.Object.html

### Testing Computed Properties

Let's start by creating an object that has a `computedFoo` computed property
based on a `foo` property.

```javascript {data-filename=app/models/some-thing.js}
import Ember from 'ember';

export default Ember.Object.extend({
  foo: 'bar',

  computedFoo: Ember.computed('foo', function() {
    const foo = this.get('foo');
    return `computed ${foo}`;
  })
});
```

Within the test for this object we'll create an instance, update the `foo` property (which
should trigger the computed property), and assert that the logic in our
computed property is working correctly.

```javascript {data-filename=tests/unit/models/some-thing-test.js}
import { moduleFor, test } from 'ember-qunit';

moduleFor('model:some-thing', 'Unit | some thing', {
  unit: true
});

test('should correctly concat foo', function(assert) {
  const someThing = this.subject();
  someThing.set('foo', 'baz');
  assert.equal(someThing.get('computedFoo'), 'computed baz');
});
```

See that we have used `moduleFor`, one of the several unit-test helpers provided by Ember-Qunit.
Test helpers provide us with some conveniences, such as the `subject` function that handles lookup and instantiation for our object under test.
Note that in a unit test you can customize the initialization of your object under test by passing to the
`subject` function an object containing the instance variables you would like to initialize.  For example, to initialize
the property 'foo' in our object under test, we would call `this.subject({ foo: 'bar' });`

### Testing Object Methods

Next let's look at testing logic found within an object's method. In this case
the `testMethod` method alters some internal state of the object (by updating
the `foo` property).

```javascript {data-filename=app/models/some-thing.js}
import Ember from 'ember';

export default Ember.Object.extend({
  foo: 'bar',
  testMethod() {
    this.set('foo', 'baz');
  }
});
```

To test it, we create an instance of our class `SomeThing` as defined above,
call the `testMethod` method and assert that the internal state is correct as a
result of the method call.

```javascript {data-filename=tests/unit/models/some-thing-test.js}
test('should update foo on testMethod', function(assert) {
  const someThing = this.subject();
  someThing.testMethod();
  assert.equal(someThing.get('foo'), 'baz');
});
```

In the event the object's method returns a value you can simply assert that the
return value is calculated correctly. Suppose our object has a `calc` method
that returns a value based on some internal state.

```javascript {data-filename=app/models/some-thing.js}
import Ember from 'ember';

export default Ember.Object.extend({
  count: 0,
  calc() {
    this.incrementProperty('count');
    let count = this.get('count');
    return `count: ${count}`;
  }
});
```

The test would call the `calc` method and assert it gets back the correct value.

```javascript {data-filename=tests/unit/models/some-thing-test.js}
test('should return incremented count on calc', function(assert) {
  const someThing = this.subject();
  assert.equal(someThing.calc(), 'count: 1');
  assert.equal(someThing.calc(), 'count: 2');
});
```

### Testing Observers

Suppose we have an object that has a property and a method observing that property.

```javascript {data-filename=app/models/some-thing.js}
import Ember from 'ember';

export default Ember.Object.extend({
  foo: 'bar',
  other: 'no',
  doSomething: Ember.observer('foo', function() {
    this.set('other', 'yes');
  })
});
```

In order to test the `doSomething` method we create an instance of `SomeThing`,
update the observed property (`foo`), and assert that the expected effects are present.

```javascript {data-filename=tests/unit/models/some-thing-test.js}
test('should set other prop to yes when foo changes', function(assert) {
  const someThing = this.subject();
  someThing.set('foo', 'baz');
  assert.equal(someThing.get('other'), 'yes');
});
```

<!-- eof - needed for pages that end in a code block  -->
