
## Ember Guides Source

This repository contains the written content
for the [Ember.js Guides](https://guides.emberjs.com). 
Here, contributors can file issues and submit PRs to 
help improve the learning experience of other developers.
The markdown files in this repository are fetched and
displayed by the [guides-app](https://github.com/ember-learn/guides-app). 

Looking for repositories for the other parts of [emberjs.com](https://emberjs.com)]? 
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
want a buddy to pair with, you can join the #-team-learning channel
in the [Ember Community Slack](https://ember-community-slackin.herokuapp.com/).

## Project layout

The Guides content takes the form of Markdown files (just like most READMEs).
Each minor version of Ember has its own directory within `/guides/`.
Pull requests should make edits to only the latest version of Ember,
except in the case of bug reports for broken links.

## Local Development
To see your changes locally, you need two repositories on your
computer. This repository, `guides-source` is made of only markdown files,
so you will need to run the 
[guides-app](https://github.com/ember-learn/guides-app).

```sh
git clone git://github.com/ember-learn/guides-app.git
git clone git://github.com/ember-learn/guides-source.git
cd guides-app
yarn install
ember server
```
