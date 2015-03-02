angular.module('locApp.modules.profile.controllers')
    .directive('sssDelete', function() {
        return {
            link: function(scope) {
                scope.deleteToggle = false;

                scope.$watch('deleteToggle', function() {
                    if(!scope.confirm) return;
                    //open modal with bootstrap click
                    $('#delete_message').click();
                });
            }
        };
});