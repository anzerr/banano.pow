'use strict';

const cp = require('child_process'),
	Pow = require('./libary/pow.js');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');
module.exports = {
	findPow: (hex, option = {}) => {
		const thread = option.thread || Math.max(require('os').cpus().length, 1);
		let workers = [];
		return new Promise((resolve) => {
			for (let i = 0; i < thread; i++) {
				let worker = cp.fork(base + '/libary/worker.js', {env: {
					id: i,
					hex: hex
				}});
				worker.on('message', (msg) => {
					for (let x in workers) {
						workers[x].kill();
					}
					resolve(Buffer.from(msg, 'hex'));
				});
				workers.push(worker);
			}
		});
	},

	isValid: (hex, work) => {
		return new Pow(hex).isValid(work);
	}
};
