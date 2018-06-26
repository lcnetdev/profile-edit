/**
 * @ngdoc service
 * @name Server
 * @description
 * Handles the http requests to and from the server
 */
angular.module('locApp.modules.profile.services')
    .factory('Server', function($q, $http, localStorageService, $sce) {

        var server = {};

        /**
         * @ngdoc function
         * @name get
         * @description
         * Returns a promise with the server's response to the get request sent to
         * url with params
         * @param {type} url - where to send the request (relative path)
         * @param {type} params - params to pass in the request
         * @returns {promise} the server's response
         */
        server.get = function(url, params, useLocalStorage) {
            var deferred = $q.defer();
            // serverPath = url.match(/\/verso\//) ? '//' + serverHostname + ':3001' : serverPath;
            
            if(useLocalStorage && sessionStorage.getItem(url)) {
                deferred.resolve(JSON.parse(sessionStorage.getItem(url)));
                return deferred.promise;
            }
            // HTTP request to get the data
            $http({
                //Include a random number to prevent early version of IE from
                //caching the request
                url: url,
                method: "GET",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                params: params,
                cache: false
            })
            .then(function(response) { // Success
                if(useLocalStorage) {
                    sessionStorage.setItem(url, JSON.stringify(response.data));
                }
                deferred.resolve(response.data);
            },
            function(response) { // Error
                deferred.reject(response.data);
            });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name post
         * @description
         * Returns a promise with the server's response to the post request sent to
         * url with params
         * @param {type} url - relative path to which the request is sent
         * @param {type} params - params for the request
         * @returns {promise} the server's response
         */
        server.post = function(url, params) {
            var deferred = $q.defer();

            $http({
                url: url,
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                data: params
            }).
            success(function(response_json) {
                deferred.resolve(response_json.data);
            }).
            error(function(response_json) {
                deferred.reject(response_json.data);
            });

            return deferred.promise;
        };

        /**
         * @ngdoc function
         * @name delete
         * @description
         * Returns a promise with the server's response to the delete request sent
         * to url with params.
         * @param {type} url - the relative path to which the request is sent
         * @param {type} params - the params accompanying the request
         * @returns {promise} the server's response
         */
        server.deleteItem = function(url, params) {
            var deferred = $q.defer();

            $http({
                url: url,
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                params: params
            })
            .then(function(response) {
                deferred.resolve(response);
            }, function(err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        return server;
});