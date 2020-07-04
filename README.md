[![Build Status](https://travis-ci.org/ember-learn/guides-source.svg?branch=master)](https://travis-ci.org/ember-learn/guides-source)
[![This project is using Percy.io for visual regression testing.](https://percy.io/static/images/percy-badge.svg)](https://percy.io/Ember/guides-app)

# Ember Guides Source

This repository contains the written content for the [Ember.js Guides](https://guides.emberjs.com). Contributors can file issues and submit pull requests (PRs) to help improve everyone's learning experience.

Looking for repositories for the other parts of [emberjs.com](https://emberjs.com)? Check out the [website](https://github.com/ember-learn/ember-website), [ember-api-docs](https://github.com/ember-learn/ember-api-docs), [super-rentals tutorial](https://github.com/ember-learn/super-rentals), [statusboard](https://github.com/ember-learn/statusboard), [deprecation-app](https://github.com/ember-learn/deprecation-app), and [styleguide](https://github.com/ember-learn/ember-styleguide).


## Contributing

Welcome and thanks for your help!

First-time contributors are encouraged to look at issues that are labeled **help wanted** or **good first issue**. If you have questions or want a buddy to pair with, you can join the [#dev-ember-learning channel](https://discordapp.com/channels/480462759797063690/480777444203429888) in the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for additional instructions on how to format your work and submit a PR.


## Project layout

The Ember Guides content are written in Markdown. Each minor version of Ember has its own directory within `/guides`.

In general, your PR should make edits to only the files in the `/guides/release` directory, which corresponds to the latest version of Ember. Exceptions may include fixing broken links and typos in older versions of the Ember Guides.

If you run `ember serve`, the Markdown files are turned into HTML to create an app. We use the following addons to make this happen:

- [ember-styleguide](https://github.com/ember-learn/ember-styleguide)
- [guidemaker](https://github.com/empress/guidemaker)
- [guidemaker-ember-template](https://github.com/ember-learn/guidemaker-ember-template)


## Local development

To run the Ember Guides app locally, type these commands into your terminal.

```bash
git clone git://github.com/ember-learn/guides-source.git

cd guides-source
npm install
ember serve
```

Afterwards, visit [http://localhost:4200](http://localhost:4200) on your browser.

Note: On Mac, if you get the error `Error: EMFILE: too many open files, watch`, try installing Watchman. Install [Homebrew](https://brew.sh/) if you don't have it. Then, in your terminal, run `brew install watchman`.


## Running tests

Use `npm test` to run tests locally. In addition to the Ember app, we check for broken links.

```bash
npm test
```

### Linting and spellchecking

The guides are spellchecked and linted for Markdown consistency. You can check your edits by running,

```bash
npm run lint:md
```

### Internal and external links

You can find broken internal (relative) and external links by running 3 commands:

```bash
# Check all internal links across all versions of the Guides
npm run test:node

# Check all external links in the `/guides/release` folder
npm run test:node-local

# Check all external links in the `/guides/release` folder,
# except for those to the API docs (https://api.emberjs.com)
npm run test:node-local-exclude-api-urls
```
