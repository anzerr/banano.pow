'use strict';

const Work = require('./work.js');

class Random extends Work {

	constructor(ar) {
		super(ar);
	}

	increment() {
		let i = Math.floor(Math.random() * this.work.length);
		this.work[i] = (this.work[i] + 1 % 255);
		this._i += 1;
		return this;
	}

}

module.exports = Random;
