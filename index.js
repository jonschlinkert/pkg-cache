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
 * pkgCache(['micromatch', 'generate'], function(err, pkgs) {
 *   if (err) throw err;
 *   console.log(pkgs);
 * });
 *
 * // cache for
 * pkgCache(['micromatch', 'generate'], function(err, pkgs) {
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
  var cached = cache.getNewerThan(timespan);
  var keys = Object.keys(cached);
  var uncached = utils.filter(names, keys);

  utils.pkgs(uncached, function(err, res) {
    if (err) return cb(err);

    for (var i = 0; i < res.length; i++) {
      cache.set(res[i].name, res[i]);
    }

    if (keys.length && options.nostore !== true) {
      keys.forEach(function(key) {
        res.push(cached[key]);
      });
    }

    cb(null, res, uncached);
  });
};
