/**
 * @ngdoc directive
 * @name sssChangecolor
 * @description
 * Handles color changes for resource template headers
 */
angular.module('locApp.modules.profile.controllers')
    .directive('sssChangecolor', function() {
        return {
            link: function(scope, element) {
                var x;
                var y;
                //Split the mouse event into a mousedown and mouseup so that
                //firefox only changes the color when templates open up
                element.on("mousedown", function(e) {
                    if(e.target.id === "resourceChoose") {
                        e.originalEvent.cancelBubble = true;
                        return;
                    }
                    x = e.clientX;
                    y = e.clientY;
                });
                element.on("mouseup", function(e) {
                    if(e.target.id === "resourceChoose") {
                        e.originalEvent.cancelBubble = true;
                        e.originalEvent.returnValue = false;
                        if(e.originalEvent.stopPropation) e.originalEvent.stopPropagation();
                        if(e.originalEvent.stopImmediatePropagation) e.originalEvent.stopImmediatePropagation();
                        return;
                    }
                   var endX = e.clientX;
                   var endY = e.clientY;
                   if((Math.pow((x-endX),2) + Math.pow((y-endY),2)) < 100) {
                       var target = e.originalEvent.target || e.originalEvent.srcElement;
                       var panel = target.id ? $('#' + target.id).parents('.panel').first() : $(e.target).parent().parents('.panel').first();
                       panel.toggleClass ('is-open');
                       panel.siblings ().removeClass ('is-open');
                   }
                });
            }
        };
});