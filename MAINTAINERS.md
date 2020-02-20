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

1. Clone the guides-source repository to your local machine
2. Make sure you have a clean git history with `git status`
3. Get the latest commits on `master` using `git pull origin master`
4. Make a branch, i.e. `git checkout -b release-new-version`
5. Create a directory in `guides` for the version that is one less than the "lastest." For example, if the newest release of Ember is `3.9`, you will make a directory for `3.8` that is a copy of `release`. `mkdir guides/vX.Y.0`
6. Copy the contents of `guides/release/` into the new directory, `cp -r release/* vX.Y.0/`
7. Edit `versions.yml` - add the version number to _both_ the end of the list and the `currentVersion`. The last item and `currentVersion` should match.
8. Double check that the new directory that you made is the latest release minus one. Commit the changes and push your branch.
9. Create a PR, and in the comments, mention that when it is merged, the person who merges it must update the guides search ASAP, and include a link to this page for instructions. Look at the app in staging, get a review, and merge to `master`. This will trigger an auto deployment.
10. Once it is deployed, follow the steps below to get the website search working for your new version.

### Updating the guides search

1. Using the GitHub Releases page, create a git tag for the release version, i.e. `v3.16.0`. Tagging a release using any tag name triggers a github action that'll take care of updating the indexes.
1. Before you walk away, you should check the guides app in production and see if you can search for something on the latest version
1. Party some more 🎉 and let the rest of the team know that the updates have been made.
