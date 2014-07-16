'use strict';

angular.module('seekerApp')
    .controller('SelectorCtrl', function ($scope, $modalInstance, params) {

        // initialize variables

        var isNew = params.isNew;
        var isRoot = params.isRoot;

        // get list of legal children
        var legalChildren = isRoot ? params.dataRootTypes : Object.keys(params.node.legalChildren()).map(function (type) {
                if (params.node.legalChildren()[type]) {
                    return type;
                }  else {
                    return '';
                }
            }).filter(function (val) {
                return val !== '';
            });

        if (!isRoot) {
            $scope.thisNode = params.node;
        }

        if (isNew) {
            $scope.child = {};
            $scope.child.type = legalChildren[0];
            $scope.child.value = [{value: ''}];
        }

        $scope.header = isRoot ? 'New root' : params.getHeader(params.node);
        $scope.isNew = isNew;

        $scope.node = isNew ? $scope.child : $scope.thisNode; // refers either to node being modified or created (for simplicity)

        // modal functions
        $scope.ok = function () {
            removeAllEmpty();
            removeAllDuplicates();
            sortValues();

            if (isRoot && isNew) {
                params.tree.push(params.createNode($scope.node.type, undefined, $scope.node.value, 1));
            }
            else if (isNew) {
                $scope.thisNode.appendChild({type: $scope.node.type, value: $scope.node.value});
            }

            $modalInstance.close('something to return');
        };

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
        };

        // value operations

        function removeAllEmpty() {
            for (var i = 0; i < $scope.node.value.length; ++i) {
                if (('' + $scope.node.value[i].value).trim() === '') {
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
                return findElem($scope.node.value, 'value', elem.value) == pos;
            });
            console.log('Check if there are any duplicates: ', $scope.node.value);
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
            return hint[$scope.node.type] || [];
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

        console.log('node.value:', $scope.node.value);

        function addAlert(type, msg) {
            $scope.alerts.push({type: type, msg: msg});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };

        // TODO: why not do that in-place? without return
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
            validate: function () { return $scope.node.type; }
        }

        function listAvailable() {
            return $scope.getHints().length > 0;
        }

        function listMode() {
            return $scope.getHints().length <= 10 && listAvailable();
        }

        $scope.listMode = listMode();

        function Tabs() {
            var tabs = [];

            tabs.push({
                title: 'Text',
                active: !$scope.listMode,
                show: function () { return true; },
                //content: 'surprise',
                action: function () { sortValues(); refreshView('switch-conditional'); }
            });

            tabs.push({
                title: 'List',
                active: $scope.listMode,
                show: function () { return listAvailable(); },
                //content: 'list',
                action: function () { refreshView('switch-conditional'); }
            });

            return tabs;
        }

        $scope.tabs = Tabs();
        console.log('Tabs:', $scope.tabs);

        $scope.typeTabs = [];

        // if creating new children of parental node then display tabs of all legal children types (to choose from)
        // otherwise return []
        function createTabs() {
            var tabs = [];

            if (isRoot && isNew) {
                for (var i = 0; i < params.dataRootTypes.length; ++i) {
                    tabs.push(
                        { type: params.dataRootTypes[i],
                          action: function () { $scope.node.type = this.type; console.log('Changed type to', $scope.node.type); refreshView('types'); }
                        });
                }
            } else if (isNew) {
                var active = true;
                legalChildren.forEach( function (type) {
                    tabs.push(
                        { type: type,
                          active: active,
                          action: function () { $scope.node.type = this.type; console.log('Changed type to', $scope.node.type); refreshView('types');}
                        });
                    active = false;
                });

            }

            return tabs;
        }

        function refreshView(action) {
            console.log('action', action, 'listAvailable()', listAvailable(), '$scope.listMode', $scope.listMode);
            if (action === 'types') {
                $scope.list = objectify($scope.getHints()); // refresh list of hints
            }
            if (!listAvailable() && $scope.listMode) {
                console.log('Switching to text from list');
                $scope.listMode = false;
                $scope.tabs[0]['active'] = true;
                $scope.tabs[1]['active'] = false;
            }
        }

        $scope.typeTabs = createTabs();
        console.log('Type tabs:', $scope.typeTabs);

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
            {title: 'Select All', action: function () { $scope.node.value = angular.copy($scope.list); }},
            {title: 'Select None', action: function () { $scope.node.value = []; }}
        ];

        function sortValues() {
            $scope.node.value.sort(function (a, b) { return a.value > b.value; } );
        }

        $scope.textToolbox = [
            {title: 'Sort', action: function () { sortValues(); }}
        ];

});