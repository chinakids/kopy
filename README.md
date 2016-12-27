# kopy

[![NPM version](https://img.shields.io/npm/v/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![NPM downloads](https://img.shields.io/npm/dm/kopy.svg?style=flat)](https://npmjs.com/package/kopy) [![Build Status](https://img.shields.io/circleci/project/egoist/kopy/master.svg?style=flat)](https://circleci.com/gh/egoist/kopy)

> Gracefully copy a directory and render templates.

## Why is this useful?

This could be used to build a scaffolding tool like [yeoman](https://github.com/yeoman/yeoman) or [vue-cli](https://github.com/vuejs/vue-cli).

## Install

```bash
$ npm install --save kopy
```

## Usage

```js
const copy = require('kopy')

copy('./template', './dest', {
  data: {
    foo: 'bar'
  }
}).then(files => {
  console.log(files) // array of filenames in './dest'
}).catch(err => {
  console.log(err.stack)
})
```

## Template Syntax

Templates could use [handlebars](http://handlebarsjs.com/) syntax or any template engine in [consolidate.js](https://github.com/tj/consolidate.js)

## API

### copy(src, dest, options)

#### src

Type: `string`<br>
Required: `true`

Source directory. Could be a relative or absolute path.

#### dest

Type: `string`<br>
Required: `true`

Destination directory.

#### options

##### engine

Type: `string`<br>
Default: `handlebars`

All template engines that're supported by [consolidate.js](https://github.com/tj/consolidate.js)

##### clean

Type: `boolean`<br>
Default: `true`

Whether to clean destination directory before writing to it.

##### cwd

Type: `string`<br>
Default: `process.cwd()`

Current working directory.

##### data

Type: `object`<br>
Default: `undefined`

The data to render templates in source directory. If it's set we'll skip `prompts`.

##### prompts

Type: `Array<InquirerPrompt>`<br>
Default: `undefined`

[inquirer](https://github.com/SBoudrias/Inquirer.js) prompts, you can use this to get data from user. If it's set it will override `data`

##### defaultData

Type: `object`<br>
Default: `undefined`

The data that prompts answers will assign to, `Object.assign({}, defaultDate, answers)`

##### skipInterpolation

Type: `string | Array<string> | function`<br>
Default: `undefined` (we skip all [binary files](https://github.com/sindresorhus/is-binary-path) by default)

Patterns([minimatch](https://github.com/isaacs/minimatch#features)) used to skip interpolation, eg: `./foo*/bar-*.js`

It could also be a function, whose first arg is file path and second arg is file content, eg. we want to exclude all `.js` files:

```js
copy(src, dest, {
  skipInterpolation(file, content) {
    return /\.js$/.test(file)
  }
})
```

##### filters

Type: `object`<br>
Default: `undefined`

An object containing file filter rules, the key of each entry is a minimatch pattern, and its value is a JavaScript expression evaluated in the context of (prompt answers) data:

```js
copy(src, dest, {
  filters: {
    '**/*.js': 'useJavaScript',
    '**/*.ts': '!useJavaScript'
  }
})
```

---

**kopy** © [EGOIST](https://github.com/egoist), Released under the [MIT](https://egoist.mit-license.org/) License.<br>
Authored and maintained by EGOIST with help from contributors ([list](https://github.com/egoist/kopy/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
