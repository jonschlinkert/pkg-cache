/*!
 * pkg-cache (https://github.com/jonschlinkert/pkg-cache)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('pkg-cache');
var Cache = require('./lib/cache');
var utils = require('./lib/utils');

/**
 * Get the package.json for one or more `names`. Results are cached for
 * 1 week by default.
 *
 * ```js
 * // results are cached for 1 week by default
 * pkgCache(['micromatch', 'base'], function(err, pkgs) {
 *   if (err) throw err;
 *   console.log(pkgs);
 * });
 *
 * // customize the cache "max age"
 * pkgCache(['micromatch', 'base'], {timespan: '1 week ago'}, function(err, pkgs) {
 *   if (err) throw err;
 *   console.log(pkgs);
 * });
 *
 * // or
 * pkgCache(['micromatch', 'base'], {maxAge: '0 sec'}, function(err, pkgs) {
 *   if (err) throw err;
 *   console.log(pkgs);
 * });
 * ```
 * @param {String|Array} `names` package names
 * @param {Object} `options`
 * @param {Function} `callback`
 * @return {Array} Returns an array of package.json objects.
 * @api public
 */

module.exports = function pkgCache(names, options, cb) {
  debug('getting the package.json for:', names);

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    throw new Error('expected a callback function');
  }

  if (typeof options === 'string') {
    options = { timespan: options };
  }

  options = options || {};
  names = utils.arrayify(names).slice();

  var timespan = options.timespan || '1 week ago';
  if (typeof options.maxAge === 'string') {
    timespan = utils.maxAge(options.maxAge);
  }

  var cache = new Cache('pkg-cache', options);
  var cached = cache.filterNewerThan(names, timespan);
  var uncached = utils.filter(names, cached);

  utils.pkgs(uncached, options, function(err, res) {
    if (err) {
      if (err.pkgName && err.message === 'document not found') {
        cache.set(err.pkgName, {});
        cb(null, res, uncached);
        return;
      }
    }

    var found = [];
    for (var i = 0; i < res.length; i++) {
      found = found.concat(res[i].name);
      cache.set(res[i].name, res[i]);
    }

    if (options.silent) {
      for (var i = 0; i < uncached.length; i++) {
        if (found.indexOf(uncached[i]) === -1) {
          cache.set(uncached[i], {});
        }
      }
    }

    if (cached.length && options.nostore !== true) {
      res = res.concat(cached);
    }

    cb(null, res, uncached);
  });
};
