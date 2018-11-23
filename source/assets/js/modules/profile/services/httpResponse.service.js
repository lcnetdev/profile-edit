/**
 * @ngdoc service
 * @name httpResponse
 * @description
 * Catches errors in http responses
 */
angular.module('locApp.modules.profile.services')
    .factory('httpResponse', function($q) {
        var responseService = {};

        responseService.alertError = false;
        responseService.errorMessage = "";

        /**
         * @ngdoc function
         * @name requestError
         * @description
         * Toggles alertError, and sets errorMessage. Used for requests sent to the server
         */
        responseService.requestError = function() {
            //watched by the alert directive to know when to show messages
            responseService.alertError = !responseService.alertError;
            responseService.errorMessage = "The http request could not be sent. Check your connection and refresh the page.";
        };

        /**
         * @ngdoc function
         * @name responseError
         * @description
         * Toggles alertError, and sets errorMessage. Used when the server response returns
         * an error
         */
        responseService.responseError = function(rejection) {
            //watched by the alert directive to know when to show messages
            console.log(rejection);
            if(rejection.message !== undefined){
                if(rejection.message.match(/Syntax error/) || rejection.message.match(/Unexpected token/) || rejection.message.match(/JSON.parse/)) {
                    responseService.alertError = !responseService.alertError;
                    responseService.errorMessage = "There was an error parsing the response. Please review the file and try again.";
                } else {
                    responseService.alertError = !responseService.alertError;
                    responseService.errorMessage = rejection.message;
                }
            }
            return $q.reject(rejection);
        };

        return responseService;
});
