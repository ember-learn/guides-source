You can test [WarpDrive](../../warp-drive/) schemas, derivations, and handlers in unit tests.
Unit tests use the `setupTest` helper.
They do not render anything.

In each test, get the real store with `this.owner.lookup('service:store')`.
The store has the schemas, derivations, and handlers of your app, so the test checks your real setup.

## Testing Derived Fields

Let's assume we have a `player` schema with a `level` field.
A derived field, `levelName`, returns `'Professional'` when the level is 5 or more:

```javascript {data-filename=app/schemas/player.js}
import { withDefaults } from '@warp-drive/core/reactive';
import { Type } from '@warp-drive/core/types/symbols';

export const PlayerSchema = withDefaults({
  type: 'player',
  fields: [
    { kind: 'field', name: 'level' },
    { kind: 'derived', name: 'levelName', type: 'level-name' },
  ],
});

export function levelName(player) {
  return player.level >= 5 ? 'Professional' : 'Noob';
}
levelName[Type] = 'level-name';
```

The store registers the schema and the derivation, as shown in
[Defining Schemas](../../warp-drive/schemas/#toc_derived-fields).

The test puts a player in the store with `store.push`, as a response from the server does.
Then it pushes a new level and checks that `levelName` follows:

```javascript {data-filename=tests/unit/schemas/player-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Schema | player', function (hooks) {
  setupTest(hooks);

  test('levelName changes at level 5', function (assert) {
    const store = this.owner.lookup('service:store');

    const player = store.push({
      data: { type: 'player', id: '1', attributes: { level: 4 } },
    });

    assert.strictEqual(player.levelName, 'Noob');

    store.push({
      data: { type: 'player', id: '1', attributes: { level: 5 } },
    });

    assert.strictEqual(player.levelName, 'Professional');
  });
});
```

## Testing Records Loaded from the Server

Records from the server are immutable, and they can have relationships.
To test them, push a JSON:API document into the store with `store.push`.
`push` returns the records.
No network request happens.

Assume that a `user` belongs to a `profile`:

```javascript {data-filename=app/schemas/user.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const UserSchema = withDefaults({
  type: 'user',
  fields: [
    { kind: 'field', name: 'name' },
    {
      kind: 'belongsTo',
      name: 'profile',
      type: 'profile',
      options: { async: false, inverse: null, linksMode: true },
    },
  ],
});
```

```javascript {data-filename=app/schemas/profile.js}
import { withDefaults } from '@warp-drive/core/reactive';

export const ProfileSchema = withDefaults({
  type: 'profile',
  fields: [{ kind: 'field', name: 'bio' }],
});
```

This test checks that the relationship points to the right profile:

```javascript {data-filename=tests/unit/schemas/user-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';

module('Unit | Schema | user', function (hooks) {
  setupTest(hooks);

  test('a user has a profile', function (assert) {
    const store = this.owner.lookup('service:store');

    const user = store.push({
      data: {
        type: 'user',
        id: '1',
        attributes: { name: 'Zoey' },
        relationships: {
          profile: { data: { type: 'profile', id: '1' } },
        },
      },
      included: [
        {
          type: 'profile',
          id: '1',
          attributes: { bio: 'Ember mascot' },
        },
      ],
    });

    assert.strictEqual(user.name, 'Zoey');
    assert.strictEqual(user.profile.bio, 'Ember mascot');
  });
});
```

## Testing Edits

To test code that edits a loaded record, check out an editable copy, as your app does:

```javascript {data-filename=tests/unit/schemas/user-edit-test.js}
import { module, test } from 'qunit';
import { setupTest } from 'my-app-name/tests/helpers';
import { checkout } from '@warp-drive/core/reactive';

module('Unit | Schema | user editing', function (hooks) {
  setupTest(hooks);

  test('edits only show on the editable copy', async function (assert) {
    const store = this.owner.lookup('service:store');

    const user = store.push({
      data: {
        type: 'user',
        id: '1',
        attributes: { name: 'Zoey' },
        relationships: { profile: { data: null } },
      },
    });
    const editable = await checkout(user);

    editable.name = 'Tomster';

    assert.strictEqual(editable.name, 'Tomster');
    assert.strictEqual(user.name, 'Zoey');
  });
});
```

## Testing Handlers

A handler is an object with a `request` method.
You can call it directly with a request and a `next` function.
Use `assert.step` to record what reaches `next`:

```javascript {data-filename=tests/unit/handlers/json-suffix-test.js}
import { module, test } from 'qunit';
import { JsonSuffixHandler } from 'my-app-name/handlers/json-suffix';

module('Unit | Handler | json-suffix', function () {
  test('it adds .json to the url', async function (assert) {
    const context = { request: { url: '/api/rentals', method: 'GET' } };

    await JsonSuffixHandler.request(context, (request) => {
      assert.step(request.url);
      return Promise.resolve({ content: null });
    });

    assert.verifySteps(['/api/rentals.json']);
  });
});
```

To check how your app behaves with a real server response, write an
[application test](../testing-application/) instead.
Application tests run the whole request chain.

_WarpDrive has extensive tests of its own, so you do not need to test that relationships or the cache work.
Test the schemas, derivations, transformations, and handlers that you write._
