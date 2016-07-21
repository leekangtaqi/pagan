'use strict';

var _ = require('lodash');

// Get list of qrcodes
exports.index = function(req, res) {
  res.json([]);
};

exports.demo = function(req, res) {
  res.render('audio.html');
};
