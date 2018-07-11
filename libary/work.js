'use strict';

class Work {

	constructor(ar) {
		this.work = new Uint8Array(8);
		for (let i in ar) {
			this.work[i] = ar[i];
		}
	}

	increment() {
		for (let i = 0; i < this.work.length; i++) {
			if (this.work[i] === 255) {
				this.work[i] = 0;
			} else {
				this.work[i] += 1;
				break;
			}
		}
		return this;
	}

	get() {
		return this.work;
	}

}

module.exports = Work;
