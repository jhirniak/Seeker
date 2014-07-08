'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope) {
        $scope.modal = {
            header: 'Test header'
        }
        $scope.text = 'change me';
});