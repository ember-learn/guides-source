import GuideMakerApp from 'guidemaker/routes/application';
import { service } from '@ember/service';

const FEATURES = {
  'template-tag': false,
};

export default class ApplicationRoute extends GuideMakerApp {
  @service features;

  model(params, ...rest) {
    let { feature_flags } = params;
    let overrides = Object.fromEntries(
      feature_flags?.split(',').map((flag) => [flag, true]) ?? []
    );
    this.features.setupFeatures(Object.assign({}, FEATURES, overrides));
    return super.model(params, ...rest);
  }
}
