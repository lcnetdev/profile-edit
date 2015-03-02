/**
 * @ngdoc directive
 * @name sssClosemodal
 * @description
 * Handles closing of modals not handled by other directives
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssClosemodal', function() {
        return {
            link: function(scope) {
                scope.visible = false;

                scope.$watch('visible', function() {
                    $('#importCloseButton').click();
                });
            }
        };
});