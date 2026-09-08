When you generate a new Ember app your default build system will be using Vite.

> Vite is a blazing fast frontend build tool powering the next generation of web applications.

You can read more about [Vite on their documentation](https://vite.dev/guide/) site. Ember's Vite implementation is [powered by Embroider](https://github.com/embroider-build/embroider), which acts as a Vite plugin that allows Vite to effectively build an Ember app.

## Basic Usage

For most developers the only interaction that they will have with the build system is running the `npm start`, or `npm run build` scripts defined in their `package.json`. If you have a look at your `package.json` scripts you will see that they are just deferring to `vite` (which by default runs `vite dev` and starts the Vite dev server) and `vite build` respectively.

You can see more docs on these commands in the Vite documentation

### Sensible defaults

As Ember developers we expect reasonable defaults, because of that we have provided a default vite config for you that takes care of most of the Vite configuration you need as an Ember developer. For example, we automatically include your `tests/index.html` in the `build.rollupOptions.input` when you are building in `develoment` mode so that you can navigate to http://localhost:4200/tests/ 

For most applications you will not need to override the config that we provide by default, instead you can just add to the config as you need. If you do need to change the defaults that we provide, you can just define the new configuration in your `vite.config.js` because anything you define there will take precedence over anything we provide.


### Integrating 3rd party plugins

Now that Ember uses Vite for its build system, you no longer need an Ember-specific plugin to augment your build. If you find a Vite or rollup plugin that you would like to use you can follow the installation instructions to add that to your `vite.config.js` without any Ember-specific instructions necessary.

## Advanced Usage

Most developers will not need to change the defaults that we provide, but in some rare cases it can be useful to know how to change the defaults.

### Running Tests Against Production Code

By default, we don't build your tests when you build for production. This is because, in most cases, people don't want their tests included in the bundle they ship to end-users. This means if you run `npm run build` in your app it will default to `--mode production` (because this is [the default for `vite build`](https://vite.dev/config/shared-options.html#mode)) and it will not include your tests in your build output.

If you needed to run your tests against your production environment for any reason (maybe you have a vite/rollup plugin that you only run during your production build) then you can use the `FORCE_BUILD_TESTS=true` environment variable. This is just a convenience in the code that the default `ember()` plugin provides, you can always define your inputs in the `vite.config.js` which will take precedent over anything we're doing automatically for you in the `ember()` plugin.
