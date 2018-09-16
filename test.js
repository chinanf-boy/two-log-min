import test from 'ava';
import log, { loggerStart, loggerText, loggerStop, _UNLOCK } from '.';

test.beforeEach('run _UNLOCK', () => {
	_UNLOCK();
});
test('log debug true', t => {
	let l = log(true);
	t.true(!!l.start);
});

test('log debug string', t => {
	let l = log('cli');
	t.true(!!l.start);
});

test('log debug false', t => {
	let l = log();
	t.is(!!l.text, true);
	t.is(!!l.start, true);
	t.is(!!l.stop, true);
});

test.failing('log LOCK , throw', t => {
	log();
	log();
	t.plan();
});

test('ora not start , return false', t => {
	let l = log();
	t.is(l.text('no start'), false);
	t.is(l.stop('no start'), false);
});

test('ora succeed', t => {
	let l = log();
	let s = 'ora';
	let oraState = 'succeed';
	let info = 'info';
	t.is(l.start('ok ora starting').test, s + ' start');
	t.is(l.text('ok ora running'), s + ' text');
	t.is(
		l.stop('ok ora stopping', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('ora start after one: succeed', t => {
	let l = log();
	let color = 'red';
	let s = 'ora';
	let oraState = 'succeed';
	let info = 'info';
	t.is(l.start('ok ora starting', { ora: color }).test, s + ' start');
	t.is(l.text('ok ora running'), s + ' text');
	t.is(l.one('ok ora running', { end: '' }), true);

	t.is(
		l.stop('ok ora stopping', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('ora start after one: stop', t => {
	let l = log();
	let color = 'red';
	let s = 'ora';
	let oraState = 'succeed';
	let info = 'info';
	t.is(l.start('ok ora starting', { ora: color }).test, s + ' start');
	t.is(l.text('ok ora running'), s + ' text');
	t.is(l.one(''), false);

	t.is(
		l.stop('ok ora stopping', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('ora before one: succeed', t => {
	let l = log();
	let s = 'ora';
	let color = 'red';
	let oraState = 'fail';
	let info = 'info';
	t.is(l.one('ok ora one running'), true);

	t.is(l.start('ok ora starting', { ora: color }).test, s + ' start');

	t.is(l.text('ok ora running'), s + ' text');

	t.is(
		l.stop('ok ora stopping', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('ora before one: stop', t => {
	let l = log();
	let s = 'ora';
	let color = 'red';
	let oraState = 'fail';
	let info = 'info';
	t.is(l.one(''), false);

	t.is(l.start('ok ora starting', { ora: color }).test, s + ' start');

	t.is(l.text('ok ora running'), s + ' text');

	t.is(
		l.stop('ok ora stopping', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('ora stop', t => {
	let l = log();
	let s = 'ora';
	let oraState = 'success';
	let b1 = l.start('ok ora starting');
	let b = l.start('ok ora starting');
	b('ok ora change name');
	t.is(b.test, s + ' start');
	t.is(l.text('ok ora running'), s + ' text');
	t.is(l.stop(), s + ' stop');
});

test('ora -+= loggerAPI ', t => {
	let s = 'ora';
	let oraState = 'succeed';
	let info = 'info';

	t.is(loggerStart('ora Loggerstart').test, s + ' start');
	t.is(loggerText('ora LoggerText'), s + ' text');
	t.is(
		loggerStop('ora LoggerStop', { ora: oraState, log: info }),
		s + ' ' + oraState
	);
});

test('debug -- log default', t => {
	let l = log(true);
	t.is(!!l.text, true);
	t.is(!!l.start, true);
	t.is(!!l.stop, true);
});

test('debug default  ', t => {
	let l = log('cli');
	let s = 'log';
	let oraState = 'success';
	let debug = '';
	let m = s + ' two-log-min';
	t.is(l.start('log  default   starting').test, m);
	t.is(l.one('ok one running false'), true);
	t.is(l.one(''), false);

	t.is(l.text('log  set running'), m);

	t.is(l.stop('log  default   stopping', { ora: oraState, log: debug }), m);
});

test('debug default : no set  ', t => {
	let l = log('cli');
	let s = 'log';
	let oraState = 'success';
	let debug = '';
	let e = '';
	let m = s + ' two-log-min';
	t.is(l.start('log  default   starting', { ora: 'yellow' }).test, m);

	t.is(l.text('log  set   running', { log: e }), m);

	t.is(l.stop('log  default   stopping', { ora: oraState, log: debug }), m);
});

test('debug not start , return false', t => {
	let l = log();
	t.is(l.text('no start'), false);
	t.is(l.stop('no start'), false);
});

test('debug use API, set debug formatter %h ', t => {
	let userUse = api => {
		let createDebug = api.log;
		createDebug.formatters.h = v => {
			return v.toString('hex');
		};
	};

	let l = log(true, userUse);
	let s = 'log';
	let oraState = 'success';
	let debug = '';
	let m = s + ' two-log-min';
	let backLog = l.start('this is hex: %h', new Buffer('hello world'), {
		log: debug,
	});
	let T = backLog.test;
	t.is(T, m);
});

test('debug use API, set debug formatter %h ', t => {
	let userUse = api => {
		let createDebug = api.log;
		createDebug.formatters.h = v => {
			return v.toString('hex');
		};
	};

	let l = log(true, userUse);
	let s = 'log';
	let oraState = 'success';
	let debug = '';
	let m = s + ' two-log-min';
	t.is(l.one('ok one running false'), true);
	t.is(l.one(''), false);
	let backLog = l.start('this is hex: %h', new Buffer('hello world'), {
		log: debug,
	});
	t.true(backLog('asdf') instanceof Object);
});

test('debug -+= loggerAPI ', t => {
	let l = log(true);
	let s = 'log';
	let oraState = 'success';
	let debug = '';
	let e = '';
	let m = s + ' two-log-min';
	t.is(
		loggerStart('default log loggerStart ', {
			log: debug,
		}).test,
		m
	);
});

// error

test.failing('debug error', t => {
	let l = log('cli');
	let s = 'log';
	let oraState = 'success';
	let debug = 'error';
	let m = s + ' two-log-min';
	t.is(l.start('log  default   starting').test, m);
	t.is(l.one('ok one running false'), true);
	t.is(l.text('log  set   running'), m);

	t.is(l.stop('log  default   stopping', { ora: oraState, log: debug }), m);
});
