const { normalize } = require('path');

/**
 * In order to know if a link in a markdown file is correct relative to the
 * markdown file's location, you have to combine the path of the md file
 * with the path of the link it contains.
 * This function takes a markdown file path like guides/v1.13.0/components/blah,
 * relative to the working directory where the script was run, and adds it together
 * with the relative link contained in the file, like ../templates/foo. path.normalize
 * is a Node method that takes a filepath like
 * guides/v1.13.0/components/blah/../templates/foo. path.normalize and resolves it
 * into guides/v1.13.0/templates/foo. The result is an absolute path with the
 * root of the working directory the script is running in. Finally, the trailing
 * slash is removed.
 * @type {[type]}
 */
module.exports = function (cleanedFilepath, cleanedLink) {
  return (normalize(`${cleanedFilepath}/${cleanedLink}`));
};
