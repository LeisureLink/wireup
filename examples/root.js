// demonstrates an application root's use of wireup

var util = require('util');

var wireup = require('../').dir(__dirname);
var jsonify = wireup('./jsonify', true, 1);

var data = {
  where: 'readme-root',
  purpose: 'shows that jsonify transforms data',
  ancillary_purposes: [
    'illustrates that wireup changed jsonify`s defaults',
    { also: 'illustrates that things are elidded bc of our second arg above' }
  ]
};

util.log(jsonify(data));