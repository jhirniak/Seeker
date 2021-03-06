'use strict';

var api = require('./controllers/api'),
    Document = require('./models/document'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // MongoDB models
  app.route('/api/documents')
    .get(function (req, res) {
        Document.find(function (err, components) {
            if (err) {
                res.send(err);
            } else {
                res.json(components);
            }
        });
    });

  app.route('/api/document')
    .get(function (req, res) {
      console.log(req.query);
      Document.find(req.query, function (err, components) {
          if (err) {
              res.send(err);
          } else {
              res.json(components);
          }
      });
    });

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);

};