/**
 * @ngdoc directive
 * @name sssField
 * @description
 * Handles opening and closing the accordion sections
 */

angular.module('locApp.modules.profile.controllers')
    .directive('sssField', function($timeout, $compile, Server, localStorageService) {
        return {
            
            link: function(scope, element, attrs) {
                var buildItem = function(html) {
                    if(scope.chain && !scope.loading) {
                        scope.continueImport();
                    }
                    else {
                        scope.parentId = parseInt(attrs.item);
                        var item = $(html).appendTo(element);
                        $compile(item)(scope);

                        // if were adding a new item open it.
                        if(scope.addNew) {
                            var panel = item.parent('.panel');
                            panel.toggleClass ('is-open');
                            panel.siblings ().removeClass ('is-open');
                            panel.siblings().children('.collapse').removeClass('in');
                            panel.children('.collapse').toggleClass('in');
                            panel.siblings().children('.panel-heading').children().children().addClass('collapsed');
                            item.children().children().removeClass('collapsed');
                            scope.addNew = false;
                        }
                        
                    }
                    scope.incLoading();
                };
                
                var html = localStorageService.get(attrs.html);
                
                scope.incLoadCount();
                
                //console.log("Load timer: " + (scope.loadCount - scope.loaded));
                
                if(html) {
                    $timeout(function() { 
                        buildItem(html);
                    }, scope.loadCount - scope.loaded);
                }
                else {
                    Server.get(attrs.html, {})
                        .then(function(result){
                            $timeout(function() { 
                                buildItem(result);
                                localStorageService.set(attrs.html, result); 
                            }, scope.loadCount - scope.loaded);
                        });
                }
                
                
            }
        };
});
