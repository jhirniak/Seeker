'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, node, getHeader, isNew) {

        $scope.thisNode = node;
        $scope.header = getHeader(node);
        $scope.isNew = isNew;

        $scope.child = {};
        $scope.child.type = '';
        $scope.child.value = [];

        $scope.node = getNode();

        function getNode() {
            if (isNew) {
                return $scope.child;
            } else {
                return $scope.thisNode;
            }
        }

        function  getParent() {
            if (isNew) {
                return node;
            } else {
                return undefined;
            }
        }

        function getType() {
            if (isNew) {
                return $scope.child.type;
            } else {
                return $scope.thisNode.type;
            }
        }

        $scope.type = getNode().type;

        // modal functions

        $scope.ok = function () {
            removeAllEmpty();
            removeAllDuplicates();
            // TODO: insert child as node, i.e.
            if (isNew) {
                node.appendChild({type: $scope.child.type, value: $scope.child.value});
            }
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
            var node = getNode();
            node.value = node.value.filter(function (elem, pos) {
                return findElem(node.value, 'value', elem.value) == pos;
            });
            console.log('Check if there are any duplicates: ', node.value);
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
            getNode().value.splice(index, 1);
        };

        $scope.addEmpty = function () {
            getNode().value.push({value: ''});
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
            return hint[getNode().type] || [];
        };

        function objectify(lst) {
            return lst.map(function (val) {
                return {value: val};
            });
        }

        $scope.list = objectify($scope.getHints());

        $scope.selected = '';

        // alerts
        $scope.alerts = [
            /* { type: 'warning', msg: 'Lorem ipsum...'},
            { type: 'info', msg: 'Lorem ipsum...'},
            { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' } */
        ];

        console.log('getNode().value:', getNode().value);

        function addAlert(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // TODO: why not do that in-place? without return
        $scope.emptyFields = function () {
            var empty = [];
            var node = getNode();

            for (var i = 0; i < node.value.length; ++i) {
                if ((node.value[i].value || '').trim() === '') {
                    empty.push(i);
                }
            }

            return empty;
        };

        $scope.anyEmpty = function () {
            var node = getNode();
            for (var i = 0; i < node.value.length; ++i) {
                if (node.value[i].value && node.value[i].value.trim() === '') {
                    return true;
                }
            }
            return false;
        };

        $scope.blurCallback = function () {

        };

        // configuration
        $scope.config = {
            validate: getType()
        }

        $scope.listMode = $scope.getHints().length <= 10 || getType() === 'text';

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

        $scope.typeTabs = [];

        // if creating new children of parental node then display tabs of all legal children types (to choose from)
        // otherwise return []
        function createTabs() {
            if (isNew) {
                var tabs = [];
                var census = node.legalChildren();
                for(var childType in census) {
                    if (census[childType]) {
                        tabs.push({type: childType, action: function () { $scope.child.type = this.type; console.log('Changed type to', this.type); } });
                    }
                }
                return tabs;
            } else {
                return [];
            }
        }

        $scope.typeTabs = createTabs();

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
            {title: 'Select All', action: function () { getNode().value = angular.copy($scope.list); }},
            {title: 'Select None', action: function () { getNode().value = []; }}
        ];

        $scope.textToolbox = [
            {title: 'Sort', action: function () { getNode().value.sort(function (a, b) { return a.value > b.value; } ); }}
        ];

        if (isNew) {
            console.log('Legal children:', node.legalChildren());
        }
});