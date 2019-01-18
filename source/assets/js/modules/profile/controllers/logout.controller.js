/**
 * @ngdoc controller
 * @name logoutController
 * @description
 * Handles verso logout routine
 */
angular.module('locApp.modules.profile.controllers')
    .controller('logoutController', function($scope, $state, Server) {
    
        Server.post('/verso/api/Users/logoutx', {})
            .then(function(response) {
                // $state.go('profile.list', {}, {reload: true});
                document.location = '/profile-edit/';
            })
            .catch(function(e) {
                alert('There was a problem signing out!');
                document.location = '/profile-edit';
            });
    });
