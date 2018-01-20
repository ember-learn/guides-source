const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');

/**
 * findMarkdownLinks takes a string filepath to a markdown file, relative to the
 * working directory the script was run from. It returns an array of link strings
 * found in the markdown.
 * @param  {[type]} filepath [description]
 * @return {[type]}          [description]
 */
module.exports = function findMarkdownLinks(filepath) {
  const markdown = fs.readFileSync(filepath).toString();
  return markdownLinkExtractor(markdown);
};
