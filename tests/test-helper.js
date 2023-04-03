import Application from 'ember-guides/app';
import config from 'ember-guides/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';


setup(QUnit.assert);

setApplication(Application.create(config.APP));

setup(QUnit.assert);

start();
