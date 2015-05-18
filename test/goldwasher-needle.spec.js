// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var goldwasher = require('goldwasher');
var goldwasherNeedle = require('../lib/goldwasher-needle');
var url = 'https://google.com';

describe('initialization', function() {

  it('loads', function(done) {
    goldwasher.should.have.property('needle');
    done();
  });

  it('loads with options', function(done) {
    goldwasher.needle(url, function(error, result, response) {
      done();
    });
  });

  it('loads without options', function(done) {
    var options = {
      goldwasher: {
        selector: 'p'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      done();
    });
  });

});

describe('running', function() {

  it('can request and goldwash a site', function(done) {
    goldwasher.needle(url, function(error, result, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      result.should.be.an('array');
      result.length.should.be.greaterThan(0);
      done();
    });
  });

  it('can request and return a raw site', function(done) {
    var options = {
      goldwasher: {
        output: 'raw'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      result.should.be.a('string');
      done();
    });
  });

});

describe('failures', function() {

  it('handles errors from needle', function(done) {
    goldwasher.needle('foo', function(error, result, response) {
      should.exist(error);
      done();
    });
  });

  it('throws on too many redirects', function(done) {
    var options = {
      needle: {
        follow_max: 0
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      should.exist(error);
      response.statusCode.should.be.within(301, 302);
      done();
    });
  });

  it('throws on 404', function(done) {
    var url = 'https://google.com/foo';
    goldwasher.needle(url, function(error, result, response) {
      should.exist(error);
      response.statusCode.should.equal(404);
      done();
    });
  });

  it('throws on disallowed header', function(done) {
    var options = {
      goldwasherNeedle: {
        disallowHeader: 'content-type'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      should.exist(error);
      done();
    });
  });
});