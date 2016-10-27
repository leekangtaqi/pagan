/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import riot from 'riot';
import Application from '../client/framework/Pagan';
import fetch from 'node-fetch';

module.exports = function(app) {
  global.fetch = fetch;
  // Insert routes below
  app.use('/config', require('./api/config'));
  app.use('/user', require('./api/user'));

  app.use('/*', function(req, res, next){
    console.warn(req.originalUrl)
    var tag = require('../client/app/app.tag');
    var app = Application({container: global});
    riot.renderAsync(tag, {store: app.store})
      .then(function(html){
        return res.render('index', {html});
      })
      .catch(function(e){
        console.warn(e);
      })
  })
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      console.warn(app.get('appPath'))
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
