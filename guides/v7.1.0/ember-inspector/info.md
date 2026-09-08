The `Info` tab shows some of the libraries used in your application, along with their version.

<img src="/images/guides/ember-inspector/v4.3.4/info-screenshot.png" width="680"/>

If you're using the [ember-cli-app-version](https://github.com/embersherpa/ember-cli-app-version) addon, your application's name and version will be added to the list automatically.

Libraries only appear in this list if they manually register themselves with Ember. So we don't recommend relying on this tab anymore, it's better to use any tool that's designed to analyze your package.json instead.
