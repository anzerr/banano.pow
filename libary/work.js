'use strict';

class Work {

	constructor(ar) {
		this.work = Buffer.from(ar).reverse();
	}

	increment() {
		for (let i = this.work.length - 1; i > 0; i--) {
			if (this.work[i] === 255) {
				this.work[i] = 0;
			} else {
				this.work[i] += 1;
				break;
			}
		}
		return this;
	}

	reverse() {
		return this.work;
	}

	get() {
		return Buffer.from(this.reverse()).reverse();
	}

}

module.exports = Work;
