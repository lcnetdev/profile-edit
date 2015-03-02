/**
 * @ngdoc service
 * @name Import
 * @description
 * Handles file reading on import
 */
angular.module('locApp.modules.profile.services')
    .factory('Import', function($resource, $q, $http, $upload) {

        importService = {};

        /**
         * @ngdoc function
         * @name handleFileSelect
         * @description
         * Event handler for a file input element. Returns the string contained
         * in the file selected
         * @param {File} file - the file to parse
         * @returns {Promise} Promise containing either the file's contents or an error message
         */
        importService.handleFileSelect = function(file) {
            var json;
            var deferred = $q.defer();

            if(window.File && window.FileReader) {
                var fileReader = new FileReader();

                fileReader.onload = function(e) {
                    json = e.target.result;
                };

                fileReader.readAsText(file);

                //Give the file reader time to read the file, and return
                //a promise with either the file's contents or an error message
                setTimeout(function() {
                    if(json === undefined) {
                        deferred.reject("Unable to parse file");
                    } else {
                        deferred.resolve(json);
                    }
                }, 1000);

                return deferred.promise;
            } else {
                //For older browsers, send the file to the server. The import
                //URL bounces back the contents contained in the post
                
                $upload.upload({
                    url: 'server/import', //upload.php script, node.js route, or servlet url
                    method: 'POST',
                    file: file
                  }).success(function(data, status, headers, config) {
                    deferred.resolve(data);
                  });

                return deferred.promise;
            }

        };

        return importService;
});


