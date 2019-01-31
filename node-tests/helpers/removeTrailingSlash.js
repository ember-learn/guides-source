module.exports = function (cleanedLink) {
  // strip trailing slash. $ is regex for "last"
  return cleanedLink.replace(/\/$/, '');
};
