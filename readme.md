# two-log-min [![Build Status](https://travis-ci.org/chinanf-boy/two-log-min.svg?branch=master)](https://travis-ci.org/chinanf-boy/two-log-min) [![codecov](https://codecov.io/gh/chinanf-boy/two-log-min/badge.svg?branch=master)](https://codecov.io/gh/chinanf-boy/two-log-min?branch=master) [![explain](http://llever.com/explain.svg)](https://github.com/chinanf-boy/two-log-min-explain)

> switch `ora` and `debug` , if `debug == true` log => `debug`, else log => `ora`

[中文](./readme.zh.md)

## install

```
npm i two-log-min
```

## cli DEMO

```
npm i -g two-log-min-cli
```

<p>
<img src="./imgs/demo1.gif" width="40%" height="150px">
<img src="./imgs/demo2.gif" width="50%" height="150px">
</p>

- [two-log-min-cli](https://github.com/chinanf-boy/two-log-min-cli)

## Usage

<details>

<summary> <b>1. cli code</b> </summary>

```js
// cli.js
const twoLog = require('two-log-min');
let D = cli.flags['D'] || false;
let l = twoLog(D);

let useWhat = !D ? 'ora' : 'log';

const o1 = {
	ora: 'red',
	log: 'cli',
};

const backLog = l.start(
	`hello debug:${D} , then use ${c(useWhat)} ${m(toS(o1))}`,
	o1
);

setTimeout(() => {
	backLog(`use backLog ${c('withou log namespace')}`);
}, t - 5000);

const o2 = {
	ora: 'green',
	log: 'cli',
};

setTimeout(() => {
	l.text(`ora:green, log:cli`, o2);

	l.one('one time ora');
}, t - 3000);

const o3 = {
	ora: 'green',
	log: 'cli',
	only: 'log',
};

setTimeout(() => {
	l.text(`ora:green, only show log`, o3);
}, t - 2000);

const o4 = {
	ora: 'fail',
	log: 'cli',
};

setTimeout(() => {
	l.stop(`i fail if ora `, o4);
}, t);
```

- `l.start === loggerStart`

- `l.text === loggerText`

- `l.stop === loggerStop`

- `l.one === oneOra`

> logger`***` use for other module without `l = twoLog(D)` init

</details>

### 2. doc-templite example

<details>

<summary> code >> </summary>

- cli log with https://github.com/chinanf-boy/doc-templite/blob/master/cli.js#L51

- main log with https://github.com/chinanf-boy/doc-templite/blob/master/doc-templite.js#L55

- more start log 👆, only one stop https://github.com/chinanf-boy/doc-templite/blob/master/cli.js#L112

</details>

---

## API

### twoLog(debug, userUser):[log](#log)

#### debug

| name: | debug             |
| ----- | ----------------- |
| Type: | `boolean`         |
| Desc: | debug for two log |

#### userUse(api)

| name:    | userUse                      |
| -------- | ---------------------------- |
| Type:    | `function(api)`              |
| Default: | `undefined`                  |
| Desc:    | reset debug options for user |

##### api

| name:    | api                    |
| -------- | ---------------------- |
| Type:    | `object`               |
| Desc:    | api for user           |
| api.log: | log = require('debug') |
| api.ora: | ora = require('ora')   |

<details>

<summary>
api examples
</summary>

- [user api : debug formatters](./example/userApi.js)

```js
let userUse = api => {
	let createDebug = api.log;
	createDebug.formatters.h = v => {
		return v.toString('hex');
	};
};

let l = twoLog(true, userUse);

// …elsewhere
const debug = l.start('something str', { log: 'foo' });
debug('this is hex: %h', new Buffer('hello world'));
//   foo this is hex: 68656c6c6f20776f726c6421 +0ms
```

</details>

---

### log

| name:    | log                                                |
| -------- | -------------------------------------------------- |
| Type:    | `any`                                              |
| Desc:    | log api                                            |
| Default: | `{ start, text, stop, one }`                       |
| Details: | `start === [loggerStart](#loggerstartstr-options)` |
| Details: | `text === [loggerText](#loggertextstr-options)`    |
| Details: | `stop === [loggerStop](#loggerstopstr-options)`    |
| Details: | `one === oneOra`                                   |

---

### loggerStart(...args):[strLog](#strlog)

#### str

| name:                | str                                                          |
| -------------------- | ------------------------------------------------------------ |
| Type:                | `string`                                                     |
| Desc:                | start log                                                    |
| Expand by `...args`: | start('one','two',opts) , `one` +/% formatter `two` will log |

#### options

| name:         | options                                     |
| ------------- | ------------------------------------------- |
| Type:         | `any`                                       |
| Default:      | `{ ora: 'yellow', log:`pkgName`, only:"" }` |
| Desc:         | log text                                    |
| options.ora:  | ora color                                   |
| options.log:  | debug show log level                        |
| options.only: | only one {'ora' \| 'log'} can use           |

> `pkgName` is the most closest package.json name

#### strLog(...args)

| name: | strLog                                       |
| ----- | -------------------------------------------- |
| Type: | `Function`                                   |
| Desc: | can use `debug` without namespace, may `ora` |

<details>

<summary> example: use strLog </summary>

```js
const twoLog = require('../index');

let l = twoLog(true);

const strLog = l.start('something str', { log: 'foo' }); // here set debug namespace
strLog('this is just like debug');
```

[code >>>](./example/strLog.js)

</details>

### loggerText(...args)

#### str

| name:                | str                                                         |
| -------------------- | ----------------------------------------------------------- |
| Type:                | `string`                                                    |
| Desc:                | log text                                                    |
| Expand by `...args`: | text('one','two',opts) , `one` +/% formatter `two` will log |

#### options

| name:         | options                                    |
| ------------- | ------------------------------------------ |
| Type:         | `any`                                      |
| Default:      | `{ ora: 'yellow', log: pkgName, only:"" }` |
| Desc:         | log text                                   |
| options.ora:  | ora color                                  |
| options.log:  | debug show log level                       |
| options.only: | only one {'ora' \| 'log'} can use          |

> `pkgName` is the most closest package.json name

### loggerStop(...args)

#### str

| name:                | str                                                         |
| -------------------- | ----------------------------------------------------------- |
| Type:                | `string`                                                    |
| Desc:                | log text                                                    |
| Expand by `...args`: | stop('one','two',opts) , `one` +/% formatter `two` will log |

#### options

| name:         | options                                                                  |
| ------------- | ------------------------------------------------------------------------ |
| Type:         | `any`                                                                    |
| Default:      | `{ ora: '', log: pkgName, only:"" }`                                     |
| Desc:         | log text                                                                 |
| options.ora:  | ora {`fail\|succeed\|warn`} https://github.com/sindresorhus/ora#instance |
| options.log:  | debug show log level                                                     |
| options.only: | only one {'ora' \| 'log'} can use                                        |

### oneOra(...args)

#### str

| name:                | str                                                        |
| -------------------- | ---------------------------------------------------------- |
| Type:                | `string`                                                   |
| Desc:                | ora text                                                   |
| Expand by `...args`: | one('one','two',opts) , `one` +/% formatter `two` will log |

#### options

| name:          | options                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| Type:          | `any`                                                                    |
| Default:       | `{ color: 'yellow', end: 'succeed' }`                                    |
| Desc:          | log text                                                                 |
| options.end:   | end {`fail\|succeed\|warn`} https://github.com/sindresorhus/ora#instance |
| options.color: | color for ota                                                            |

---

## concat

- [two-log](https://github.com/chinanf-boy/two-log) just need two log, `ora` / `winston`

## License

MIT © [chinanf-boy](http://llever.com)
