'use strict';

angular.module('seekerApp')
    .controller('NewNodeCtrl', function ($scope, $modalInstance, node, getHeader) {

        // static data
        var hint = {};
        hint['source'] = ['State Periodical Report', 'Committee of Experts\' evaluation report', 'Committee of Ministers\' Recommendation'];
        hint['cycle'] = [1, 2, 3, 4, 'last']; // only example
        hint['language'] = ['Albanian', 'Arabic', 'Aragonese', 'Aranese', 'Armenian', 'Assyrian', 'Asturian', 'Basque', 'Beás', 'Belarusian', 'Berber', 'Bosnian', 'Bulgarian', 'Bunjevac', 'Burgenlandcroatian', 'Caló', 'Catalan', 'Cornish', 'Crimean Tatar', 'Croatian', 'Cypriot Maronite Arabic', 'Czech', 'Danish', 'Finnish', 'French', 'Frisian', 'Gagauz', 'Galician', 'Georgian', 'German', 'Greek', 'Hungarian', 'Inari Sámi', 'Irish', 'Italian', 'Karaim', 'Karelian', 'Kashub', 'Krimchak', 'Kurdish', 'Kven', 'Ladino', 'Lemko', 'Limburgish', 'Lithuanian', 'Low German', 'Lower Saxon', 'Lower Sorbian', 'Lule Sámi', 'Macedonian', 'Manx Gaelic', 'Meänkieli', 'Moldovan', 'Montenegrin', 'North Frisian', 'North Sámi', 'Polish', 'Portuguese', 'Romanes', 'Romani', 'Romanian', 'Romansh', 'Russian', 'Ruthenian', 'Sater Frisian', 'Scots', 'Scottish-Gaelic', 'Serbian', 'Skolt Sámi', 'Slovakian', 'Slovenian', 'South Sámi', 'Swedish', 'Tatar', 'Turkish', 'Ukrainian', 'Ulster Scots', 'Upper Sorbian', 'Valencian', 'Vlach', 'Welsh', 'Yenish', 'Yezidi', 'Yiddish'];
        hint['country'] = ['Armenia', 'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Finland', 'Germany', 'Hungary', 'Liechtenstein', 'Luxembourg', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Romania', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'];

        $scope.node = node;
        $scope.modal = {};
        $scope.modal.header = 'Creating new node...';
        $scope.child = {};
        $scope.child.type = '';
        $scope.child.value = [];

        $scope.ok = function () {
            $modalInstance.close('something to return'); // return new node
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // item functions
        $scope.remove = function (index) {
            $scope.child.value.splice(index, 1);
        };

        $scope.addEmpty = function () {
            $scope.child.value.push({value: ''});
        }

        $scope.switch = function (type) {
            $scope.child.type = type;
        }

        //console.log('Legal children:', node.legalChildren());
        //$scope.children = node.legalChildren().filter(function (k, v) { return v; }).map(function (k, v) { return k; });
        //console.log($scope.children);

        function createTabs() {
            var census = node.legalChildren();
            for(var child in census) {
                if (census[child]) {
                    $scope.tabs.push({type: child});
                }
            }
        }

        $scope.tabs = [
            //{'title'}
        ];

        createTabs();

        var validate = false; // TODO: change

        function check(item, model, label) {

        }

        function objectify(lst) {
            return lst.map(function (val) {
                return {value: val};
            });
        }

        $scope.list = objectify(hint[$scope.child.type] || []);

    });