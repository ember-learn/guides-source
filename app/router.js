import EmberRouter from '@ember/routing/router';
import { inject as service } from '@ember/service';
import config from 'ember-guides/config/environment';

export default class Router extends EmberRouter {
  @service fastboot;
  @service metrics;

  location = config.locationType;
  rootURL = config.rootURL;

  constructor() {
    super(...arguments);

    this.on('routeDidChange', () => {
      this.trackPage();
    });
  }

  trackPage() {
    if (this.fastboot.isFastBoot) {
      return;
    }

    /*
      `hostname` is constant and is used to identify page views
      in the Google Analytics Dashboard
    */
    const hostname = 'guides.emberjs.com';
    const page = this.url;
    const title = this.currentRouteName ?? 'unknown';

    this.metrics.trackPage({ hostname, page, title });
  }
}

Router.map(function () {});
