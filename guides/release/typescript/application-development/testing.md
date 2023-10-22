When working with TypeScript in [Ember tests][testing], your workflow will be essentially the same as testing with JavaScript. There will be a few differences in your testing experience, however, and there will also be differences in how you should handle testing app code vs. addon code.

## Testing Experience

### The `TestContext`

A common scenario in Ember tests, especially integration tests, is setting some value on the `this` context of the tests, so that it can be used in the context of the test. The Ember types refer to this as the `TestContext`.

For example, we might need to set up a `User` type to pass into a `Profile` component. We're going to start by defining a basic `User` and `Profile` so that we have a good idea of what we're testing. The `User` type is very simple, just an `interface`:

```typescript {data-filename="app/types/user.ts"}
export default interface User {
  displayName: string;
  avatarUrl?: string;
}
```

Then our component might be defined like this:

```handlebars {data-filename="app/components/profile.hbs"}
<div class='user-profile' ...attributes>
  <img
    src={{this.avatarUrl}}
    alt={{this.description}}
    class='avatar'
    data-test-avatar
  />
  <span class='name' data-test-name>{{@user.displayName}}</span>
</div>
```

```typescript {data-filename="app/components/profile.ts"}
import Component from '@glimmer/component';
import type User from 'app/types/user';
import { randomAvatarURL } from 'app/utils/avatar';

interface ProfileSignature {
  Args: {
    user: User;
  };
}

export default class Profile extends Component<ProfileSignature> {
  get avatarUrl() {
    return this.args.user.avatarUrl ?? randomAvatarURL();
  }

  get description() {
    return this.args.user.avatarUrl
      ? `${this.args.user.displayName}'s custom profile picture`
      : 'a randomly generated placeholder avatar';
  }
}
```

To test the `Profile` component, we need to set up a `User` on `this` to pass into the component as an argument. With TypeScript on our side, we can even make sure our user actually has the correct type!

```typescript {data-filename="tests/integration/components/profile.ts"}
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'app/tests/helpers';
import type User from 'app/types/user';

module('Integration | Component | Profile', function (hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function (assert) {
    const user: User = {
      displayName: 'Rey',
      avatarUrl: 'https://example.com/star-wars/rey',
    };
    this.user = user;

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatarUrl!)
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function (assert) {
    const user: User = {
      displayName: 'Rey',
    };
    this.user = user;

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/)
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

This is a lovely test. Unfortunately, though, it won't type-check. TypeScript reports that `Property 'user' does not exist on type 'TestContext'`. Now, TypeScript _does_ know that QUnit sets up that helpfully-named `TestContext`—so a lot of the things we can do in tests work out of the box—but we haven't told TypeScript that `this` now has a `user` property on it.

To inform TypeScript about this, we need to tell it that the type of `this` in each test assertion includes the `user` property, of type `User`. We'll start by importing the `TestContext` defined by Ember's test helpers, and extending it:

```typescript {data-filename="tests/integration/components/profile.ts"}
import type { TestContext } from '@ember/test-helpers';
import type User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}
```

Then, in every `test` callback, we need to specify the [`this` type][this]:

```typescript
test('...', function (this: Context, assert) {});
```

Putting it all together, this is what our updated test definition would look like:

```typescript {data-filename="tests/integration/components/profile.ts"}
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import type { TestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupRenderingTest } from 'app/tests/helpers';
import type User from 'app/types/user';

interface Context extends TestContext {
  user: User;
}

module('Integration | Component | Profile', function (hooks) {
  setupRenderingTest(hooks);

  test('given a user with an avatar', async function (this: Context, assert) {
    this.user = {
      displayName: 'Rey',
      avatarUrl: 'https://example.com/star-wars/rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', this.user.avatarUrl!)
      .hasAttribute('alt', `${this.user.displayName}'s custom profile picture`);
  });

  test('given a user without an avatar', async function (this: Context, assert) {
    this.user = {
      displayName: 'Rey',
    };

    await render(hbs`<Profile @user={{this.user}}`);

    assert.dom('[data-test-name]').hasText(this.user.displayName);
    assert
      .dom('[data-test-avatar]')
      .hasAttribute('src', /rando-avatars-yo/)
      .hasAttribute('alt', 'a randomly generated placeholder avatar');
  });
});
```

Now everything type-checks, and we get the nice auto-completion we're used to when dealing with `this.user` in the test body.

There are still a couple things to be careful about here, however. First, we didn't specify that the `this.user` property was _optional_. That means that TypeScript won't warn you if you do `this.user` _before_ assigning to it. Second, every test in our module gets the same `Context`. Depending on what you're doing, that may be fine, but you may end up needing to define multiple distinct test context extensions. If you _do_ end up needing to define a bunch of different test context extensions, that may be a sign that this particular set of tests is doing too much. That in turn is probably a sign that this particular _component_ is doing too much!

## Testing Philosophy

### App tests

One major difference when working with TypeScript in _app_ code is that **once your app is _fully_ converted**, there is a whole category of tests you no longer need to write: bad inputs to functions. We'll use an admittedly silly and contrived example here, an `add` function to add two numbers together, so that we can focus on the differences between JavaScript and TypeScript, rather than getting hung up on the details of this particular function.

First, the function we're testing might look like this:

```javascript {data-filename="app/utils/math.js"}
import { assert } from '@ember/debug';

