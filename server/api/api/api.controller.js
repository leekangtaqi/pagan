'use strict';

var config = require('../../config/environment');
var request = require('request');
//request.debug = true;
//接口：订单列表
exports.order = function(req, res){
  var hostname = req.host.split('.').shift();
  var options = {
    url : config.api.uri + "/partaker/export",
    headers: {
      'origin':req.host,
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    qs:req.query,
    //json:true
  };
  request.get(options,function (error, response, body) {
    if(error) console.error('order_error',error);
    res.send(body);
  });
}
//接口：订单查询
exports.order_get = function(req, res){
  var hostname = req.host.split('.').shift();
  var options = {
    url : config.api.uri + "/partaker/"+req.params.id+"/get",
    headers: {
      'origin':req.host,
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    qs:req.query,
    //json:true
  };
  request.get(options,function (error, response, body) {
    if(error) console.error('order_error',error);
    res.send(body);
  });
}
//接口：交易状态设置
exports.trade = function(req, res){
  var hostname = req.host.split('.').shift();
  var query = req.query;
  var express = {};
  if(query.express_no){
    express = {
      no:query.express_no,
      company:{name:query.express_company}
    };
  }
  var options = {
    url : config.api.uri + "/partaker/"+query.order+"/trade",
    headers: {
      'origin':req.host,
      'X-API-From':'client',
      'X-APPID':hostname,
      'X-Component':config.api.component
    },
    qs:req.query,
    json:true,
    body:{express:express}
  };
  request.post(options,function (error, response, body) {
    if(error) console.error('order_error',error);
    res.send(body);
  });
}
