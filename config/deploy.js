/* eslint-env node */
'use strict';

let credentials;

try {
  // eslint-disable-next-line n/no-missing-require
  credentials = require('./credentials.json');
} catch (e) {
  credentials = {};
}

module.exports = function (deployTarget) {
  let ENV = {
    build: {},
    'prember-algolia': {
      indexName: credentials.algoliaIndex || process.env.ALGOLIA_INDEX,
      applicationId:
        credentials.algoliaApplication || process.env.ALGOLIA_APPLICATION,
      apiKey: credentials.algoliaKey || process.env.ALGOLIA_KEY,
      tagsToExclude: '.old-version-warning,.edit-page,code,pre',
      cssSelector: 'section',
      versionsToIgnore: ['1.x', '2.x'],
      versionPattern: /^(v\d+\.\d+\.\d+)\//,
      pathPattern: /^v\d+\.\d+\.\d+\/(.*)\/index.html$/,
    },
  };

  if (deployTarget === 'development') {
    ENV.build.environment = 'development';
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
