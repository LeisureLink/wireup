var util = require('util');


var wireup = require('../../').dir(__dirname);

// arguments contributed by the root,
// and this ->                     v
var jsonify = wireup('../jsonify', 1);

// are injected here ->                     v     v
// jsonify:module.exports.wireup = function(show, elid) { /* ... */ }

var data = {
  purpose: 'shows that modules may contribute values in the wireup call',
  elided: [ {
    since: 'this module added a second argument to the one contributed by ' +
     'the root, this won`t show in the output' }
    ]
};

util.log(jsonify(data));
