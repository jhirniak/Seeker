'use strict';

angular.module('seekerApp')
    .controller('ToolboxCtrl', function ($scope, $location, Auth) {
        $scope.menu = [
            {'title': 'help'},
            {'title': 'undo'},
            {'title': 'redo'},
            {'title': 'collapse all'},
            {'title': 'expand all'}
        ]
    });