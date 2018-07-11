'use strict';

const blake = require('blake2b'),
	util = require('./util.js'),
	Work = require('./Work.js');

class Pow {

	constructor(hex, start, end) {
		this._hex = hex;
		this._end = end;
		this._work = new Work(start);
		this.threshold = 0xfffffc000000;
	}

	hash(work) {
		let context = blake.createHash({digestLength: 8});
		context.update(work);
		context.update(Uint8Array.from(Buffer.from(this._hex, 'hex')));
		return Buffer.from(context.digest()).reverse();
	}

	isUint8Valid(work) {
		return this.hash(work).readUIntBE(0, 6) > this.threshold;
	}

	isValid(work) {
		return this.isUint8Valid(util.hex.toUint8(work).reverse());
	}

	work() {
		let i = 0;
		while (true) {
			if (this.isUint8Valid(this._work.increment().get())) {
				return this._result = this._work.get();
			}
			if (i > this._end) {
				return null;
			}
			i++;
		}
	}

	get() {
		return this.result || null;
	}

}

module.exports = Pow;
