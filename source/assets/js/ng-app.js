angular.module('locApp', [
    'ui.router', 
    'ui.grid',
    'ui.grid.pagination',
    'locApp.modules.profile',
    'locApp.modules.help',
    'ui.sortable',
    'ui.bootstrap',
    'LocalStorageModule',
    'angularFileUpload'
])

    .config(function($httpProvider, $urlRouterProvider, $tooltipProvider, localStorageServiceProvider) {
        $httpProvider.interceptors.push('httpResponse');
        $urlRouterProvider.otherwise("/profile");
        localStorageServiceProvider.setPrefix('locApp');
        
        if(!$httpProvider.defaults.headers.get){
            $httpProvider.defaults.headers.get = {}
        }
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        
        if(is_ie8) {
            $tooltipProvider.options({
               animation: false 
            });
        }
    });
