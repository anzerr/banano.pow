'use strict';

class Work {

	constructor(ar) {
		this.work = Buffer.from(ar);
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
