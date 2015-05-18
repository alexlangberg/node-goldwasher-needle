'use strict';

var goldwasher = require('goldwasher');
var needle = require('needle');
var R = require('ramda');

var getDefaults = function(url, options) {
  var defaults = {
    goldwasher: {
      url: url
    },
    needle: {
      follow_max: 20
    }
  };

  if (!options) {
    options = {};
  }

  return R.merge(defaults, options);
};

goldwasher.needle = function(url, userOptions, callback) {
  var options;
  if (typeof(userOptions) === 'function') {
    callback = userOptions;
    options = getDefaults(url);
  } else {
    options = getDefaults(url, userOptions);
  }

  needle.get(url, options.needle, function(error, response, body) {
    var result;

    if (error) {
      return callback(error);
    }

    if (response.statusCode === 301 || response.statusCode === 302) {
      return callback(new Error('Too many redirects. Increase in needle options.'));
    }

    if (response.statusCode !== 200) {
      return callback(
        new Error('Request failed. Status code: ' + response.statusCode)
      );
    }

    if (response.headers['x-goldwasher-version']) {
      return callback(new Error('Please do not call other goldwashers.'));
    }

    if (options.goldwasher.output === 'raw') {
      return callback(null, body);
    }

    result = goldwasher(body, options.goldwasher);

    return callback(null, result, response, body);
  });
};

module.exports = function () {
  return goldwasher;
};