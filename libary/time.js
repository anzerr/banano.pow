'use strict';

module.exports = (cd) => {
	let start = process.hrtime();
	cd();
	let end = process.hrtime(start);
	return end[0] * 1e9 + end[1];
};
