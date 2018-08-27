/**
 * @ngdoc controller
 * @name ontologiesController
 * @description
 * Handles the ontologies list page. Gets ontologies from the server and populates
 * the list with them. Also contains functions for sorting and searching the
 * ontologies list
 */
angular.module('locApp.modules.profile.controllers')
    .controller('ontologiesController', function($scope, $state, $stateParams, Server) {
        $scope.numItems = 10;
        $scope.ontologies = [];
        $scope.searchText = "";

        Server.get('/verso/api/configs?filter[where][configType]=vocabulary&filter[where][name][neq]=Languages', {})
            .then(function(response) {
                for(var i = 0; i < response.length; i++) {
                    // Logic to format the date correctly
                    var oSource = response[i];
                    var name = oSource.name;
                    var oid = oSource.id;
                    oSource.json.RDF.Class.forEach(function(oClass) {
                        oClass.oType = 'Resource'
                        oClass.source = name;
                        oClass.id = oid;
                        $scope.ontologies.push(oClass);
                    });
                    if (oSource.json.RDF.Property !== undefined) {
                        oSource.json.RDF.Property.forEach(function(oProp) {
                            oProp.oType = 'Property';
                            oProp.source = name;
                            oProp.id = oid;
                            $scope.ontologies.push(oProp);
                        });
                    }
                }
                $scope.addBlanks();
            });
            console.log($scope.ontologies);
        /**
         * Defines the table parameters for use in the ui-grid
         */

        $scope.ontologiesGrid = {
            data: "ontologies",
            columnDefs: [
                {
                    field:'source', displayName:'Source', width: 120
                },
                {
                    field:'label.__text', displayName:'Label', width: 160,
                    cellTemplate: '<a href="#/profile/ontologies/?id={{row.entity.id}}&uri={{row.entity[\'_rdf:about\']}}"  class="pad-cell">{{ row.entity.label.__text }}</a>'
                },
                {
                    field:'oType', displayName:'Type', width: 80
                },
                {
                    field:'comment.__text', displayName:'Description'
                },
            ],
            enableHorizontalScrollbar: false,
            enableVerticalScrollbar: false
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
