/**
 * @ngdoc directive
 * @name sssAlert
 * @description
 * Directive for handling alert modals
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssAlert', function(httpResponse) {
        return {
            link: function(scope) {
                scope.alertVisible = false;

                scope.$watch("alertVisible", function() {
                    if(scope.message == null || scope.message === ""){
                        return;
                    }

                    //empty the error messages
                    $('#alert_text').empty();
                    // append the messages
                    $('#alert_text').append(scope.message);
                    //open modal with bootstrap click
                    $('#alert_message').click();
                }, true);

                scope.$watch(function() {
                    return httpResponse.alertError;
                }, function(newVal, oldVal) {
                    if(httpResponse.errorMessage == null || httpResponse.errorMessage === "") {
                        return;
                    }

                    //empty the error messages
                    $('#alert_text').empty();
                    // append the messages
                    $('#alert_text').append(httpResponse.errorMessage);
                    //open modal with bootstrap click
                    $('#alert_message').click();
                    //empty the message
                    httpResponse.errorMessage = "";
                });
            }
        };
});


