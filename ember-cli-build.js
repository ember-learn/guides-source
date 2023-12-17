'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

// All versions since this one will be built on every PR or locally
// it should probably be no older than 2 LTS versions.
// If you need to update older pre-built versions then you can run
// npm run build:prebuilt
const BUILD_SINCE = '4.8.0';

let guidemakerConfig = {};

if (!process.env.ALL_VERSIONS) {
  guidemakerConfig.premberVersionFilter = BUILD_SINCE;
}

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    fingerprint: {
      extensions: ['js', 'css', 'map'],
      exclude: ['downloads'],
    },
    guidemaker: guidemakerConfig,
    autoImport: {
      // taken from https://github.com/discourse/discourse/pull/18907/files
      webpack: {
        output: {
          // Workaround for https://github.com/ef4/ember-auto-import/issues/519
          // Upstreamed in https://github.com/ef4/ember-auto-import/pull/548
          filename: `chunk.[id].[contenthash].js`,
          chunkFilename: `chunk.[id].[contenthash].js`,
        },
        optimization: {
          // Workaround to provide deterministic chunk output
          // See https://github.com/ef4/ember-auto-import/issues/478#issuecomment-1000526638
          moduleIds: 'size',
        },
      },
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};

module.exports.BUILD_SINCE = BUILD_SINCE;
