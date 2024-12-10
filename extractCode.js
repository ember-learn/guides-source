/* eslint-env node */
/* eslint no-console:0 */

const walkSync = require('walk-sync');
const _ = require('lodash');
const codeBlocks = require('gfm-code-blocks');
const { extname, join, dirname } = require('path');
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');

// these regexs are used against the lang definition of a code block to identify
// the language. If you only want to check certain types then you should change
// this line
const templatesMatch =
  /^(handlebars|html|text|javascript|bash|sh|css|hbs|json|apacheconf)/;

const mdFiles = _.chain(walkSync('guides/release'))
  .filter((path) => extname(path) === '.md')
  .value();

mdFiles.forEach((filename) => {
  const source = readFileSync(
    join(__dirname, 'guides', 'release', filename),
    'utf-8',
  );
  // console.log(filename);
  const blocks = codeBlocks(source);

  const codeOnly = blocks.reduce((prev, current) => {
    if (!current.lang) {
      console.error(`Missing lang in code block on ${filename}`);
    }

    if (current.lang.match(templatesMatch)) {
      return `${prev}\n\n${current.block}`;
    }

    console.log(`Ignoring language ${current.lang}`);
    return prev;
  }, '');

  if (codeOnly) {
    const newFilename = join(__dirname, 'code', filename);

    if (!existsSync(dirname(newFilename))) {
      mkdirSync(dirname(newFilename), {
        recursive: true,
      });
    }

    writeFileSync(join(__dirname, 'code', filename), codeOnly);
  }
});
