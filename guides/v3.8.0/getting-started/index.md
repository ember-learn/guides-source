Getting started with Ember is easy. Ember projects are created and managed
through our command line build tool Ember CLI.
This tool provides:

* Modern application asset management (including concatenation, minification, and versioning).
* Generators to help create components, routes, and more.
* A conventional project layout, making existing Ember applications easy to approach.
* Support for ES2015/ES6 JavaScript via the [Babel](https://babeljs.io/learn-es2015/) project. This includes support for [JavaScript modules](http://exploringjs.com/es6/ch_modules.html), which are used throughout this guide.
* A complete [QUnit](https://qunitjs.com/) test harness.
* The ability to consume a growing ecosystem of [Ember Addons](https://emberobserver.com/).

## Dependencies

### Git

Ember requires Git to manage many of its dependencies. Git comes with Mac OS
X and most Linux distributions. Windows users can
download and run [this Git installer](http://git-scm.com/download/win).

### Node.js and npm

Ember CLI is built with JavaScript, and requires the most recent LTS version of the [Node.js](https://nodejs.org/)
runtime. It also requires dependencies fetched via [npm](https://www.npmjs.com/). npm is packaged with Node.js, so if your computer has Node.js
installed you are ready to go.

If you're not sure whether you have Node.js or the right version, run this on your
command line:

```bash
node --version
npm --version
```

If you get a *"command not found"* error or an outdated version for Node:

* Windows or Mac users can download and run [this Node.js installer](http://nodejs.org/en/download/).
* Mac users often prefer to install Node using [Homebrew](http://brew.sh/). After
installing Homebrew, run `brew install node` to install Node.js. Alternatively, installer packages are available directly
from [Node.js](https://nodejs.org/en/download/).
* Linux users can use [this guide for Node.js installation on Linux](https://nodejs.org/en/download/package-manager/).

If you get an outdated version of npm, run `npm install -g npm`.

### Watchman (optional)

On Mac and Linux, you can improve file watching performance by installing [Watchman](https://facebook.github.io/watchman/docs/install.html).

## Installation

Install Ember using npm:

```bash
npm install -g ember-cli
```

To verify that your installation was successful, run:

```bash
ember -v
```

If a version number is shown, you're ready to go.
