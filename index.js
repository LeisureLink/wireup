'use strict';

var util = require('util');
var path = require('path');

var _root;
var _args = [];
var _def;

function wireup(args, dir, mod) {
  var aa;
  if (typeof(mod) === 'string') {
    if (mod[0] === '.') {
      mod = path.normalize(path.join(dir, mod));
    }
    mod = require(mod);
  }
  if (typeof(mod.wireup) === 'function') {
    if (arguments.length > 3) {
      aa = args.concat(Array.prototype.slice.call(arguments, 3));
    }
    mod.wireup.apply(mod, aa || args);
  }
  return mod;
}

function instructional() {
  if (instructional.root) {
    throw new Error('wireup`s #root function must be called to root to your app.');
  }
  throw new Error('wireup`s #dir function must be called so wireup can work with relative files.');
}

instructional.root = function root(dir) {
  if (!dir) {
    throw new Error('root directory must be specified');
  }
  _root = dir;
  delete instructional.root; // app is rooted only once.
  if (arguments.length > 1) {
    _args = Array.prototype.slice.call(arguments, 1);
  }
  return wireup.bind(null, _args, dir);
};

instructional.dir = function dir(dir) {
  if (!dir) {
    throw new Error('directory must be specified');
  }
  var aa = (arguments.length > 1) ?
    _args.concat(Array.prototype.slice.call(arguments, 1)) : _args;
  var bound = wireup.bind(null, aa, dir);
  bound.rootRelative = wireup.bind(null, aa, _root);
  return bound;
};

module.exports = instructional;