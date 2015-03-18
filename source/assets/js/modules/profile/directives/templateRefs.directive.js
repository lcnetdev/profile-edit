/**
 * @ngdoc directive
 * @name sssTemplate
 * @description
 * Handles prompts for template references
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssTemplate', ['Server', function(Server) {
        return function(scope, element) {
            element.on('change', function(e) {
                var template;
                if(typeof(e.currentTarget.value) !== "undefined") {
                    template = e.currentTarget.value;
                } else {
                    template = e.originalEvent.srcElement.value;
                }
                Server.post('/server/updateTemplateRefs', {
                   "template":template
                });

            });
        };
}]);