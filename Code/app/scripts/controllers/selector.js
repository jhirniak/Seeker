'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, node, getHeader) {

        // data
        $scope.modal = {
            header: 'Test header',
            text: 'change me'
        };

        $scope.node = node;
        $scope.header = getHeader(node);

        // functions
        $scope.ok = function () {
            $modalInstance.close('something to return');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // parsing / responding
        $scope.sources = ['Committee of Experts', 'Regulatory Committee', 'Committee of Great Coffee',
            'Committee of Great Changes', 'Interstellar Committee of Interesting Puzzles'];
        $scope.selectedSource = '';

});