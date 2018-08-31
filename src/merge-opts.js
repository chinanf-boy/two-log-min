const pkgName = require('get-module-name').sync();

module.exports = function merge(step, ...args) {
	let len = args.length;
	let options = len > 1 ? args[len - 1] : {};
	let str = args.slice(0, len - 1 || 1);

	let { color, end, ora, log, only } = mergeOpts(options, step);

	return {
		len,
		color,
		end,
		ora,
		log,
		only,
		str,
	};
};

const mergeOpts = (opts, step) => {
	const M = (s, o) => Object.assign(s, o);

	let s0 = {
		color: 'yellow',
		end: 'succeed',
		log: pkgName,
	}; // oneOra - default opts
	let s12 = {
		ora: 'yellow',
		log: pkgName,
	}; // start/test - default opts
	let s3 = {
		ora: 'succeed',
		log: pkgName,
	}; // stop - deafult opts

	if (step === 0) {
		return M(s0, opts);
	}
	if (step === 3) {
		return M(s3, opts);
	}
	return M(s12, opts);
};
