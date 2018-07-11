'use strict';

const Pow = require('./pow.js');
const thread = Math.max(require('os').cpus().length, 2);
const i = Number(process.env.id), chunk = Math.floor(255 / thread);
const p = new Pow(process.env.hex, [0, 0, 0, 0, 0, 0, 0, chunk * i], Math.pow(255, 7) * Math.floor(255 / chunk));
process.send(Buffer.from(p.work()).toString('hex'));
