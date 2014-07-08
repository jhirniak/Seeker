'use strict';

angular.module('seekerApp')
  .controller('QueryCtrl', function ($scope, $http, Bokeh, $timeout, History, $modal) {
    /* $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    }); */

    var types = ['source', 'cycle', 'country', 'language', 'section', 'text', 'ordering-root', 'ordering-child', 'decorator-root', 'decorator-child'];
    var rootTypes = ['source', 'ordering-root', 'decorator-root'];
    var infertileTypes = ['language', 'section', 'text', 'ordering-child', 'decorator-child'];
    var uniqueOnPathTypes = ['cycle', 'country'];
    var nodeProperties = ['id', 'type', 'parent', 'children', 'header', 'value', 'appendChild', 'fertile'];

    // example: init trees
    var example = {};
    example['data'] = [
        {
            id: 1,
            type: 'source',
            header: 'Report Type',
            value: 'Committee of Experts',
            children: [
                {
                    id: 11,
                    type: 'cycle',
                    header:'Cycle',
                    value: [1, 'last'],
                    children: [
                        {
                            id: 111,
                            type: 'country',
                            header: 'Country',
                            value: ['UK'],
                            children: [
                                {
                                    id: 1111,
                                    type: 'language',
                                    header: 'Language',
                                    value: ['Scottish-,Gaelic', 'Welsh'],
                                    children: []
                                },
                                {
                                    id: 1112,
                                    type: 'text',
                                    header: 'Contains any of',
                                    value: ['education', 'school'],
                                    children: []
                                }
                            ]
                        }
                ]
            }]
        }
    ];

    // example: init formatting data
    example['formatting'] = [
        { id: 1,
          type: 'ordering-root',
          header: 'Ordering',
          children: [
              {
                  id: 11,
                  type: 'ordering-child',
                  value: 'Language ascending (1111-asc)',
                  children: []
              },
              {
                  id: 12,
                  type: 'ordering-child',
                  value: 'Language ascending (1112-asc)',
                  children: []
              }
          ]
        },
        {
            id: 2,
            type: 'decorator-root',
            header: 'Decorator',
            children :[
                {
                    id: 21,
                    type: 'decorator-child',
                    value: 'some cool template'
                }
            ]
        }
    ];

    // add history functionality to data and formatting (allows to undo/redo) on tree elements
    $scope.trees = {};
    $scope.trees['data'] = nodify(example.data);
    $scope.trees['formatting'] = nodify(example.formatting);

    History.watch('trees', $scope);

    $scope.selectedNode = {};

    $scope.options = {
    };

    $scope.toggle = function (node) {
        node.toggle();
    };

    // opens modal window of 'size' and passes 'node' to its controller
    // size - 'sm' for small, 'lg' for large, nothing for medium
    // node - reference to object which is being modified
    function openModal(size, node, help) {

        var templateUrl = 'partials/selector.html';
        var controller =  'SelectorCtrl';

        if (help) {
            templateUrl = 'partials/help.html';
            controller =  'HelpCtrl';
        }

        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            controller: controller,
            size: size,
            resolve: {
                node: function () {
                    return node;
                }
            }
        });
    };

    $scope.modify = function (node) {
        console.log('Modifying:', node);
        openModal('lg', node);
    };

    $scope.remove = function (node) {
        node.remove();
    };

    $scope.insertAfter = function (node) {
        var nodeData = node.$modelValue;
        nodeData.children.push({
            id: nodeData.id * 10 + nodeData.children.length,
            title: nodeData.title + '.' + (nodeData.children.length + 1),
            children: []
        });
    };

    $scope.help = function (size, node) {
        openModal('lg', node, true);
    }

    // TODO: Replace hints with proper text
    // TODO: Use language package like i18n
    function hintify(text) {
        return 'This is a hint about ' + text + '. To be written and included here.';
    };

    $scope.hint = function (type) {
        return hintify(type) || 'Hint not specified for this type of node.';
    };

    $scope.tooltip = {
         delay: 1000
    }

    $scope.moveLastToTheBeginning = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
    };

    var getRootNodesScope = function() {
        return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
        var scope = getRootNodesScope();
        console.log('collapseAll on scope:', scope);
        scope.collapseAll();
    };

    $scope.expandAll = function() {
        var scope = getRootNodesScope();
        scope.expandAll();
    };

    $scope.resetQuery = function () {
        $scope.trees = [];
    };

    // TODO: add glyphs icons to buttons
    // TODO: generalize menu or make two menus for formatting and query
    $scope.toolboxMenu = [
        {'title': 'help', 'action': function () { $scope.help('lg') }},
        {'title': 'undo', 'action': function () {History.undo('trees', $scope); }},
        {'title': 'redo', 'action': function () {History.redo('trees', $scope); }},
        {'title': 'collapse all', 'action': $scope.collapseAll},
        {'title': 'expand all', 'action': $scope.expandAll},
        {'title': 'reset', 'action': $scope.resetQuery }
    ];

    // TODO: Deal with not working parent part
    function isOnPath(node, type) {
        // scan up (all parents)
        var currNode = node;
        while (currNode !== null) {
            if (currNode.type === type) {
                return true;
            }
            currNode = currNode.parent;
        }

        // scan down (all children)
        var queue = [node];
        while (queue.length > 0) {
            var currNode = queue.shift();
            if (currNode.type === type) {
                return true;
            }
            (currNode.children || []).forEach(function (child) {
                queue.push(child);
            });
        }

        return false;
    }

    // TODO: rewrite to ng
    // returns list of types for given node, legal indicated by true, and illegal by false
    function fertile(node) {
        if (node === null || !node) {
            return false;
        } else {
            return infertileTypes.indexOf(node.type) === -1;
        }
    }

    function FertilityList() {
        var l = {};
        types.forEach(function (t) {
            l[t] = false;
        });
        return l;
    }

    function legalChildren (node) {
        var legal = FertilityList(); // list prototype, all properties are false by default

        if (fertile(node)) {
            // if fertile then can give birth to any infertile type
            infertileTypes.forEach(function (t) {
                legal[t] = true;
            });

            // if fertile and there is no child any path through given node then can give birth to that uniquePathType
            uniqueOnPathTypes.forEach(function (t) {
                legal[t] = !isOnPath(node, t);
            });
        }

        return legal;
    }

    function elemIn(elem, array) {
        return array.indexOf(elem) !== -1;
    }

    function appendChild(parent, child) {
        if ((parent === null || !parent) && !elemIn(child.type, rootTypes)) {
            // should be root type, but is not
            throw 'Expected root type, but found attempt to assign type ' + child.type + ' to parent' + parent;
        } else if (!legalChildren(parent)[child.type]) {
            // illegal children
            throw 'Expected one of the legal children types, i.e. ' + legalChild(parent) + ', but found ' + children.type;
        } else {
            var child = Node(type, child.header, child.value, child.id);
            parent.children.push(child);
        }
    }

    function Node(type, header, value, id) {
        if (!type || types.indexOf(type) === -1) {
            throw 'Expected one of node types: ' + rootTypes + ', but found: ' + type + '.';
        } else {
            return {
                id: id,
                type: type,
                children: [],
                header: header,
                value: value,
                appendChild: function (child) { return appendChild(this, child); },
                fertile: function () { return fertile(this); },
                legalChildren: function () { return legalChildren(this); }
            };
        }
    }

    function nodify(json) {
        var n = [];
        json.forEach(function (node) {
            var children = [];
            if (node.children) {
                children = nodify(node.children);
            }
            var parent = Node(node.type, node.header, node.value, node.id);
            parent.children = children;
            n.push(parent);
        });
        return n;
    }

    $scope.select = function (key, value) {
        switch (key) {
            case "committee":
                alert('Lets deal with committee part');
                break;
            case "cycle":
                alert('Lets deal with cycles');
            default:
                alert('By default');
        }
    };

    $scope.process = function () {
        Bokeh.set();
        $timeout(function () {Bokeh.reset()}, 2000);
    };
  });