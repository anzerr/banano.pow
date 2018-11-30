'use strict';

let done = false;
let keepAlive = () => {
	return done ? process.exit(0) : setTimeout(keepAlive, 200);
};
keepAlive(); // keep the process from closing

const Pow = require('./pow.js');
const WORK = {
	random: require('./work/random.js'),
	incremental: require('./work/incremental.js')
};
const CONFIG = JSON.parse(process.env.config);

const p = new Pow(CONFIG.hex)
	.withWork(new WORK[CONFIG.type](CONFIG.start, CONFIG.max));

process.on('message', () => {
	if (!done) {
		done = true;
		let result = p.stop();
		result[0] = result[0].toString('hex');
		process.send(Buffer.concat([
			Buffer.from([0x01]),
			Buffer.from(JSON.stringify(result))
		]));
	}
});

p.work((result) => {
	if (!done) {
		done = true;
		result[0] = result[0].toString('hex');
		process.send(Buffer.concat([
			Buffer.from([0x02]),
			Buffer.from(JSON.stringify(result))
		]));
	}
});
