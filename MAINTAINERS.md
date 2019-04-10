# Maintainers

This document contains instructions and guidelines for maintainer tasks, like publishing and deploying new versions of the Guides.

## Before deployment of a new version

- Check briefly to see if there are any PRs that should be merged in
- Make sure that if PRs were merged into an earlier version, they have also been included in the version you are about to release. This is a manual process at the moment.

## To deploy a new version

It is required that all maintainers use 2FA (two factor authentication). These are the permissions needed for a deployment of the Guides:

- npm admin or contributor
- Merge permissions on the repository
- Percy dashboard

If you are lacking any permissions, post in the learning team channel on Slack.

When you have all those permissions set up:

1. Clone the guides-source repository to your local machine
2. Double check that you have the latest commits on `master`
3. Edit `versions.yml` - add the version number to _both_ the end of the list and the `currentVersion`. The last item and `currentVersion` should match.
4. Commit the change.
5. If you don't have it already, install `np` with `npm install -g np`
6. `npm login`
7. The following command will begin the build when executed from the root of the guides-source repo: `np`
8. When prompted, choose `minor`
9. In about 5 minutes, you will see a PR from dependabot on guides-app. Here is an [example](https://github.com/ember-learn/guides-app/pull/186). After the tests pass, merge it. If content has changed significantly, Percy visual CI may indicate changes, so use the dashboard to review. Follow the link in the CI notifications.
10. Check to make sure the deployment was successful before you walk away. It will take some time to deploy.
11. Party!

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

  
