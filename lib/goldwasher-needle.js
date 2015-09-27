// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var R = require('ramda');
var goldwasher = require('goldwasher');
var needle = require('needle');
var retry = require('retry');

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
    },
    retry: {
      retries: 5
    }
  };

  if (!options) {
    return defaults;
  }

  return {
    goldwasher: R.merge(defaults.goldwasher, options.goldwasher),
    needle: R.merge(defaults.needle, options.needle),
    retry: R.merge(defaults.retry, options.retry),
    goldwasherNeedle: R.merge(
      defaults.goldwasherNeedle,
      options.goldwasherNeedle
    )
  };
};

var run = function(url, options, callback) {
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

    try {
      result = goldwasher(body, options.goldwasher);
      return callback(null, result, response, body);
    } catch(error) {
      return callback(error);
    }

  });
};

/**
 * Use needle to get content of a site, pass to goldwasher and return result.
 * @param url
 * @param userOptions
 * @param callback
 */
module.exports = function(url, userOptions, callback) {
  var operation;
  var options;
  if (typeof (userOptions) === 'function') {
    callback = userOptions;
    options = getDefaults(url);
  } else {
    options = getDefaults(url, userOptions);
  }

  operation = retry.operation(options.retry);
  operation.attempt(function() {
    run(url, options, function(error, result, response, body) {
      if (operation.retry(error)) {
        return;
      }

      return callback(
        error ? operation.mainError() : null,
        error ? url : result,
        response,
        body
      );
    });
  });
};