'use strict';

var assert = require('assert-plus');
var util = require('util');
var path = require('path');

var _root;
var _args = [];
var _def;

function Wireup(dir) {
  this._dir = dir;
}

Wireup.prototype.wireup = function wireup(mod, rootRelative) {
  assert.string(mod, 'mod');
  assert.ok(mod.length, 'mod cannot be empty');
  if (mod[0] === '.') {
    var where = (rootRelative && _root) ? _root : this._dir;
    assert.string(where, 'could not calculate base path');
    mod = path.normalize(path.join(where, mod));
  }
  var m = require(mod);
  if (typeof(m.wireup) === 'function') {
    m.wireup.apply(m, _args);
  }
  return m;
};

_def = new Wireup();
var exp = module.exports = _def.wireup.bind(_def);

exp.root = function root(dir, args) {
  assert.string(dir, 'dir');
  assert.ok(!_root, 'root is already assigned');
  _root = dir;
  _args = Array.isArray(args) ? args : [args];
  var sub = new Wireup(dir);
  return sub.wireup.bind(sub);
};
exp.dir = function dir(dir) {
  assert.string(dir, 'dir');
  var sub = new Wireup(dir);
  return sub.wireup.bind(sub);
};
