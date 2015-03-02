/**
 * @ngdoc service
 * @name Scrub
 * @description
 * keeps track of an entities child elements
 */
angular.module('locApp.modules.profile.services')
    .factory('Scrub', function() {
        var scrubService = {};


        var importIndex = -0.5;

        /**
         * @ngdoc function
         * @name getIndex
         * @description
         * Maintains a unique index of the entity's child elements so that they
         * may be moved and deleted easily
         * @returns {Number} - the index
         */
        scrubService.getIndex = function() {
            importIndex += 0.5;
            return importIndex;
        };

        return scrubService;
    });


