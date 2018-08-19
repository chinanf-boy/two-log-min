#!/usr/bin/env node
'use strict';

const meow = require('meow');
const twoLog = require('./index');
const tc = require('turbocolor');
const c = tc.cyan
const m = tc.magenta
const r = tc.red

const toS = (s) => JSON.stringify(s,null,0)

const cli = meow(`
	Usage
	  $ two-log-min -D

	Options
	  -D  Debug [Default: false]

	Examples
	  $ two-log-min
	  ora show
	  $ two-log-min -D
	  winston show
`);

let D = cli.flags['D'] || false
let l = twoLog(D);
let t = 6000;

let useWhat = !D ? 'ora' : 'log';

const o1 = {
	ora: 'red',
	log: 'cli'
}

const backLog = l.start(`1 debug:${D} , then use ${c(useWhat)} ${m(toS(o1))}`, o1);

setTimeout(() => {
	backLog(`use backLog ${c('withou log namespace')}`);
}, t - 5000);

const backLog2 = l.start(`2 debug`);

const o2 = {
	ora: 'green',
	log: 'cli'
}

setTimeout(() => {
	l.text(`ora:green, log:cli`, o2);

	l.one('one time ora');
}, t - 3000);

const o3 =  {
	ora: 'green',
	log: 'cli',
	only: 'log',
}

setTimeout(() => {
	l.text(`ora:green, only show log`, o3);
}, t - 2000);

const o4 = {
	ora: 'fail',
	log: 'cli'
}

setTimeout(() => {
	l.stop(`i fail if ora `, o4);
}, t);


process.on('uncaughtException', function(err){
	console.error('\n%s', r(err.stack));
	process.exitCode = 1;
});