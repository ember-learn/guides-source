const { realpathSync } = require('fs');

module.exports = function getFileRealPath(s) {
  try {
    return realpathSync(s);
  } catch (e) {
    return false;
  }
};
