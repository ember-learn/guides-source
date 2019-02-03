
## Ember Guides Source [![Build Status](https://travis-ci.org/ember-learn/guides-source.svg?branch=master)](https://travis-ci.org/ember-learn/guides-source)

This repository contains the written content
for the [Ember.js Guides](https://guides.emberjs.com). 
Here, contributors can file issues and submit PRs to 
help improve the learning experience of other developers.

Looking for repositories for the other parts of [emberjs.com](https://emberjs.com)? 
Check out
[website](https://github.com/emberjs/website),
[ember-api-docs](https://github.com/ember-learn/ember-api-docs),
[super-rentals tutorial](https://github.com/ember-learn/super-rentals),
[statusboard](https://github.com/ember-learn/statusboard),
[deprecation-app](https://github.com/ember-learn/deprecation-app),
and [styleguide](https://github.com/ember-learn/ember-styleguide).

## Contributing

Welcome and thanks for your help! Please see [CONTRIBUTING.md](CONTRIBUTING.md)
for detailed instructions on how to format your work and submit a Pull Request.
First-time contributors are encouraged to choose issues that are labeled 
"help wanted" or "good for new contributors." If you have questions or
want a buddy to pair with, you can join the 
[dev-ember-learning channel](https://discordapp.com/channels/480462759797063690/480777444203429888)
in the [Ember Community Discord](https://discordapp.com/invite/zT3asNS).


## Project layout

The Guides content takes the form of Markdown files (just like most READMEs).
Each minor version of Ember has its own directory within `/guides/`.
Pull requests should make edits to only the latest version of Ember,
except in the case of bug reports for broken links.
On `ember serve`, the Markdown files are turned into HTML
to create an app. Most of the functionality comes from 
[guidemaker](https://github.com/empress/guidemaker) and 
[guidemaker-ember-template](https://github.com/ember-learn/guidemaker-ember-template).
The styles come from [ember-styleguide](https://github.com/ember-learn/ember-styleguide),
the shared home of components and stylesheets used throughout the family of 
Ember sites.

## Local Development

```sh
git clone git://github.com/ember-learn/guides-source.git

cd guides-source
npm install
ember serve
```

## Running tests

Use `npm` to run tests instead of `ember`, since we have additional
tests like spellchecking that are not part of The Ember app's tests.

```
npm install
npm test
```

### Linting and spellchecking

The guides are spellchecked and linted for Markdown consistency. You can test your contributions by running `npm run lint::md`. Linting and spellchecking must pass or they will fail in Travis-CI.  See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on linting and spellchecking.
