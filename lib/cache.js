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

  this.store.on('set', function(name) {
    self.dates.set(name);
  });
}

Cache.prototype.set = function(name, val) {
  debug('setting <%s>', name);
  this.store.set(name, val);
  return this;
};

Cache.prototype.get = function(name, timespan) {
  timespan = timespan || this.options.timespan;
  var cached = this.store.get(name);
  if (typeof cached === 'undefined') {
    return;
  }

  if (typeof timespan === 'undefined') {
    return cached;
  }

  if (this.dates.lastSaved(name).lessThan(timespan)) {
    return cached;
  }

  if (this.options.node_modules !== false) {
    var pkg = utils.node_modules(name);
    // TODO: consider comparing versions before caching/returning value
    if (pkg && pkg.name) {
      this.set(pkg.name, pkg);
      return pkg;
    }
  }
};

Cache.prototype.getSince = function(timespan) {
  var keys = this.dates.filterSince(timespan);
  var self = this;

  return keys.reduce(function(acc, name) {
    acc[name] = self.store.get(name);
    return acc;
  }, {});
};

Cache.prototype.deleteOlderThan = function(timespan) {
  var cached = {};
  for (var name in this.cache) {
    if (this.cache.hasOwnProperty(name) && this.dates.lastSaved(name).moreThan(timespan)) {
      this.dates.del(name);
      this.store.del(name);
    }
  }
  return cached;
};

Cache.prototype.filterNewerThan = function(names, timespan) {
  var res = [];
  for (var idx = 0; idx < names.length; idx++) {
    res = res.concat(this.get(names[idx], timespan) || []);
  }
  return res;
};

Cache.prototype.getTimespan = function(timespan, fn) {
  var time = this.dates.time(timespan);
  var cached = {};

  for (var name in this.cache) {
    var saved = this.dates.getTime(name);
    if (typeof fn === 'function' && fn(+saved, +time)) {
      cached[name] = this.store.get(name);
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
