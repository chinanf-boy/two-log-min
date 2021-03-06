'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true,
}); // es6 export default
const path = require('path');
const debugLog = require('debug');
const Ora = require('ora-min');
const readPkgUp = require('read-pkg-up');

const parentDir = path.dirname(module.parent.filename);
const pkgName =
	readPkgUp.sync({
		cwd: parentDir,
		normalize: false,
	}).pkg.name || '*';

const {
	getRName,
	onlyWhat,
	forText,
	isExistAndErr,
	setName,
} = require('./util');
setName(pkgName);
const mergeOpts = require('./merge-opts');

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
	if (D) {
		const { pkgName } = require('./util');
		LOGGER = LOGGER || {};
		LOGGER[pkgName] = debugLog(pkgName);
	} else {
		LOGGER = null;
	}

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
	return function strLog(...args) {
		let { str, only } = mergeOpts(2, ...args);
		if (LOGGER) {
			if (!D && onlyWhat(only, 'ora')) {
				LOGGER.text = str.join(' ');
			} else if (D && onlyWhat(only, 'log')) {
				LOGGER[namespace](...str);
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

	if (str.join('') === '') {
		return false;
	}

	function logType(log, str, end) {
		if (str.filter(x => x).length && end) {
			log[end](...str);
		} else {
			log.stop();
		}
	}

	if (LOGGER && !D) {
		let l = LOGGER;
		const oldColor = l.color;
		const oldText = l.text;
		l.color = color;
		l.text = str.join('');

		logType(l, str, end);

		LOGGER = Ora(oldText).start();
		LOGGER.color = oldColor;
	} else if (!D && !LOGGER) {
		let l = Ora(...str).start();
		l.color = color;

		logType(l, str, end);

		l = null;
	} else if (D && LOGGER[log]) {
		LOGGER[log](...str);
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

		if (isExistAndErr(LOGGER, { step: 3, log })) {
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
			if (isExistAndErr(LOGGER, { step: 4, log })) {
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
exports.loggerStart = loggerStart;
exports.loggerText = loggerText;
exports.loggerStop = loggerStop;
exports.oneOra = oneOra;
exports._UNLOCK = _UNLOCK;
exports.default = twoLog;
