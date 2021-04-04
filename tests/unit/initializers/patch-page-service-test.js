import Application from '@ember/application';
import { run } from '@ember/runloop';
import { initialize } from 'ember-guides/initializers/patch-page-service';
import Resolver from 'ember-resolver';
import { module, test } from 'qunit';

module('Unit | Initializer | patch-page-service', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {}

    this.TestApplication.initializer({
      initialize,
      name: 'initializer under test',
    });

    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    });
  });

  hooks.afterEach(function () {
    run(this.application, 'destroy');
  });

  test('it works', async function (assert) {
    await this.application.boot();

    assert.ok(true);
  });
});
