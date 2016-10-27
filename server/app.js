/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var compression = require('compression')
var app = express();
app.set('env', process.env.NODE_ENV);
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('application is startup %s mode, listen to port %d', config.env, config.port);
});

// start a webpack-dev-server with config
if(process.env.NODE_ENV === 'development'){
  let webpack = require('webpack');
  let WebpackDevServer = require('webpack-dev-server');
  let config = require('../webpack.config.js');
  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    // hot: true,
    historyApiFallback: true,
    proxy: {
      "/api/*": "http://localhost:" + config.devServer.port,
      "/config/*": "http://localhost:" + config.devServer.port
    }
  }).listen(8080, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err);
    }
    console.log(`[system]: Webpack Dev Server is startup, Listening at ${config.ip || 'localhost'}:8080`);
  });  
}

// Expose app
exports = module.exports = app;
