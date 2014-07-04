'use strict';

angular.module('seekerApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
