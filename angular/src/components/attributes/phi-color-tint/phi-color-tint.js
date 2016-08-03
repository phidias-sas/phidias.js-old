/*
Creates a containing element tinted with the given hue

<div phi-color-tint="... valid css color ...">
*/

(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiColorTint", phiColorTint);

    function phiColorTint() {
        return {
            restrict: "A",
            link: function(scope, element, attributes) {
                var hue = attributes.phiColorTint;
                element.prepend('<div class="phi-color-tint" style="background-color: ' + hue + '" />');
            }
        };
    };

})();