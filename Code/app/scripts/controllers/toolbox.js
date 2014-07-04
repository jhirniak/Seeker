'use strict';

angular.module('seekerApp')
    .controller('ToolboxCtrl', function ($scope, $location, Auth) {
        $scope.menu = [
            {'title': 'undo'},
            {'title': 'redo'},
            {'title': 'help'}
        ]
    });