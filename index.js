'use strict';

const Worker = require('./src/worker.js'),
	Pow = require('./src/pow.js'),
	os = require('os');

module.exports = {
	findPow: (hex, option) => {
		return this.find(hex, option);
	},

	find: (hex, option = {}) => {
		const thread = option.thread || Math.max(os.cpus().length, 1);

		const out = {time: 0, result: null, workload: []};

		let h = [], wait = [];
		for (let i = 0; i < thread; i++) {
			((id) => {
				wait.push(new Promise((resolve) => {
					let w = new Worker(hex, option.type || 'random', id, thread);
					w.found().then((res) => {
						for (let x in h) {
							h[x].close();
						}
						out.time = res[0];
						out.result = Buffer.from(res[1][0], 'hex');
						out.workload.push(res[1][1]);
					});
					w.on('exit', () => {
						resolve();
					}).on('close', (res) => {
						out.workload.push(res[1]);
					});
					h.push(w);
				}));
			})(i);
		}
		return Promise.all(wait).then(() => {
			if (option.verbose) {
				return out;
			}
			return out.result;
		});
	},

	isValid: (hex, work) => {
		return new Pow(hex).isValid(work instanceof Buffer ? work : Buffer.from(work, 'hex'));
	}
};
