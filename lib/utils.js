'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

require('date-store', 'Dates');
require('data-store', 'Store');
require('get-pkgs', 'pkgs');
require = fn;

utils.maxAge = function(str) {
  return str.replace(/\s*(ago|old)?$/g, ' ago');
};

utils.filter = function(names, cached) {
  return utils.removeEach(names, utils.values(cached, 'name'));
};

utils.values = function(arr, prop) {
  return arr.map(function(ele) {
    return ele[prop];
  });
};

utils.removeEach = function(arr, names) {
  names = utils.arrayify(names);
  var len = names.length;
  var idx = -1;
  while (++idx < len) {
    utils.remove(arr, names[idx]);
  }
  return arr;
};

utils.remove = function(arr, str) {
  arr = utils.arrayify(arr);
  var last = arr.pop();
  var len = arr.length;
  var idx = -1;

  while (++idx < len) {
    if (arr[idx] === str) {
      arr[idx] = last;
      break;
    }
  }
  return arr;
};

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Get the package.json from the given module in node_modules.
 *
 * @param  {String} `name` The name of the module
 * @return {Object}
 */

utils.node_modules = function(name) {
  try {
    return require(path.resolve('node_modules', name, 'package.json'));
  } catch (err) {}
  return {};
};

/**
 * Expose utils
 */

module.exports = utils;
