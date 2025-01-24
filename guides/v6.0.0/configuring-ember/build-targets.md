Ember application builds are created by the Ember CLI build pipeline. Just as with your application code,
Ember CLI ships with a sensible set of defaults to compile and bundle the assets that can be deployed
to production. Under the hood, this is accomplished using a series of Broccoli plugins, each of which
can be configured in the `ember-cli-build.js` file at the root of your project.

Ember CLI uses [Babel.js](https://babeljs.io/) for the compile step in this process. If you've used Babel
before, you know that it comes with a large set of options, including the ability to configure
"targets"; i.e. the environments in which your application is expected to run.
For example, if your application is embedded in an [Electron app](https://www.electronjs.org),
you might only care about compiling for the latest Chromium build. Or if your app targets Enterprise
users, you may need to compile your JavaScript to older syntax that runs in IE11.

For any of these cases, you can configure `ember build` to do The Right Thing. You can read more about
this in [the Ember CLI Guides](https://cli.emberjs.com/release/advanced-use/build-targets/)!
