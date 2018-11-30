'use strict';

const rand = () => {
	return Math.floor(Math.random() * 255);
};

class Work {

	constructor(ar) {
		if (ar) {
			this.work = Buffer.from(ar);
		} else {
			this.work = Buffer.from([rand(), rand(), rand(), rand(), rand(), rand(), rand(), rand()]);
		}
		this._i = 0;
	}

	pause() {
		return (this._i % 100000 === 0);
	}

	end() {
		return false;
	}

	reverse() {
		return this.work;
	}

	runs() {
		return this._i;
	}

	get() {
		return Buffer.from(this.work).reverse();
	}

}

module.exports = Work;
