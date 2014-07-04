'use strict';

angular.module('seekerApp')
    .controller('BokehCtrl', function ($scope, $location, Bokeh) {
        $scope.bokeh = Bokeh;
    });