const stripOffAnchorTags = require('./stripOffAnchorTags');
const removeTrailingIndex = require('./removeTrailingIndex');
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
  const endsWithSlashRegex = /\/(#[\w-_]+)?$/;
  const endsWithSlash = endsWithSlashRegex.test(link);

  if (!endsWithSlash) {
    return false;
  }

  const cleanedLink = stripOffAnchorTags(link);
  let cleanedFilepath = removeMarkdownFileFromFilepath(filepath);
  cleanedFilepath = removeTrailingIndex(cleanedFilepath);

  let normalized = computeLinkRelativeToWorkingDir(
    cleanedFilepath,
    cleanedLink,
  );
  normalized = handleImageEdgeCases(normalized, link);

  // return true if it is a valid path to a directory OR markdown file.
  // No easy way to tell which is which, so try both
  return (
    checkIfPathExists(normalized.replace(/\/$/, '.md')) ||
    checkIfPathExists(`${normalized}/index.md`)
  );
};
