module.exports = function (filepath) {
  // chops off whatever is after the final slash
  return filepath.substring(0, filepath.lastIndexOf('/'));
};
