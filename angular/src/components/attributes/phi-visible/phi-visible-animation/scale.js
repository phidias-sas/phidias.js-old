(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiVisibleAnimation", phiVisibleAnimation);


    phiVisibleAnimation.$inject = ["phiCoordinates"];
    function phiVisibleAnimation(phiCoordinates) {

        return {
            restrict: "A",
            link: phiVisibleAnimationLink
        };


        function phiVisibleAnimationLink(scope, element, attributes) {

            if (attributes.phiVisibleAnimation != 'scale') {
                return;
            }

            var el = element[0];

            attributes.$observe("phiVisible", function(newValue) {

                if (newValue == 'true') {

                    // Measure the final height 
                    el.style.height = 'auto';
                    var endheight = getComputedStyle(el).height;                    

                    // reset
                    el.style.height = 0;
                    el.offsetHeight; // force repaint

                    // transition to final height:
                    el.style.height = endheight;

                    // set height to auto after transition
                    el.addEventListener('transitionend', function transitionEnd(event) {
                        if (event.propertyName == 'height') {
                            el.removeEventListener('transitionend', transitionEnd, false);
                            el.style.height = 'auto';
                        }
                    }, false);


                } else {
                    el.style.height = getComputedStyle(el).height;  //set height to a numeric value (because if height is "auto" it will not transition)
                    el.offsetHeight; // force repaint
                    el.style.height = '0';
                }

            });

        };

    };


})();