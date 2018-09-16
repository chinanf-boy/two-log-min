const pkgName = require('get-module-name').sync();
const { c, m, r } = require('yobrave-util');

const onlyWhat = (only, str) => {
	return !only || only === str;
};
const getRName = namespace => {
	if (namespace.startsWith(pkgName)) {
		return namespace;
	}
	if (namespace) {
		return `${pkgName}:${namespace}`;
	}
	return `${pkgName}`;
};
const forText = (msgs = []) => {
	return msgs.join('');
};
const isExistAndErr = function(val, opts) {
	let { step, log, ora } = opts;
	let logWay = ora ? val : val[log];
	if (logWay) {
		return true;
	}
	if (step >= 3) {
		ora && logWay.stop && logWay.stop();
		let S = step === 3 ? 'Text' : 'Stop';
		let LoggerNAME = ora ? 'ora' : 'log';
		let msg = ora ? `'${ora}' method` : `'${log}' namespace`;
		throw new Error(
			`two-log-min-tip-you > use ${c(LoggerNAME)}:in life<${m(S)}> ❌: no ${c(
				msg
			)}`
		);
	}
};

module.exports = {
	onlyWhat,
	getRName,
	forText,
	isExistAndErr,
};
