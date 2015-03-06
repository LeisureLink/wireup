// demonstrates an application root's use of wireup
//   also, wires up a subordinate that itself wires up another.

var util = require('util');

var wireup = require('../').root(__dirname);

var sub = wireup('./subs/wires-up-root-relative');

