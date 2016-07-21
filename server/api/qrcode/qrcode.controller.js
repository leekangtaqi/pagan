'use strict';

var _ = require('lodash');
var config = require('../../config/environment');
var request = require('request');
//require('request').debug = true;
var QRCode = require('qrcode');

// Get list of qrcodes
exports.index = function(req, res) {
  res.json([]);
};

exports.qrcode = function(req, res) {
  var hostname = req.host.split('.').shift();
  var options = {
    url: config.api.uri+'/partaker/qrcode',
    method:'POST',
    headers: {
      'origin':req.host,
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    json:true,
    body:{id:req.params.id}
  };
  request(options, function (error, response, body) {
    if(error){
      console.error(error);
      QRCode.toDataURL(req.params.id,function(err,src){
        res.render('qrcode',{src:src});
      });
      return;
    }
    if(response.statusCode !== 200){
      console.error(body);
      QRCode.toDataURL(req.params.id,function(err,src){
        res.render('qrcode',{src:src,errmsg:body.errmsg});
      });
      return;
    }
    if(body.url){
      console.error(body,body.url);
      return res.redirect(body.url);      
    }
    //测试后删除
    QRCode.toDataURL(req.params.id,function(err,src){
      res.render('qrcode',{src:src});
    });//*/
  });
};
exports.qrcode_query = function(req, res) {
  let id = req.query.id?req.query.id:'http://91pt.oss-cn-beijing.aliyuncs.com/home/ymyimg/mylogo.png';
  var QRCode = require('qrcode');
  QRCode.toDataURL(id,function(err,src){
    res.type('png');
    res.send(src);
  });
};
exports.qrcode_img = function(req, res) {
  var QRCode = require('qrcode');
  QRCode.toDataURL(req.params.id,function(err,src){
    res.send(src);
  });
};
exports.gift_get = function(req,res,next){
  var request = require('request');
  //require('request').debug = true;
  var hostname = req.host.split('.').shift();
  var options = {
    url: config.api.uri+'/gift/order/'+req.params.id,
    headers: {
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    json:true
  };
  request(options, function (error, response, body) {
    if(error){
      console.log(error);
      res.send('系统错误！');
      return;
    }
    if(response.statusCode !== 200){
      var message = body.errmsg?body.errmsg:'系统错误！';
      res.send(message);
      return;
    }
    if (!error && response.statusCode == 200) {
      req.order = body;
      next();
    }
  });
};
exports.gift_qrcode = function(req, res) {
  var url = 'http://'+req.host+'/gift/listen/'+req.order.id;
  var QRCode = require('qrcode');
  QRCode.toDataURL(url,function(err,src){
    res.render('qrcode_gift',{src:src,order:req.order});
  });
};
