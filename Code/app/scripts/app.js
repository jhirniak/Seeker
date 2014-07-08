'use strict';

var seekerApp = angular.module('seekerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.tree',
  'decipher.history'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/query',
        controller: 'QueryCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .when('/feedback', {
        templateUrl: 'partials/feedback',
        controller: 'FeedbackCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });

/* Loading module: when waiting froze the page and display bokeh animation */
seekerApp.factory('Bokeh', function () {
    console.log('Created bokeh animation service.');
    var bokeh = {};
    bokeh.waiting = false;
    bokeh.items = [0, 1, 2, 3];
    bokeh.toggle = function () {
        bokeh.waiting = !bokeh.waiting;
        console.log('Toggled bokeh aniamtion. Waiting: ', bokeh.waiting);
    }
    bokeh.reset = function () {
        bokeh.waiting = false;
        console.log('Reseted bokeh animation. Waiting: ', bokeh.waiting);
    }
    bokeh.set = function () {
        bokeh.waiting = true;
        console.log('Set bokeh animation. Waiting: ', bokeh.waiting);
    }
    return bokeh;
});

/* Format tree data from model to MongoDB query*/
seekerApp.filter('queryLens', function () {
    return function (data) {
        var q = {};
        var queue = [];

        data.forEach(function (node) {
            queue.push(node);
        });

        while (queue.length > 0) {
            var node = queue.shift();

            if (node["type"] !== undefined && node["value"] !== undefined) {
                q[node["type"]] = node["value"];
            }

            if (node.nodes !== undefined) {
                node.nodes.forEach(function (n) {
                    queue.push(n);
                });
            }
        }

        return 'db.docs.find(' + JSON.stringify(q) + ');';
    };
});