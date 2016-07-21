'use strict';

var _ = require('lodash');
var config = require('../../config/environment');

exports.index = function(req, res) {
  res.json([]);
};
/*
exports.qrgun = function(req,res,next){
  var request = require('request');
  //require('request').debug = true;
  var hostname = req.host.split('.').shift();
  var options = {
    url: config.api.uri+'/qrgun/'+req.params.id,
    headers: {
      'origin':req.host,
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    json:true
  };
  request(options, function (error, response, body) {
    if(error){
      console.error(error);
      res.send('系统错误！');
      return;
    }
    if(response.statusCode !== 200){
      var message = body.errmsg?body.errmsg:'系统错误！';
      res.send(message);
      return;
    }
    if (!error && response.statusCode == 200) {
      req.qrgun = body;
      next();
    }
  });
};
exports.qrcode = function(req, res) {
  var text = req.qrgun.qrgun.toUpperCase()+':'+req.qrgun.id;
  var QRCode = require('qrcode');
  QRCode.toDataURL(text,function(err,src){
    res.render('qrcode',{src:src,id:req.qrgun.id});
  });
};*/
exports.qrcode = function(req, res) {
  var text = '91PINTUAN:'+req.params.id;
  var QRCode = require('qrcode');
  QRCode.toDataURL(text,function(err,src){
    res.render('qrcode',{src:src,errmsg:''});
  });
};