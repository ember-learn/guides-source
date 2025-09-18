import shell from 'shelljs';
import compareVersions from 'compare-versions';

import { exec as childProcessExec } from 'child_process';

import util from 'util';
const exec = util.promisify(childProcessExec);

const { BUILD_SINCE } = await import('../ember-cli-build.js');

const anyChanges = shell.exec('git status --porcelain');

if (anyChanges.stdout) {
  console.log(
    'This script calls `git clean -xdf` to clean your current working directory before running'
  );
  console.log(
    'You have some un-committed changes in your branch, please clean them up before continuing.'
  );
  // eslint-disable-next-line no-process-exit, no-undef
  process.exit(1);
}

shell.exec('git clean -xdf');

// this can't use shell.js because we cleared node_modules
await exec('pnpm i');

shell.exec('rm -r public/assets/*');
shell.exec('rm -rf public/v*');

shell.exec('ALL_VERSIONS=true ember build -prod');

shell.exec('cp -r dist/assets/* public/assets/');

shell
  .ls('dist')
  .filter((version) => version.startsWith('v'))
  .forEach(function (versionFolder) {
    if (compareVersions.compare(versionFolder, BUILD_SINCE, '<')) {
      shell.exec(`cp -r dist/${versionFolder} public`);
    }
  });
