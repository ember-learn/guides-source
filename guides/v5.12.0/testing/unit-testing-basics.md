Unit tests (as well as container tests) are generally used to test a small piece of code
and ensure that it is doing what was intended.
Unlike application tests, they are narrow in scope and do not require the Ember application to be running.

Let's have a look at a common use case - testing a service - to understand the basic principles of testing in Ember.
This will set the foundation for other parts of your Ember application such as controllers, components, helpers and others.
Testing a service is as simple as creating a container test,
looking up the service on the application's container and running assertions against it.

### Testing Computed Properties

Let's start by creating a service that has a `computedFoo` computed property
based on a `foo` property.

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked foo = 'bar';

  get computedFoo() {
    return `computed ${this.foo}`;
  }
}
```

Within the test for this object, we'll lookup the service instance, update the `foo` property (which
should trigger the computed property), and assert that the logic in our
computed property is working correctly.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should correctly concat foo', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');
    someThing.foo = 'baz';

    assert.equal(someThing.computedFoo, 'computed baz');
  });
});
```

See that first, we are creating a new testing module using the [`QUnit.module`](http://api.qunitjs.com/QUnit/module) function.
This will scope all of our tests together into one group that can be configured
and run independently from other modules defined in our test suite.
Also, we have used `setupTest`, one of the several test helpers provided by [ember-qunit](https://github.com/emberjs/ember-qunit).
The `setupTest` helper provides us with some conveniences, such as the `this.owner` object, that helps us to create or lookup objects
which are needed to setup our test.
In this example, we use the `this.owner` object to lookup the service instance that becomes our test subject: `someThing`.
Note that in a unit test you can customize any object under test by setting its properties accordingly.
We can use the `set` method of the test object to achieve this.

### Testing Object Methods

Next let's look at testing logic found within an object's method. In this case
the `testMethod` method alters some internal state of the object (by updating
the `foo` property).

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked foo = 'bar';

  testMethod() {
    this.foo = 'baz';
  }
}
```

To test it, we create an instance of our class `SomeThing` as defined above,
call the `testMethod` method and assert that the internal state is correct as a
result of the method call.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should update foo on testMethod', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    someThing.testMethod();

    assert.equal(someThing.foo, 'baz');
  });
});
```

In case the object's method returns a value, you can simply assert that the
return value is calculated correctly. Suppose our object has a `calc` method
that returns a value based on some internal state.

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SomeThingService extends Service {
  @tracked count = 0;

  calc() {
    this.count += 1;
    return `count: ${this.count}`;
  }
}
```

The test would call the `calc` method and assert it gets back the correct value.

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('should return incremented count on calc', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    assert.equal(someThing.calc(), 'count: 1');
    assert.equal(someThing.calc(), 'count: 2');
  });
});
```

### Skipping tests

Some times you might be working on a feature, but know that a certain test will fail so you might want to skip it.
You can do it by using `skip`:

```javascript
import { test, skip } from 'qunit';

test('run this test', function(assert) {
  assert.ok(true);
});

skip('skip this test', function(assert) {
  assert.ok(true);
});
```

### Stubs

Unit tests are often testing methods that call other methods or work with other objects.
A stub is a substitute method or object to be used during the test.
This isolates a unit test to the actual method under test.

#### Stubbing a method

```javascript {data-filename=app/services/some-thing.js}
import Service from '@ember/service';

export default class SomeThingService extends Service {
  someComplicatedOtherMethod(x) {
    return x * 2;
  }

  testMethod(y) {
    let z = this.someComplicatedOtherMethod(y);
    return `Answer: ${z}`;
  }
}
```

`someComplicatedOtherMethod` might have complex behavior that you do not want failing your
unit test for `testMethod`, because you know `testMethod` works otherwise.
Isolating unit tests is best practice because the tests that are failing should directly
point to the method that is failing, allowing you to quickly fix it rather than figuring
out which method the error is in. In we stub the other method:

```javascript {data-filename=tests/unit/services/some-thing-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | some thing', function(hooks) {
  setupTest(hooks);

  test('testMethod should return result of someComplicatedOtherFunction', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');
    const originalSomeComplicatedOtherMethod =
      someThing.someComplicatedOtherMethod;
    someThing.someComplicatedOtherMethod = function() {
      return 4;
    };

    assert.equal(someThing.testMethod(2), 'Answer 4', 'testMethod is working');

    someThing.someComplicatedOtherMethod = originalSomeComplicatedOtherMethod;
  });
});
```

#### Stubbing an object

You can also stub an object:

```javascript {data-filename=app/services/employees.js}
import Service from '@ember/service';

export default class EmployeesService extends Service {
  employees = [];

  hire(person) {
    person.addJob();
    this.employees.push(person);
    return `${person.title} ${person.name} is now an employee`;
  }
}
```

Here, you need to pass a person object, which could be a complex class.
The `addJob` method in `Person` could be complex as well, perhaps requiring another class.
Instead, create a simple object and pass it instead.

```javascript {data-filename=tests/unit/services/employees-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Service | employees', function(hooks) {
  setupTest(hooks);

  test('hire adds a person to employees array', function(assert) {
    const someThing = this.owner.lookup('service:some-thing');

    class MockPerson {
      title = 'Dr.';
      name = 'Zoey';
      addJob() {}
    }

    let person = new MockPerson();

    assert.equal(someThing.hire(person), 'Dr. Zoey is now an employee');
  });
});
```

<!-- eof - needed for pages that end in a code block  -->
