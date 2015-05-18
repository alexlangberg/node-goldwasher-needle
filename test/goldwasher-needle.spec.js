'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var goldwasher = require('goldwasher');
var goldwasherNeedle = require('../lib/goldwasher-needle');

describe('test', function() {

  it('loads', function(done) {
    goldwasher.should.have.property('needle');
    done();
  });

  //it('works', function(done) {
  //  console.log(goldwasher.needle());
  //  done();
  //});
});