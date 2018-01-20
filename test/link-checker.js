const { expect } = require('chai');

const { getBadRelativeUrlsForFile, findMarkdownLinks } = require('./helpers');

/**
 * Autogenerate some mocha tests
 */

const walkSync = require('walk-sync');
const { extname } = require('path');
const { inspect } = require('util');

const paths = walkSync('guides')
  .filter(filePath => extname(filePath) === '.md')
  .map(filePath => `guides/${filePath}`);

function printBadLinks(badLinks) {
  return inspect(badLinks, { depth: null });
}

describe('check all links in markdown files', function () {
  paths.forEach((filepath) => {
    it(`processing ${filepath}`, function () {
      const badLinks = getBadRelativeUrlsForFile({
        filepath,
        links: findMarkdownLinks(filepath),
      });

      expect(badLinks, printBadLinks(badLinks)).to.be.empty;
    });
  });
});
