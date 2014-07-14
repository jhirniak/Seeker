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
    var noValueTypes = ['ordering-root', 'decorator-root'];
    var nodeProperties = ['id', 'type', 'parent', 'children', 'header', 'value', 'appendChild', 'fertile'];

    // example: init trees
    // IMPORTANT: All values must be objects, if they would be string then AngularJS would not register every change to them (it is the recommended approach)
    var example = {};
    example['data'] = [
        {
            id: 1,
            type: 'source',
            value: [{value: 'Committee of Experts'}],
            children: [
                {
                    id: 11,
                    type: 'cycle',
                    value: [{value: 1}, {value: 'last'}],
                    children: [
                        {
                            id: 111,
                            type: 'country',
                            value: [{value: 'United Kingdom'}],
                            children: [
                                {
                                    id: 1111,
                                    type: 'language',
                                    value: [{value: 'Scottish-Gaelic'}, {value: 'Welsh'}],
                                    children: []
                                },
                                {
                                    id: 1112,
                                    type: 'text',
                                    value: [{value: 'education'}, {value: 'school'}],
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
          children: [
              {
                  id: 11,
                  type: 'ordering-child',
                  value: [{value: 'Language ascending (1111-asc)'}],
                  children: []
              },
              {
                  id: 12,
                  type: 'ordering-child',
                  value: [{value: 'Language ascending (1112-asc)'}],
                  children: []
              }
          ]
        },
        {
            id: 2,
            type: 'decorator-root',
            children :[
                {
                    id: 21,
                    type: 'decorator-child',
                    value: [{value: 'some cool template'}]
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
    // validate - does fields require validation (check if entered value is one of the legal ones)
    // help - display in help mode?
    function openModal(size, node, template) {

        var templateUrl, controller;

        switch (template) {
            case 'help':
                templateUrl = 'partials/help.html';
                controller =  'HelpCtrl';
                break;
            case 'new':
                //templateUrl = 'partials/newnode.html';
                //controller =  'NewNodeCtrl';
                //break;
            default:
                templateUrl = 'partials/selector.html';
                controller =  'SelectorCtrl';
        }

        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            controller: controller,
            size: size,
            resolve: {
                node: function () { return node; },
                getHeader: function () { return $scope.getHeader; },
                isNew: function () { return template === 'new'; }
            }
        });
    };

    $scope.modify = function (node) {
        console.log('Modifying:', node);
        openModal('lg', node, 'modify');
    };

    $scope.remove = function (node) {
        node.remove();
    };

    $scope.insertAfter = function (node) {
        console.log('Making child for:', node);
        openModal('lg', node, 'new');
        /*
        var nodeData = node.$modelValue;
        nodeData.children.push({
            id: nodeData.id * 10 + nodeData.children.length,
            type: 'text',
            value: [{value: nodeData.title + '.' + (nodeData.children.length + 1)}],
            children: []
        });
        */
    };

    $scope.help = function (size, node) {
        openModal('lg', node, 'help');
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

    // returns all tree roots identified by class name "tree-root" (should be attached to ol root node)
    var getRootScopes = function() {
        var scopes = [];
        var roots = document.getElementsByClassName("tree-root");
        for (var i = 0; i < roots.length; ++i) {
            scopes.push(angular.element(roots[i]).scope());
        }
        return scopes;
    };

    $scope.collapseAll = function() {
        getRootScopes().forEach(function (scope) {
            console.log('collapseAll on scope:', scope);
            scope.collapseAll();
        });
    };

    $scope.expandAll = function() {
        getRootScopes().forEach(function (scope) {
            console.log('collapseAll on scope:', scope);
            scope.expandAll();
        });
    };

    $scope.resetQuery = function () {
        $scope.trees = [];
    };

    function plural(word) {
        if (typeof word === 'string' && word.length >= 1) {
            var lastIdx = word.length - 1;
            var lastChar = word.charAt(lastIdx).toLowerCase();

            if (word.slice(lastIdx-1) === 'of') {
                return word;
            }
            else if (lastChar === 'y') {
                return word.slice(0, lastIdx) + 'ies';
            } else {
                return word + 's';
            }
        } else {
            return word;
        }
    }
    var t2h = {
        'source': 'Report Type',
        'text': 'Contains any of',
        'ordering-root': 'Order by',
        'decorator-root': 'Use template'
    }

    function upcaseFirstChar(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    $scope.getHeader = function (node) {
        var type = node.type;
        var header = t2h[type] || upcaseFirstChar(type);

        if (elemIn(type, noValueTypes) || (node.value.length <= 1)) {
        // has no value property or is singular
            return header;
        } else {
        // is plural
            return plural(header);
        }
    }

    $scope.lst2str = function (lst) {
        if (lst) {
            var vals = lst.map(function (val) {
                return val.value;
            });
            return vals.join(', ');
        }
        else { return ''; }
    }

    // TODO: add glyphs icons to buttons
    // TODO: generalize menu or make two menus for formatting and query
    $scope.toolboxMenu = [
        {'title': 'help', 'action': function () { $scope.help('lg') }},
        {'title': 'undo', 'action': function () { History.undo('trees', $scope); }},
        {'title': 'redo', 'action': function () { History.redo('trees', $scope); }},
        {'title': 'collapse all', 'action': $scope.collapseAll},
        {'title': 'expand all', 'action': $scope.expandAll},
        {'title': 'reset', 'action': $scope.resetQuery }
    ];

    // TODO: Deal with not working parent part
    function isOnPath(node, type) {
        return true; // TODO: fix this issue
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

            // TODO: make it responsive
            // temporairly switched of decorator and order
            legal['ordering-child'] = false;
            legal['decorator-child'] = false;
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