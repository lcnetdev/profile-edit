/**
 * @ngdoc service
 * @name Alert
 * @description
 * Handles alert message parsing
 */
angular.module('locApp.modules.profile.services').factory('Alert', function() {

    alertService = {};

    /**
     * @ngdoc function
     * @name showModal
     * @description
     * Returns the contents of data as a string for presenting on a web page
     * @param {Object} data - Either the message or an object containing the message
     * @returns {string} Either the message or the message contained in data
     */
    alertService.showModal = function(data) {
        var message = "";

        // Check if the error is an array, if so then format it
        if(data instanceof Array){
           angular.forEach(data, function(value) {
               message = message.concat(value + '<br>');
           });
        }
        else if(data instanceof SyntaxError) {
            message = data.message;
        }
        else {
            message = data;
        }

        return message;
    };

    return alertService;
});


