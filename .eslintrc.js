module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember'
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended'
  ],
  env: {
    browser: true
  },
  rules: {
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    },
    // node tests
    {
      files: [
        'node-tests/**/*.js'
      ],
      env: {
        node: true,
        mocha: true
      },
      parserOptions: {
        ecmaVersion: 6
      },
      rules: {
        "func-names": 0,
        "prefer-arrow-callback": 0,
        "no-unused-expressions": 0
      },
    }
  ]
};
