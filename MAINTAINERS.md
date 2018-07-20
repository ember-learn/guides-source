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
- Heroku pipeline access

If you are lacking any permissions, post in the learning team channel on Slack.

When you have all those permissions set up:

1. Clone the guides-source repository to your local machine
2. Double check that you have the latest commits on `master`
3. Edit `versions.yml` - add the version number to _both_ the end of the list and the `currentVersion`. The last item and `currentVersion` should match.
4. Commit the change.
5. If you don't have it already, install `np` with `npm install -g np`
6. `npm login`
7. The following command will begin the build when executed from the content of guides-source: `np`
8. When prompted, choose `minor`
9. In about 5 minutes, you will see a PR from dependabot on guides-app. Here is an [example](https://github.com/ember-learn/guides-app/pull/186). After the tests pass, merge it. If content has changed significantly, Percy visual CI may indicate changes, so use the dashboard to review. Follow the link in the CI notifications.
10. Next, open the [heroku pipeline](https://dashboard.heroku.com/pipelines/34336875-328f-42c8-ab5c-44a8182f6a5c). Do not click promote to production! In the production column, click on the arrows icon, choose deploy a branch, and master. 
11. Check to make sure the deployment was successful before you walk away. It will take some time to deploy.
12. Party!