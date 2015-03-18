/**
 * @ngdoc directive
 * @name sssWarning
 * @description
 * Handles displaying general warning messages.
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssWarning', function() {
        return {
            link: function(scope) {
                scope.warnVisible = false;

                scope.$watch('warnVisible', function() {
                    if(scope.message == null || scope.message === "") {
                        return;
                    }

                    //open modal with bootstrap click
                    $('#warning_message').click();
                });
            }
        };
});
