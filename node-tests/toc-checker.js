/* eslint-env node, mocha */
const guidemakerTocChecker = require('guidemaker-toc-checker');

describe.only('check all of the pages.yml files are correct', function () {
  guidemakerTocChecker();
});
