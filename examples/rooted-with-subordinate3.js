// demonstrates an application root's use of wireup
//   also, wires up a subordinate that itself wires up another.

var util = require('util');

// this ->                                 vvvvv
var wireup = require('../').dir(__dirname, false);

// is implied here ->                           v
var sub = wireup('./subs/call-adds-arg-to-wireup');

