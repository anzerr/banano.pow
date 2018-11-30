'use strict';

const cp = require('child_process'),
	events = require('events');

const base = require('path').resolve(__dirname).replace(/\\/g, '/');

class Worker extends events {

	constructor(hex, type, i, total) {
		super();
		this.fork = cp.fork(base + '/fork.js', {env: {config: this.config(hex, type, i, total)}});
		this.fork.on('message', (m) => {
			let data = Buffer.from(m.data);

			if (data[0] === 1) {
				let d = JSON.parse(data.slice(1, data.length));
				this.emit('close', d);
			}
			if (data[0] === 2) {
				let d = JSON.parse(data.slice(1, data.length));
				this.emit('found', d);
			}
		});
		this.fork.on('error', () => {
			// ?
		});
		this.fork.on('exit', (code) => {
			this.emit('exit', code);
		});
	}

	config(hex, type, i, total) {
		const chunk = Math.floor(255 / total), c = {};
		c.hex = hex;
		c.type = type;
		if (type === 'incremental') {
			c.start = [chunk * i, 0, 0, 0, 0, 0, 0, 0];
			c.max = Math.pow(255, 7) * Math.floor(255 / total);
		}
		return JSON.stringify(c);
	}

	close() {
		this.fork.send(1);
		setTimeout(() => {
			try {
				this.fork.kill(0);
				process.kill(this.fork.pid, 0);
			} catch(e) {
				// done
			}
		}, 100);
	}

	found() {
		let start = process.hrtime();
		return new Promise((resolve) => {
			this.once('found', (data) => {
				let end = process.hrtime(start);
				resolve([end[0] * 1e9 + end[1], data]);
			});
		});
	}

}

module.exports = Worker;
