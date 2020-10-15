/**
 * @ngdoc controller
 * @name ontologiesController
 * @description
 * Handles the ontologies list page. Gets ontologies from the server and populates
 * the list with them. Also contains functions for sorting and searching the
 * ontologies list
 */
angular.module('locApp.modules.profile.controllers')
    .controller('ontologiesController', function($scope, $state, $stateParams, Server, localStorageService) {
        $scope.numItems = 10;
        $scope.ontologies = [];
        $scope.searchText = "";

        if ($state.current.name == 'profile.ontologies') {
        Server.get('/api/listconfigs?where=index.resourceType:ontology', {})
            .then(function(response) {
                for(var i = 0; i < response.length; i++) {
                    response[i].metadata.updateDate = response[i].metadata.updateDate.substring(0, 10);
                    $scope.ontologies.push(response[i]);
                }
                $scope.addBlanks();
            });
        }
        /**
         * Defines the table parameters for use in the ui-grid
         */

        $scope.ontologiesGrid = {
            data: "ontologies",
            columnDefs: [
                {
                    field:'json.label', displayName:'Label', width: 200,
                    cellTemplate: '<a href="#/profile/ontologies/{{row.entity.id}}" class="pad-cell">{{row.entity.json.label}}</a>'
                },
                {
                    field:'json.url', displayName:'URL'
                },
                {
                    field:'metadata.updateDate', displayName:'Modified', width: 120,
                }
            ],
            enableHorizontalScrollbar: false,
            enableVerticalScrollbar: false
        };

        if ($stateParams.id && $stateParams.id != 'create') {
            Server.get('/ldp/verso/configs/' + $stateParams.id, {})
                .then(function(response) {
                    $scope.ontology = response;
                });
        };

        $scope.ontologySubmit = function() {
            if (!$scope.ontology.name) {
                $scope.ontology.name = $scope.ontology.json.label + '-ontology';
            }
            $scope.ontology.configType = 'ontology';
            
            var d = new Date();
            if ($scope.ontology.id != null) {
                $scope.ontology.metadata.updateDate = d.toISOString();
            } else {
                var newid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
                    function(c) {
                        var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
                        return v.toString(16);
                    });
                $stateParams.id = newid;
                $scope.ontology["id"] = newid;
                $scope.ontology["metadata"] = {
                    "createDate": d.toISOString(),
                    "updateDate": d.toISOString(),
                    "createUser": null,
                    "updateUser": null
                };
            }
            
            var urltoken = ($scope.ontology.id != null) ? $stateParams.id : '';
            
            if (urltoken != '') {
                Server.put('/ldp/verso/configs/' + urltoken, $scope.ontology)
                .then(function() {
                    localStorageService.clearAll();
                    $state.go('profile.ontologies');
                 });    
            } else {
                Server.post('/ldp/verso/configs/', $scope.ontology)
                .then(function() {
                    localStorageService.clearAll();
                    $state.go('profile.ontologies');
                 });    
            }

        }

        $scope.ontologyDelete = function() {
            var url = '/ldp/verso/configs/' + $scope.ontology.id;
            Server.deleteItem(url, {})
                .then(function() {
                    localStorageService.clearAll();
                    $state.go('profile.ontologies')
                })
        }

        $scope.verifyDelete = function(callback) {
            $scope.deleteToggle = !$scope.deleteToggle;
            $scope.confirm = callback;
        };

        /**
         * @ngdoc function
         * @name onRegisterApi
         * @description
         * called the first time nggrid is set up
         * @param {Object} gridApi - the api to register
         */
        $scope.ontologiesGrid.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
        };

        /**
         * @ngdoc function
         * @name addBlanks
         * @description
         * Changes the index of the paginator to add blank lines to the ngGrid
         * if neeeded
         */
        $scope.addBlanks = function() {
            var count = $scope.ontologies.length % $scope.numItems;

            // dont add blanks if we dont have to.
            if(count === 0 && $scope.ontologies.length > 0) {
                return;
            }

            for(; count < $scope.numItems; count++) {
                var blank = {
                    source: "",
                    'label.__text': "",
                    oType: "",
                    'comment.__text': ""
                };
                $scope.ontologies.push(blank);
            }
        };

        /**
         * @ngdoc function
         * @name search
         * @description
         * Updates scopes.ontologies to contain only those ontologies containing the
         * text found in the search query input
         */
        $scope.search = function() {
            var textBox = document.getElementById("search_query");
            var text = textBox.value.toLowerCase();
            //copy the existing ontologies into a master list if necessary
            $scope.masterOntologyList = $scope.masterOntologyList !== undefined ? $scope.masterOntologyList : $scope.ontologies.slice();

            if(text !== "") {
                $scope.ontologies = [];
                angular.forEach($scope.masterOntologyList, function(ontology) {
                   if(angular.toJson(ontology).toLowerCase().indexOf(text) >= 0) {
                       $scope.ontologies.push(ontology);
                   }
                });
            } else {
                $scope.ontologies = $scope.masterOntologyList.slice();
            }
            // $scope.sortByParam('title', 'asc');
            textBox.value='';
            $scope.addBlanks();
        };
    }); 
