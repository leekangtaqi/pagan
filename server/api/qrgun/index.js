'use strict';

var express = require('express');
var controller = require('./qrgun.controller');

var router = express.Router();

router.get('/:id', 
  //controller.qrgun,
  controller.qrcode
);

module.exports = router;
