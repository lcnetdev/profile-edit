/**
 * @ngdoc service
 * @name FormHandler
 * @description
 * Turns the information in the form into data angular can handle
 */
angular.module('locApp.modules.profile.services')
    .factory('FormHandler', function() {
        var handler = {};

        /**
         * @ngdoc function
         * @name getFormData
         * @description
         * Returns the data held in the profile form as a javascript object
         * @param {type} profile - the profile from which to grab the data
         * @returns {obj} - a javascript object representing the profile
         */
        handler.getFormData = function(profile) {
            // TODO: add things here
            obj = {};
            obj.Profile = profile;
            return obj;
        };

        return handler;
    });

