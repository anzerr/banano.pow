'use strict';

const blake = require('blake2b');

class Pow {

	constructor(hex) {
		this._hex = hex instanceof Buffer ? hex : Buffer.from(hex, 'hex');
		this._running = false;
		this.threshold = 0xfffffc0000000000; // nano 0xffffffc000000000
	}

	withWork(w) {
		this._work = w;
		this._running = true;
		return this;
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
		return [this._work.get(), this._work.runs()];
	}

	work(cd) {
		while (this._running) {
			if (this.isValid(this._work.reverse(), true)) {
				this._result = this._work.get();
				return cd([
					this._result,
					this._work.runs()
				]);
			}
			if (this._work.end()) {
				return cd(null);
			}
			this._work.increment();
			if (this._work.pause()) {
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
