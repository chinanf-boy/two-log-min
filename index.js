'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
}); // es6 export default
const debugLog = require('debug');
const Ora = require('ora-min');
const { c, m, r } = require('yobrave-util');

const mergeOpts = require('./src/merge-opts');
const { getRName, onlyWhat, forText, isExistAndErr } = require('./src/util');

// two-log-min
let D = false; // default no debug
let LOGGER = null; // main
let LOCK = false; // only one set debug
let LoggerNAME = 'ora'; // for test

// log

// two-log-min
const twoLog = (debug = false, userUse) => {
	if (typeof debug === 'string') {
		debugLog.enable(getRName(debug));
	} else if (debug) {
		debugLog.enable('*');
	}

	if (LOCK) {
		throw new TypeError(`Set two-log-min debug just only one,❌`);
	}

	D = !!debug;
	LoggerNAME = D ? 'log' : 'ora';
	LOCK = true;

	if (userUse) {
		userUse(API);
	}

	return {
		start: loggerStart,
		text: loggerText,
		stop: loggerStop,
		one: oneOra,
	};
};

// user use API
let API = {
	ora: Ora,
	log: debugLog,
};

// for test
const _UNLOCK = function() {
	LOCK = false;
};

const apiLog = function(namespace) {
	return function strLog(str, ...args) {
		if (LOGGER) {
			if (!D) {
				LOGGER.text = str;
			} else {
				LOGGER[namespace](str, ...args);
			}
		}
		return LOGGER[namespace];
	};
};

/**
 * @description one time ora spinner
 * @arg {Array<string>} args - ...args
 * @param {string} str ... can more string
 * @param {string} options.color yellow
 * @param {string} options.end succeed
 * @param {string} options.log debug log namespace
 * @returns {Boolean} work or no
 */
function oneOra(...args) {
	let { color, end, log, str } = mergeOpts(0, ...args);

	if (LOGGER && !D) {
		let l = LOGGER;
		let oldColor = l.color;
		let oldText = l.text;
		l.color = color;
		l.text = str.join('');

		if (str.filter(x => x).length && end) {
			l[end](...str);
		} else {
			l.stop();
		}

		LOGGER = Ora(oldText).start();
		LOGGER.color = oldColor;
	} else if (!D && !LOGGER) {
		let l2 = Ora(...str).start();
		l2.color = color;
		if (str.filter(x => x).length && end) {
			l2[end](...str);
		} else {
			l2.stop();
		}

		l2 = null;
	} else if (D && LOGGER[log]) {
		LOGGER[log](...str);
	} else {
		return false;
	}
	return true;
}

/**
 * @description start logger
 * @arg {Array<string>} args - ...args
 * @param {string} str ... can more string
 * @param {string} options.ora ora color
 * @param {string} options.log debug log namespace
 * @param {string} options.only only one {ora|log}
 * @returns {Function} important is run debug log without namespace
 */
function loggerStart(...args) {
	let { ora, log, only, str } = mergeOpts(1, ...args);

	let res = ' '; // for test

	if (!D && onlyWhat(only, 'ora')) {
		if (LOGGER) {
			LOGGER.text = str.join('');
		} else {
			LOGGER = Ora(...str).start();
		}
		LOGGER.color = ora;

		res = forText([res, 'start']);
	} else if (D && onlyWhat(only, 'log')) {
		LOGGER = LOGGER || {}; // init {}
		log = getRName(log);
		LOGGER[log] = debugLog(log); // set nameSpace
		LOGGER[log](...str); // run log

		res = forText([res, log]);
	}
	let B = apiLog(log);
	B.test = forText([LoggerNAME, res]);

	return B;
}

/**
 * @description set logger text
 * @arg {Array<string>} args - ...args
 * @param {string} str ... can more string
 * @param {string} options.ora ora color
 * @param {string} options.log debug log namespace
 * @param {string} options.only only one {ora|log}
 */
function loggerText(...args) {
	if (!LOGGER) {
		return false;
	}

	let { ora, log, only, str } = mergeOpts(2, ...args);

	let res = ' '; // for test

	if (!D && onlyWhat(only, 'ora')) {
		LOGGER.text = str.join('');
		LOGGER.color = ora;

		res = forText([res, 'text']);
	} else if (D && onlyWhat(only, 'log')) {
		log = getRName(log);

		if (isExistAndErr(LOGGER[log], { step: 3, log })) {
			LOGGER[log](...str);
		}

		res = forText([res, log]);
	}
	return forText([LoggerNAME, res]);
}

/**
 * @description logger stop
 * @arg {Array<string>} args - ...args
 * @param {string} str ... can more string
 * @param {string} options.ora ora {fail|succeed|warn} https://github.com/sindresorhus/ora#instance
 * @param {string} options.log debug log namespace
 * @param {string} options.only only one {ora|log}
 */
function loggerStop(...args) {
	if (!LOGGER) {
		return false;
	}

	let { ora, log, only, str } = mergeOpts(3, ...args);

	let res = ' '; // for test

	if (!D && onlyWhat(only, 'ora')) {
		if (ora && str.length) {
			if (isExistAndErr(LOGGER[ora], { step: 4, ora })) {
				LOGGER[ora](...str);
			}

			res = forText([res, ora]);
		} else {
			LOGGER.stop();

			res = forText([res, 'stop']);
		}
	} else if (D && onlyWhat(only, 'log')) {
		log = getRName(log);

		if (str.length) {
			if (isExistAndErr(LOGGER[log], { step: 4, log })) {
				LOGGER[log](...str);
			}
		}

		res = forText([res, log]);
	}

	LOGGER = null;

	return forText([LoggerNAME, res]);
}

process.on('exit', function() {
	if (LOGGER && !D) {
		LOGGER.stop();
		LOGGER = null;
	}
});

exports = module.exports = twoLog;
exports.twoLog = twoLog;
exports.loggerStart = loggerStart;
exports.loggerText = loggerText;
exports.loggerStop = loggerStop;
exports.oneOra = oneOra;
exports._UNLOCK = _UNLOCK;
exports.default = twoLog;
