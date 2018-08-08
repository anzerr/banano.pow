'use strict';

const cp = require('child_process'),
	Pow = require('./libary/pow.js');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');
module.exports = {
	findPow: (hex, option) => {
		return this.findDetailPow(hex, option).then((res) => {
			return res.result;
		});
	},

	findDetailPow: (hex, option = {}) => {
		const thread = option.thread || Math.max(require('os').cpus().length, 1);
		let workers = [], env = {
			id: 0,
			slice: thread,
			hex: hex
		};

		let start = process.hrtime(), chunk = Math.floor(255 / thread);
		let wait = [], out = {result: null, workload: [], time: 0};
		for (let i = 0; i < thread; i++) {
			((id) => {
				wait.push(new Promise((resolve) => {
					env.id = id;
					let worker = cp.fork(base + '/libary/worker.js', {env: env});
					worker.on('message', (m) => {
						let data = Buffer.from(m.data);

						if (data[0] === 1) {
							let d = data.slice(1, data.length);
							d[d.length - 1] -= chunk * id;
							out.workload.push(parseInt(d.reverse().toString('hex'), 16));
						}
						if (data[0] === 2) {
							let d = data.slice(1, data.length);
							out.result = Buffer.from(d);
							d[d.length - 1] -= chunk * id;
							out.workload.push(parseInt(d.reverse().toString('hex'), 16));

							for (let x in workers) {
								try {
									workers[x].send(1);
								} catch	(e) {
									// ?
								}
							}
						}
					});
					worker.on('error', () => {
						// ?
					});
					worker.on('exit', () => {
						resolve();
					});
					workers.push(worker);
				}));
			})(i);
		}
		return Promise.all(wait).then(() => {
			let end = process.hrtime(start);
			out.time = end[0] * 1e9 + end[1];
			return out;
		});
	},

	isValid: (hex, work) => {
		return new Pow(hex).isValid(work instanceof Buffer ? work : Buffer.from(work, 'hex'));
	}
};
