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

        Server.get('/verso/api/configs?filter[where][configType]=ontology', {})
            .then(function(response) {
                for(var i = 0; i < response.length; i++) {
                    response[i].metadata.updateDate = response[i].metadata.updateDate.substring(0, 10);
                    $scope.ontologies.push(response[i]);
                }
                // $scope.addBlanks();
            });
            console.log($scope.ontologies);
        /**
         * Defines the table parameters for use in the ui-grid
         */

        $scope.ontologiesGrid = {
            data: "ontologies",
            columnDefs: [
                {
                    field:'json.label', displayName:'Label', width: 200,
                    // cellTemplate: '<input type="text" value="{{row.entity.name}}"></input>'
                },
                {
                    field:'json.url', displayName:'URL',
                    // cellTemplate: '<input type="text" value="{{row.entity.json.url}}" size="100%"></input>'
                },
                {
                    field:'metadata.updateDate', displayName:'Modified', width: 120,
                },
                {
                    field:'actions', displayName:'Actions', width: 120,
                    cellTemplate: '<div class="text-center"><a class="btn"><span class="fa fa-pencil fa-fw"></span></a><a class="btn"><span class="fa fa-trash-o fa-fw"></span></a></div>'
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
