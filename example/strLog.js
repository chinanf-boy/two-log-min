const twoLog = require('../index')

let userUse = api => {
	let createDebug = api.log;
	createDebug.formatters.h = (v) => {
	return v.toString('hex')
	}
};

let l = twoLog(true, userUse);

const strLog = l.start('something str',{log:'foo'}) // here set debug namespace
strLog('this is hex: %h', new Buffer('hello world'))
