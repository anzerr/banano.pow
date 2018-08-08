'use strict';

let done = false;
let lock = () => {
	if (done) {
		process.exit(0);
		return;
	}
	setTimeout(lock, 100);
};
lock();

const Pow = require('./pow.js');
const i = Number(process.env.id), chunk = Math.floor(255 / process.env.slice);

const p = new Pow(process.env.hex, [0, 0, 0, 0, 0, 0, 0, chunk * i], Math.pow(255, 7) * Math.floor(255 / chunk));

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
