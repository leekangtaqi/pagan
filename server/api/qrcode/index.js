'use strict';

var express = require('express');
var controller = require('./qrcode.controller');

var router = express.Router();

router.get('/', controller.qrcode_query);
router.get('/:id', controller.qrcode); 
router.get('/:id/qrcode', controller.qrcode_img);
router.get('/gift/:id', controller.gift_get,controller.gift_qrcode);

module.exports = router;
