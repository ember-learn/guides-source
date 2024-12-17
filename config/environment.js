'use strict';

module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'ember-guides',
    environment,
    rootURL: '/',
    locationType: 'trailing-history',
    historySupportMiddleware: true,

    EmberENV: {
      EXTEND_PROTOTYPES: false,
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'ember-meta': {
      description:
        'Ember.js helps developers be more productive out of the box. Designed with developer ergonomics in mind, its friendly APIs help you get your job done—fast.',
    },

    'ember-showdown-shiki': {
      theme: 'github-dark',
      languages: [
        'bash',
        'css',
        'http',
        'javascript',
        'json',
        'json5',
        'ruby',
        'scss',
        'yaml',
        'typescript',
        'glimmer-js',
        'glimmer-ts',
        'handlebars',
      ],
    },

    guidemaker: {
      title: 'Ember Guides',
      sourceRepo: 'https://github.com/ember-learn/guides-source',
    },

    algolia: {
      algoliaId: 'Y1OMR4C7MF',
      algoliaKey: '5d01c83734dc36754d9e94cbf6f8964d',
      indexName: 'ember-guides',
    },

    showdown: {
      ghCompatibleHeaderId: true,
      prefixHeaderId: 'toc_',
    },

    deprecationsGuideURL: 'https://www.emberjs.com/deprecations/',

    metricsAdapters: [
      {
        name: 'GoogleAnalytics',
        environments: ['production'],
        config: {
          id: 'UA-27675533-1',
          require: ['linkid'],
        },
      },
    ],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
