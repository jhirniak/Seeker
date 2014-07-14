'use strict';

angular.module('seekerApp')
    .controller('FeedbackCtrl', function ($scope, $http) {
        $scope.title = '';
        $scope.message = '';
    });