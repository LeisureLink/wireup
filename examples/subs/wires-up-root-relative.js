var util = require('util');

module.exports.wireup = function(show) {
  // wireup is called with `this` set to a WireupContext

  // set the wireup context's root dir.
  this.dir(__dirname);

  // Same as wireup, except that the module is resolved relative to the root.
  //   would fail if using require because justify's relative path is ../justify
  //
  var jsonify = this.rootRelative('./jsonify');

  var data = {
    purpose: 'shows that modules may wireup root relative'
  };

  util.log(jsonify(data));
};
