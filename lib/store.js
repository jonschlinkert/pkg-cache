'use strict';

var debug = require('debug')('get-pkgs-store');
var utils = require('./utils');

function Store(name, options) {
  debug('initializing store', __filename);

  this.options = options || {};
  this.dates = new utils.Dates(name, this.options);
  this.store = new utils.Store(name, this.options);
  this.cache = this.dates.cache.__data__;
  var self = this;

  this.store.on('set', function(key) {
    self.dates.set(key);
  });
}

Store.prototype.set = function(key, val) {
  debug('setting <%s>', key);
  this.store.set(key, val);
  return this;
};

Store.prototype.get = function(key, timespan) {
  timespan = timespan || this.options.timespan;
  if (typeof timespan === 'undefined') {
    return this.store.get(key);
  }
  if (this.dates.lastSaved(key).lessThan(timespan)) {
    return this.store.get(key);
  }
};

Store.prototype.getSince = function(timespan) {
  var keys = this.dates.filterSince(timespan);
  var self = this;

  return keys.reduce(function(acc, key) {
    acc[key] = self.store.get(key);
    return acc;
  }, {});
};

Store.prototype.deleteOlderThan = function(timespan) {
  var cached = {};
  for (var key in this.cache) {
    if (this.cache.hasOwnProperty(key) && this.dates.lastSaved(key).moreThan(timespan)) {
      this.dates.del(key);
      this.store.del(key);
    }
  }
  return cached;
};

Store.prototype.getTimespan = function(timespan, fn) {
  var time = this.dates.time(timespan);
  var cached = {};

  for (var key in this.cache) {
    var saved = this.dates.getTime(key);
    if (typeof fn === 'function' && fn(+saved, +time)) {
      cached[key] = this.store.get(key);
    }
  }
  return cached;
};

Store.prototype.getOlderThan = function(timespan) {
  var time = this.dates.time(timespan);
  var cached = {};

  for (var key in this.cache) {
    var saved = this.dates.getTime(key);
    if (+saved <= +time) {
      cached[key] = this.store.get(key);
    }
  }
  return cached;
};

Store.prototype.getNewerThan = function(timespan) {
  var time = this.dates.time(timespan);
  var cached = {};

  for (var key in this.cache) {
    var saved = this.dates.getTime(key);
    if (+saved >= +time) {
      cached[key] = this.store.get(key);
    }
  }
  return cached;
};

/**
 * Expose `Store`
 */

module.exports = Store;
