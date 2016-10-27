/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var riot = require('riot');
var Application = require('../client/framework/Pagan');

module.exports = function (app) {

  // Insert routes below
  app.use('/config', require('./api/config'));
  app.use('/user', require('./api/user'));

  app.use('/*', function (req, res, next) {
    console.warn('!!!!!!!');
    var tag = require('../client/app/app.tag');
    var app = new Application();
    var html = riot.render(tag, { store: app.store });
    console.warn(html);
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*').get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*').get(function (req, res) {
    console.warn(app.get('appPath'));
    res.sendfile(app.get('appPath') + '/index.html');
  });
};