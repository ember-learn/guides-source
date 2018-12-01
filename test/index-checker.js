const { expect } = require('chai');
const { extname, dirname, join } = require('path');
const { existsSync } = require('fs');
const walkSync = require('walk-sync');
const _ = require('lodash');

describe.only('check all links in markdown files', function () {
  const paths = _.chain(walkSync('guides'))
    .filter(filePath => extname(filePath) === '.md')
    .map(filePath => `guides/${filePath}`)
    .map(filePath => dirname(filePath))
    .uniq()
    .value();
  /**
   * Autogenerate some mocha tests
   */
  paths.forEach((filepath) => {
    it(`processing ${filepath}`, function () {
      expect(existsSync(join(filepath, 'index.md')), `${join(filepath, 'index.md')} must exist`).to.be.ok;
    });
  });
});
