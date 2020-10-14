/**
 * @ngdoc controller
 * @name profileListController
 * @description
 * Handles the profile list page. Gets profiles from the server and populates
 * the list with them. Also contains functions for sorting and searching the
 * profile list
 */
angular.module('locApp.modules.profile.controllers')
    .controller('profileListController', function($scope, $state, $stateParams, Server) {
        $scope.numItems = 10;
        $scope.profiles = [];
        $scope.searchText = "";

        Server.get('/api/listconfigs?where=index.resourceType:profile', {})
            .then(function(response) {
                for(var i = 0; i < response.length; i++) {
                    // Logic to format the date correctly
                    var record = response[i].json;
                    var parse = (record.Profile.date) ? record.Profile.date.split('-') : [];
                    var date = (parse.length > 0) ? new Date(parse[0], parse[1] - 1, parse[2]) : new Date();
                    record.Profile.date = date.toDateString().slice(4, date.length);
                    record.Profile.versoId = response[i].id;

                    // push profile to list
                    $scope.profiles.push(record.Profile);
                }
                $scope.sortByParam('title', 'asc');
                $scope.addBlanks();
            });

        /**
         * Defines the table parameters for use in the ui-grid
         */
        $scope.profileGrid = {
            data: "profiles",
            columnDefs: [
                {
                    field:'title', displayName:'Title', width: 350,
                    cellTemplate: '<a href="#/profile/{{row.entity.versoId}}"  class="pad-cell">{{ row.entity.title }}</a>'
                },
                {
                    field:'description', displayName:'Description'
                },
                {
                    field:'date', displayName:'Date', width: 120,
                    enableSorting: false
                }
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
        $scope.profileGrid.onRegisterApi = function (gridApi) {
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
            var count = $scope.profiles.length % $scope.numItems;

            // dont add blanks if we dont have to.
            if(count === 0 && $scope.profiles.length > 0) {
                return;
            }

            for(; count < $scope.numItems; count++) {
                var blank = {
                    title: "",
                    description: "",
                    date: ""
                };
                $scope.profiles.push(blank);
            }
        };

        /**
         * @ngdoc function
         * @name search
         * @description
         * Updates scope.profiles to contain only those profiles containing the
         * text found in the search query input
         */
        $scope.search = function() {
            var textBox = document.getElementById("search_query");
            var text = textBox.value.toLowerCase();
            //copy the existing profiles into a master list if necessary
            $scope.masterProfileList = $scope.masterProfileList !== undefined ? $scope.masterProfileList : $scope.profiles.slice();

            if(text !== "") {
                $scope.profiles = [];
                angular.forEach($scope.masterProfileList, function(profile) {
                   if(angular.toJson(profile).toLowerCase().indexOf(text) >= 0) {
                       $scope.profiles.push(profile);
                   }
                });
            } else {
                $scope.profiles = $scope.masterProfileList.slice();
            }
            $scope.sortByParam('title', 'asc');
            textBox.value='';
            $scope.addBlanks();
        };

        /**
         * @ngdoc function
         * @name sortByParam
         * @description
         * Sorts the profile list by the given param and direction. Param must be a valid
         * key in the Profile object (id, title, description, date, contact
         * or remark)
         * @param {String} param - the object key by which to sort
         * @param {String} direction - whether to sort ascending or descending
         * @returns {Number} - The result of the comparison which javascript uses for sort functions
         */
        $scope.sortByParam = function(param, direction) {
            $scope.profiles.sort(function(a, b) {
                var first;
                var second;
                //Make sure the data is in the correct form, and that strings
                //are case insensitive
                if(param === "date") {
                    //validate the date parameter
                    if(!a[param].match('[0-9]{4}-[0-9]{2}-[0-9]{2}')) {
                        first = '1969-12-31';
                    }
                    if(!b[param].match('[0-9]{4}-[0-9]{2}-[0-9]{2}')) {
                        second = '1969-12-31';
                    }
                    first = Date.parse(a[param]);
                    second = Date.parse(b[param]);
                } else {
                    //Move empty fields to the end of the list
                    if(a[param] === null || a[param] === 'undefined' || a[param] === "" || a[param] === " " || typeof(a[param]) === 'undefined') {
                        first = "zz";
                    } else {
                        first = a[param];
                    }
                    if(b[param] === null || b[param] === 'undefined' || b[param] === "" || b[param] === " " || typeof(b[param]) === 'undefined') {
                        second = "zz";
                    } else {
                        second = b[param];
                    }
                    first = first.toLowerCase();
                    second = second.toLowerCase();
                }

                //Carry out the actual sort function
                if(direction === 'asc') {
                    if(first < second) {
                        return -1;
                    }
                    if(first > second) {
                        return 1;
                    }
                } else {
                    if(first < second) {
                        return 1;
                    }
                    if(first > second) {
                        return -1;
                    }
                }
                return 0;
            });
        };
    });
