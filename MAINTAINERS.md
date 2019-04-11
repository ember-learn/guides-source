# Maintainers

This document contains instructions and guidelines for maintainer tasks, like publishing and deploying new versions of the Guides.

## Before deployment of a new version

- Check briefly to see if there are any PRs that should be merged into the previous Guides version

## To deploy a new version

It is required that all maintainers use 2FA (two factor authentication). These are the permissions needed for a deployment of the Guides:

- Merge permissions on the repository
- Percy dashboard

1. Clone the guides-source repository to your local machine
2. Make sure you have a clean git history with `git status`
3. Get the latest commits on `master` using `git pull origin master`
4. Create a directory in `guides` for the version that is one less than the "lastest." For example, if the newest release of Ember is `3.9`, you will make a directory for `3.8` that is a copy of `release`.
5. Copy the contents of `guides/release/` into the new directory, `cp -r release vX.Y.Z`
6. Edit `versions.yml` - add the version number to _both_ the end of the list and the `currentVersion`. The last item and `currentVersion` should match.
7. Commit the change.
8. Create a PR, check the app in staging, get a review, and merge to `master`. This will trigger an auto deployment.
9. Once it is deployed, follow the steps below to get the website search working for your new version.

## After deploying a new version

Currently getting the new version indexed and put in Algolia is a manual step. There is currently work going on to try to make this automatic, see the [tracking issue here](https://github.com/ember-learn/guides-source/issues/487) to follow along with progress.

Before we get started you need to login to the Algolia dashboard to get the API key. You login, click `API Keys` and then copy `Write API Key`. Once you have it you need to create the file `config/credentials.json` with the following content: 

```json
{
  "algoliaKey": "<algolia-key>",
  "algoliaIndex": "ember-guides",
  "algoliaApplication": "Y1OMR4C7MF"
}
```

Next let's make sure that you have pulled the latest changes after the new version PR has been merged into master

```
git checkout master
git pull
```

I would now recommend that you make sure that you don't have any local changes using `git stash` because we're going to be a bit distructive (temporarily)

1. Delete all guides folders apart from `release` i.e. everything that starts with a `v`
  - cd guides
  - rm -rf v*
2. Open versions.yml and delete everything in `allVersions` apart from the latest version (that has just been released) 
3. Make sure `config/credentials.json` is in place as described above
  - you may have accidently deleted this since last time as it is supposed to be ignored by git
4. Open `config/environment.js` and delete the `versionsToIgnore` line in the `prember-algolia` config
5. run `ember deploy production`
6. This should now be done, you can fix your local repo by running `git reset --hard HEAD`
7. Before you walk away, you should check the guides app in production and see if you can search for something on the latest version
8. Party some more 🎉

  
