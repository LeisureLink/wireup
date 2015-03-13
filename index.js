'use strict';

var util = require('util');
var path = require('path');

function WireupContext(parent, a) {
  var _args = a || [];
  var _local;
  var _dir;

  function contextArgs() {
    return _local || _args;
  }

  var self = this;
  var wireup = WireupContext.prototype.wireup.bind(this);

  function setArgs() {
    if (arguments.length) {
      _local = _args.concat(Array.prototype.slice.call(arguments));
    } else {
      _local = undefined;
    }
    return wireup;
  }

  function setDir(dir) {
    _dir = dir;
    if (arguments.length > 1) {
      self.args.apply(self, Array.prototype.slice.call(arguments, 1));
    }
    return wireup;
  }
  Object.defineProperties(this, {
    invoke: {
      value: function invoke(target) {
        var args = contextArgs();
        var aa = (arguments.length > 1) ?
          args.concat(Array.prototype.slice.call(arguments, 1)) :
          args;
        var cx = new WireupContext(this, args);
        target.apply(cx, aa);
      }
    },
    makeRelative: {
      value: function makeRelative(file) {
        if (!_dir) {
          throw new Error('wireup`s #dir function must be called so wireup can work with relative files.');
        }
        return path.normalize(path.join(_dir, file));
      },
      enumerable: true
    },
    rootRelative: {
      value: function rootRelative() {
        return _root.wireup.apply(_root, Array.prototype.slice.call(arguments));
      },
      enumerable: true
    },

    args: {
      value: setArgs,
      enumerable: true
    },
    dir: {
      value: setDir,
      enumerable: true
    }
  });
  wireup.args = setArgs;
  wireup.dir = setDir;
  this.wireup = wireup;
}

WireupContext.prototype.wireup = function wireup(mod) {
  var args = Array.prototype.slice.call(arguments);
  if (typeof(mod) === 'string') {
    if (mod[0] === '.') {
      mod = this.makeRelative(mod);
    }
    mod = require(mod);
  }
  if (typeof(mod.wireup) === 'function') {
    args[0] = mod.wireup;
    this.invoke.apply(this, args);
  }
  return mod;
};

var _root = new WireupContext();
module.exports = _root.wireup;
