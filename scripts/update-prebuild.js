const shell = require('shelljs');
const compareVersions = require('compare-versions');

const { BUILD_SINCE } = require('../ember-cli-build');

shell.exec('rm public/assets/*');
shell.exec('rm -rf public/v*');

shell.exec('ALL_VERSIONS=true ember build -prod');

shell.exec('cp -r dist/assets/ember-guides-* public/assets/')
shell.exec('cp -r dist/assets/vendor-* public/assets/')

shell.ls('dist').filter(version => version.startsWith('v')).forEach(function (versionFolder) {
  if(compareVersions.compare(versionFolder, BUILD_SINCE, '<')) {
    shell.exec(`cp -r dist/${versionFolder} public`)
  }
});
