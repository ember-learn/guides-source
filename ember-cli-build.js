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

  return app.toTree();
};

module.exports.BUILD_SINCE = BUILD_SINCE;
