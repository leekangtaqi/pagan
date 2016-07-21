'use strict';

var express = require('express');
var api = require('./api.controller');

var router = express.Router();

router.get('/order', api.order);
router.get('/order/:id', api.order_get);
router.get('/trade', api.trade);

module.exports = router;
