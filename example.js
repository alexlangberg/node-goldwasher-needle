'use strict';

var goldwasher = require('goldwasher');
var goldwasherNeedle = require('./lib/goldwasher-needle');

goldwasher.needle('https://alexlangberg.dk', function(error, result) {
  console.log(result);
});