'use strict';

angular.module('seekerApp')
    .controller('ResultCtrl', function ($scope, $http) {

        $scope.doc = {};
        $scope.doc.header = 'Search result';

        $http.get('api/document', {params: {title: 'test document'}})
            .success(function (result) {
                console.log('Worked and got', result);
                $scope.doc.content = result;
            })
            .error(function (data, status) {
                console.log('Error');
            });

        /*$http.get('api/documents')
            .success(function (result) {
                $scope.doc.content = result;
            })
            .error(function (data, status, headers, config) {
               console.log('Failed to fetch data. Status code:', status);
            });*/

    });