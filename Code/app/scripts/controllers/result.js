'use strict';

angular.module('seekerApp')
    .controller('ResultCtrl', function ($scope, $http) {

        $scope.doc = {};
        o

        $http.get('http://localhost:9000/api/documents')
            .success(function (result) {
               $scope.doc.content = result;
            });

    });