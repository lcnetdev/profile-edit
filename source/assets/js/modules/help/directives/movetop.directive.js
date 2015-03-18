angular.module('locApp.modules.help.controllers')
    .directive('sssMovetop', function() {
        return {
            link: function(scope, element) {
                element.on('click', function() {
                    $('html, body').animate({scrollTop: 0}, 'fast');
                });
            }
        };
});