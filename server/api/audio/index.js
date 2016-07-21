'use strict';

var express = require('express');
var controller = require('./audio.controller');

var router = express.Router();

router.get('/', controller.demo);

module.exports = router;