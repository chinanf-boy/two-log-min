const twoLog = require('../index')

let l = twoLog(true);

const strLog = l.start('something str',{log:'foo'}) // here set debug namespace
strLog('this is just like debug')
