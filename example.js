'use strict';

var goldwasher = require('goldwasher');
var goldwasherNeedle = require('./lib/goldwasher-needle');

var url = 'http://www.google.com';
var options = {
  goldwasher: {
    selector: 'h1, h2, h3, h4, h5, h6, p'
  }
};

goldwasher.needle(url, options, function(error, result) {
  console.log(result);
});