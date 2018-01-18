const _ = require('lodash');
const { expect } = require('chai');
const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');

/*
  findMarkdownLinks takes a string filepath to a markdown file, relative to the
  working directory the script was run from. It returns an array of link strings
  found in the markdown.
*/
function findMarkdownLinks(filepath) {
  const markdown = fs.readFileSync(filepath).toString();
  return markdownLinkExtractor(markdown);
}

const {
  stripOffAnchorTags,
  removeTrailingSlash,
  removeMarkdownFileFromFilepath,
  computeLinkRelativeToWorkingDir,
  handleImageEdgeCases,
  checkIfPathExists,
} = require('./helpers');

/*
  pathIsValid takes in a path to a markdown file and a link contained in that file.
  It checks to see if the link is correct relative to the markdown file's path.
  Returns true if the link is an existing directory or markdown file.
*/
function pathIsValid(filepath, link) {
  let cleanedLink = stripOffAnchorTags(link);
  cleanedLink = removeTrailingSlash(cleanedLink);
  const cleanedFilepath = removeMarkdownFileFromFilepath(filepath);
  let normalized = computeLinkRelativeToWorkingDir(cleanedFilepath, cleanedLink);
  normalized = handleImageEdgeCases(normalized, link);
  // return true if it is a valid path to a directory OR markdown file.
  // No easy way to tell which is which, so try both
  return checkIfPathExists(normalized) || checkIfPathExists(`${normalized}.md`);
}

/*
  getBadRelativeUrl takes a file object like:
  {filepath: 'something/like/this.md', links: ['../a', '../b/c', 'd'] }
  and returns an array of objects containing a "bad" link and the path to the markdown file
  that contains it, like [{fileToFix: 'something/like/this.md', badLink: '../something'}, ...]
  The function iterates over each object's links array. For each link, it
  ignores any that are http, since the script only tests relative links.

  If the path to the link is incorrect relative to the working directory the
  script was run from, it is returned in the results.
*/

function getBadRelativeUrlsForFile(mdFile) {
  return _.chain(mdFile.links)
    .map((link) => {
      if (link.includes('http' || link[0] === '#')) {
        // skip it if it's a url or just an anchor tag
        return null;
      } else if (!pathIsValid(mdFile.filepath, link)) {
        return { fileToFix: mdFile.filepath, badLink: link };
      }
      return null;
    })
    .compact()
    .value();
}

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
