const apiDocsUrl = {remote: 'https://api.emberjs.com', local: 'https://api.emberjs.com'};
//const apiDocsUrl = {remote: 'https://api.emberjs.com', local: 'http://locahost:4200'};

module.exports = function (url) {
	return url.replace(apiDocsUrl.remote, apiDocsUrl.local);
}
