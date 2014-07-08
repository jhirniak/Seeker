'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, node) {

        // data
        $scope.modal = {
            header: 'Test header',
            text: 'change me'
        };

        $scope.node = node;

        // functions
        $scope.ok = function () {
            $modalInstance.close('something to return');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // parsing / responding


});