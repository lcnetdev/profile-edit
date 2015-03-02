/**
 * @ngdoc directive
 * @name sssExport
 * @description
 * Handles profile exports
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssExport', function(Export, ProfileHandler, FormHandler, Alert) {
        return {
            link: function(scope, element) {
                element.on('click', function() {
                    
                    if(scope.validateProfile()) {
                        scope.validateDate();
                        var raw = FormHandler.getFormData(scope.profile);
                        var name = ProfileHandler.getName(raw) + ".json";
                        var json = angular.toJson(raw);

                        Export.exportJson(json, name)
                            .then(function(response) {
                                if(response !== "\"failure\"") {
                                    var iframe = document.createElement("iframe");
                                    iframe.setAttribute("src", "/server/getFile/" + name);
                                    iframe.setAttribute("style", "display:none");
                                    document.body.appendChild(iframe);
                                }
                                else {
                                    Alert.showModal("There was an error with the download");
                                    scope.alertVisible = !scope.alertVisible;
                                }
                            });
                    }
                    //Make sure the alert dialogs appear
                    scope.$digest();
                });
            }
        };
});
