/**
 * @ngdoc service
 * @name FormHandler
 * @description
 * Turns the information in the form into data angular can handle
 */
angular.module('locApp.modules.profile.services')
    .factory('FormHandler', function() {
        var handler = {};

        var removeDefaults = function(profile) {
            // TODO: add things
            angular.forEach(profile.resourceTemplates, function(resource){
                angular.forEach(resource.propertyTemplates, function(properties){
                    if(properties.mandatory === 'false'){
                        delete properties.mandatory;
                    }
                    if(properties.repeatable === 'true') {
                        delete properties.repeatable;
                    }
                    if(properties.type === 'literal') {
                        delete properties.type;
                    }
                });
            });
        };

        var removeSchemaUrls = function(profile) {
          if (profile.schema) delete profile.schema;
          angular.forEach(profile.resourceTemplates, function(resource){
              if (resource.schema) delete resource.schema;
          })
        }

        /**
         * @ngdoc function
         * @name getFormData
         * @description
         * Returns the data held in the profile form as a javascript object
         * @param {type} profile - the profile from which to grab the data
         * @returns {obj} - a javascript object representing the profile
         */
        handler.getFormData = function(profile, removeDefault) {
            // TODO: add things here
            if(removeDefault) removeDefaults(profile);
            removeSchemaUrls(profile);            

            obj = {};
            obj.Profile = profile;
            return obj;
        };

        return handler;
    });


