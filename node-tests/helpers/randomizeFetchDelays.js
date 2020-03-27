const MIN_DELAY = 100;
const MAX_DELAY = 200;

module.exports = function convertToUrlTestingStructure(url) {
	return {
		url: url,
		delay: Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1) + MIN_DELAY)
	}
};
