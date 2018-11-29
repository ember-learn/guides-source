const { expect } = require('chai');


/**
 * Autogenerate some mocha tests
 */

const walkSync = require('walk-sync');
const { extname } = require('path');
const { inspect } = require('util');
const {
  findMarkdownLinks,
  getBadRelativeUrlsForFile,
  getBadLineBreaks,
  getBadImageUrls,
  getNonRelativeGuidesLinks,
} = require('./helpers');

const paths = walkSync('guides')
  .filter(filePath => extname(filePath) === '.md')
  .map(filePath => `guides/${filePath}`);

function printBadLinks(badLinks) {
  return inspect(badLinks, { depth: null });
}

describe('check all links in markdown files', function () {
  paths.forEach((filepath) => {
    it(`processing ${filepath}`, function () {
      const links = findMarkdownLinks(filepath);
      const badLinks = getBadRelativeUrlsForFile({
        filepath,
        links,
      });
      const nonRelativeGuidesLinks = getNonRelativeGuidesLinks(filepath, links);
      expect(nonRelativeGuidesLinks, printBadLinks(nonRelativeGuidesLinks)).to.be.empty;

      expect(badLinks, printBadLinks(badLinks)).to.be.empty;

      const badLineBreaks = getBadLineBreaks(filepath);
      expect(badLineBreaks, printBadLinks(badLineBreaks)).to.be.empty;

      const badImageLinks = getBadImageUrls({
        filepath,
        links,
      });

      expect(badImageLinks, printBadLinks(badImageLinks)).to.be.empty;
    });
  });
});

