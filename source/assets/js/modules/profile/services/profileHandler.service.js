/**
 * @ngdoc service
 * @name ProfileHandler
 * @description
 * Handles profile validation
*/
angular.module('locApp.modules.profile.services')
    .factory('ProfileHandler', function() {

        handler = {};

        handler.errors = [];

        var profAttributes = ["id","title","description","date","author","contact","remark","adherence","schema", "resourceTemplates", "source"];
        var resAttributes = ["id","resourceURI","resourceURL","resourceLabel","propertyTemplates","author", "date","contact","remark", "schema", "adherence","source"];
        var propAttributes = ["propertyURI","propertyLabel","mandatory","repeatable","type","valueConstraint","remark", "resourceTemplates"];
        var consAttributes = ["valueLanguage","languageURI","languageLabel","valueDataType","valueTemplateRefs","useValuesFrom","editable","remark", "repeatable", "defaultURI", "defaultLiteral", "defaults", "validatePattern"];
        var dataAttributes = ["dataTypeURI","dataTypeLabel","dataTypeLabelHint","remark"];

        var RESOURCE_TEMPLATE = "resourceTemplates";
        var PROPERTY_TEMPLATE = "propertyTemplates";
        var VALUE_CONSTRAINT = "valueConstraint";
        var VALUE_DATA_TYPE = "valueDataType";
        var ID = "id";
        var TITLE = "title";
        var RESOURCE_URI = "resourceURI";
        var RESOURCE_URL = "resourceURL";
        var PROPERTY_URI = "propertyURI";

        /**
         * @ngdoc function
         * @name validateProfile
         * @description
         * Takes a profile object (javascript object) and checks that it contains
         * only the required information. Throws an exception if any unexpected
         * information is found, or if any required fields are missing.
         * @param {Object} raw - the profile to validate
         * @returns {boolean} true if the profile is valid
         */
        handler.validateProfile = function(raw) {
            handler.errors = [];
            //Check that all the keys are accepted values
            var profile = raw.Profile;
            angular.forEach(profile, function(value, key) {
                if(key === RESOURCE_TEMPLATE) {
                    angular.forEach(value, function(v) {

                        validateResourceTemplate(v);
                    });
                }
                else if(!(profAttributes.indexOf(key) >= 0)) {
                    handler.errors.push( key + " is not an accepted key in a profile");
                }
            });

            _profileValidation(profile);

            if(handler.errors.length !== 0) {
                throw handler.errors;
            }

            return true;
        };

        // Helper method for validation
        _profileValidation = function(profile) {
            //Check that id and title are filled in, and that the profile
            //has at least one resource template
            if(!(ID in profile) || profile[ID] === undefined || profile[ID] === "") {
                handler.errors.push( "Profile must have an id field");
            }
            if(!(TITLE in profile) || profile[TITLE] === undefined || profile[TITLE] === "") {
                handler.errors.push( "Profile must have a title field");
            }
            if(!(RESOURCE_TEMPLATE in profile) || profile[RESOURCE_TEMPLATE] === undefined || profile[RESOURCE_TEMPLATE].length < 1) {
                handler.errors.push( "Profile must have at least one resource template");
            }
        };

        validateResourceTemplate = function(resourceTemplate) {
            var valid = true;
            var name = "Resource template";
            var hasLabel = false;
            //Check that all the keys are accepted values
            angular.forEach(resourceTemplate, function(value, key) {
                if(key === PROPERTY_TEMPLATE) {
                    angular.forEach(value, function(v) {
                        validatePropertyTemplate(v);
                    });
                }
                else if(key === "resourceLabel" && value !== ""){
                    name = value;
                    hasLabel = true;
                }
                else if(key === "id" && !hasLabel && value !== "") {
                    name = value;
                }
                else if(!(resAttributes.indexOf(key) >= 0)) {
                    handler.errors.push( key + " is not an accepted key in a " + name);
                }
            });

            _resourceValidation(resourceTemplate, name);

            return valid;

        };

        // Helper method for validation
        _resourceValidation= function(resourceTemplate,name) {
            //Check that the resource template has a resource URI and
            //at least one property template
            if(!(RESOURCE_URI in resourceTemplate || RESOURCE_URL in resourceTemplate) || resourceTemplate[RESOURCE_URI] === undefined || resourceTemplate[RESOURCE_URI] === "") {
                handler.errors.push( name + " must have a resource URI field");
            }
            if(!(PROPERTY_TEMPLATE in resourceTemplate) || resourceTemplate[PROPERTY_TEMPLATE] === undefined || resourceTemplate[PROPERTY_TEMPLATE].length < 1) {
                handler.errors.push( name + " must have at least one property template");
            }
        };

        validatePropertyTemplate = function(propertyTemplate) {
            var name = "Property template";
            var hasLabel = false;
            //Check that all the keys are accepted values
            angular.forEach(propertyTemplate, function(value, key) {
                if(key === VALUE_CONSTRAINT) {
                    validateValueConstraint(value);
                }
                else if(key === RESOURCE_TEMPLATE) {
                    angular.forEach(value, function(v) {

                        validateResourceTemplate(v);
                    });
                }
                else if(key === "propertyLabel" && value !== ""){
                    name = value;
                    hasLabel = true;
                }
                else if(key === "propertyURI" && !hasLabel && value !== "") {
                    name = value;
                }
                else if(!(propAttributes.indexOf(key) >= 0)) {
                    handler.errors.push( key + " is not an accepted key in a " + name);
                }
            });
            //Check that the property template has a URI
            if(!(PROPERTY_URI in propertyTemplate) || propertyTemplate[PROPERTY_URI] === undefined || propertyTemplate[PROPERTY_URI] === "") {
                handler.errors.push( name + " must have at least one property URI");
            }
        };

        validateValueConstraint = function(valueConstraint) {
            //Check that all the keys are accepted values
            angular.forEach(valueConstraint, function(value, key) {
                if(key === VALUE_DATA_TYPE) {
                    validateValueDataType(value);
                }
                else if(!(consAttributes.indexOf(key) >= 0)) {
                    handler.errors.push( key + " is not an accepted key in a value constraint");
                }
            });
        };

        validateValueDataType = function(dataType) {
            //Check that all the keys are accepted values
            angular.forEach(dataType, function(value, key) {
               if(!(dataAttributes.indexOf(key) >= 0)) {
                   handler.errors.push( key + " is not an accepted key in a value data type");
               }
            });
        };

        /**
         * @ngdoc function
         * @name getName
         * @description
         * Returns the profile's title
         * @param {Object} profile - A BIBFRAME profile
         * @returns {string} the profile's title
         */
        handler.getName = function(profile) {
            return profile.Profile.title;
        };

        return handler;
});
