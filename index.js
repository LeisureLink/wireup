'use strict';

var util = require('util');
var path = require('path');

function WireupContext(loader, parent, a) {
  var _loader = loader;
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

  function setLoader(loader) {
    _loader = loader;
    return wireup;
  }
  Object.defineProperties(this, {
    invoke: {
      value: function invoke(target) {
        var args = contextArgs();
        var aa = (arguments.length > 1) ?
          args.concat(Array.prototype.slice.call(arguments, 1)) :
          args;
        var cx = new WireupContext(_loader, this, args);
        target.apply(cx, aa);
      }
    },
    loadModule: {
      value: function loadModule(file) {
        if (file[0] === '.') {
          if (!_dir) {
            throw new Error('wireup`s #dir function must be called so wireup can work with relative files.');
          }
          file = path.normalize(path.join(_dir, file));
        }
        return _loader(file);
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
    loader: {
      value: setLoader,
      enumerable: true
    },
    dir: {
      value: setDir,
      enumerable: true
    }
  });
  wireup.args = setArgs;
  wireup.dir = setDir;
  wireup.loader = setLoader;
  this.wireup = wireup;
}

WireupContext.prototype.wireup = function wireup(mod) {
  var args = Array.prototype.slice.call(arguments);
  if (typeof(mod) === 'string') {
    mod = this.loadModule(mod);
  }
  if (typeof(mod.wireup) === 'function') {
    args[0] = mod.wireup;
    this.invoke.apply(this, args);
  }
  return mod;
};

var _root = new WireupContext(require, null, null);
module.exports = _root.wireup;
