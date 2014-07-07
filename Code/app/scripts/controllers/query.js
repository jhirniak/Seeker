'use strict';

angular.module('seekerApp')
  .controller('QueryCtrl', function ($scope, $http, Bokeh, $timeout) {
    /* $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    }); */

    // init tree
    $scope.data = [
        {
            "id": 1,
            "type": "source",
            "title": "Committee of Experts report",
            "items": [{
                "id": 2,
                "type": "cycle",
                "title": "Cycle: 1, last",
                "items": [
                    {
                        "id": 21,
                        "type": "producer-country",
                        "title": "Country: UK",
                        "items": [
                            {
                                "id": 211,
                                "type": "specifier-language",
                                "title": "Languages: Scottish-Gaelic, Welsh",
                                "items": []
                            },
                            {
                                "id": 212,
                                "type": "specifier-text",
                                "title": "Contains some of words: education, school",
                                "items": []
                            }
                        ]
                    }
                ]
            },
            {
                "id": 22,
                "title": "Organize by",
                "items": [
                    {
                        "id": 221,
                        "organizer": "211-asc",
                        "title": "Language (ascending)",
                        "items": []
                    },
                    {
                        "id": 222,
                        "organizer": "212-asc",
                        "title": "Cycle (ascending)",
                        "items": []
                    }
                ]
            }]
        }
    ]

    $scope.getQuery = function () {
        return "Hello moto!";
    };

    $scope.selectedItem = {};

    $scope.options = {
    };

    $scope.remove = function(scope) {
        scope.remove();
    };

    $scope.toggle = function(scope) {
        scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
        var a = $scope.data.pop();
        $scope.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
        // TODO: replace name items with nodes
        var nodeData = scope.$modelValue;
        nodeData.items.push({
            id: nodeData.id * 10 + nodeData.items.length,
            title: nodeData.title + '.' + (nodeData.items.length + 1),
            items: []
        });
    };

    var getRootNodesScope = function() {
        return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
        var scope = getRootNodesScope();
        scope.collapseAll();
    };

    $scope.expandAll = function() {
        var scope = getRootNodesScope();
        scope.expandAll();
    };

    $scope.history = {
        index: -1,
        trace: [],

        undo: function () {
            if (index >= 0) {
                $scope.query = history[index--];
                this.updateButtons();
            }
        },

        redo: function () {
            if (index < history.length - 1) {
                $scope.query = history[index++];
                this.updateButtons();
            }
        },

        updateButtons : function () {
            console.log('History @ index: ' + index + '/' + (trace.length - 1));
            if (index < 0) {
                // disable undo button
                console.log('Disabled undo button.');
            } else {
                // enable undo button
                console.log('Enabled undo button.');
            }
            if (index >= history.length - 1) {
                // disable redo button
                console.log('Disabled redo button.');
            } else {
                // enable redo button
                console.log('Enabled redo button.');
            }
        }
    };

    var types = ['source', 'cycle', 'country', 'organizer', 'decorator', 'language', 'section', 'text'];

    // tests
    function isRoot(node) {
        return node.parent === null;
    }

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
            currNode.children.forEach(function (child) {
                queue.push(child);
            });
        }

        return false;
    }

    function canBeRootChild(node, type) {
        if (!isRoot(node)) {
            return false;
        } else {
            node.children.forEach(function (child) {
                if (child.type === type) {
                    return false;
                }
            })
            return true;
        }
    }

    // returns list of types for given node, legal indicated by true, and illegal by false
    function legalTypes(node) {
        return {
            source: false,
            cycle: !isOnPath(node, 'cycle'),
            country: !isOnPath(node, 'country'),
            organizer: canBeRootChild(node, 'organizer'),
            decorator: canBeRootChild(node, 'decorator'),
            language: true,
            section: true,
            text: true
        }
    }

    function initRoot(data) {
        return createNode('source', data, null, []);
    }

    function createNode(type, data, parent, children) {
    // Check if parameters are valid
    // Type must be one of the types and cannot be undefined
    // Parent and children must be either object (reference, array, or null) or undefined
    // Note that parent should not be array, but there is no point in going crazy with the sanitization of the parameters
        if (types.indexOf(type) === -1) {
            throw 'Expected one of types: ' + types.toString() + ', but found: ' + type;
        } else if (parent !== undefined && typeof parent !== 'object') {
            throw 'Expected parent either to be reference to parent object or undefined, but found: ' + (typeof parent);
        } else if (children !== undefined && typeof children !== 'object') {
            throw 'Expected children either to be either object (reference, array, or null) or undefined, but found: ' + (typeof children);
        } else {
            // Everything OK, create and return node
            return {
                type: type,
                data: data,
                parent: parent || null,
                children: children || [],
                appendChild: function (type, data) {
                    var legal = legalTypes(this);
                    if (legal[type] === true) {
                        var ref = createNode(type, data, this);
                        this.children.push(ref);
                        return ref;
                    } else {
                        throw 'Illegal type. Expected one of the legal types: ' + legal + '. But found: ' + type + '.';
                    }
                }
            };
        }
    }

    function renderTree() {

    }

    $scope.query = {

    };

    var root = initRoot('Committee of Experts report');
    var cycle = root.appendChild('cycle', [1, 'last']);
    cycle.appendChild('section', ['1-b', '2-c', '3-i']);
    cycle.appendChild('language', ['Scottish-Gaelic', 'Welsh']);
    cycle.appendChild('country', 'UK');
    root.appendChild('text', 'school; education');
    console.log('Root:', root);
    /*
    root.appendChild('children');
    console.log('Root node:', root);
    console.log('options', $scope.query.getOptions(root));
    //$scope.example = example;
    */

    /*
    $scope.query = [
        {
            "id": 0,
            "data": {
                "committee": ["Committee of Experts"],
                "cycle": [1, "last"],
                "languages": ["Scottish-Gaelic", "Welsh"],
                "sections": ["1-b-ii", "2-c-i", "2-c", "3"],
                "countries": ["UK"]
            }
        },
        {
            "id": 1,
            "data": {
                "cycle": ["last"],
                "committee": ["State Periodical Report"],
                "languages": ["Catalan", "French"],
                "sections": ["1-b", "3-a", "4", "last"],
                "countries": ["UK"]
            }
        }
    ];
    */

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