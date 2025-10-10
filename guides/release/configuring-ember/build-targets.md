By default, Ember apps are built with Vite. The toolchain uses Babel (alongside modern compilers like esbuild/Rollup) so you can write current-generation JavaScript and TypeScript with confidence.

Rather than always compiling everything down to legacy syntax, Ember determines what—if anything—needs to be transformed based on the browsers you target. With today’s defaults aimed at evergreen browsers, many features (ES modules, classes, arrow functions, async/await, etc.) ship largely as-is.

Why does this matter? Over-transpiling to very old JavaScript increases bundle size and slows parsing. As the web platform has advanced and legacy browsers have faded, Ember’s defaults avoid unnecessary transforms to keep apps smaller and faster.

That’s why the build respects your browser targets: set the targets for your app and the compiler applies only the minimal transforms and polyfills required for those browsers.

If you open `config/targets.js`, you will find the following code:

```javascript {data-filename=config/targets.js}
"use strict";

const browsers = [
  "last 1 Chrome versions",
  "last 1 Firefox versions",
  "last 1 Safari versions",
];

module.exports = {
  browsers,
};
```

If you inspect the compiled code, you’ll see many modern features (like arrow functions and async/await) preserved when your targets support them.

This feature is backed by [Browserslist](https://github.com/ai/browserslist) and [Can I Use](https://caniuse.com/).
These websites track usage stats of browsers, so you can use complex queries based on the user base of every browser.

If you want to target all browsers with more than a 4% market share in Canada,
you'd have the following options:

```javascript {data-filename=config/targets.js}
module.exports = {
  browsers: ["> 4% in CA"],
};
```

It is very important that you properly configure the targets of your app so you get the smallest and fastest code possible.

Build targets can also be leveraged in other ways.

Some addons might conditionally include polyfills only if needed.
Some linters may emit warnings when using features not yet fully supported in your targets.
Some addons may even automatically prefix unsupported CSS properties.
