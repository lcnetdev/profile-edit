/**
 * @ngdoc service
 * @name Search
 * @description
 * Handles search requests that are sent to the server
*/
angular.module('locApp.modules.profile.services')

    .factory('Search', function($http, $q) {
        var search = {};

        /**
         * @ngdoc function
         * @name runSearch
         * @description
         * Returns a promise containing the server's response to the given
         * search query.
         * @param {string} text - the query the search uses
         * @returns {promise} Promise containing the server's response to 
         * the query
         */
        search.runSearch = function(text) {
            var deferred = $q.defer();
            //Pass the search parameter to the list routine, which will
            //only return the results that contain text
            $http({
                url: serverPath + 'server/list/' + text,
                method: "GET"
            }).
                success(function(response) {
                    deferred.resolve(response);
            }).
                error(function() {
                    deferred.reject("There was an error with the search");
            });

            return deferred.promise;
        };

        return search;
    });

