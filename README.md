# node-goldwasher-needle
[![npm version](http://img.shields.io/npm/v/goldwasher-needle.svg)](https://www.npmjs.org/package/goldwasher-needle)
[![Build Status](http://img.shields.io/travis/alexlangberg/node-goldwasher-needle.svg)](https://travis-ci.org/alexlangberg/node-goldwasher-needle)
[![Coverage Status](http://img.shields.io/coveralls/alexlangberg/node-goldwasher-needle.svg)](https://coveralls.io/r/alexlangberg/node-goldwasher-needle?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/alexlangberg/node-goldwasher-needle.svg)](https://codeclimate.com/github/alexlangberg/node-goldwasher-needle)

[![Dependency Status](https://david-dm.org/alexlangberg/node-goldwasher-needle.svg)](https://david-dm.org/alexlangberg/node-goldwasher-needle)
[![devDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-needle/dev-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-needle#info=devDependencies)
[![peerDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-needle/peer-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-needle#info=peerDependencies)

Plugin for [goldwasher](https://www.npmjs.org/package/goldwasher) to add [needle](https://www.npmjs.org/package/needle) for easy HTTP requests. Uses [retry](https://www.npmjs.org/package/retry) for robustness. Requires [goldwasher](https://www.npmjs.org/package/goldwasher) to work. If you want to run this as a web server/service, have a look at the module [hapi-goldwasher](https://www.npmjs.com/package/hapi-goldwasher).

## Installation
```
npm install goldwasher-needle
```

## Options
Options can be optionally passed in as the second parameter, as an object with a property ```goldwasher``` for goldwasher options, a property ```needle``` for needle options and a property ```retry``` for retry options. For instance:

```javascript
var options = {
    goldwasher: {
        selector: 'h1'
    },
    needle: {
        follow_max: 20
    },
    retry: {
        retries: 3
    }
}
```

Have a look at their respective doc pages for [goldwasher](https://www.npmjs.org/package/goldwasher), [needle](https://www.npmjs.org/package/needle) and [retry](https://www.npmjs.org/package/retry) for options available.

## Example
```javascript
var gn = require('goldwasher-needle');

gn('http://www.google.com', function(error, result) {
  console.log(result);
});
```

## Advanced example
```javascript
var gn = require('goldwasher-needle');

var url = 'http://www.google.com';
var options = {
  goldwasher: {
    selector: 'h1, h2, h3, h4, h5, h6, p'
  }
};

gn(url, options, function(error, result) {
  console.log(result);
});
```