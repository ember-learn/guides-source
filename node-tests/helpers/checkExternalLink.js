const fetch = require('node-fetch');

module.exports = async function checkExternalLink(url) {
	return fetch(url)
		.catch((error) => { return { reason: 'Connection Refused', badLink: url }})
		.then(
			(response) => {
				if (!response.status) { return response; }
				if (response.ok) { return null; }
				return 	{ reason: response.status, badLink: url };
			}
		);
};
