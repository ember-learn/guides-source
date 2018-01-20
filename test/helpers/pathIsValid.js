const stripOffAnchorTags = require('./stripOffAnchorTags');
const removeTrailingSlash = require('./removeTrailingSlash');
const removeMarkdownFileFromFilepath = require('./removeMarkdownFileFromFilepath');
const computeLinkRelativeToWorkingDir = require('./computeLinkRelativeToWorkingDir');
const handleImageEdgeCases = require('./handleImageEdgeCases');
const checkIfPathExists = require('./checkIfPathExists');

/**
 * pathIsValid takes in a path to a markdown file and a link contained in that file.
 * It checks to see if the link is correct relative to the markdown file's path.
 * Returns true if the link is an existing directory or markdown file.
 * @param  {[type]} filepath [description]
 * @param  {[type]} link     [description]
 * @return {[type]}          [description]
 */
module.exports = function pathIsValid(filepath, link) {
  let cleanedLink = stripOffAnchorTags(link);
  cleanedLink = removeTrailingSlash(cleanedLink);
  const cleanedFilepath = removeMarkdownFileFromFilepath(filepath);
  let normalized = computeLinkRelativeToWorkingDir(cleanedFilepath, cleanedLink);
  normalized = handleImageEdgeCases(normalized, link);
  // return true if it is a valid path to a directory OR markdown file.
  // No easy way to tell which is which, so try both
  return checkIfPathExists(normalized) || checkIfPathExists(`${normalized}.md`);
};