export function add(a, b) {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Note that before we add `b` to `a`, we first check that both values are numbers using [`assert` from `@ember/debug`][assert].

The test for our function might look something like this:

```javascript {data-filename="tests/unit/utils/math-test.js"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });

  test('throws an error with strings', function (assert) {
    assert.throws(
      () => add('nope', 1),
      'throws when the first arg is a string and the second is a number'
    );
    assert.throws(
      () => add(0, 'nope'),
      'throws when the first arg is a number and the second is a string'
    );
    assert.throws(
      () => add('nope', 'also nope'),
      'throws when both args are strings'
    );
  });
});
```

In the TypeScript version of the function, we simply add the types to the function declaration:

```typescript {data-filename="app/utils/math.ts"}
export function add(a: number, b: number): number {
  return a + b;
}
```

We can also drop the assertion from our function definition, because the _compiler_ will check this for us. In this example, testing bad inputs to the function wouldn't make any sense at all because, once again, the _compiler_ will check this for us. We would still write tests, however, to make sure we actually got back what we expected:

```typescript {data-filename="tests/unit/utils/math-test.ts"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });
});
```

### Addon tests

Note, however, that only _app code_ can omit this category of tests. If you're writing an Ember addon (or any other library), you cannot assume that everyone consuming your code is using TypeScript, so you still need to account for these kinds of cases.

Let's return to our silly example with an `add` function. Our setup will look a lot like it did in the JavaScript-only example—but with some extra type coercion along the way so that we can invoke it the way JavaScript-only users might.

First, notice that in this case we've added back in our `assert` in the body of the function. The inputs to our function here will get checked for us by any TypeScript users, but this way we are still doing the work of helping out our JavaScript users.

```typescript {data-filename="app/utils/math.ts"}
import { assert } from '@ember/debug';

function add(a: number, b: number): number {
  assert(
    'arguments must be numbers',
    typeof a === number && typeof b === number
  );

  return a + b;
}
```

Now, in our test file, we're similarly back to testing all those extra scenarios, but here TypeScript would actually stop us from passing the bad inputs _at all_. Working around this will require you to do something that might feel uncomfortable for some enthusiastic TypeScript users: casting a bunch of values [`as any`][any] for your tests to throw away what TypeScript knows about our code!

```typescript {data-filename="tests/unit/utils/math-test.ts"}
import { module, test } from 'qunit';
import { add } from 'app/utils/math';

module('the `add` function', function (hooks) {
  test('adds numbers correctly', function (assert) {
    assert.strictEqual(add(2, 2), 4, '2 + 2 = 4');
  });

  test('throws an error with strings', function (assert) {
    assert.throws(
      () => add('nope' as any, 1),
      'throws when the first arg is a string and the second is a number'
    );
    assert.throws(
      () => add(0, 'nope' as any),
      'throws when the first arg is a number and the second is a string'
    );
    assert.throws(
      () => add('nope' as any, 'also nope' as any),
      'throws when both args are strings'
    );
  });
});
```

<!-- Internal links -->

[assert]: ../../additional-resources/faq/#toc_type-narrowing-with-ember-debug-assert
[testing]: ../../../testing/

<!-- External links -->

[any]: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any
[this]: https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function
