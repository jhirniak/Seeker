'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, node, getHeader) {

        $scope.node = node;
        $scope.header = getHeader(node);

        // modal functions

        $scope.ok = function () {
            removeAllEmpty();
            removeAllDuplicates();
            $modalInstance.close('something to return');
        };

        function removeAllEmpty() {
            for (var i = 0; i < node.value.length; ++i) {
                if (('' + node.value[i].value).trim() === '') {
                    $scope.remove(i--);
                }
            }
        }

        // find first position of object with property prop of value val in array/list lst
        // (used for removing duplicates)
        function findElem(lst, prop, val) {
            for (var i = 0; i < lst.length; ++i) {
                if (lst[i][prop] == val) {
                    return i;
                }
            }
            return -1;
        }

        function removeAllDuplicates() {
            $scope.node.value = $scope.node.value.filter(function (elem, pos) {
                return findElem(node.value, 'value', elem.value) == pos;
            });
            console.log('Check if there are any duplicates: ', $scope.node.value);
        }

        $scope.check = function(item, model, label) {
            console.log('Item:', item);
            console.log('Model:', model);
            console.log('Label:', label);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        // item functions
        $scope.remove = function (index) {
            $scope.node.value.splice(index, 1);
        };

        $scope.addEmpty = function () {
            $scope.node.value.push({value: ''});
        }

        // TODO: move all this data to model (database)
        // TODO: can use flags in display countries
        // TODO: export some data to json for other projects reuse
        var hint = {};
        hint['source'] = ['State Periodical Report', 'Committee of Experts\' evaluation report', 'Committee of Ministers\' Recommendation'];
        hint['cycle'] = [1, 2, 3, 4, 'last']; // only example
        hint['language'] = ['Albanian', 'Arabic', 'Aragonese', 'Aranese', 'Armenian', 'Assyrian', 'Asturian', 'Basque', 'Beás', 'Belarusian', 'Berber', 'Bosnian', 'Bulgarian', 'Bunjevac', 'Burgenlandcroatian', 'Caló', 'Catalan', 'Cornish', 'Crimean Tatar', 'Croatian', 'Cypriot Maronite Arabic', 'Czech', 'Danish', 'Finnish', 'French', 'Frisian', 'Gagauz', 'Galician', 'Georgian', 'German', 'Greek', 'Hungarian', 'Inari Sámi', 'Irish', 'Italian', 'Karaim', 'Karelian', 'Kashub', 'Krimchak', 'Kurdish', 'Kven', 'Ladino', 'Lemko', 'Limburgish', 'Lithuanian', 'Low German', 'Lower Saxon', 'Lower Sorbian', 'Lule Sámi', 'Macedonian', 'Manx Gaelic', 'Meänkieli', 'Moldovan', 'Montenegrin', 'North Frisian', 'North Sámi', 'Polish', 'Portuguese', 'Romanes', 'Romani', 'Romanian', 'Romansh', 'Russian', 'Ruthenian', 'Sater Frisian', 'Scots', 'Scottish-Gaelic', 'Serbian', 'Skolt Sámi', 'Slovakian', 'Slovenian', 'South Sámi', 'Swedish', 'Tatar', 'Turkish', 'Ukrainian', 'Ulster Scots', 'Upper Sorbian', 'Valencian', 'Vlach', 'Welsh', 'Yenish', 'Yezidi', 'Yiddish'];
        // document is outdated (proof below, difference between reports and outline)
        // hint['country'] = ['Armenia', 'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Finland', 'Germany', 'Hungary', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Romania', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'];
        hint['country'] = ['Armenia', 'Austria', 'Bosnia and Herzegovina', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Finland', 'Germany', 'Hungary', 'Liechtenstein', 'Luxembourg', 'Montenegro', 'Netherlands', 'Norway', 'Poland', 'Romania', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'];

        $scope.getHints = function () {
            return hint[node.type] || [];
        };

        function objectify(lst) {
            return lst.map(function (val) {
                return {value: val};
            });
        }

        $scope.list = objectify(hint[node.type] || []);

        $scope.selected = '';

        // alerts
        $scope.alerts = [
            /* { type: 'warning', msg: 'Lorem ipsum...'},
            { type: 'info', msg: 'Lorem ipsum...'},
            { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' } */
        ];

        console.log('node.value:', $scope.node.value);

        function addAlert(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        $scope.emptyFields = function () {
            var empty = [];
            for (var i = 0; i < $scope.node.value.length; ++i) {
                if (($scope.node.value[i].value || '').trim() === '') {
                    empty.push(i);
                }
            }
            return empty;
        };

        $scope.anyEmpty = function () {
            for (var i = 0; i < $scope.node.value.length; ++i) {
                if ($scope.node.value[i].value && $scope.node.value[i].value.trim() === '') {
                    return true;
                }
            }
            return false;
        };

        $scope.blurCallback = function () {

        };

        // configuration
        $scope.config = {
            validate: node.type
        }

        $scope.listMode = $scope.getHints().length <= 10 || node.type === 'text';

        $scope.tabs = [
            {
                title: 'Text',
                active: !$scope.listMode,
                //content: 'surprise',
                action: function () { $scope.listMode = false; }
            },
            {
                title: 'List',
                active: $scope.listMode,
                //content: 'list',
                action: function () { $scope.listMode = true; }
            }
        ];

        /* Disabled, see comment in selector.html
        $scope.gridOptions = {
            data: 'list',
            selectedItems: $scope.node.value,
            multiSelect: true,
            afterSelectionChange: function () {
                //$scope.selectedIDs = [];
                $scope.node.value = [];
                angular.forEach($scope.mySelections, function ( val ) {
                    //$scope.selectedIDs.push( item.id ) // item with id property
                    $scope.node.value.push({value:val.value});
                    console.log(val);
                });
            }
        };

        $timeout(function () {
            var hints = $scope.getHints();
            var selected = node.value;
            for (var i = 0; i < selected.length; ++i) {
                var row = hints.indexOf(selected[i]);
                $scope.gridOptions.selectRow(row, true);
            }
        });
        */

        $scope.validate = $scope.getHints().length > 0; // require to specify one of the suggested values


        // list menu options
        $scope.listToolbox = [
            {title: 'Select All', action: function () { node.value = angular.copy($scope.list); }},
            {title: 'Select None', action: function () { node.value = []; }}
        ];

        $scope.textToolbox = [
            {title: 'Sort', action: function () { node.value.sort(function (a, b) { return a.value > b.value; } ); }}
        ];
});