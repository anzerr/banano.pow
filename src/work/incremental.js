'use strict';

const Work = require('./work.js');

class Incremental extends Work {

	constructor(ar, end) {
		super(ar);
		this._end = end;
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
		this._i += 1;
		return this;
	}

	end() {
		return (this._i > this._end || !this._end);
	}

}

module.exports = Incremental;
