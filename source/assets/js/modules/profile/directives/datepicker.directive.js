/**
 * @ngdoc directive
 * @name sssDatepicker
 * @description
 * Formats date fields as yyyy-mm-dd 
 * 
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssDatepicker', function() {
        return {
            link: function(scope) {
                $('[name=date]').datepicker({format: 'yyyy-mm-dd'})
                    .on('changeDate', function(ev) {
                        scope.profile.date = $('[name=date]').val();
                    }).data('datepicker');
            }
        };
    });