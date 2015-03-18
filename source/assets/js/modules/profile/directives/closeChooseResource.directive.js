/**
 * @ngdoc directive
 * @name sssClosechooseresource
 * @description
 * Handles closing the choose resource template modal
 */

angular.module('locApp.modules.profile.controllers')
    .directive('sssClosechooseresource', function() {
        return {
            link: function(scope) {
                scope.resourceVisible = false;

                scope.$watch('resourceVisible', function() {
                    $('#chooserClose').click();
                });
            }
        };
});