# Maintainers

This document contains instructions and guidelines for maintainer tasks, like publishing and deploying new versions of the Guides.

## Continuous deployment

Whenever a PR is merged into `master`, Travis will automatically run the scripts that build the app and upload the results to Netlify. Netlify will then deploy the site. We currently allow only one Travis job at a time so that concurrent deploy commands do not cause a conflict.

## Deploying a new version

Whenever the release blog post is published for a new version of Ember, follow these steps.

### Before deployment of a new version

Check briefly to see if there are any PRs that should be merged into `/release/`, so that they are applied to both the new version we are about to deploy, and the previous version.

### To deploy a new version

It is required that all maintainers use 2FA (two factor authentication). These are the permissions needed for a deployment of the Guides:

- Merge permissions on the repository
- Percy dashboard

1. Run `npm run release:guides` and follow the script's instructions. At the end, the script will create a PR for releasing a new version of the Ember Guides.
9. In the newly created PR, mention that when it is merged, the person who merges it must update the guides search ASAP, and include a link to this page for instructions. Look at the app in staging, get a review, and merge to `master`. This will trigger an auto deployment.
10. Once it is deployed, follow the steps below to get the website search working for your new version.

### Updating the guides search

Currently getting the new version indexed and put in Algolia is a semi-manual step. There is currently work going on to try to make this automatic, see the [tracking issue here](https://github.com/ember-learn/guides-source/issues/487) to follow along with progress.

To proceed, run `yarn run release:search` and you will be presented with instructions.
