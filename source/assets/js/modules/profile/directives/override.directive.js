/**
 * @ngdoc directive
 * @name sssOverride
 * @description
 * Handles warning messages
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssOverride', function() {
        return {
            link: function(scope) {
                scope.overrideVisible = false;

                scope.$watch('overrideVisible', function() {
                    if(scope.message == null || scope.message === "") {
                        return;
                    }

                    //open modal with bootstrap click
                    $('#override_message').click();
                });
            }
        };
});