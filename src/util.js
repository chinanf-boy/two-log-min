module.exports = {
	onlyWhat,
	getRName,
	forText,
	isExistAndErr,
};

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
	if (val) {
		return true;
	}
	if (step >= 3) {
		ora && LOGGER.stop();
		let S = step === 3 ? 'Text' : 'Stop';
		let msg = ora ? `'${ora}' method` : `'${log}' namespace`;
		throw new Error(
			`two-log-min-tip-you > use ${c(LoggerNAME)}:in life<${m(S)}> ❌: no ${c(
				msg
			)}`
		);
	}
};
