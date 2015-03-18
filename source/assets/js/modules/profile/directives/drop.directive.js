/**
 * @ngdoc directive
 * @name sssDrop
 * @description
 * Handles the drag and drop feature
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssDrop', [function() {
        return function(scope, element) {
            element.on('dragover', function(e) {
                e.originalEvent.cancelBubble = true;
                if(e.preventDefault) e.preventDefault();
            });

            element.on('dragenter', function(e) {
                e.originalEvent.cancelBubble = true;
                if(e.preventDefault) e.preventDefault();
            });

            element.on('drop', function(e) {
                e.originalEvent.cancelBubble = true;
                if(e.preventDefault) e.preventDefault();
                var files = e.originalEvent.dataTransfer.files;
                scope.handleFile(files[0]);
            });
        };
}]);
