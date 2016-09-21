(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiButton", phiButtonDirective);


    function phiButtonDirective() {

        return {
            restrict:   "E",
            transclude: true,
            template:   "<button phi-button type=\"button\" ng-transclude></button>",
            replace:    true
        }

    }

})();