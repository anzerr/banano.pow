'use strict';

const pow = require('./index.js');

let find = (h) => {
	return pow.findDetailPow(h).then((res) => {
		let total = 0;
		for (let i in res.workload) {
			total += res.workload[i];
		}
		console.log('found', res.result.toString('hex'), 'in', (res.time / 1e9).toFixed(3), 'sec', Math.floor(1e9 / (res.time / total) / 1000), 'kH/s');
		return pow.isValid(h, res.result.toString('hex'));
	});
};

find('4C0E1E2F29B2723B20CBF678799103B9876A1B2005A147E9992BE2AADA410B5D').then((res) => {
	console.log('isValid 1', res);
	return find('4E83A1A34957F4F7E2AA920B9D615782D2CC727B6703EB7B9236B97B57362C0D');
}).then((res) => {
	console.log('isValid 2', res);
});

console.log([
	pow.isValid('4C0E1E2F29B2723B20CBF678799103B9876A1B2005A147E9992BE2AADA410B5D', '838899e60d24b608'),
	pow.isValid('4E83A1A34957F4F7E2AA920B9D615782D2CC727B6703EB7B9236B97B57362C0D', '1c9364ab682d834e'),
	pow.isValid('4f8aa674c9f1bdac2799514faeb163481e549beebc7bfd56142da391ce3dfa43', '6f38bf04bf5a9a57'),
	pow.isValid('1A66A5CEF5B149FEAE8F680ED7E32956F3B45A3D7914660265178BDED16446C8', '7f414f7a18ce261c'),
	pow.isValid('96D95251A9ADB079E9B3FFA9EAE5A8C3709F529975F02AB77328FCFDE1D70E9F', '5d58696612f67d78')
]);
