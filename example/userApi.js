const twoLog = require('../index')

let userUse = api => {
	let createDebug = api.log;
	createDebug.formatters.h = (v) => {
	return v.toString('hex')
	}
};

let l = twoLog(true, userUse);

// …elsewhere
const debug = l.start('something str',{log:'foo'}) 
debug('this is hex: %h', new Buffer('hello world'))
//   foo this is hex: 68656c6c6f20776f726c6421 +0ms
