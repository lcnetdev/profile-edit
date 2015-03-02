
// Module Namespace Defintions
angular.module('locApp.modules.help.services', ['ngResource']);
angular.module('locApp.modules.help.directives', ['locApp.modules.help.services']);
angular.module('locApp.modules.help.controllers', ['locApp.modules.help.services']);

// Module Definition
angular.module('locApp.modules.help', [
    'locApp',
    'locApp.modules.help.controllers',
    'ui.router',
    'ui.sortable',
    'ui.bootstrap',
    'LocalStorageModule'
])

.config(function($stateProvider, $urlRouterProvider) {

    // Define various states of module
    $stateProvider.state('help', {
        url: '/help',
        templateUrl: 'html/help.html'
    });

});