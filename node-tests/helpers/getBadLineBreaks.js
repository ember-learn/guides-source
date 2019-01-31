const fs = require('fs');

module.exports = function findBadLineBreaks(filepath) {
  const markdown = fs.readFileSync(filepath).toString();

  return [
    // urls that have a newline between the ] and (
    /\]\n\(/.test(markdown),

    // to be safe, also search where \s is a whitespace
    /\]\n\s\(/.test(markdown),
    /\]\s\n\s\(/.test(markdown),
  ].filter(Boolean);
};
