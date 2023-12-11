const { expect } = require('chai');
const replaceURLsVersions = require('../scripts/helpers/replace-url-versions');

describe('replace url versions', function () {
  it('works', function () {
    let test;

    console.log('Running tests...');

    expect(replaceURLsVersions('https://api.emberjs.com/ember/release/', '3.15')).to.equal('https://api.emberjs.com/ember/3.15/')

    test = replaceURLsVersions('https://api.emberjs.com/ember/release', '3.15');
    console.log(test === 'https://api.emberjs.com/ember/3.15' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember/3.20/', '3.15');
    console.log(test === 'https://api.emberjs.com/ember/3.15/' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember/3.20', '3.15');
    console.log(test === 'https://api.emberjs.com/ember/3.15' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember/release/classes/Application', '3.15');
    console.log(test === 'https://api.emberjs.com/ember/3.15/classes/Application' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember-data/release/', '3.15');
    console.log(test === 'https://api.emberjs.com/ember-data/3.15/' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember-data/release', '3.15');
    console.log(test === 'https://api.emberjs.com/ember-data/3.15' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember-data/release/classes/Model/', '3.15');
    console.log(test === 'https://api.emberjs.com/ember-data/3.15/classes/Model/' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember-data/3.20/classes/Model/', '3.15');
    console.log(test === 'https://api.emberjs.com/ember-data/3.15/classes/Model/' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://api.emberjs.com/ember/release/classes/@ember%2Fapplication/methods/getOwner', '3.15');
    console.log(test === 'https://api.emberjs.com/ember/3.15/classes/@ember%2Fapplication/methods/getOwner' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://guides.emberjs.com/release/getting-started/', '3.15');
    console.log(test === 'https://guides.emberjs.com/v3.15.0/getting-started/' ? '✅' : '❌', test);

    test = replaceURLsVersions('https://guides.emberjs.com/release/getting-started/', '3.16.0');
    console.log(test === 'https://guides.emberjs.com/v3.16.0/getting-started/' ? '✅' : '❌', test);
  })
})
