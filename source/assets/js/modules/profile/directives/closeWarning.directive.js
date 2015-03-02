/**
 * @ngdoc directive
 * @name sssClosewarning
 * @description
 * Handles closing the warning modal
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssClosewarning', function() {
        return {
            link: function(scope) {
                scope.warningVisible = false;
                scope.$watch('warningVisible', function() {
                    if($('#warning_close').is(':visible')) {
                        $('#warning_close').click();
                    } else {
                        $('#warning_close').click();
                    }
                    $('.modal-backdrop').remove();
                });
            }
        };
});