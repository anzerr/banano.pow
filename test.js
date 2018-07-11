'use strict';

const pow = require('./index.js');

pow.findPow('4C0E1E2F29B2723B20CBF678799103B9876A1B2005A147E9992BE2AADA410B5D').then((hex) => {
	console.log('found1', hex);
});

pow.findPow('4E83A1A34957F4F7E2AA920B9D615782D2CC727B6703EB7B9236B97B57362C0D').then((hex) => {
	console.log('found2', hex);
});

console.log([
	pow.isValid('4C0E1E2F29B2723B20CBF678799103B9876A1B2005A147E9992BE2AADA410B5D', '838899e60d24b608'),
	pow.isValid('4E83A1A34957F4F7E2AA920B9D615782D2CC727B6703EB7B9236B97B57362C0D', '1c9364ab682d834e')
]);
