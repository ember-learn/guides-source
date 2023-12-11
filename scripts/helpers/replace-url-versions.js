module.exports = function replaceURLVersions(str, emberVersion, emberDataVersion) {
  let output;

  // guides use `v3.20.0` version format
  const patchVersion = /\d+\.\d+.\d+/.test(version) ? version : version + '.0';
  output = str.replace(
    /https:\/\/guides.emberjs.com\/(release|v\d+\.\d+.\d+)(\/?)/g,
    `https://guides.emberjs.com/v${patchVersion}$2`
  );

  // apis use `3.20` version format
  output = output.replace(
    /https:\/\/api.emberjs.com\/(ember)\/(release|\d+\.\d+)(\/?)/g,
    `https://api.emberjs.com/$1/${emberVersion}$3`
  );

  output = output.replace(
    /https:\/\/api.emberjs.com\/(ember-data)\/(release|\d+\.\d+)(\/?)/g,
    `https://api.emberjs.com/$1/${emberDataVersion}$3`
  );

  return output;
};
