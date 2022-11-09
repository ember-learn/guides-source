Anyone can participate in adding new features to Ember. This guide will
provide some background information for developers who want to
contribute to the core [`ember.js` codebase](https://github.com/emberjs/ember.js).

## RFCs

New features begin as RFCs (Request for Comments).
The RFC process is how community members and core team members
propose changes, such as adding new features or
making deprecations.

You can see work-in-progress proposals in the
[Ember RFCs repository Pull Requests](https://github.com/emberjs/rfcs/pulls),
and participate in giving feedback.
[Merged RFCs](https://emberjs.github.io/rfcs/) are proposals
that can move forward with implementation.
You can reach out to an RFC author to find out how to
get involved.

You can also [learn how to write your own RFC](https://github.com/emberjs/rfcs#ember-rfcs).

## Background information

Here are some tips for working in the [`ember.js` repository](https://github.com/emberjs/ember.js).

To learn how to make a pull request, review the
[`CONTRIBUTING.md`](https://github.com/emberjs/ember.js/blob/master/CONTRIBUTING.md)
instructions.

In general, new feature development should be done on the `master` branch.

Bugfixes should not introduce new APIs or break existing APIs, and do
not need feature flags.

Features can introduce new APIs, and need feature flags. They should not
be applied to the release or beta branches, since SemVer requires
bumping the minor version to introduce new features.

Security fixes should not introduce new APIs, but may, if strictly
necessary, break existing APIs. Such breakages should be as limited as
possible.

## Bug Fixes

### Urgent Bug Fixes

Urgent bugfixes are bugfixes that need to be applied to the existing
release branch. If possible, they should be made on master and prefixed
with `[BUGFIX release]`.

### Beta Bug Fixes

Beta bugfixes are bugfixes that need to be applied to the beta branch.
If possible, they should be made on master and tagged with `[BUGFIX
beta]`.

### Security Fixes

Security fixes need to be applied to the beta branch, the current
release branch, and the previous tag. If possible, they should be made
on master and tagged with `[SECURITY]`.

## Features

Features must always be wrapped in a feature flag. Tests for the feature
must also be wrapped in a feature flag.

Because the build-tools will process feature-flags, flags must use
precisely this format. We are choosing conditionals rather than a block
form because functions change the surrounding scope and may introduce
problems with early return.

```javascript
if (Ember.FEATURES.isEnabled("feature")) {
  // implementation
}
```

Tests will always run with all features on, so make sure that any tests
for the feature are passing against the current state of the feature.

### Commits

Commits related to a specific feature should include  a prefix like
`[FEATURE htmlbars]`. This will allow us to quickly identify all commits
for a specific feature in the future. Features will never be applied to
beta or release branches. Once a beta or release branch has been cut, it
contains all of the new features it will ever have.

If a feature has made it into beta or release, and you make a commit to
master that fixes a bug in the feature, treat it like a bugfix as
described above.

### Feature Naming Conventions

```javascript {data-filename=config/environment.js}
Ember.FEATURES['<packageName>-<feature>'] // if package specific
Ember.FEATURES['container-factory-injections']
Ember.FEATURES['htmlbars']
```

## Builds

The Canary build, which is based off master, will include all features,
guarded by the conditionals in the original source. This means that
users of the canary build can enable whatever features they want by
enabling them before creating their Ember.Application.

```javascript {data-filename=config/environment.js}
module.exports = function(environment) {
  let ENV = {
    EmberENV: {
      FEATURES: {
        htmlbars: true
      }
    },
  }
}
```

### `features.json`

The root of the repository will contain a `features.json` file, which will
contain a list of features that should be enabled for beta or release
builds.

This file is populated when branching, and may not gain additional
features after the original branch. It may remove features.

```javascript
{
  "htmlbars": true
}
```

The build process will remove any features not included in the list, and
remove the conditionals for features in the list.

### Continuous Integration Tests

For a new PR:

1. Tests will run against master with all feature flags on.
2. If a commit is tagged with `[BUGFIX beta]`, the commit will be
   cherry-picked into beta, and the automated tests will be executed on that
   branch. If the commit doesn't apply cleanly or the tests fail, the
   build will fail.
3. If a commit is tagged with `[BUGFIX release]`, the commit will be cherry-picked
   into release, and the tests will be executed on the release branch. If the commit
   doesn't apply cleanly or the tests fail, the build will fail.

For a new commit to master:

1. Tests will be executed as described above.
2. If the build passes, the commits will be cherry-picked into the
   appropriate branches.

The idea is that new commits should be submitted as PRs to ensure they
apply cleanly when a PR is merged.

### Go/No-Go Process

Every six weeks, the core team goes through the following process.

#### Beta Branch

All remaining features on the beta branch are vetted for readiness. If
any feature isn't ready, it is removed from `features.json`.

Once this is done, the beta branch is tagged and merged into release.

#### Master Branch

All features on the master branch are vetted for readiness. In order for
a feature to be considered "ready" at this stage, it must be ready as-is
with no blockers. Features are a no-go even if they are close and
additional work on the beta branch would make it ready.

Because this process happens every six weeks, there will be another
opportunity for a feature to make it soon enough.

Once this is done, the master branch is merged into beta. A
`features.json` file is added with the features that are ready.

### Beta Releases

Every week, we repeat the Go/No-Go process for the features that remain
on the beta branch. Any feature that has become unready is removed from
the `features.json`.

Once this is done, a Beta release is tagged and pushed.
