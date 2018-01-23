module.exports = function (link) {
  return link.includes('#') ? link.substring(0, link.lastIndexOf('#')) : link;
};
