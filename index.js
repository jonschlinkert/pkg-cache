/*!
 * get-pkgs-since (https://github.com/jonschlinkert/get-pkgs-since)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('get-pkgs-since');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('get-pkgs-since')) return;

    this.define('get-pkgs-since', function() {
      debug('running get-pkgs-since');
      
    });
  };
};
