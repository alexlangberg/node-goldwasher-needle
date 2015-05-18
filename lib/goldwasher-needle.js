// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var goldwasher = require('goldwasher');
var needle = require('needle');
var R = require('ramda');

/**
 * Gets default options and merges with user options if any.
 * @param url
 * @param options
 * @returns {Object|*}
 */
var getDefaults = function(url, options) {
  var defaults = {
    goldwasher: {
      url: url
    },
    needle: {
      follow_max: 20
    },
    goldwasherNeedle: {
      disallowHeader: 'x-goldwasher-version'
    }
  };

  if (!options) {
    options = {};
  }

  return R.merge(defaults, options);
};

/**
 * Add "needle" function to goldwasher.
 * Use needle to get content of a site, pass to goldwasher and return result.
 * @param url
 * @param userOptions
 * @param callback
 */
goldwasher.needle = function(url, userOptions, callback) {
  var options;
  if (typeof (userOptions) === 'function') {
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
      return callback(
        new Error('Too many redirects. Increase in needle options.'),
        null,
        response
      );
    }

    if (response.statusCode !== 200) {
      return callback(
        new Error('Request failed. Status code: ' + response.statusCode),
        null,
        response
      );
    }

    if (response.headers[options.goldwasherNeedle.disallowHeader]) {
      return callback(
        new Error('Please do not call other goldwashers.'),
        null,
        response
      );
    }

    if (options.goldwasher.output === 'raw') {
      return callback(null, body, response);
    }

    result = goldwasher(body, options.goldwasher);

    return callback(null, result, response, body);
  });
};