module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
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
        'lib/*/index.js',
        'server/**/*.js'
      ],
      parserOptions: {
        sourceType: 'script'
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
