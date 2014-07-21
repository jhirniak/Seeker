'use strict';

angular.module('seekerApp')
    .controller('ResultCtrl', function ($scope, $http) {

        $scope.doc = {};
        $scope.doc.header = 'Search result';

        $http.get('/api/documents')
            .success(function (result) {
               $scope.doc.content = result;
            });

    });