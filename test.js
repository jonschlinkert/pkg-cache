'use strict';

require('mocha');
// require('time-require');
var assert = require('assert');
var utils = require('./lib/utils');
var pkgCache = require('./');

describe('pkg-cache', function() {
  it('should export a function', function() {
    assert.equal(typeof pkgCache, 'function');
  });

  it('should get an array of packages from npm', function(cb) {
    var fixtures = ['base', 'base-task', 'base-option'];
    pkgCache(fixtures, function(err, res) {
      if (err) return cb(err);
      assert.deepEqual(utils.values(res, 'name').sort(), fixtures.sort());
      cb();
    });
  });

  it('should expose the array of uncached package names as the last argument', function(cb) {
    var fixtures = ['base', 'base-task', 'base-option'];
    pkgCache(fixtures, function(err, res, arr) {
      if (err) return cb(err);
      assert.deepEqual(arr.sort(), fixtures.sort());
      cb();
    });
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      pkgCache();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected a callback function');
      cb();
    }
  });
});
