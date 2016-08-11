/*
The phi-modal attribute only appends the element to the bottom of the body
and styles it as a fixed full-screen element (100% width and height).
visibility can be established with the phi-visible attribute
*/

(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiModal", phiModal);

    phiModal.$inject = ["$document"];
    function phiModal($document) {

        return {
            restrict: "A",

            link: function(scope, element, attributes)  {

                angular.element($document[0].body).append(element);

                scope.$on("$destroy", function() {
                    element.remove();
                });

            }
        };        
    };

})();