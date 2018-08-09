'use strict';

let done = false;
let keepAlive = () => {
	return done ? process.exit(0) : setTimeout(keepAlive, 100);
};
keepAlive(); // keep the process from closing

const Pow = require('./pow.js');
const chunk = Math.floor(255 / process.env.slice), config = {
	hex: process.env.hex,
	work: {
		start: [0, 0, 0, 0, 0, 0, 0, chunk * Number(process.env.id)],
		max: Math.pow(255, 7) * Math.floor(255 / chunk)
	}
};
const p = new Pow(config.hex, config.work.start, config.work.max);

process.on('message', () => {
	if (!done) {
		done = true;
		process.send(Buffer.concat([
			Buffer.from([0x01]),
			p.stop()
		]));
	}
});

p.work((result) => {
	if (!done) {
		done = true;
		process.send(Buffer.concat([
			Buffer.from([0x02]),
			result
		]));
	}
});
