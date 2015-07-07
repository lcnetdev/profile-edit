/**
 * @ngdoc service
 * @name Export
 * @description
 * Service for getting the exported data from the form
 */
angular.module('locApp.modules.profile.services').factory('Export', function($resource, $q, $http) {

    exportService = {};

    /**
     * @ngdoc function
     * @name exportJson
     * @description
     * Sends the exported json string to the server with the name parameter for
     * saving. Returns a promise on success that indicates either the success
     * or failure of the server side save
     * @param {type} json - the data to export
     * @param {type} name - the name under which to export the file
     * @returns {promise} Promise containing the server's response to the request
     */
    exportService.exportJson = function(json, name) {
        var deferred = $q.defer();
        $http({
            url: serverPath + "server/save",
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: $.param({"name":name + "_tmp","json":json})
        }).
        success(function(response_json) {
            deferred.resolve(response_json);
        }).
        error(function() {
            deferred.reject("There was an error getting the info from " + URL);
        });

        return deferred.promise;
    };

    return exportService;
});


