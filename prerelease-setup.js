/* eslint-env node, mocha */
const glob = require('glob');
const del = require('del');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');
const process = require('process');

console.log('Begin: Prerelease');

const prevReleaseFolders = glob.sync('guides/!(release|versions.yml)');
del.sync(prevReleaseFolders);
del.sync(['app', 'node-tests', 'tests']);

const versionsFile = path.join(process.cwd(), 'guides/versions.yml');
const guidesVersionDoc = YAML.parse(fs.readFileSync(versionsFile, 'utf8'));

guidesVersionDoc.allVersions = [guidesVersionDoc.allVersions.pop()];
fs.writeFileSync(versionsFile, YAML.stringify(guidesVersionDoc));

console.log('Completed: Prerelease');
