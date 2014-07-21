'use strict';

angular.module('seekerApp')
    .controller('ResultCtrl', function ($scope, $http) {

        $http.get('http://localhost:9000/api/documents')
            .success(function (result) {
               $scope.docs = result;
            });

    });