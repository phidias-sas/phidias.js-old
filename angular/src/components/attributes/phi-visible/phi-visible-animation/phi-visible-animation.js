(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiVisibleAnimation", phiVisibleAnimation);


    phiVisibleAnimation.$inject = ["phiCoordinates", "$timeout"];
    function phiVisibleAnimation(phiCoordinates, $timeout) {

        return {
            restrict: "A",
            link: phiVisibleAnimationLink
        };


        function phiVisibleAnimationLink(scope, element, attributes) {

            if (attributes.phiVisibleAnimation != 'scale') {
                return;
            }

            attributes.$observe("phiVisible", function(newValue) {

                if (newValue == 'true') {
                    element.css('height', 'auto');
                    var bounds = element[0].getBoundingClientRect();
                    element.css('height', 0);
                    $timeout(function() {
                        element.css('height', bounds.height + 'px');
                    }, 0);

                } else {
                    element.css('height', 0);
                }

            });

        };

    };


})();