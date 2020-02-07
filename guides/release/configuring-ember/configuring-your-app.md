Ember CLI ships with support for managing your application's environment. The runtime environment for the application is defined in `config/environment.js`. Here an object `ENV` is built for each of the three Ember CLI-supported build modes: development, test, and production.

Three notable properties on the `ENV` object are:

- `EmberENV` can be used to define Ember feature flags (see the [Feature Flags guide](../feature-flags/)) to be enabled at runtime.
- `APP` can be used to pass flags or options to the app's `Application` instance.
- `environment` by default contains which of the build environments was selected at build time (`development`, `test`, or `production`).

The `ENV` object is defined at build time, but you can access the `ENV` object
in application code via import from `your-application-name/config/environment`.

For example:

```javascript
import ENV from 'your-application-name/config/environment';

if (ENV.environment === 'development') {
  // ...
}
```

<!-- eof - needed for pages that end in a code block  -->
