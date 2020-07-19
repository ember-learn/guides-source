Ember CLI ships with support for managing your application's environment. Ember CLI will setup a default environment config file at `config/environment`. Here, you can define an `ENV` object for each environment, which are currently limited to three: development, test, and production.

The ENV object contains three important keys:

- `EmberENV` can be used to define Ember feature flags (see the [Feature Flags guide](./feature-flags/)) to be enabled at runtime.
- `APP` can be used to pass flags or options to the app's `Application` instance.
- `environment` by default contains which of the build environments was selected at build time (`development`, `test`, or `production`).

You can access these environment variables in your application code by importing from `your-application-name/config/environment`.

For example:

```javascript
import ENV from 'your-application-name/config/environment';

if (ENV.environment === 'development') {
  // ...
}
```

<!-- eof - needed for pages that end in a code block  -->
