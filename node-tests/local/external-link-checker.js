const { expect } = require('chai');

/**
 * Autogenerate some mocha tests
 */

const walkSync = require('walk-sync');
const { extname } = require('path');
const { inspect } = require('util');
const {
  findMarkdownLinks,
  checkExternalLink,
  mapToLocalUrl,
  removeTrailingApostrophe,
  randomizeFetchDelays,
  sleep,
} = require('./../helpers');

function printBadLinks(badLinks) {
  return inspect(badLinks, { depth: null });
}

const releasePaths = walkSync('guides/release')
  .filter((filePath) => extname(filePath) === '.md')
  .map((filePath) => `guides/release/${filePath}`);

/**
 * The do not check list is a list of known URL's that will fail, but are still
 * considered ok.  They include links such as follow-along URL's contained in
 * prose that allow learners to easily open their browsers to relevant local
 * development page, or other known 'safe' links that do not need to be checked.
 *
 * @type {Array}
 */
const doNotCheckList = [
  'http://localhost:4200',
  'https://codepen.io/melsumner/live/ZJeYoP', // codepen does not play with fetch api
  'https://www.ember-cli-mirage.com/docs/testing/acceptance-tests', // results in an initial 404, but forwards to the correct path
];

describe('check all external links in markdown files', function () {
  const skipApiUrls =
    'FOLLOW_API_URLS' in process.env && process.env.FOLLOW_API_URLS === 'false';

  releasePaths.forEach((filePath) => {
    it(`processing ${filePath}`, async function () {
      this.timeout(60000); // high for slow networks and pages with a lot of external links

      const externalLinks = findMarkdownLinks(filePath)
        .filter((link) => link.startsWith('http')) // should have more robust regex
        .filter((link) => {
          const canSkipCheck = doNotCheckList.some((address) =>
            link.startsWith(address),
          );
          return !canSkipCheck;
        })
        .filter(
          (link) =>
            !(skipApiUrls && link.toLowerCase().includes('api.emberjs.com')),
        )
        .map(mapToLocalUrl)
        .map(removeTrailingApostrophe)
        .map(randomizeFetchDelays);

      let responses = [];

      for (let i = 0; i < externalLinks.length; i++) {
        await sleep(externalLinks[i].delay);
        responses.push(await checkExternalLink(externalLinks[i].url));
      }

      const errors = responses.filter((result) => result != null);

      expect(errors, printBadLinks(errors)).to.be.an('array').to.be.empty;
    });
  });
});
