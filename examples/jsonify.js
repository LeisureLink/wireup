// demonstrates making a module wireup enabled.

var util = require('util');

var _show_the_privates = false;
var _elid_after_n = 2;

module.exports = function possiblyElidedJsonify(obj) {
  return util.inspect(
    obj,
    _show_the_privates,
    _elid_after_n
    );
};

module.exports.wireup = function wireup(show, elid) {
  util.log(util.format('show: %s', show));
  util.log(util.format('elid: %s', elid));
  _show_the_privates = show;
  // make sure the "levels" is an int
  _elid_after_n = ~~((typeof (elid) === 'number') ? elid : _elid_after_n);
};