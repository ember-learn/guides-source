const _ = require('lodash');

const pathIsValid = require('./pathIsValid');

/**
 * getBadRelativeUrl takes a file object like:
 * {filepath: 'something/like/this.md', links: ['../a', '../b/c', 'd'] }
 * and returns an array of objects containing a "bad" link and the path to the markdown file
 * that contains it, like [{fileToFix: 'something/like/this.md', badLink: '../something'}, ...]
 * The function iterates over each object's links array. For each link, it
 * ignores any that are http, since the script only tests relative links.
 *
 * If the path to the link is incorrect relative to the working directory the
 * script was run from, it is returned in the results.
 * @param  {[type]} mdFile [description]
 * @return {[type]}        [description]
 */
module.exports = function getBadRelativeUrlsForFile(mdFile) {
  return _.chain(mdFile.links)
    .map((link) => {
      // skip it if it's a url or just an anchor tag
      if (link.includes('http' || link[0] === '#')) {
        return null;
      }

      // this function is only for checking relative urls
      if (!link.startsWith('../')) {
        return null;
      }

      if (!pathIsValid(mdFile.filepath, link)) {
        return { fileToFix: mdFile.filepath, badLink: link };
      }

      // no issues found
      return null;
    })
    .compact()
    .value();
};
