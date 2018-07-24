
// Module Namespace Defintions
angular.module('locApp.modules.profile.services', ['ngResource']);
angular.module('locApp.modules.profile.directives', ['locApp.modules.profile.services']);
angular.module('locApp.modules.profile.controllers', ['locApp.modules.profile.services']);

console.log('ontologies module');
// Module Definition
angular.module('locApp.modules.ontologies', [
    'locApp',
    'locApp.modules.ontologies.controllers',
    'ui.router',
    'ui.sortable',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload'
])
    .config(function($stateProvider, $urlRouterProvider) {

        // Reroute root of module to list controller
        $urlRouterProvider
            .when('/ontologies', '/profile/ontologies');

        // Define various states of module
        $stateProvider
            .state('ontologies', {
                url: '/ontologies',
                templateUrl: 'html/help.html'
            })
            .state('profile.list', {
                parent: 'profile',
                url: '/list',
                templateUrl: 'html/profileList.html',
                controller: 'profileListController'
            })
            .state('profile.create', {
                parent: 'profile',
                url: '/create',
                templateUrl: 'html/profileForm.html',
                controller: 'profileController'
            })
            .state('profile.edit', {
                parent: 'profile',
                url: '/{id}',
                templateUrl: 'html/profileForm.html',
                controller: 'profileController'
            });
    });