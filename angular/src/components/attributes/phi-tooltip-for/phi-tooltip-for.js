(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiTooltipFor", phiTooltipFor);


    var uniqueTooltipId = 0;

    phiTooltipFor.$inject = ["phiCoordinates", "$document", "$timeout"];
    function phiTooltipFor(phiCoordinates, $document, $timeout) {

        return {
            restrict: "A",
            link: phiTooltipForLink
        };


        function phiTooltipForLink(scope, element, attributes) {

            element.css("position", "absolute");

            uniqueTooltipId++;
            scope.uniqueId = uniqueTooltipId;

            var targetElement = angular.element(document.getElementById(attributes.phiTooltipFor));
            targetElement.data("phiTooltipId", scope.uniqueId);

            if (attributes.phiTooltipAutoToggle != undefined) {
                hide();
                targetElement.bind('click', toggle);
            }

            function toggle() {
                if (element.attr("phi-visible") == "true") {
                    hide();
                } else {
                    show();
                }
            }

            function show() {
                element.attr("phi-visible", true);
                reposition();

                $timeout(function() {
                    $document.bind('click', hide);
                });
            }

            function hide() {
                element.attr("phi-visible", false);
                reposition();

                $document.unbind('click', hide);
            }


            function documentClicked(e) {

                $document.unbind('click', documentClicked);

                // ignore clicks on the target element
                var clickTargetId = angular.element(e.target).inheritedData("phiTooltipId");
                if (clickTargetId == scope.uniqueId) {
                    return;
                }

                hide();
            }


            attributes.$observe("phiTooltipFor", function() {
                reposition();
            });

            attributes.$observe("phiTooltipAlign", function() {
                reposition();
            });

            attributes.$observe("phiTooltipOrigin", function() {
                reposition();
            });

            attributes.$observe("phiVisible", function(value) {
                reposition();
            });



            function reposition() {

                var targetElement = angular.element(document.getElementById(attributes.phiTooltipFor));

                if (!targetElement.length) {
                    return;
                }

                var localCoordinates         = phiCoordinates.getBounds(element);
                var targetElementCoordinates = phiCoordinates.getBounds(targetElement);

                var coordinates = {
                    top:  0,
                    left: 0
                };

                var alignment = phiCoordinates.parseAlignmentString(attributes.phiTooltipAlign) || {vertical: "bottom", horizontal: "left"};

                switch (alignment.vertical) {
                    case "top":
                        coordinates.top += targetElementCoordinates.top;
                    break;

                    case "center":
                        coordinates.top += targetElementCoordinates.top + targetElementCoordinates.height/2;
                    break;

                    case "bottom":
                        coordinates.top += targetElementCoordinates.top + targetElementCoordinates.height;
                    break;
                }

                switch (alignment.horizontal) {
                    case "left":
                        coordinates.left += targetElementCoordinates.left;
                    break;

                    case "center":
                        coordinates.left += targetElementCoordinates.left + targetElementCoordinates.width/2;
                    break;

                    case "right":
                        coordinates.left += targetElementCoordinates.left + targetElementCoordinates.width;
                    break;
                }


                var origin = phiCoordinates.parseAlignmentString(attributes.phiTooltipOrigin) || {vertical: "top", horizontal: "left"};

                switch (origin.vertical) {
                    case "bottom":
                        coordinates.top -= localCoordinates.height;
                    break;

                    case "center":
                        coordinates.top -= localCoordinates.height/2;
                    break;
                }

                switch (origin.horizontal) {

                    case "right":
                        coordinates.left -= localCoordinates.width;
                    break;

                    case "center":
                        coordinates.left -= localCoordinates.width/2;
                    break;
                }


                var elementCoordinates = {
                    top:    coordinates.top+"px",
                    left:   coordinates.left+"px",
                    right:  "auto",
                    bottom: "auto"
                };

                if (attributes.phiTooltipMatch == "width") {
                    elementCoordinates.minWidth = targetElementCoordinates.width+"px";
                } else if (attributes.phiTooltipMatch == "height") {
                    elementCoordinates.minHeight = targetElementCoordinates.height+"px";
                }

                element.css(elementCoordinates);
            };


        };

    };


})();