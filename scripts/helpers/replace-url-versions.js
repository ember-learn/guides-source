module.exports = function replaceURLVersions(
  str,
  emberVersion,
  emberDataVersion,
) {
  let output;

  // guides use `v3.20.0` version format
  const emberPatchVersion = /\d+\.\d+.\d+/.test(emberVersion)
    ? emberVersion
    : emberVersion + '.0';
  output = str.replace(
    /https:\/\/guides.emberjs.com\/(release)(\/?)/g,
    `https://guides.emberjs.com/v${emberPatchVersion}$2`,
  );

  const emberDataPatchVersion = /\d+\.\d+.\d+/.test(emberDataVersion)
    ? emberDataVersion
    : emberDataVersion + '.0';
  output = str.replace(
    /https:\/\/guides.emberjs.com\/(release)(\/?)/g,
    `https://guides.emberjs.com/v${emberDataPatchVersion}$2`,
  );

  // apis use `3.20` version format
  output = output.replace(
    /https:\/\/api.emberjs.com\/(ember)\/(release)(\/?)/g,
    `https://api.emberjs.com/$1/${emberVersion}$3`,
  );

  output = output.replace(
    /https:\/\/api.emberjs.com\/(ember-data)\/(release)(\/?)/g,
    `https://api.emberjs.com/$1/${emberDataVersion}$3`,
  );

  return output;
};
