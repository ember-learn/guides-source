const _ = require('lodash');

const checkIfPathExists = require('./checkIfPathExists');

module.exports = function getBadRelativeUrlsForFile(mdFile) {
  const badImages = _.chain(mdFile.links)
    .filter(link => link.endsWith('.png') || link.endsWith('.gif'))
    .map((link) => {
      // ignore external images
      if (link.startsWith('http://') || link.startsWith('https://')) {
        return null;
      }
      // all links need to be absolute
      if (!link.startsWith('/')) {
        return { fileToFix: mdFile.filepath, badImageLink: link, reason: 'not absolute path' };
      }

      if (!checkIfPathExists(`public/${link}`)) {
        return { fileToFix: mdFile.filepath, badImageLink: link, reason: 'file does not exist' };
      }

      // no issues found
      return null;
    })
    .compact()
    .value();

  const traillingSlashImages = _.chain(mdFile.links)
    .filter(link => link.endsWith('.png/') || link.endsWith('.gif/'))
    .map(link => ({
      fileToFix: mdFile.filepath,
      badImageLink: link,
      reason: 'extra trailing slash on image',
    }))
    .compact()
    .value();

  return _.concat(badImages, traillingSlashImages);
};
