'use strict';

var seekerApp = angular.module('seekerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.tree',
  'decipher.history',
  'ui.bootstrap',
  'ngAnimate',
  'ngGrid'
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
})

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

            if (node.children !== undefined) {
                node.children.forEach(function (n) {
                    queue.push(n);
                });
            }
        }

        return 'db.docs.find(' + JSON.stringify(q) + ');';
    };
});

// conditional text filter
seekerApp.filter('iff', function () {
    return function (condition, onTrue, onFalse) {
        return condition ? onTrue : onFalse;
    }
});

// display list keys (indexes) in human readable form (with indexes starting from 1)
seekerApp.filter('humanizeListKeys', function () {
    return function (lst) {
        if (lst) {
            var keys = [];
            for (var i = 0; i < lst.length; i++) {
                if (lst[i] !== undefined) {
                    keys.push(i + 1);
                }
            }
            return keys.join(', ');
        } else {
            return '';
        }
    }
});

// attach an action the the blur and focus events
// accessed as form values, i.e. formName.fieldName.$focused
seekerApp.directive('ngFocus', [function() {
    var FOCUS_CLASS = "ng-focused";
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$focused = false;
            element.bind('focus', function(evt) {
                element.addClass(FOCUS_CLASS);
                scope.$apply(function() {ctrl.$focused = true;});
            }).bind('blur', function(evt) {
                    element.removeClass(FOCUS_CLASS);
                    scope.$apply(function() {ctrl.$focused = false;});
                });
        }
    }
}]);

/**
 * Checklist-model
 * AngularJS directive for list of checkboxes
 */

seekerApp
    .directive('checklistModel', ['$parse', '$compile', function($parse, $compile) {
        // contains
        function contains(arr, item) {
            if (angular.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], item)) {
                        return true;
                    }
                }
            }
            return false;
        }

        // add
        function add(arr, item) {
            arr = angular.isArray(arr) ? arr : [];
            for (var i = 0; i < arr.length; i++) {
                if (angular.equals(arr[i], item)) {
                    return arr;
                }
            }
            arr.push(item);
            return arr;
        }

        // remove
        function remove(arr, item) {
            if (angular.isArray(arr)) {
                for (var i = 0; i < arr.length; i++) {
                    if (angular.equals(arr[i], item)) {
                        arr.splice(i, 1);
                        break;
                    }
                }
            }
            return arr;
        }

        // http://stackoverflow.com/a/19228302/1458162
        function postLinkFn(scope, elem, attrs) {
            // compile with `ng-model` pointing to `checked`
            $compile(elem)(scope);

            // getter / setter for original model
            var getter = $parse(attrs.checklistModel);
            var setter = getter.assign;

            // value added to list
            var value = $parse(attrs.checklistValue)(scope.$parent);

            // watch UI checked change
            scope.$watch('checked', function(newValue, oldValue) {
                if (newValue === oldValue) {
                    return;
                }
                var current = getter(scope.$parent);
                if (newValue === true) {
                    setter(scope.$parent, add(current, value));
                } else {
                    setter(scope.$parent, remove(current, value));
                }
            });

            // watch original model change
            scope.$parent.$watch(attrs.checklistModel, function(newArr, oldArr) {
                scope.checked = contains(newArr, value);
            }, true);
        }

        return {
            restrict: 'A',
            priority: 1000,
            terminal: true,
            scope: true,
            compile: function(tElement, tAttrs) {
                if (tElement[0].tagName !== 'INPUT' || !tElement.attr('type', 'checkbox')) {
                    throw 'checklist-model should be applied to `input[type="checkbox"]`.';
                }

                if (!tAttrs.checklistValue) {
                    throw 'You should provide `checklist-value`.';
                }

                // exclude recursion
                tElement.removeAttr('checklist-model');

                // local scope var storing individual checkbox model
                tElement.attr('ng-model', 'checked');

                return postLinkFn;
            }
        };
    }]);