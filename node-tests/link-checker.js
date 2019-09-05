const { expect } = require('chai');

/**
 * Autogenerate some mocha tests
 */

const walkSync = require('walk-sync');
const { extname } = require('path');
const { inspect } = require('util');
const {
  findMarkdownLinks,
  getBadRelativeUrlsForFile,
  getBadLineBreaks,
  getBadImageUrls,
  getNonRelativeGuidesLinks,
	checkExternalLink,
	mapToLocalUrl,
	removeTrailingApostrophe,
	randomizeFetchDelays,
	sleep
} = require('./helpers');

const paths = walkSync('guides')
  .filter(filePath => extname(filePath) === '.md')
  .map(filePath => `guides/${filePath}`);

function printBadLinks(badLinks) {
  return inspect(badLinks, { depth: null });
}

describe('check all internal links in markdown files', function () {
  paths.forEach((filepath) => {
    it(`processing ${filepath}`, function () {
      const links = findMarkdownLinks(filepath);
      const badLinks = getBadRelativeUrlsForFile({
        filepath,
        links,
      });
      const nonRelativeGuidesLinks = getNonRelativeGuidesLinks(filepath, links);
      expect(nonRelativeGuidesLinks, printBadLinks(nonRelativeGuidesLinks)).to.be.empty;

      expect(badLinks, printBadLinks(badLinks)).to.be.empty;

      const badLineBreaks = getBadLineBreaks(filepath);
      expect(badLineBreaks, printBadLinks(badLineBreaks)).to.be.empty;

      const badImageLinks = getBadImageUrls({
        filepath,
        links,
      });

      expect(badImageLinks, printBadLinks(badImageLinks)).to.be.empty;
    });
  });
});

const releasePaths = walkSync('guides/release')
  .filter(filePath => extname(filePath) === '.md')
  .map(filePath => `guides/release/${filePath}`);

/**
 * The do not check list is a list of known URL's that will fail, but are still
 * considered ok.  They include links such as follow-along URL's contained in
 * prose that allow learners to easily open their browsers to relevant local
 * development page, or other known 'safe' links that do not need to be checked.
 *
 * @type {Array}
 */
const doNotCheckList = [
	'http://localhost:4200', // getting-started/quick-start
	'http://localhost:4200/scientists', // generating routes, link to open local server route
	'http://localhost:4200/contact', // model hook tutorial code snippet
	'http://localhost:4200/about', // model hook tutorial code snippet
	'http://localhost:4200/about/', // routes and tempaltes
	'https://codepen.io/melsumner/live/ZJeYoP' // ...codepen does not play with fetch api.
]

describe('check all external links in markdown files', function () {
  releasePaths.forEach((filepath) => {
    it(`processing ${filepath}`, async function () {
			this.timeout(20000); // high for slow networks and pages with a lot of external links

			const externalLinks = findMarkdownLinks(filepath)
				.filter((link) => link.startsWith("http")) // should have more robust regex
				.filter((link) => !doNotCheckList.includes(link))
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
