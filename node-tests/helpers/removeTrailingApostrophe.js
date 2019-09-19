module.exports = function (url) {
  // strip encoded trailing apostrophe ('). $ is regex for "end of string"
	// links that fall into this category are those that are contained within code
	// snippets
  return url.replace(/&#39;$/, '');
};
