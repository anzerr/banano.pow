'use strict';

const blake = require('blake2b'),
	Work = require('./work.js');

class Pow {

	constructor(hex, start, end) {
		this._hex = hex instanceof Buffer ? hex : Buffer.from(hex, 'hex');
		this._end = end;
		if (start) {
			this._start = start;
			this._work = new Work(start);
			this._running = true;
		} else {
			this._running = false;
		}
		this._i = 0;
		this.threshold = 0xfffffc0000000000; // nano 0xffffffc000000000
	}

	hash(work) {
		let context = blake.createHash({digestLength: 8});
		context.update(work);
		context.update(this._hex);
		return Buffer.from(context.digest()).reverse();
	}

	isValid(work, isReverse) {
		let w = this.hash(isReverse ? work : Buffer.from(work).reverse());
		return parseInt(w.toString('hex'), 16) >= this.threshold;
	}

	stop() {
		this._running = false;
		return this._work.get();
	}

	work(cd) {
		while (this._running) {
			if (this.isValid(this._work.reverse(), true)) {
				return cd(this._result = this._work.get());
			}
			if (this._i > this._end || !this._end) {
				return cd(null);
			}
			this._work.increment(this._i++);
			if (this._i % 10000 === 0) {
				setTimeout(() => this.work(cd), 0); // unblock to exit
				break;
			}
		}
		return null;
	}

	get() {
		return this.result || null;
	}

}

module.exports = Pow;
