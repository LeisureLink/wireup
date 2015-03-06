var util = require('util');

// arguments contributed by the root,
// and this ->                                v
var wireup = require('../../').dir(__dirname, 0);

// are injected here ->         v
var jsonify = wireup('../jsonify');

var data = {
  purpose: 'shows that modules may wireup root relative',
  elided: [ {
    since: 'this module added a second argument to the one contributed by ' +
     'the root, this won`t show in the output' }
    ]
};

util.log(jsonify(data));

