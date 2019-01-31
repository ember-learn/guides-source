module.exports = function (filepath) {
  // chops off whatever is after the final slash
  return filepath.replace(/\.md$/, '/');
};
