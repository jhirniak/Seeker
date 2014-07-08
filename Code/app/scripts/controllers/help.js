'use strict';

angular.module('seekerApp')
    .controller('HelpCtrl', function ($scope, $modalInstance, node) {
        $scope.modal = {
            header: 'Test header',
            content: 'To get information about using any query item hover over it for 1 second or click help button for further information.'
        };

        $scope.close = function () {
            $modalInstance.close();
        };
    });