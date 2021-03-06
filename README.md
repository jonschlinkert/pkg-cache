# pkg-cache [![NPM version](https://img.shields.io/npm/v/pkg-cache.svg?style=flat)](https://www.npmjs.com/package/pkg-cache) [![NPM downloads](https://img.shields.io/npm/dm/pkg-cache.svg?style=flat)](https://npmjs.org/package/pkg-cache) [![Build Status](https://img.shields.io/travis/jonschlinkert/pkg-cache.svg?style=flat)](https://travis-ci.org/jonschlinkert/pkg-cache)

Gets the package.json for one or more names from the npm registry and caches the results for a specified period of time. Default cache period is one week.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save pkg-cache
```

## Usage

```js
var pkgCache = require('pkg-cache');
```

## API

### [pkgCache](index.js#L44)

Get the package.json for one or more `names`. Results are cached for 1 week by default.

**Params**

* `names` **{String|Array}**: package names
* `options` **{Object}**
* `callback` **{Function}**
* `returns` **{Array}**: Returns an array of package.json objects.

**Example**

```js
// results are cached for 1 week by default
pkgCache(['micromatch', 'base'], function(err, pkgs) {
  if (err) throw err;
  console.log(pkgs);
});

// customize the cache "max age"
pkgCache(['micromatch', 'base'], {timespan: '1 week ago'}, function(err, pkgs) {
  if (err) throw err;
  console.log(pkgs);
});

// or
pkgCache(['micromatch', 'base'], {maxAge: '0 sec'}, function(err, pkgs) {
  if (err) throw err;
  console.log(pkgs);
});
```

## Related projects

You might also be interested in these projects:

* [data-store](https://www.npmjs.com/package/data-store): Easily get, set and persist config data. | [homepage](https://github.com/jonschlinkert/data-store "Easily get, set and persist config data.")
* [date-store](https://www.npmjs.com/package/date-store): Easily persist or get stored dates/times. Useful for conditionally making updates in an application based… [more](https://github.com/jonschlinkert/date-store) | [homepage](https://github.com/jonschlinkert/date-store "Easily persist or get stored dates/times. Useful for conditionally making updates in an application based on the amount of time that has passed.")
* [get-pkg](https://www.npmjs.com/package/get-pkg): Get the package.json for a project from npm. | [homepage](https://github.com/jonschlinkert/get-pkg "Get the package.json for a project from npm.")
* [get-pkgs](https://www.npmjs.com/package/get-pkgs): Get the package.json for an array of repos from the npm registry, optionally filtering properties… [more](https://github.com/jonschlinkert/get-pkgs) | [homepage](https://github.com/jonschlinkert/get-pkgs "Get the package.json for an array of repos from the npm registry, optionally filtering properties using glob patterns.")

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

_(This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/pkg-cache/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 29, 2016._