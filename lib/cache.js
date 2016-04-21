'use strict';

var debug = require('debug')('pkg-cache:cache');
var utils = require('./utils');

function Cache(options) {
  debug('initializing cache', __filename);

  this.options = options || {};
  this.dates = new utils.Dates('pkg-cache', this.options);
  this.store = new utils.Store('pkg-cache', this.options);
  this.cache = this.dates.cache.__data__;
  var self = this;

  this.store.on('set', function(key) {
    self.dates.set(key);
  });
}

Cache.prototype.set = function(key, val) {
  debug('setting <%s>', key);
  this.store.set(key, val);
  return this;
};

Cache.prototype.get = function(key, timespan) {
  timespan = timespan || this.options.timespan;
  if (typeof timespan === 'undefined') {
    return this.store.get(key);
  }
  if (this.dates.lastSaved(key).lessThan(timespan)) {
    return this.store.get(key);
  }
};

Cache.prototype.getSince = function(timespan) {
  var keys = this.dates.filterSince(timespan);
  var self = this;

  return keys.reduce(function(acc, key) {
    acc[key] = self.store.get(key);
    return acc;
  }, {});
};

Cache.prototype.deleteOlderThan = function(timespan) {
  var cached = {};
  for (var key in this.cache) {
    if (this.cache.hasOwnProperty(key) && this.dates.lastSaved(key).moreThan(timespan)) {
      this.dates.del(key);
      this.store.del(key);
    }
  }
  return cached;
};

Cache.prototype.getTimespan = function(timespan, fn) {
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

Cache.prototype.getOlderThan = function(timespan) {
  return this.getTimespan(timespan, function(saved, time) {
    return saved <= time;
  });
};

Cache.prototype.getNewerThan = function(timespan) {
  return this.getTimespan(timespan, function(saved, time) {
    return saved >= time;
  });
};

/**
 * Expose `Cache`
 */

module.exports = Cache;
