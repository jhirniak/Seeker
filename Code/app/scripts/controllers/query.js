'use strict';

angular.module('seekerApp')
  .controller('QueryCtrl', function ($scope, $http, Bokeh, $timeout, History, $modal) {
    /* $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    }); */

    // TODO: in nodes, disable or hide glyph on leaves

    // example: init tree
    $scope.data = [
        {
            "id": 1,
            "type": 'source',
            "value": "committee-of-experts",
            "title": "Committee of Experts report",
            "nodes": [{
                "id": 2,
                "type": 'cycle',
                "value": [1, 'last'],
                "title": "Cycle: 1, last",
                "nodes": [
                    {
                        "id": 21,
                        "type": 'country',
                        "value": ['UK'],
                        "title": "Country: UK",
                        "nodes": [
                            {
                                "id": 211,
                                "type": 'language',
                                "value": ['Scottish-,Gaelic', 'Welsh'],
                                "title": "Languages: Scottish-Gaelic, Welsh",
                                "nodes": []
                            },
                            {
                                "id": 212,
                                "type": 'text',
                                "value": ['education', 'school'],
                                "title": "Contains any of: education, school",
                                "nodes": []
                            }
                        ]
                    }
                ]
            }]
        }
    ];

    // example: init formatting data
    $scope.formatting = [
        { id: 0,
          type: 'ordering-root',
          title: 'Ordering',
          nodes: [
              {
                  "id": 221,
                  "type": 'ordering-child',
                  "organizer": "211-asc",
                  "value": "211-asc",
                  "title": "Language (ascending)",
                  "nodes": []
              },
              {
                  "id": 222,
                  "type": 'ordering-child',
                  "organizer": "212-asc",
                  "value": "212-asc",
                  "title": "Cycle (ascending)",
                  "nodes": []
              }
          ]
        },
        {
            id: 1,
            type: 'decorator-root',
            title: 'Decorator',
            nodes :[
                {
                    id: 10,
                    type: 'decorator-child',
                    title: 'some cool template'
                }
            ]
        }
    ];

    // add history functionality to data and formatting (allows to undo/redo)
    History.watch('data', $scope);
    History.watch('formatting', $scope);

    $scope.selectedNode = {};

    $scope.options = {
    };

    /*
    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    };

    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    function History(obj) {
        this.index = -1;
        this.trace = [];
        this.obj = obj;
        this.note();
    }

    History.method('note', function () {
        this.trace[++this.index] = clone(this.obj);
        alert(this.index);
    });

    History.method('undo', function () {
        if (this.index >= 0) {
            alert('undoing');
            this.obj = this.trace[this.index--];
            // this.updateButtons();
        }
    });

    History.method('redo', function () {
        if (this.index < this.trace.length - 1) {
            alert('redoing');
            this.obj = this.trace[this.index++];
            // this.updateButtons();
        }
    });

    var dataHistory = new History($scope.data);
    */

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
        nodeData.nodes.push({
            id: nodeData.id * 10 + nodeData.nodes.length,
            title: nodeData.title + '.' + (nodeData.nodes.length + 1),
            nodes: []
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

    var type2hint = {
        'source': hintify('source'),
        'cycle': hintify('cycle'),
        'producer-country': hintify('country'),
        'formatting': hintify('formatting'),
        //'decorator': hintify('decorator'),
        'specifier-language': hintify('language'),
        'specifier-section': hintify('section'),
        'specifier-text': hintify('text')
    };

    $scope.hint = function (type) {
        return type2hint[type] || 'Hint not specified for this type of node.';
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
        $scope.data = [];
    };

    /*
    var history = {
        index: -1,
        trace: [],

        record: function () {
            trace[++index] = $scope.data;
        },

        undo: function () {
            if (index >= 0) {
                $scope.data = history[index--];
                this.updateButtons();
            }
        },

        redo: function () {
            if (index < history.length - 1) {
                $scope.data = history[index++];
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
    */

    // TODO: add glyphs icons to buttons
    // TODO: generalize menu or make two menus for formatting and query
    $scope.toolboxMenu = [
        {'title': 'help', 'action': function () { $scope.help('lg') }},
        {'title': 'undo', 'action': function () {History.undo('data', $scope); }},
        {'title': 'redo', 'action': function () {History.redo('data', $scope); }},
        {'title': 'collapse all', 'action': $scope.collapseAll},
        {'title': 'expand all', 'action': $scope.expandAll},
        {'title': 'reset', 'action': $scope.resetQuery }
    ];

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
            //organizer: canBeRootChild(node, 'organizer'),
            //decorator: canBeRootChild(node, 'decorator'),
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