By default, Ember apps are built with Vite. The toolchain uses Babel, esbuild, and Rollup so you can write current-generation JavaScript and TypeScript while still allowing your application to work with older browsers.

Rather than always compiling everything down to legacy syntax, Ember determines what—if anything—needs to be transformed based on the browsers you target. With today’s defaults aimed at evergreen browsers, many features (ES modules, classes, arrow functions, async/await, etc.) ship largely as-is.

Why does this matter? Over-transpiling to very old JavaScript increases bundle size, slows parsing, and in some cases can slow down the execution of your JavaScript code. As the Web platform has advanced and percentage of users on legacy browsers have decreased, Ember’s default targets avoid unnecessary transforms to keep apps smaller and faster.

If you need to update the defaults for any reason (i.e. need to target a very legacy browser), you can set the targets for your app and the compiler applies only the minimal transforms and polyfills required for those browsers.

Your app's targets are in the `browserslist` key of `package.json`:

```json {data-filename=package.json}
{
  "browserslist": [
    "last 1 Chrome versions",
    "last 1 Firefox versions",
    "last 1 Safari versions"
  ]
}
```

If you inspect your compiled code after running a build with `npm run build`, you'll see that many modern features (like arrow functions and async/await) are preserved when your targets support them.

This feature is backed by [Browserslist](https://github.com/browserslist/browserslist) and [Can I Use](https://caniuse.com/).
These websites track usage stats of browsers, so you can use complex queries based on the user base of every browser.

If you want to target all browsers with more than a 4% market share in Canada,
you could use:

```json {data-filename=package.json}
{
  "browserslist": ["> 4% in CA"]
}
```

Other tools that read Browserslist, like Autoprefixer, use the same list.
See the [Browserslist documentation](https://github.com/browserslist/browserslist#queries) for more queries, and for other places to put the list, such as a `.browserslistrc` file.

It is very important that you properly configure the targets of your app so you get the smallest and fastest code possible.

## Apps with `config/targets.js`

Older apps set their targets in `config/targets.js`.
It still works, and it takes precedence over the `browserslist` key, but the build prints a warning about it.
To move over, copy the `browsers` array into the `browserslist` key of `package.json` and delete `config/targets.js`.
