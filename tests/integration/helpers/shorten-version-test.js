import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | shorten-version', function(hooks) {
  setupRenderingTest(hooks);

  test('it shortens version v3.2.0 to 3.2', async function(assert) {
    this.set('inputValue', 'v3.2.0');
    await render(hbs`{{shorten-version inputValue}}`);
    assert.dom(this.element).hasText('3.2');
  });

  test('it keeps version 3.2 without changes', async function(assert) {
    this.set('inputValue', '3.2');
    await render(hbs`{{shorten-version inputValue}}`);
    assert.dom(this.element).hasText('3.2');
  });
});
