var util = require('util');

module.exports.wireup = function(show) {
  // wireup is called with `this` set to a WireupContext

  // set the wireup context's root dir.
  this.dir(__dirname);

  // arguments contributed by the root,
  // and this ->                          v
  var jsonify = this.wireup('../jsonify', 1);

  // are injected here ->                     v     v
  // jsonify:module.exports.wireup = function(show, elid) { /* ... */ }

  var data = {
    purpose: 'shows that modules may contribute values in the wireup call',
    elided: [{
      since: 'this module added a second argument to the one contributed by ' +
        'the root, this won`t show in the output'
    }]
  };

  util.log(jsonify(data));
};
