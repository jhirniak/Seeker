'use strict';

angular.module('seekerApp')
    .controller('ResultCtrl', function ($scope, $http) {

        $scope.doc = {};
        $scope.doc.header = 'Search result';

        $http.get('api/documents', {timeout: 100000})
            .success(function (result) {
                $scope.doc.content = result;
                //$scope.doc.content = 'success';
            })
            .error(function (data, status, headers, config) {
               console.log('Failed to fetch data. Status code:', status);
            });

    });