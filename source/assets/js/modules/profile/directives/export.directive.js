/**
 * @ngdoc directive
 * @name sssExport
 * @description
 * Handles profile exports
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssExport', function(ProfileHandler, FormHandler, Alert) {
        return {
            link: function(scope, element, attrs) {
                element.on('click', function() {
                    
                    if(scope.validateProfile()) {
                        scope.validateDate();
                        var raw = FormHandler.getFormData(scope.profile, attrs.sssExport === "brief");
                        var name = ProfileHandler.getName(raw) + ".json";
                        var json = angular.toJson(raw);
                        // Need to URI encode for any '#' chars in, e.g. propertyURI
                        var dataStr = "data:text/json; charset=utf-8," + encodeURIComponent(json);
                        var downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", name);
                        document.body.appendChild(downloadAnchorNode); // required for firefox
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                    }
                    //Make sure the alert dialogs appear
                    scope.$digest();
                });
            }
        };
});
