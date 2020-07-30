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

#### Minor versions

To release a new minor version, you can use the `npm run releases:guides:minor` command.
The script will create and update the necessary files for you, showing you a URL at the end that you can use to create the PR.

0. Run `npm install` to guarantee dependencies are installed.
1. Run `npm run release:guides:minor`. The script is a mix of automated and manual steps, so follow the instructions carefully.
2. In the PR, mention that **the person who merges it must update the guides search ASAP**. Add a link to this page for instructions on updating the guides search. Look at the app in staging, get a review, and merge to `master`. This will trigger an auto deployment.
3. Once it is deployed, follow the steps below to get the website search working for your new version.

#### Major versions

Currently only minor version releases are scripted.
To make a major version release, please follow the steps in `scripts/create-new-minor-version` manually, adjusting the command for the major version.

### Updating the guides search

Currently getting the new version indexed and put in Algolia is a semi-manual step. There is currently work going on to try to make this automatic, see the [tracking issue here](https://github.com/ember-learn/guides-source/issues/487) to follow along with progress.

To proceed, run `npm run release:search` and you will be presented with instructions.
This will compile the search indices for the current release version and publish them to the Algolia instance.
