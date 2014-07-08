'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, node) {
        $scope.modal = {
            header: 'Test header',
            text: 'change me'
        };

        $scope.ok = function () {
            $modalInstance.close('something to return');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.node = node;

        console.log('Received node', node);

});