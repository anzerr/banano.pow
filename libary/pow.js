'use strict';

const blake = require('blake2b'),
	Work = require('./Work.js'),
	BigNumber = require('bignumber.js');

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
		this.threshold = new BigNumber('0xfffffc0000000000'); // nano 0xffffffc000000000
	}

	hash(work) {
		let context = blake.createHash({digestLength: 8});
		context.update(Buffer.from(work).reverse());
		context.update(this._hex);
		return Buffer.from(context.digest()).reverse();
	}

	isValid(work) {
		let w = this.hash(work);
		return new BigNumber(w.toString('hex'), 16).isGreaterThanOrEqualTo(this.threshold);
	}

	stop() {
		this._running = false;
		return this._work.get();
	}

	work(cd) {
		this._i = 0;
		while (this._running) {
			if (this.isValid(this._work.get())) {
				return cd(this._result = this._work.get());
			}
			if (this._i > this._end || !this._end) {
				return cd(null);
			}
			this._work.increment(this._i++);
			if (this._i % 10000 === 0) {
				setTimeout(() => {
					this.work(cd);
				}, 1);
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
