/** eslint-env node */
const https = require('https')

/* 
With this script, we only run a preview build on demand, since our CI was timing out
when we ran previews for everything.
*/

if (process.env.TRAVIS_EVENT_TYPE !== 'pull_request') {
  console.log('This aint no pull request')
  process.exit(1)
}

const needsDeploy = 861719997

const options = {
  hostname: 'api.github.com',
  path: `/repos/ember-learn/guides-source/pulls/${process.env.TRAVIS_PULL_REQUEST}`,
  method: 'GET',
  headers: { 'User-Agent': 'node/https' }
}

const parseResponse = (res) => {
  let { labels } = JSON.parse(res)

  const needsDeployLabel = labels.find(item => item.id === needsDeploy)

  if (needsDeployLabel) {
    console.log('Needs deploy preview label found on PR')
    process.exit(0)
  }

  console.log('Needs deploy preview label not found on PR')
  process.exit(1)
}

https.get(options, (response) => {
  let data = ''

  response.on('data', (chunk) =>  data += chunk)
  response.on('end', () =>  parseResponse(data))

}).on('error', (err) =>  console.error('Error: ' + err.message))
