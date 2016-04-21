/*!
 * pkg-cache (https://github.com/jonschlinkert/pkg-cache)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('pkg-cache');
var utils = require('./lib/utils');

module.exports = pkgCache;

function pkgCache(names, options, cb) {
  debug('getting the package.json for:', names);

  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (typeof cb !== 'function') {
    throw new Error('expected a callback function');
  }

  options = options || {};
  names = utils.arrayify(names).slice();

  var timespan = options.timespan || '1 week ago';
  var dates = new utils.Dates('pkg-cache', options);
  var store = new utils.Store('pkg-cache', options);

  var stored = utils.getEach(store, dates, timespan, names);
  var arr = utils.filter(names, stored);

  utils.pkgs(arr, function(err, res) {
    if (err) return cb(err);
    utils.setEach(store, dates, res);
    cb(null, res.concat(stored), arr);
  });
}
