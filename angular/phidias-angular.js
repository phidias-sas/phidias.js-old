(function() {
    'use strict';
    angular
        .module("phidias-angular", [
            "ngAria", 
            "ngSanitize",
            "angular-sortable-view",
            "textAngular"
        ]);
})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter("bytes", bytes);

    function bytes() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter("lines", lines);

    function lines() {
        return function(text) {

            var retval = [];

            if (text == undefined) {
                return retval;
            }

            text.split("\n").map(function(line) {
                var trimmed = line.trim();
                if (trimmed.length > 0) {
                    retval.push(trimmed);
                }
            });

            return retval;
        };
    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter("momentCalendar", calendar)
        .filter("momentFormat", format)
        .filter("momentFromNow", fromNow);

    function calendar() {
        return function(timestamp) {
            return moment(timestamp*1000).calendar();
        };
    }

    function format() {
        return function(timestamp, formatString) {
            return moment(timestamp*1000).format(formatString);
        };        
    }

    function fromNow() {
        return function(timestamp) {
            return moment(timestamp*1000).fromNow();
        };
    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter('trustAsResourceUrl', trustAsResourceUrl)
        .filter('trustAsUrl', trustAsUrl)
        .filter('trustAsHtml', trustAsHtml);

    trustAsResourceUrl.$inject = ["$sce"];
    function trustAsResourceUrl($sce) {
        return $sce.trustAsResourceUrl;
    }

    trustAsUrl.$inject = ["$sce"];
    function trustAsUrl($sce) {
        return $sce.trustAsUrl;
    }

    trustAsHtml.$inject = ["$sce"];
    function trustAsHtml($sce) {
        return $sce.trustAsHtml;
    }

})();
// Based on https://jcrowther.io/2015/07/13/linking-polymer-model-updates-to-angularjs-digest-cycle/
// fixed support for camelCase attributes
// fixes elements inside ng-repeat
(function() {
        'use strict';

        angular
            .module("phidias-angular")
            .directive('bindPolymer', ['$parse', function($parse) {
                return {
                    restrict: 'A',
                    scope : false,
                    compile: function bindPolymerCompile(el, attr) {
                        var attrMap = {};
                        for (var prop in attr) {
                            if (angular.isString(attr[prop])) {
                                var _match = attr[prop].match(/\{\{\s*([\.\w]+)\s*\}\}/);
                                if (_match) {
                                    attrMap[prop] = $parse(_match[1]);
                                }
                            }
                        }
                        return function bindPolymerLink(scope, element, attrs) {

                            // !!! get correct element if inside an ng-repeat
                            element = (element[0].tagName == undefined) ? angular.element(element[0].nextElementSibling) : element;

                            Object.keys(attrMap).forEach(function(key) {

                                attrs.$observe(key, function(newValue) {
                                    element[0].set(key, newValue);
                                });

                                var dashedName = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

                                element.on(dashedName + '-changed', function(event) {
                                    scope.$evalAsync(function() {
                                        if (attrMap[key](scope) === event.detail.value) return;
                                        attrMap[key].assign(scope, event.detail.value);
                                    });
                                });
                            });
                        };
                    }
                };
            }]);
})();
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
angular.module("phidias-angular").directive("phiPosition", ["phiCoordinates", function(phiCoordinates) {

    return {

        restrict: "A",

        scope: {},

        link: function(scope, element, attributes)  {

            element.parent().css("position", "relative");
            element.css("position", "absolute");

            scope.reposition = function(positionString) {

                var boundingRect = phiCoordinates.getBounds(element);
                var alignment    = phiCoordinates.parseAlignmentString(positionString) || {vertical: "top", horizontal: "left"};

                var coordinates  = {
                    top:        "auto",
                    left:       "auto",
                    bottom:     "auto",
                    right:      "auto",
                    marginTop:  0,
                    marginLeft: 0
                };

                switch (alignment.vertical) {

                    case "top":
                        coordinates.top = "10px";
                    break;

                    case "center":
                        coordinates.top       = "50%";
                        coordinates.marginTop = (boundingRect.height * -0.5) + "px";
                    break;

                    case "bottom":
                        coordinates.bottom = "10px";
                    break;

                }

                switch (alignment.horizontal) {

                    case "left":
                        coordinates.left = "10px";
                    break;

                    case "center":
                        coordinates.left       = "50%";
                        coordinates.marginLeft = (boundingRect.width * -0.5) + "px";
                    break;

                    case "right":
                        coordinates.right = "10px";
                    break;

                }

                element.css(coordinates);

            };

            attributes.$observe("phiPosition", function(positionString) {
                scope.reposition(positionString);
            });

        }
    };

}]);

/*
This directive will simply set the "phi-switch-active" class (and optionally the class you specify via phi-switch-active-class="") to one child element at a time 
and provide controls to select the active item.  All styling should be defined in your stylesheets

Usage:

//have a local variable "controls" which will be populated with the switch's controls functions:

<div phi-switch="controls" phi-switch-active-class="myOwnClass">
    <div>Element 1</div>
    <div>Element 2</div>
    ....
</div>

<h1>Now showing {{controls.activeIndex}}</h1>

<button ng-click="controls.select(2)">See index 2</button>
<button ng-click="controls.previous()" ng-disabled="!controls.hasPrevious()">prev</button>
<button ng-click="controls.next()" ng-disabled="!controls.hasNext()">next</button>

*/


(function() {
    'use strict';


    angular
        .module("phidias-angular")
        .directive("phiSwitch", phiSwitch);


    phiSwitch.$inject = ["$timeout"];
    function phiSwitch($timeout) {

        return {

            restrict: "A",

            scope: {
                controls:        "=phiSwitch",
                customClassName: "@phiSwitchActiveClass",
                onChange:        "&"
            },

            link: phiSwitchLink
        };


        function phiSwitchLink(scope, element, attributes)  {

            var items  = [];

            scope.activeClass = "phi-switch-active" + (scope.customClassName ? " "+scope.customClassName : "");
            scope.controls    = scope.controls != undefined ? scope.controls : {};

            scope.controls = {

                activeIndex: null,
                length:      0,

                select: function(targetIndex) {

                    items       = element.children();
                    this.length = items.length;

                    if (!items.length) {
                        return;
                    }

                    //only allow from 0 to items.length
                    //targetIndex = Math.min(Math.max(targetIndex, 0), items.length);

                    //cycle
                    if (targetIndex >= items.length) {
                        targetIndex = targetIndex % items.length;
                    } else if (targetIndex < 0) {
                        targetIndex = items.length + targetIndex;
                    }

                    if (items[targetIndex] == undefined) {
                        return;
                    }

                    if (this.activeIndex !== null && items[this.activeIndex] != undefined) {
                        angular.element(items[this.activeIndex]).removeClass(scope.activeClass);
                    }

                    angular.element(items[targetIndex]).addClass(scope.activeClass);
                    this.activeIndex = targetIndex;

                    scope.onChange();
                },

                next: function() {
                    scope.controls.select(scope.controls.activeIndex + 1);
                },

                previous: function() {
                    scope.controls.select(scope.controls.activeIndex - 1);
                },

                hasNext: function() {
                    return items[scope.controls.activeIndex + 1] != undefined;
                },

                hasPrevious: function() {
                    return items[scope.controls.activeIndex - 1] != undefined;
                }

            };

        };

    };

})();

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
                    console.log("self click");
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
//phi-viewport-leave(-start)
//phi-viewport-leave-end

//phi-viewport-enter(-start)
//phi-viewport-enter-end

angular.module("phidias-angular").directive("phiViewportLeave", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.top && bounds.top <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.bottom && bounds.bottom >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeave, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);



angular.module("phidias-angular").directive("phiViewportLeaveEnd", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            scope.scrollListener = function() {

                var bounds     = phiCoordinates.getBounds(element);
                var leaveEvent = null;

                if (lastY < bounds.bottom && bounds.bottom <= $window.scrollY) { //leaving from the top
                    leaveEvent = {
                        direction: "up"
                    }
                } else if (lastY + $window.innerHeight > bounds.top && bounds.top >= $window.scrollY + $window.innerHeight) { //leaving from the bottom
                    leaveEvent = {
                        direction: "down"
                    }
                }

                if (leaveEvent) {
                    scope.$eval(attributes.phiViewportLeaveEnd, {event: leaveEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;
            };


            angular.element($window).bind("scroll", scope.scrollListener);

            element.on('$destroy', function() {
                angular.element($window).unbind("scroll", scope.scrollListener);
            });

        }

    };


}]);




angular.module("phidias-angular").directive("phiViewportEnter", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.top && bounds.top <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.bottom && bounds.bottom >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnter, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);





angular.module("phidias-angular").directive("phiViewportEnterEnd", ["$window", "phiCoordinates", "$timeout", function($window, phiCoordinates, $timeout) {

    return {

        restrict: "A",

        link: function(scope, element, attributes) {

            var lastY = $window.scrollY;

            angular.element($window).bind("scroll", function() {

                var bounds     = phiCoordinates.getBounds(element);
                var enterEvent = null;

                if (lastY + $window.innerHeight < bounds.bottom && bounds.bottom <= $window.scrollY + $window.innerHeight) { //entering from the top
                    enterEvent = {
                        direction: "up"
                    }
                } else if (lastY > bounds.top && bounds.top >= $window.scrollY) { //entering from the bottom
                    enterEvent = {
                        direction: "down"
                    }
                }

                if (enterEvent) {
                    scope.$eval(attributes.phiViewportEnterEnd, {event: enterEvent});
                    scope.$apply();
                }

                lastY = $window.scrollY;

            });

        }

    };


}]);

(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive('srcIf', [function() {
            return {
                restrict: 'A',
                scope : false,
                compile: function srcIfCompile(el, attr) {
                    // console.log("compiling", typeof el, typeof el.addClass, el[0]);
                    return function srcIfLink(scope, element, attrs) {
                        // !!! when inside ng-repeat, angular linking returns the wrong element.
                        element = (element[0].tagName == undefined) ? element[0].nextElementSibling : element[0];

                        attrs.$observe('srcIf', function(srcIf){
                            if (srcIf) {
                                element.set('src', attrs.srcIf);
                            } else {
                                element.removeAttribute('src');
                            }
                        });
                    };
                }
            };
        }]);
})();
/**
* The ng-thumb directive
* @author: nerv
* @version: 0.1.2, 2014-01-09
*/
angular.module("phidias-angular").directive('ngThumb', ['$window', function($window) {

    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };

}]);
/*

someObject = {
    title: "Object title",
    description: "Some description"
}


<phi-object type="book" ng-model="someObject" controller-as="myBook"></phi-object>

<phi-button ng-click="myBook.go('edit')">Editar</phi-button>


*/
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiBlock", phiBlock);

    function phiBlock() {

        return {

            restrict: "E",

            scope: {
                ngModel:          "=",
                controllerAssign: "=",
                onChange:         "&",
                onDestroy:        "&"
            },

            controller:       phiBlockController,
            controllerAs:     "vm"
        };

    };


    phiBlockController.$inject = ["$scope", "$element", "$controller", "$compile"];
    function phiBlockController($scope, $element, $controller, $compile) {

        var scope;
        var objectService;

        var vm          = this;

        vm.ngModel      = $scope.ngModel;
        vm.onChange     = $scope.onChange;
        vm.onDestroy    = $scope.onDestroy;

        vm.states       = [];
        vm.currentState = null;
        vm.go           = go;

        vm.isLoading    = false;
        vm.setLoading   = setLoading;

        vm.change       = change;
        vm.destroy      = destroy;


        /* Load states from corresponding service */
        objectService   = loadObjectService(vm.ngModel.type, vm);
        vm.states       = objectService.states;


        /* Setup external controller */
        vm.controller = {
            states:       Object.keys(vm.states),
            currentState: vm.currentState,
            go:           go,
            isLoading:    vm.isLoading
        };

        if ($scope.controllerAssign != undefined) {
            $scope.controllerAssign = vm.controller;
        }

        /* Run object initialization */
        if (typeof objectService.initialize == "function") {
            objectService.initialize();
        } else if (vm.states.length) {
            vm.go(Object.keys(vm.states)[0]);
        }

        /////////////

        function go(targetStateName) {

            if (vm.states[targetStateName] === undefined || vm.currentState == targetStateName) {
                return;
            }

            if (scope) {
                scope.$destroy();
                scope = null;
            }

            scope = $scope.$new(true);
            scope.phiBlock = vm;

            $element.removeClass("phi-object-state-"+vm.currentState);
            $element.addClass("phi-object-state-"+targetStateName);

            vm.currentState            = targetStateName;
            vm.controller.currentState = targetStateName;

            var targetState = vm.states[targetStateName];

            if (targetState.controller) {

                var controllerObj = $controller(targetState.controller, {'$scope': scope});

                if (targetState.controllerAs) {
                    scope[targetState.controllerAs] = controllerObj;
                }
            }

            if (targetState.template) {
                var e = $compile(targetState.template)(scope);
                $element.empty().append(e);
            }

        }

        function change() {
            vm.onChange();
        }

        function destroy() {
            vm.onDestroy();
        }

        function setLoading(isLoading) {
            vm.isLoading            = isLoading;
            vm.controller.isLoading = isLoading;
        }

    };


    function loadObjectService(type, vm) {

        var words = type.split("-").map(function(word) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        });

        var serviceName  = "phiBlock" + words.join("");

        try {
            var blockFactory = angular.element(document.body).injector().get(serviceName);
            return blockFactory(vm);
        } catch (err) {
            console.log("Block service " + serviceName + " not found");
            return {states: []};
        }

    };

})();
(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive('phiAvatar', phiAvatar);


    function phiAvatar() {

        return {
            restrict: 'E',
            template:

                '<div>' +
                    '<img ng-src="{{src}}" />' +
                '</div>',

            scope: {
                src: "@"
            }

        };

    };

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiButton", phiButtonDirective);


    function phiButtonDirective() {

        return {
            restrict:   "E",
            transclude: true,
            template:   "<button phi-button ng-transclude></button>",
            replace:    true
        }

    }

})();
/**
 * Proof of concept: Port an angular-material element
 */

(function() {
'use strict';

/**
 * @ngdoc module
 * @name material.components.checkbox
 * @description Checkbox module!
 */
angular.module("phidias-angular")
    .directive('phiCheckbox', ['inputDirective', MdCheckboxDirective]);

/**
 * @ngdoc directive
 * @name mdCheckbox
 * @module material.components.checkbox
 * @restrict E
 *
 * @description
 * The checkbox directive is used like the normal [angular checkbox](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D).
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the checkbox is in the accent color by default. The primary color palette may be used with
 * the `phi-primary` class.
 *
 * @param {string} ng-model Assignable angular expression to data-bind to.
 * @param {string=} name Property name of the form under which the control is published.
 * @param {expression=} ng-true-value The value to which the expression should be set when selected.
 * @param {expression=} ng-false-value The value to which the expression should be set when not selected.
 * @param {string=} ng-change Angular expression to be executed when input changes due to user interaction with the input element.
 * @param {boolean=} phi-no-ink Use of attribute indicates use of ripple ink effects
 * @param {string=} aria-label Adds label to checkbox for accessibility.
 * Defaults to checkbox's text. If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 * <phi-checkbox ng-model="isChecked" aria-label="Finished?">
 *     Finished ?
 * </phi-checkbox>
 *
 * <phi-checkbox phi-no-ink ng-model="hasInk" aria-label="No Ink Effects">
 *     No Ink Effects
 * </phi-checkbox>
 *
 * <phi-checkbox ng-disabled="true" ng-model="isDisabled" aria-label="Disabled">
 *     Disabled
 * </phi-checkbox>
 *
 * </hljs>
 *
 */
function MdCheckboxDirective(inputDirective) {

    inputDirective = inputDirective[0];
    var CHECKED_CSS = 'phi-checked';

    return {
        restrict: 'E',
        transclude: true,
        require: '?ngModel',

        template:   '<div class="phi-checkbox-box"></div>' +
                    '<div ng-transclude class="phi-checkbox-label"></div>',

        compile: compile
    };

    // **********************************************************
    // Private Methods
    // **********************************************************

    function compile (tElement, tAttrs) {

        tAttrs.type     = 'checkbox';
        tAttrs.tabIndex = 0;
        tElement.attr('role', tAttrs.type);

        return function postLink(scope, element, attr, ngModelCtrl) {

            var checked = false;

            // Reuse the original input[type=checkbox] directive from Angular core.
            // This is a bit hacky as we need our own event listener and own render
            // function.
            inputDirective.link.pre(scope, {
                on: angular.noop,
                0: {}
            }, attr, [ngModelCtrl]);

            element.on('click', listener)
                   .on('keypress', keypressHandler);

            ngModelCtrl.$render = render;

            function keypressHandler(ev) {
                if(ev.which === 32) {
                    ev.preventDefault();
                    listener(ev);
                }
            }

            function listener(ev) {
                if (element[0].hasAttribute('disabled')) return;

                scope.$apply(function() {
                    checked = !checked;
                    ngModelCtrl.$setViewValue(checked, ev && ev.type);
                    ngModelCtrl.$render();
                });
            }

            function render() {
                checked = ngModelCtrl.$viewValue;
                element.toggleClass(CHECKED_CSS, checked);
            }
        };
    }
}

})();
/*
phi-cover is esentially a shorthand way of creating a <div> with a background-image css property

<phi-cover src="foo.jpg" />

will produce

<div style="background-image: url('foo.jpg')"></div>
*/

(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive("phiCover", phiCover);

    function phiCover() {

        return {
            restrict: 'E',

            scope: {
                src: "@",
                'default': "@"
            },

            link: function(scope, element, attributes) {

                attributes.$observe("src", function(src) {

                    var backgrounds = [];

                    if (src) {
                        backgrounds.push("url('"+src+"')");
                    }

                    if (scope['default']) {
                        backgrounds.push("url('"+scope['default']+"')");
                    }

                    if (backgrounds.length) {
                        element.css("background-image", backgrounds.join());
                    }

                });

            }
        };

    };

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiEventEditor", phiEventEditor);

    function phiEventEditor() {
        return {
            restrict: "E",
            scope: {
                event: "=ngModel"
            },
            controller:       phiEventEditorController,
            controllerAs:     "vm",
            bindToController: true,
            templateUrl:      '/components/elements/event/editor.html'
        };
    }

    function phiEventEditorController() {

        var vm = this;

        vm.defaultRepeat = {
            interval: '1',
            every: 'week'
        };

        vm.minDate = null;

        vm.toggleRepeat = function(value) {
            if (value == undefined) {
                value = !vm.event.repeat;
            }
            vm.event.repeat = value ? vm.defaultRepeat : null;
        };

        vm.sanitize = function() {
            if (vm.event.endDate < vm.event.startDate) {
                vm.event.endDate = vm.event.startDate;
            }

            vm.minDate = new Date();
            vm.minDate.setDate(vm.event.startDate.getDate() - 1);
        };

        vm.sanitize();
    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiEventRepeat", phiEventRepeat);

    function phiEventRepeat() {
        return {
            restrict: "E",
            scope: {
                repeat: "=ngModel"
            },
            controller:       phiEventRepeatController,
            controllerAs:     "vm",
            bindToController: true,
            templateUrl:      '/components/elements/event/repeat.html'
        };
    }

    phiEventRepeatController.$inject = ["$scope"];
    function phiEventRepeatController($scope) {

        var vm = this;

        vm.checkedDays = [];
        vm.summary     = "";

        $scope.$watch("vm.repeat", function() {
            if (typeof vm.repeat.on == "object") {
                vm.checkedDays = [];
                for (var cont = 0; cont < vm.repeat.on.length; cont++) {
                    vm.checkedDays[parseInt(vm.repeat.on[cont])] = true;
                }
            }
        }, true);

        vm.sayDay = function(day) {
            switch (day) {
                case 1:
                    return "lunes";
                case 2:
                    return "martes";
                case 3:
                    return "miércoles";
                case 4:
                    return "jueves";
                case 5:
                    return "viernes";
                case 6:
                    return "sábado";
                case 7:
                    return "domingo";
                default:
                    return "???";
            }
        };

        vm.toggleDay = function(weekDay, value) {

            if (typeof vm.repeat.on != 'object') {
                vm.repeat.on = [];
            }

            if (value) {
                if (vm.repeat.on.indexOf(weekDay) == -1) {
                    vm.repeat.on.push(weekDay);
                }
            } else {
                vm.repeat.on.splice(vm.repeat.on.indexOf(weekDay), 1);
            }

        };

        vm.getSummary = function() {

            if (!vm.repeat.every) {
                return "no se repite";
            }

            var summary = "cada ";

            if (vm.repeat.interval > 1) {
                summary += vm.repeat.interval + " ";
            }

            switch (vm.repeat.every) {
                case "day":
                    summary += (vm.repeat.interval > 1) ? "dias" : "dia";
                break;

                case "week":
                    summary += (vm.repeat.interval > 1) ? "semanas" : "semana";

                    var dayNames = [];

                    if (typeof vm.repeat.on == 'object') {
                        for (var cont = 0; cont < vm.repeat.on.length; cont++) {
                            dayNames.push(vm.sayDay(vm.repeat.on[cont]));
                        }
                    }

                    if (dayNames.length) {
                        summary += " los ";
                    }

                    if (dayNames.length > 2) {
                        summary += " " + dayNames.slice(0, dayNames.length-2).join(", ") + ", " + dayNames.slice(dayNames.length-2).join(" y ");
                    } else {
                        summary += " " + dayNames.join(" y ");
                    }

                break;

                case "month":
                    summary += (vm.repeat.interval > 1) ? "meses" : "mes";

                    summary += (vm.repeat.on == "weekday") ? " el día de la semana" : " el día del mes";

                break;

                case "year":
                    summary += (vm.repeat.interval > 1) ? "años" : "año";
                break;
            }

            return summary;
        };


    }

})();
(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive("phiGallery", phiGallery);

    function phiGallery() {

        return {
            restrict: 'E',

            scope: {
                control: "="
            },

            controller:       phiGalleryController,
            controllerAs:     "gallery",
            bindToController: true,

            transclude: true,
            replace: true,
            template: '<div phi-modal class="phi-gallery-modal" phi-visible="{{gallery.isVisible}}" ng-click="gallery.isVisible = false">' +

                          '<div class="phi-gallery-modal-navigation">' +
                                '<a class="previous"' +
                                   'ng-class="{disabled: !gallery.control.hasPrevious()}"' +
                                   'ng-click="gallery.control.previous(); $event.stopPropagation();">' +
                                   'anterior' +
                                '</a>' +

                                '<span>{{gallery.control.activeIndex+1}} de {{gallery.control.length}}</span>' +

                                '<a class="next"' +
                                   'ng-class="{disabled: !gallery.control.hasNext()}"' +
                                   'ng-click="gallery.control.next(); $event.stopPropagation();">' +
                                   'siguiente' +
                                '</a>' +
                          '</div>' +

                          '<div class="phi-gallery-modal-contents" phi-switch="gallery.control" ng-transclude on-change="gallery.isVisible = true"></div>' +

                      '</div>'            

        };

    };


    phiGalleryController.$inject = ["$scope"];
    function phiGalleryController($scope) {
        var gallery        = this;
        gallery.isVisible  = false;
        gallery.control    = gallery.control ? gallery.control : {};
    };

})();
/*
Same attributes as polymer's paper-element
*/

angular.module("phidias-angular").directive("phiInput", [function() {

    var phiInputCounter = 1;

    return {
        restrict: "E",

        scope: {
            name:           "@",
            type:           "@",
            label:          "@",
            placeholder:    "@",
            ngModel:        "=",
            ngModelOptions: "=",
            ngChange:       "&",
            ngFocus:        "&",
            ngBlur:         "&",
            maxlength:      "@",
        },

        template:   '<div>' +
                        '<label for="{{elementId}}" ng-bind="label"></label>' +
                        '<input maxlength="{{maxlength}}" type="{{type||\'text\'}}" ng-show="!multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="ngModel" ng-disabled="state.disabled" ng-model-options="ngModelOptions||{}" />' +
                        '<textarea maxlength="{{maxlength}}" ng-show="multiline" placeholder="{{placeholder}}" ng-focus="focus()" ng-blur="blur()" id="{{elementId}}" name="{{name}}" ng-model="ngModel" ng-disabled="state.disabled" ng-trim="false" ng-model-options="ngModelOptions||{}"></textarea>' +
                    '</div>' +
                    '<hr />',

        link: function(scope, element, attributes)  {

            scope.elementId     = "phi-input-" + phiInputCounter++;
            scope.floatinglabel = (typeof attributes.floatinglabel !== 'undefined') && attributes.floatinglabel !== 'false' && attributes.floatinglabel !== '0';
            scope.multiline     = (typeof attributes.multiline !== 'undefined') && attributes.multiline !== 'false' && attributes.multiline !== '0';

            scope.state = {
                focused:  false,
                empty:    true,
                disabled: (typeof attributes.disabled !== 'undefined') && attributes.disabled !== 'false' && attributes.disabled !== '0'
            };

            /* copy all attributes (except those in scope) to child input */
            var childInput = scope.multiline ? element.find('textarea') : element.find('input');
            for (var property in attributes) {
                if (!scope.hasOwnProperty(property) && property.charAt(0) != '$') {
                    childInput.attr(property, attributes[property]);
                }
            }

            element.toggleClass("phi-input-disabled", scope.state.disabled);

            element.attr("tabindex", -1);

            element.on("focus", function() {
                var inputElement = scope.multiline ? element.find("textarea") : element.find("input");
                inputElement[0].focus();
            });

            scope.focus = function() {
                scope.state.focused = true;
                element.toggleClass('phi-input-focused', true);
                scope.ngFocus();
            };

            scope.blur = function() {
                scope.state.focused = false;
                element.toggleClass('phi-input-focused', false);
                scope.ngBlur();
            };

            scope.resizeTextarea = function() {
                if (scope.multiline) {
                    var textarea = element.find("textarea");
                    textarea.css("height", "auto");
                    textarea.css("height", Math.max(textarea[0].scrollHeight, textarea[0].clientHeight) + "px");
                }
            };

            scope.$watch("ngModel", function(newValue, oldValue) {
                scope.state.empty = newValue == undefined || !newValue.length;
                element.toggleClass('phi-input-empty', scope.state.empty);

                if (newValue != oldValue) {
                    scope.resizeTextarea();
                    scope.ngChange();
                }
            });

        }

    };

}]);
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiMenu", phiMenu)
        .directive("phiSubmenu", phiSubmenu)
        .directive("phiMenuItem", phiMenuItem);


    function phiMenu() {
        return {
            restrict: "E",

            scope: {
                "onSelect": "&"
            },

            controller: ["$scope", function($scope) {
                this.select = function(item) {
                    $scope.onSelect(item);
                };
            }]
        };
    }

    function phiSubmenu() {

        return {
            restrict: "E",
            require: "^phiMenu",
            scope: {
                "label": "@"
            },

            transclude: true,

            template: '<a class="phi-submenu-label" ng-bind="label" tabindex="0" ng-click="toggle()"></a>' +
                      '<div class="phi-submenu-contents" ng-transclude></div>',

            link: function(scope, element, attributes, phiMenuController)  {

                scope.setExpanded = function(expanded) {

                    scope.expanded = expanded;

                    if (scope.expanded) {
                        element.attr("expanded", "expanded");
                        element.find("div").find("a").attr("tabindex", 0);
                    } else {
                        element.removeAttr("expanded");
                        element.find("div").find("a").attr("tabindex", -1);
                    }
                };

                scope.toggle = function() {
                    scope.setExpanded(!scope.expanded);
                };

                scope.setExpanded(false);

                var items = element.find('a');
                for (var index = 0; index < items.length; index++) {
                    if (angular.element(items[index]).attr("active") !== undefined) {
                        scope.setExpanded(true);
                        break;
                    }
                }
            }

        };
    }

    function phiMenuItem() {

        return {
            restrict: "EA",
            require: "^phiMenu",

            link: function(scope, element, attributes, phiMenuController) {
                element.on("click", function() {
                    phiMenuController.select(element);
                });
            }
        };

    }

})();

(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive("phiPost", phiPost);

    function phiPost() {

        return {
            restrict: 'E',

            scope: {
                ngModel: "="
            },

            templateUrl:      '/components/elements/phi-post/phi-post.html',
            controller:       phiPostController,
            controllerAs:     "vm",
            bindToController: true
        };

    };


    phiPostController.$inject = ["$sce", "$scope"];
    function phiPostController($sce, $scope) {


        var vm  = this;
        vm.post = vm.ngModel;

        $scope.$watch("vm.ngModel", function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            vm.post = newValue;
        });


    }


})();
/* Based on http://www.bennadel.com/blog/2756-experimenting-with-ngmodel-and-ngmodelcontroller-in-angularjs.htm */

(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiSelect", phiSelect)
        .directive("phiOption", phiOption);

    function phiSelect() {

        return {

            restrict: "E",
            require: "?ngModel",

            transclude: true,
            template:  '<div id="{{vm.uniqueId}}" class="phi-select-face" ng-click="vm.expand()" ng-class="{\'phi-select-expanded\': vm.isExpanded}">' +
                           '<div ng-show="!vm.isExpanded" class="phi-select-value"></div>' +
                           '<input ng-show="!!vm.isExpanded" type="text" ng-model="vm.query" tabindex="-1" size="2" />' +
                       '</div>' +
                       '<phi-menu ng-transclude phi-texture="paper" phi-tooltip-for="{{vm.uniqueId}}" phi-visible="{{vm.isExpanded}}" phi-visible-animation="slide-bottom"></phi-menu>',

            scope: {
                onSearch: "&phiOnSearch"
            },

            controller:       phiSelectController,
            controllerAs:     "vm",
            bindToController: true,

            link: phiSelectLink

        };

    }

    var phiSelectLinkCounter = 0;
    function phiSelectLink(scope, element, attrs, ngModel) {

        // Prepare element
        scope.vm.uniqueId = "phiSelect" + (++phiSelectLinkCounter);
        element.data("phiSelectLinkId", scope.vm.uniqueId);
        element.on("focus", scope.vm.expand);

        var displayElement = angular.element(element.find('div')[1]);


        // Let the controller access ngModel
        scope.vm.ngModel = ngModel;

        // $render() triggers when the ng-model value has changed
        ngModel.$render = function() {
            var optionElement = findOptionWithValue(ngModel.$viewValue);
            displayElement.html(optionElement ? optionElement.html() : ngModel.$viewValue);
        };

        function findOptionWithValue(value) {

            if (!value) {
                value = "";
            }

            var options = element.find('phi-option');

            for ( var i = 0; i < options.length; i++ ) {
                var option = angular.element( options[i] );
                if (option.attr("value") == value) {
                    return option;
                }
            }

            return null;

        };

        scope.$watch("vm.query", function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            scope.vm.onSearch({query: newValue});
        });

    }


    phiSelectController.$inject = ["$scope", "$document", "$element", "$timeout"];
    function phiSelectController($scope, $document, $element, $timeout) {

        var vm = this;

        vm.query = null;

        vm.setValue = function(value) {
            vm.collapse();
            vm.ngModel.$setViewValue(value);
            vm.ngModel.$render();
        }

        // Expand / collapse behavior

        vm.isExpanded = false;

        vm.expand = function() {

            if (vm.isExpanded) {
                return;
            }

            vm.isExpanded = true;

            $timeout(function() {
                $element.find("input")[0].focus();
            }, 0);

            $document.bind('click', documentClicked);

            vm.onSearch();
        };

        vm.collapse = function() {
            vm.isExpanded = false;
            $document.unbind('click', documentClicked);
        };

        vm.toggle = function() {
            vm.isExpanded ? vm.collapse() : vm.expand();
        };

        // Attach child
        vm.attachOptionElement = function(element) {

            element.on("click", function() {
                vm.setValue(element.attr("value"));
            });

        };

        function documentClicked(e) {

            // Ignore clicks within element
            if (angular.element(e.target).inheritedData('phiSelectLinkId') == $element.data('phiSelectLinkId')) {
                return;
            }

            $scope.$apply(vm.collapse);
        };

    }


    function phiOption() {

        return {
            restrict:   "E",
            require:    "^phiSelect",
            template:   '<a ng-transclude></a>',
            transclude: true,

            link: function(scope, element, attributes, phiSelect) {
                phiSelect.attachOptionElement(element);
            }
        };

    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .provider('phiApi', phiApi);

    function phiApi() {

        var provider      = this;
        provider.host     = null;
        provider.setHost  = setProviderHost;

        provider.$get     = service;

        /////////////////////////////////////////////////////

        function setProviderHost(host) {
            provider.host = host;
        }

        service.$inject = ['$http', '$q', 'phiStorage'];
        function service($http, $q, phiStorage) {

            var service = {

                /* Service configuration */
                host:    provider.host,
                setHost: setHost,

                /* Authentication (bearer token) */
                token:    null, // string token
                setToken: setToken,

                /* Main service functions */
                get:      get,
                post:     post,
                put:      put,
                patch:    patch,
                options:  options,
                remove:   deleteFn,  //alias, when phiApi.delete() causes a syntax error ('delete' is a reserved JS keyword)
                'delete': deleteFn,

                /* Cache handlers */
                cache: phiStorage.session,
                getCache: getCache,
                maxCacheTime: 30 // default cache lifetime in seconds
            }


            ////////// experimental cache
            var listeners = {};
            var filters   = {};

            service.cache = function(request) {

                request = angular.extend({
                    maxCacheTime: service.maxCacheTime
                }, request);

                var storage = phiStorage.session;

                function getCacheKey(request) {
                    // !!! in the meantime
                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");
                    return "api-cache:" + url;
                };


                function runListeners(current, previous) {
                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");

                    if (url.indexOf('threads/all') > 0) {
                        for (var property in listeners) {
                            listeners[property](current, previous);
                            return;
                        }
                    }
                };

                function runFilters(cacheContent) {

                    var url = request.url.replace(service.host,'').replace(/[/?]+$/, "");

                    if (!filters[url]) {
                        return cacheContent.payload;
                    }

                    var filter = filters[url];
                    cacheContent.payload = filter(cacheContent.payload, new Date(cacheContent.timestamp));
                    return cacheContent.payload;

                };

                var cache = {

                    get: function() {
                        var cacheContent = storage.get(getCacheKey(request));
                        if (cacheContent) {
                            var age = (new Date() - new Date(cacheContent.timestamp))/1000;
                            if (age < request.maxCacheTime) {
                                var retval = runFilters(cacheContent);
                                
                                retval.headers = function(key) {
                                    if (key == undefined) {
                                        return retval._headers; 
                                    }
                                    return retval._headers[key];
                                }

                                return retval;
                            }
                        }
                    },

                    store: function(payload) {

                        payload._headers = payload.headers();

                        var key      = getCacheKey(request);
                        var previous = storage.get(key);

                        runListeners(payload, previous ? previous.payload : null);

                        storage.set(key, {
                            payload: payload,
                            timestamp: new Date()
                        });

                        return cache;
                    },

                    clear: function() {
                        storage.clear(getCacheKey(request));

                        return cache;
                    },

                    patch: function(payload) {
                        var key          = getCacheKey(request);
                        var cacheContent = storage.get(key);
                        if (cacheContent) {
                            payload = angular.extend(cacheContent.payload, payload);
                        }

                        cache.store(payload);
                        return payload;
                    },

                    fetch: function(defaultValue) {
                        var key          = getCacheKey(request);
                        var cacheContent = storage.get(key);

                        if (!cacheContent) {
                            return defaultValue;
                        }

                        if (defaultValue == undefined) {
                            defaultValue = {};
                        }

                        return angular.extend(defaultValue, cacheContent.payload);
                    },

                    watch: function(callback) {
                        listeners[request.url] = callback;

                        return cache;
                    },

                    filter: function(callback) {
                        filters[request.url] = callback;

                        return cache;
                    }
                };

                return cache;
            }


            ///////////////////////////////////




            return service;

            ///////

            function setHost(host) {
                service.host = host;
            }

            function setToken(strToken) {
                if (strToken) {
                    service.token = strToken;
                } else {
                    service.token = null;
                }
            }

            function get(resource, data, config) {
                return execute('get', resource, data, config);
            }

            function post(resource, data, config) {
                return execute('post', resource, data, config);
            }

            function put(resource, data, config) {
                return execute('put', resource, data, config);
            }

            function patch(resource, data, config) {
                return execute('patch', resource, data, config);
            }

            function options(resource, data, config) {
                return execute('options', resource, data, config);
            }

            function deleteFn(resource, data, config) {
                return execute('delete', resource, data, config);
            }

            function getCache(method, resource, data, config) {

                var request = {
                    url: service.host ? service.host + '/' + resource : resource
                };

                if (method == 'get') {
                    request.url += '?' + serialize(data);
                }

                var cacheKey = "phi-api:" + request.url;
                var cacheContents = service.cache.get(cacheKey);
                if (!cacheContents) {
                    return null;
                }

                cacheContents.key = cacheKey;
                return cacheContents;
            }

            function execute(method, resource, data, config) {

                var request = {
                    method: method,
                    url:    service.host ? service.host + '/' + resource : resource,
                    data:   data
                };

                if (service.token) {
                    angular.extend(request, {
                        headers: {
                            Authorization: 'Bearer ' + service.token
                        }
                    });
                }

                angular.extend(request, config);

                if (method == 'get') {

                    request.url += '?' + serialize(request.data);
                    request.data = null;

                    var resourceCache  = service.cache(request);
                    var cachedResponse = resourceCache.get();
                    if (cachedResponse) {
                        var deferred = $q.defer();
                        deferred.resolve(cachedResponse);
                        return deferred.promise;
                    }

                    return $http(request)
                        .then(function(response) {
                            resourceCache.store(response);
                            return response;
                        });

                }

                return $http(request);

            }


            function serialize(obj, prefix) {

                var str = [];
                for(var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + '[' + p + ']' : p;
                        var v = obj[p];

                        if (v == null) {
                            continue;
                        }

                        if (typeof v == 'object') {
                            str.push(serialize(v, k));
                        } else if (typeof v == 'number' || v.length > 0) {
                            str.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
                        }

                    }
                }

                return str.join('&');
            }


        }

    }

})();
/*

Notificaciones:

phiApp.on('notification', function(notification) {

    // see https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md

    // notification.message,
    // notification.title,
    // notification.count,
    // notification.sound,
    // notification.image,
    // notification.additionalData
    // notification.additionalData.foreground
    // notification.additionalData.coldstart

});


Simular una notificacion desde consola:

var phiApp = angular.element(document.body).scope().$root.phiApp;

phiApp.broadcast('notification', {
    message: null,
    title: null,
    count: null,
    sound: null,
    image: null,
    additionalData: {
        foreground: true,
        postId: '4p54wr2b',
        threadId: '5719121132bc2'
    }
});

*/
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .provider('phiApp', phiApp);

    function phiApp() {

        var provider  = this;
        provider.$get = getService;

        /////////////////////////////////////////////////////

        getService.$inject = ["$rootScope", "$document", "$http", "phiStorage", "phiApi", "phiJwt", "$q", "$httpParamSerializer"];
        function getService($rootScope, $document, $http, phiStorage, phiApi, phiJwt, $q, $httpParamSerializer) {

            var service = {

                // application settings
                isLoaded: false,
                title:    null,
                endpoint: null,
                logo:     null,
                loadCode: loadCode,

                // authentication
                isAuthenticated: false,
                token: null, // string.  authentication token
                user: null,

                setToken: setToken,
                logout: logout,
                authenticate: authenticate,
                googleSignIn: googleSignIn,

                // navigation history
                previousState: null,


                // UX helpers
                loginShown: false,

                showLogin: function() {
                    service.loginShown = true;
                },

                hideLogin: function() {
                    service.loginShown = false;
                },

                loginController:  loginController,
                signupController: signupController

            }

            activate();


            ///////

            function activate() {

                /* Look for stored data */
                var storedData = phiStorage.local.get('phiApp');
                if (!storedData) {
                    storedData = getDataFromMetaTags();
                }

                load(storedData);

            }

            function loadCode(code) {

                return $http.get("http://phi.io/code/"+code)
                    .then(function(response) {
                        load({
                            title:    response.data.title,
                            //endpoint: "https://"+response.data.url,
                            endpoint: "http://"+response.data.url,
                            logo:     response.data.logo
                        });
                    });

            }


            function load(appData) {

                if (!appData.endpoint) {
                    return;
                }

                service.isLoaded = true;
                service.title    = appData.title;
                service.endpoint = appData.endpoint;
                service.logo     = appData.logo;
                service.token    = appData.token;

                phiApi.setHost(service.endpoint);

                if (service.token) {
                    service.setToken(service.token);
                }

                store();
            }

            function store() {
                phiStorage.local.set('phiApp', {
                    title:    service.title,
                    endpoint: service.endpoint,
                    logo:     service.logo,
                    token:    service.token
                });
            }


            function setToken(strToken) {
                service.token           = strToken;
                service.user            = phiJwt.decode(strToken);
                service.isAuthenticated = true;

                phiApi.setToken(strToken);
                registerPushNotifications();

                store();
                $rootScope.$broadcast("phiAppLogin");
            }

            function logout() {

                if (service.user && service.user.id && window.device && window.device.uuid) {
                    phiApi.delete("people/" + service.authentication.id + "/devices/" + window.device.uuid);
                }

                service.token = null;
                service.user  = null;
                service.isAuthenticated = false;
                phiApi.setToken(false);

                store();
                $rootScope.$broadcast("phiAppLogout");
            }

            function authenticate(username, password) {

                var deferred = $q.defer();

                phiApi.post('oauth/token', 'grant_type=client_credentials',
                        {
                            headers: {
                                'Authorization': 'Basic ' + btoa(username + ':' + password),
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }
                    )
                    .then(function(response) {
                        service.setToken(response.data.access_token);
                        deferred.resolve(service.authentication);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function googleSignIn() {

                var deferred = $q.defer();

                getGoogleAuthorizationCode()
                    .then(function(authorizationCode) {
                        phiApi
                            .post("oauth/google", {
                                code: authorizationCode
                            })
                            .then(function (response) {
                                service.setToken(response.data.access_token);
                                deferred.resolve(service.authentication);
                            }, function(error) {
                                deferred.reject(error);
                            });
                    });

                return deferred.promise;

            }


            function registerPushNotifications() {

                if (typeof PushNotification == "undefined") {
                    return;
                }

                var push = PushNotification.init({
                    android: {
                        senderID: "890266961007"
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                });

                push.on('registration', function(data) {

                    if (!window.device || !window.device.platform) {
                        return;
                    }

                    phiApi.post("people/" + service.authentication.id + "/devices/", {
                        token:    data.registrationId,
                        platform: window.device.platform,
                        model:    window.device.model,
                        uuid:     window.device.uuid
                    });

                });

                push.on('notification', function(data) {
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                    $rootScope.$broadcast("phiAppNotification", data);
                });

                push.on('error', function(e) {
                    // e.message
                });

            }




            function getGoogleAuthorizationCode() {

                var deferred = $q.defer();

                // https://developers.google.com/identity/protocols/OAuth2UserAgent#formingtheurl
                var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + $httpParamSerializer({
                    "redirect_uri":  "http://www.phidias.co/googlesignin.html",
                    "client_id":     "890266961007.apps.googleusercontent.com",
                    "scope":         "email",
                    "response_type": "code",
                    "prompt":        "select_account"
                });

                // Open the OAuth consent page in the InAppBrowser
                var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

                // Listen (one time) for messages sent from authWindow
                var listenMessage = function(event) {

                    if (event.data.status == 'success') {
                        deferred.resolve(event.data.code);
                    } else {
                        deferred.reject(event.data.error);
                    }

                    window.removeEventListener('message', listenMessage);
                }
                window.addEventListener('message', listenMessage);


                // Within phonegap, the created window will NOT have a window.opener, so
                // use this instead:
                authWindow.addEventListener('loadstart', function(e) {
                    var url   = e.url;
                    var code  = new RegExp(/\?code=(.+)$/).exec(url);
                    var error = new RegExp(/\?error=(.+)$/).exec(url);

                    var result = {};

                    if (code) {
                        result.status = 'success';
                        result.code   = code[1];
                    } else if (error) {
                        result.status = 'error';
                        result.error  = error[1];
                    }

                    if (code || error) {
                        window.postMessage(result, "*");
                        authWindow.close();
                    }
                });
                return deferred.promise;
            }



            function getDataFromMetaTags() {

                var retval = {};

                /* Obtain data from metatags (in public/index.html) */
                var metas = $document.find('meta');
                for (var cont = 0; cont < metas.length; cont++) {

                    /* Obtain endpoint from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-endpoint") {
                        retval.endpoint = metas[cont].content;
                    }

                    /* Obtain title from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-title") {
                        retval.title = metas[cont].content;
                    }

                    /* Obtain logo from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-logo") {
                        retval.logo = metas[cont].content;
                    }

                }

                return retval;
            }


            function loginController() {

                var vm = this;

                vm.isLoading   = false;
                vm.error       = null;

                vm.credentials = {
                    username: null,
                    password: null
                };

                vm.login = function() {

                    vm.isLoading = true;

                    service.authenticate(vm.credentials.username, vm.credentials.password).then(

                        function(response) {
                            service.hideLogin();
                        },

                        function(response) {

                            switch (response.data.error) {
                                case "Phidias\\OAuth\\Exception\\UserNotFound":
                                    vm.error = "usuario no encontrado";
                                break;

                                case "Phidias\\OAuth\\Exception\\WrongPassword":
                                    vm.error = "contrasena incorrecta";
                                break;

                                case "Phidias\\OAuth\\Exception\\UserNotActive":
                                    vm.error = "este usuario aun no esta activado";
                                break;

                                default:
                                    vm.error = "ha ocurrido un error iniciando la sesion";
                                break;
                            }
                        }

                    ).finally(function() {
                        vm.isLoading = false;
                    });

                };

            };


            signupController.$inject = ["$scope", "$stateParams"];
            function signupController($scope, $stateParams) {

                var vm = this;

                vm.isLoading         = false;           
                vm.account           = {};
                vm.errors            = {};
                vm.verificationEmail = null;
                vm.signup            = signup;

                activate();

                //////////////////////////

                function activate() {
                    $scope.$watch(
                        function () {
                            return vm.account;
                        }, 
                        function (newValue, oldValue) {
                            for (var property in newValue) {
                                if (newValue[property] != oldValue[property]) {
                                    delete vm.errors[property];
                                }
                            }
                        }
                    );
                };


                function signup() {

                    // Include all stateParams as
                    // registration payload
                    vm.account.payload = $stateParams;

                    vm.isLoading = true;

                    phiApi.post("accounts", vm.account)
                        .then(
                            function(response) {
                                vm.verificationEmail = response.data.email
                            },

                            function(response) {
                                vm.errors = response.data.data;
                            }
                        )
                        .finally(function() {
                            vm.isLoading = false;
                        });

                };



            };


            return service;


        }

    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .service('phiCoordinates', phiCoordinates);

    phiCoordinates.$inject = ['$timeout'];
    function phiCoordinates($timeout) {

        return {

            /*
            Based on angular-material util.js
            https://github.com/angular/material/blob/master/src/core/util/util.js

            Return the bounding rectangle relative to the offset parent (nearest in the containment hierarchy positioned containing element)

            Caches results every 500ms, so it's safe to call it continuously (like inside a window.scroll event)

            */
            getBounds: function(element, offsetParent) {

                $timeout.cancel(element.clearBoundsTimeout);

                element.clearBoundsTimeout = $timeout(function() {
                    element.data('phi-coordinates-bounds', null);
                }, 500);

                var bounds = element.data('phi-coordinates-bounds');

                if (!bounds) {
                    var node       = element[0];
                    offsetParent   = offsetParent || node.offsetParent || document.body;
                    offsetParent   = offsetParent[0] || offsetParent;
                    var nodeRect   = node.getBoundingClientRect();
                    var parentRect = offsetParent.getBoundingClientRect();

                    bounds = {
                        left:   nodeRect.left - parentRect.left,
                        top:    nodeRect.top - parentRect.top,
                        width:  nodeRect.width,
                        height: nodeRect.height,
                        bottom: nodeRect.top - parentRect.top + nodeRect.height
                    };

                    element.data('phi-coordinates-bounds', bounds);
                }

                return bounds;

            },


            parseAlignmentString: function(string) {

                if (string == undefined) {
                    return null;
                }

                var vertical   = null;
                var horizontal = null;

                if (string.indexOf('center') != -1) {
                    vertical   = 'center';
                    horizontal = 'center';
                }

                if (string.indexOf('top') != -1) {
                    vertical = 'top';
                }

                if (string.indexOf('bottom') != -1) {
                    vertical = 'bottom';
                }

                if (string.indexOf('left') != -1) {
                    horizontal = 'left';
                }

                if (string.indexOf('right') != -1) {
                    horizontal = 'right';
                }

                if (!vertical || !horizontal) {
                    return null;
                }

                return {
                    vertical: vertical,
                    horizontal: horizontal
                };

            }

        };

    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .provider('phiJwt', phiJwt);

    function phiJwt() {

        var provider  = this;
        provider.$get = getService;

        /////////////////////////////////////////////////////

        function getService() {

            var service = {
                decode:            decode,
                isExpired:         isExpired,
                getExpirationDate: getExpirationDate                    
            }

            return service;

            ///////

            function decode(token) {
                var parts = token.split('.');

                if (parts.length !== 3) {
                    throw new Error('JWT must have 3 parts');
                }

                var decoded = urlBase64Decode(parts[1]);
                if (!decoded) {
                    throw new Error('Cannot decode the token');
                }

                return JSON.parse(decoded);
            };

            function isExpired(token) {
                var d = getExpirationDate(token);

                if (!d) {
                    return false;
                }

                // Token expired?
                return !(d.valueOf() > new Date().valueOf());
            };

            function getExpirationDate(token) {
                var decoded;
                decoded = decode(token);

                if(!decoded.exp) {
                    return null;
                }

                var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
                d.setUTCSeconds(decoded.exp);

                return d;
            };

            function urlBase64Decode(str) {
                var output = str.replace('-', '+').replace('_', '/');
                switch (output.length % 4) {
                    case 0: { break; }
                    case 2: { output += '=='; break; }
                    case 3: { output += '='; break; }
                    default: {
                        throw 'Illegal base64url string!';
                    }
                }
                // return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
                return decodeURIComponent(escape(window.atob(output))); //polifyll https://github.com/davidchambers/Base64.js
            };            

        }

    }

})();
/*
phiStorage.session.set('name', value);
phiStorage.session.get('name', defaultValue);
phiStorage.session.clear('name');
phiStorage.session.clear(); // clears all

phiStorage.local.set('name', value);
phiStorage.local.get('name', defaultValue);
phiStorage.local.clear('name');
phiStorage.local.clear(); // clears all

*/
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory('phiStorage', phiStorage);

    function phiStorage() {

        return {
            session: getWrapper(window.sessionStorage),
            local:   getWrapper(window.localStorage)
        };

    };

    function getWrapper(storage) {

        return {

            set: function(name, value) {
                storage[name] = angular.toJson(value);
            },

            get: function(name, defaultValue) {
                return storage[name] === undefined ? defaultValue : angular.fromJson(storage[name]);
            },

            clear: function(name) {

                if (name !== undefined) {
                    return storage.removeItem(name);
                }

                return storage.clear();
            }

        }

    };

})();
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
(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive('phiNotificationSettings', phiNotificationSettings);

    phiNotificationSettings.$inject = ["phiApi"];
    function phiNotificationSettings(phiApi) {

        return {

            restrict: 'E',

            scope: {
                personId: "@"
            },

            templateUrl: '/components/elements/notification/settings/settings.html',
            controller: phiNotificationSettingsController,
            controllerAs: 'vm',
            bindToController: true
        };


        function phiNotificationSettingsController() {

            var vm          = this;
            var settingsUrl = "people/" + vm.personId + "/notifications/settings";

            vm.types    = [];
            vm.settings = {};

            vm.getTransportName = getTransportName;
            vm.toHour           = toHour;

            vm.toggleScheduling = toggleScheduling;
            vm.describeSetting  = describeSetting;

            vm.save = save;

            initialize();

            ////////////////

            function initialize() {
                phiApi.get("types/post")
                    .then(function(response) {
                        vm.types = response.data;
                        phiApi.get(settingsUrl)
                            .then(function(response) {
                                vm.settings = response.data.map(sanitizeSetting);
                            });
                    });
            }

            function getTransportName(transport) {
                switch (transport) {
                    case 'mobile':
                        return 'aplicación móvil';
                    break;
                    default:
                        return transport;
                    break;
                }
            }

            function sanitizeSetting(setting) {
                setting.hasSchedule = !!setting.schedule;
                if (setting.hasSchedule) {
                    setting.scheduleDate = new Date(null, null, null, setting.schedule.slice(0, 2), setting.schedule.slice(-2));
                }
                fillMissingTypes(setting);
                return setting;
            }

            function fillMissingTypes(setting) {

                // if this setting is already a type setting, ignore
                if (setting.type != undefined) {
                    return setting;
                }

                var typeSettings = [];

                for (var cont = 0; cont < vm.types.length; cont++) {

                    var type        = vm.types[cont];
                    var typeSetting = findTypeSetting(setting.types, type.singular);

                    if (typeSetting) {
                        typeSettings.push(sanitizeSetting(typeSetting));
                    } else {
                        // settings for this type are not explicitly declared.  Crete default:
                        typeSettings.push({
                            type: type.singular,
                            isEnabled: true
                        });
                    }
                }

                setting.types = typeSettings;
                return setting;
            }

            function findTypeSetting(settingArray, typeName) {

                if (settingArray == undefined) {
                    return null;
                }

                for (var cont = 0; cont < settingArray.length; cont++) {
                    var typeSetting = settingArray[cont];
                    if (typeSetting.type == typeName) {
                        return typeSetting;
                    }
                }

                return null;

            }



            function toHour(date) {
                var hours   = ("00"+String(date.getHours())).slice(-2);
                var minutes = ("00"+String(date.getMinutes())).slice(-2);
                return hours+minutes;
            }


            function save() {
                phiApi.post(settingsUrl, vm.settings)
                    .then(function(response) {
                        initialize(); // reload everything
                    });
            }

            function toggleScheduling(setting, isEnabled) {
                if (!setting.scheduleDate) {
                    setting.scheduleDate = new Date(null, null, null, 17, 0);
                }
                setting.schedule = isEnabled ? vm.toHour(setting.scheduleDate) : null;
            }

            function describeSetting(setting) {

                var notices = [];

                if (!setting.isEnabled) {
                    notices.push('desactivado');
                    return notices;
                }

                if (setting.hasSchedule) {
                    var hours   = setting.scheduleDate.getHours();
                    var minutes = ('00' + String(setting.scheduleDate.getMinutes())).slice(-2);
                    var am      = hours >= 12 ? 'pm' : 'am';

                    if (hours >= 12) {
                        hours = hours - 12;
                    }

                    if (hours == 0) {
                        hours = 12;
                    }

                    notices.push('se envia un consolidado a las ' + hours + ':' + minutes + ' ' + am);
                } else {
                    notices.push('activado');
                }

                if (setting.types) {

                    var disabledTypes = [];

                    for (var cont = 0; cont < setting.types.length; cont++) {

                        var typeSetting = setting.types[cont];
                        var type        = getType(typeSetting.type);

                        if (!typeSetting.isEnabled) {
                            disabledTypes.push(type.plural);
                            continue;
                        }

                        if (typeSetting.hasSchedule) {
                            notices.push((type.gender ? 'los ' : 'las ') + type.plural + ' se consolidan');
                        }
                    }

                    if (disabledTypes.length > 0) {
                        notices.push("excepto " + disabledTypes.join(", "));
                    }
                }

                return notices;

            }

            function getType(typeName) {
                for (var cont = 0; cont < vm.types.length; cont++) {
                    if (vm.types[cont].singular == typeName) {
                        return vm.types[cont];
                    }
                }
                return null;
            }



        }

    };

})();
/*

post = {

    id: "15913gfq",
    url: "nodes/9xaib1v/posts/process/15913gfq",

    title: "A title",
    description: "Yes, a description",

    blocks: [
        {
            type: "html",
            url: "nodes/9xaib1v/media/html/1591chpq",
            id: "1591cimg"
        },

        {
            type: "form",
            url: "data/entities/1591x70r",
            id: "1591x8p9"
        },

        {
            type: "html",
            url: "nodes/9xaib1v/media/html/15s1ibga",
            id: "15s1idb4"
        }
    ]
};

<phi-post-editor ng-model="post"></phi-post-editor>

*/

(function() {

    angular
        .module("phidias-angular")
        .directive("phiPostEditor", phiPostEditor);

    function phiPostEditor() {

        return {

            restrict: "E",

            scope: {
                post: "=ngModel"
            },

            controller:       phiPostEditorController,
            controllerAs:     "vm",
            bindToController: true,

            templateUrl: '/components/elements/phi-post/editor/phi-post-editor.html'
        };

    };


    phiPostEditorController.$inject = ["phiApi", "$scope"];
    function phiPostEditorController(phiApi, $scope) {

        var vm         = this;

        vm.addBlock    = addBlock;
        vm.attachBlock = attachBlock;
        vm.removeBlock = removeBlock;
        vm.reorder     = reorder;

        ///////////////////////

        $scope.$watch("vm.post", function(newValue) {
            
            if (!newValue) {
                return;
            }

            /* Testing */
            vm.insertable = [
                {
                    type: "html",
                    title: "texto HTML",
                    icon: "fa-font",

                    block: {
                        collectionUrl: '/media/html',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "youtube",
                    title: "Youtube",
                    icon: "fa-youtube-play",

                    block: {
                        collectionUrl: vm.post.url + '/blocks',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "files",
                    title: "Archivos",
                    icon: "fa-files-o",

                    block: {
                        collectionUrl: vm.post.url + '/resources/files',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                },

                {
                    type: "form",
                    title: "Formulario",
                    icon: "fa-pencil-square-o",

                    block: {
                        collectionUrl: '/data/entities',
                        menu: [
                            {
                                state: "editor",
                                title: "editar",
                                icon: "fa-pencil"
                            },
                            {
                                state: "delete",
                                title: "eliminar",
                                icon: "fa-trash-o"
                            }
                        ]
                    }
                }
            ];
        });



        function addBlock(insertable) {

            if (!vm.post.blocks) {
                vm.post.blocks = [];
            }

            var newBlock   = insertable.block;
            newBlock.type  = insertable.type;
            newBlock.order = vm.post.blocks.length;

            vm.post.blocks.push(newBlock);

        };

        function attachBlock(block) {

            if (block.id) {

                phiApi.put( vm.post.url + "/blocks/" + block.id, block);

            } else {

                phiApi.post( vm.post.url + "/blocks", {

                    type:        block.type,
                    url:         block.url,
                    title:       block.title,
                    description: block.description,
                    order:       vm.post.blocks.length

                }).then( function(response) {
                    block.id = response.data.id;
                });

            }

        };

        function removeBlock(block) {

            if (block.id) {

                phiApi.remove(vm.post.url + "/blocks/" + block.id)
                    .then(function() {
                        vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
                    });

            } else {
                vm.post.blocks.splice(vm.post.blocks.indexOf(block), 1);
            }

        };

        function reorder() {
            var blockIds = [];
            for (var cont = 0; cont < vm.post.blocks.length; cont++) {
                blockIds.push(vm.post.blocks[cont].id);
            }
            phiApi.put(vm.post.url+"/blocks/", blockIds);
        };

    };

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiApiResourceFiles", phiApiResourceFiles);

    function phiApiResourceFiles() {

        return {

            restrict: "E",
            scope: {
                src: "@"
            },
            controller:       phiApiResourceFilesController,
            controllerAs:     "vm",
            bindToController: true,

            template:   '<ul>' +
                            '<li ng-repeat="item in vm.files" class="phi-api-resource-files-file" ng-class="{selected: selected.url == item.url}" ng-click="select(item)">' +
                                '<a class="thumbnail" target="_blank" href="{{item.url}}">' +
                                    '<img ng-if="!!item.thumbnail" ng-src="{{item.thumbnail}}" />' +
                                '</a>' +
                                '<a class="details" target="_blank" href="{{item.url}}">' +
                                    '<h3 ng-bind="item.title"></h3>' +
                                    '<p>{{item.size|bytes}} - {{item.name}}</p>' +
                                '</a>' +
                            '</li>' +
                        '</ul>'
        };

    }

    phiApiResourceFilesController.$inject = ["phiApi"];
    function phiApiResourceFilesController(phiApi) {

        var vm   = this;
        vm.files = [];

        phiApi.get(vm.src)
            .then(function(response) {
                vm.files = response.data;
            });

    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockFiles", phiBlockFiles);

    phiBlockFiles.$inject = ["phiApi"];
    function phiBlockFiles(phiApi) {

        return function(phiBlock) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        template:   '<phi-api-resource-files src="{{phiBlock.ngModel.url}}"></phi-api-resource-files>'
                    },

                    editor: {
                        controller:   editorController,
                        template:     '<phi-api-resource-files-editor src="{{phiBlock.ngModel.url}}"></phi-api-resource-files-editor>'
                    },

                    delete: {
                        template:   '<form>' + 
                                        '<h1>Eliminar esta carpeta ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button ng-click="phiBlock.destroy()">eliminar</phi-button>' + 
                                            '<phi-button ng-click="phiBlock.go(\'default\')" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
                    }

                }

            };

            //////////////////////

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

            }


            function editorController() {

                if ( !phiBlock.ngModel.url ) {
                    //make one up I guess!
                    var random = Math.floor((Math.random() * 10000) + 1);

                    phiBlock.ngModel.url = phiBlock.ngModel.collectionUrl + "/block" + random;
                    phiBlock.change();
                }

            }

        }


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockGallery", phiBlockGallery);

    phiBlockGallery.$inject = ["phiApi"];
    function phiBlockGallery(phiApi) {

        return function(phiBlock) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        controller: defaultController,
                        controllerAs: "vm",
                        template:   '<div>' + 
                                        '<ul class="phi-gallery-thumbnails">' + 
                                            '<li ng-repeat="image in vm.images" ng-click="vm.control.select($index)"><img ng-src="{{image.thumbnail}}" alt="{{image.name}}" /></li>' + 
                                        '</ul>' + 
                                        '<phi-gallery control="vm.control">' + 
                                            '<div ng-repeat="image in vm.images">' + 
                                                '<img ng-src="{{image.url}}" alt="{{image.name}}" />' + 
                                            '</div>' + 
                                        '</phi-gallery>' + 
                                    '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        template:     '<phi-api-resource-files-editor src="{{phiBlock.ngModel.url}}"></phi-api-resource-files-editor>'
                    },

                    delete: {
                        template:   '<form>' + 
                                        '<h1>Eliminar esta galería ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button ng-click="phiBlock.destroy()">eliminar</phi-button>' + 
                                            '<phi-button ng-click="phiBlock.go(\'default\')" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
                    }

                }

            };

            //////////////////////

            function initialize() {

                if (phiBlock.ngModel.url) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

            }


            function defaultController() {

                var vm     = this;
                vm.images  = [];
                vm.control = {};

                phiApi.get(phiBlock.ngModel.url + '/files')
                    .then(function(response) {
                        vm.images = response.data;
                    });

            }


            function editorController() {

                if ( !phiBlock.ngModel.url ) {
                    //make one up I guess!
                    var random = Math.floor((Math.random() * 10000) + 1);

                    phiBlock.ngModel.url = phiBlock.ngModel.collectionUrl + "/block" + random;
                    phiBlock.change();
                }

            }

        }


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockForm", phiBlockForm);

    phiBlockForm.$inject = ["phiApi", "phiApp"];
    function phiBlockForm(phiApi, phiApp) {
        return function(phiBlock) {

            var templateFieldPreview = '<div class="phi-form-editor-field-preview" ng-switch="field.type">' +

                                            '<div ng-switch-when="text">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<input ng-model="vm.currentRecord[field.name]" type="text" />' +
                                            '</div>' +

                                            '<div ng-switch-when="textarea">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<textarea ng-model="vm.currentRecord[field.name]"></textarea>' +
                                            '</div>' +

                                            '<div ng-switch-when="select">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<select ng-model="vm.currentRecord[field.name]">' +
                                                    '<option value="">---</option>' +
                                                    '<option ng-repeat="line in field.options|lines track by $index" value="{{line}}">{{line}}</option>' +
                                                '</select>' +
                                            '</div>' +

                                            '<div ng-switch-when="checkbox">' +
                                                '<phi-checkbox ng-model="vm.currentRecord[field.name]"> {{field.title}}</phi-checkbox>' +
                                            '</div>' +

                                            '<p class="description" ng-bind="field.description"></p>' +

                                        '</div>';


            var templateEditor = '<form class="phi-form-editor">' +

                                    '<fieldset class="description">' +
                                        '<phi-input multiline ng-model="phiBlock.form.description" label="descripci&oacute;n" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }" ng-change="vm.save()"></phi-input>' +
                                    '</fieldset>' +

                                    '<fieldset class="fields" sv-root sv-part="phiBlock.form.fields" sv-on-sort="vm.reorder()">' +

                                        '<div ng-repeat="field in phiBlock.form.fields" sv-element class="phi-form-editor-field">' +

                                            '<div class="phi-form-editor-field-toolbar" sv-handle>' +
                                                '<a phi-icon="fa-times" ng-click="vm.removeField(field)" href="">&nbsp;</a>' +
                                            '</div>' +

                                            '<div class="phi-form-editor-field-controls">' +

                                                '<phi-select label="tipo" ng-model="field.type">' +
                                                    '<phi-option value="text">texto</phi-option>' +
                                                    '<phi-option value="textarea">textarea</phi-option>' +
                                                    '<phi-option value="select">lista</phi-option>' +
                                                    '<phi-option value="checkbox">checkbox</phi-option>' +
                                                '</phi-select>' +

                                                '<phi-input label="titulo" ng-model="field.title"></phi-input>' +

                                                '<phi-input multiline label="descripci&oacute;n" ng-model="field.description"></phi-input>' +

                                                '<div ng-show="field.type == \'select\'">' +
                                                    '<phi-input multiline label="opciones" ng-model="field.options"></phi-input>' +
                                                    '<p class="notice">Escribe una opci&oacute;n por l&iacute;nea</p>' +
                                                '</div>' +
                                            '</div>' +

                                            templateFieldPreview +

                                        '</div>' +

                                        '<div class="phi-form-editor-field-new" phi-icon-left="fa-plus" ng-click="vm.addField()">Agregar campo</div>' +

                                    '</fieldset>' +


                                '</form>';


            function initialize() {

                if (phiBlock.ngModel.url) {

                    phiApi.get(phiBlock.ngModel.url)
                        .then(function(response) {
                            phiBlock.form = response.data;
                            phiBlock.go("default");
                        });

                } else {

                    phiApi.post(phiBlock.ngModel.collectionUrl)
                        .then(function(response, code, headers) {
                            phiBlock.ngModel.url = headers("location");
                            phiBlock.form        = response.data;
                            phiBlock.form.fields = [];
                            phiBlock.change();
                            phiBlock.go("editor");
                        });

                }
            }


            function defaultController() {

                var recordsUrl = 'people/' + phiApp.user.id + '/data/entities/' + phiBlock.form.id + '/records';

                var vm           = this;
                vm.currentRecord = null;
                vm.records       = [];

                phiApi.get(recordsUrl)
                    .then(function(response) {
                        vm.records = response.data;
                    });


                vm.saveCurrentRecord = function() {

                    if (!recordsUrl) {
                        return;
                    }

                    phiApi.post(recordsUrl, vm.currentRecord)
                        .then(function(response) {
                            vm.records       = [response.data];
                            vm.currentRecord = {};
                        });

                }
            }

            editorController.$inject = ["$scope", "$timeout"];
            function editorController($scope, $timeout) {

                var vm         = this;
                vm.addField    = addField;
                vm.removeField = removeField;
                vm.save        = save;
                vm.reorder     = reorder;

                //////////////////////////////////////////

                var saveTimer = null;

                $scope.$watch("phiBlock.form.fields", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    $timeout.cancel(saveTimer);
                    saveTimer = $timeout(vm.save, 1000);

                }, true);



                function addField() {

                    var newField = {
                        type: "text",
                        order: phiBlock.form.fields.length
                    };

                    phiBlock.form.fields.push(newField);

                };

                function removeField(field) {

                    if (confirm('Deseas eliminar este campo ?')) {
                        phiBlock.form.fields.splice(phiBlock.form.fields.indexOf(field), 1);
                    }

                };

                function save() {
                    phiApi.put(phiBlock.ngModel.url, phiBlock.form);
                };


                function reorder() {
                    var fieldIds = [];
                    for (var cont = 1; cont <= phiBlock.form.fields.length; cont++) {
                        phiBlock.form.fields[cont-1].order = cont;
                    }
                };

            };


            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {

                    phiApi.delete(phiBlock.ngModel.url)
                        .then(function() {
                            phiBlock.destroy();
                        });

                }

                function cancel() {
                    phiBlock.go("default");
                }

            };




            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:   defaultController,
                        controllerAs: "vm",
                        template:   '<div>' +
                                        '<form ng-if="!vm.records.length">' +
                                            '<p ng-bind="phiBlock.form.description"></p>' +
                                            '<fieldset>' +
                                                '<div ng-repeat="field in phiBlock.form.fields">' +
                                                    templateFieldPreview +
                                                '</div>' +
                                            '</fieldset>' +

                                            '<footer>' +
                                                '<phi-button ng-click="vm.saveCurrentRecord()">Guardar</phi-button>' +
                                            '</footer>' +
                                        '</form>' +

                                        '<div ng-if="!!vm.records.length">' +
                                            '<fieldset ng-repeat="record in vm.records">' +
                                                '<div ng-repeat="field in phiBlock.form.fields">' +
                                                    '<strong ng-bind="field.title"></strong>: ' +
                                                    '<span ng-if="field.type != \'checkbox\'" ng-bind="record.values[field.name]"></span>' +
                                                    '<span ng-if="field.type == \'checkbox\'" ng-bind="record.values[field.name] == 1 ? \'si\' : \'no\'"></span>' +
                                                '</div>' +
                                            '</fieldset>' +
                                        '</div>' +

                                    '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: "vm",
                        template:     templateEditor
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:     '<h1>Eliminar este formulario ?</h1>' +
                                      '<phi-button class="danger" ng-click="vm.confirm()">Eliminar</phi-button>'  +
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancelar</phi-button>'
                    }

                }

            };

        };


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockHtml", phiBlockHtml);

    phiBlockHtml.$inject = ["phiApi"];
    function phiBlockHtml(phiApi) {

        return function(phiBlock) {

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                if ( !phiBlock.ngModel.collectionUrl ) {
                    phiBlock.go("error");
                    return;
                }

                phiApi.post(phiBlock.ngModel.collectionUrl)
                    .then(function(response) {

                        phiBlock.ngModel.url = response.headers("location");

                        // Play nice:  report ngModel changes to phiBlock
                        phiBlock.change();

                        phiBlock.go("editor");
                    });

            }


            defaultController.$inject = ["$sce"];
            function defaultController($sce) {

                var vm = this;

                phiApi.get(phiBlock.ngModel.url)
                    .then(function(response) {
                        vm.body = $sce.trustAsHtml(response.data.body);
                    });
            }


            editorController.$inject = ["$scope", "$sce"];
            function editorController($scope, $sce) {

                var vm = this;

                phiApi.get(phiBlock.ngModel.url)
                    .then(function(response) {

                        vm.body = $sce.trustAsHtml(response.data.body);

                        $scope.$watch("vm.body", function(newValue, oldValue) {
                            if (newValue == oldValue || oldValue == undefined || newValue == undefined) {
                                return;
                            }
                            save(newValue);
                        });

                    });

                function save(htmlBody) {
                    phiApi.put(phiBlock.ngModel.url, {body: htmlBody});
                }

            }


            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {

                    phiApi.delete(phiBlock.ngModel.url)
                        .then(function() {
                            phiBlock.destroy();
                        });

                }

                function cancel() {
                    phiBlock.go("default");
                }

            }



            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:   defaultController,
                        controllerAs: 'vm',
                        template:     '<div ng-bind-html="vm.body"></div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:     '<text-angular ng-model="vm.body" ng-model-options="{default: 920, blur: 0}"></text-angular>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:     '<h1>Eliminar este texto ?</h1>' +
                                      '<phi-button class="danger" ng-click="vm.confirm()">Eliminar</phi-button>'  +
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancelar</phi-button>'
                    },

                    error: {
                        template: '<h1>error!</h1>'
                    }

                }

            };

        }


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockV3", phiBlockV3);

    phiBlockV3.$inject = ["phiApi", "$http"];
    function phiBlockV3(phiApi, $http) {
        return function(phiBlock) {

            function initialize() {
                if ( !phiBlock.ngModel.url ) {
                    phiBlock.go("error");
                    return;
                }
                phiBlock.go("default");
            }

            function defaultController() {

                var vm = this;

                $http.get(phiBlock.ngModel.url, {
                    headers: {'Authorization': 'Bearer ' + phiApi.tokenString}
                }).then(function(response) {
                    vm.body = response.data;
                }, function() {
                    phiBlock.go("error");
                });

            }

            return {
                initialize: initialize,
                states: {
                    default: {
                        controller:   defaultController,
                        controllerAs: 'vm',
                        template:     '<div ng-bind-html="vm.body"></div>'
                    },
                    error: {
                        template: '<h1>Error cargando datos adjuntos</h1>'
                    }
                }
            };

        }


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockYoutube", phiBlockYoutube);

    phiBlockYoutube.$inject = ["phiApi"];
    function phiBlockYoutube(phiApi) {
        return function(phiBlock) {

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

            }

            function defaultController() {

                var vm = this;

                if (phiBlock.ngModel.url) {
                    phiBlock.ngModel.videoId   = getYoutubeId(phiBlock.ngModel.url);
                    phiBlock.ngModel.isInvalid = !phiBlock.ngModel.videoId;
                    phiBlock.ngModel.thumbnail = phiBlock.ngModel.videoId ? "https://img.youtube.com/vi/" + phiBlock.ngModel.videoId + "/0.jpg" : null;
                }

            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm    = this;
                vm.save   = save;
                vm.cancel = cancel;

                $scope.$watch("phiBlock.ngModel.url", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    phiBlock.ngModel.videoId   = getYoutubeId(current);
                    phiBlock.ngModel.isInvalid = !!current && !phiBlock.ngModel.videoId;
                    phiBlock.ngModel.thumbnail = phiBlock.ngModel.videoId ? "https://img.youtube.com/vi/" + phiBlock.ngModel.videoId + "/0.jpg" : null;

                });

                /////////////////

                function save() {
                    phiBlock.change();
                    phiBlock.go("default");
                }

                function cancel() {

                    if (!phiBlock.ngModel.videoId) {
                        phiBlock.destroy();
                    } else {
                        phiBlock.go("default");
                    }

                }
            }

            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {
                    phiBlock.destroy();
                }

                function cancel() {
                    phiBlock.go("default");
                }

            }

            function getYoutubeId(url) {

                if (!url.trim().length) {
                    return null;
                }

                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match  = url.match(regExp);
                if (match && match[2].length == 11) {
                    return match[2];
                } else {
                    return null;
                }
            }


            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:     defaultController,
                        controllerAs:   'vm',
                        template:       '<div>' +
                                            '<p ng-show="!phiBlock.ngModel.videoId">El v&iacute;deo no es v&aacute;lido</p>' +
                                            '<p ng-show="!!phiBlock.ngModel.videoId" ng-bind="phiBlock.ngModel.title"></p>' +
                                            '<iframe ng-if="!!phiBlock.ngModel.videoId" width="100%" height="420" ng-src="{{\'https://www.youtube.com/embed/\' + phiBlock.ngModel.videoId | trustAsResourceUrl}}" frameborder="0" allowfullscreen></iframe>' +
                                        '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<fieldset>' +

                                            '<phi-input ng-model="phiBlock.ngModel.url" label="URL de youtube"></phi-input>' +

                                            '<p ng-show="!!phiBlock.ngModel.isInvalid">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                            '<div ng-show="!!phiBlock.ngModel.videoId" class="description">' +
                                                '<phi-input ng-model="phiBlock.ngModel.title" label="titulo"></phi-input>' +
                                                '<phi-input multiline ng-model="phiBlock.ngModel.description" label="descripci&oacute;n"></phi-input>' +
                                                '<img ng-if="!!phiBlock.ngModel.thumbnail" ng-src="{{phiBlock.ngModel.thumbnail}}" />' +
                                            '</div>' +

                                            '<footer style="margin-top: 16px">' +  // !!!! remove built in styles
                                                '<phi-button ng-show="!!phiBlock.ngModel.videoId" ng-click="vm.save()">aceptar</phi-button>' +
                                                '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' +
                                            '</footer>' +

                                        '</fieldset>' +
                                    '</form>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<h1>Eliminar este video ?</h1>' +
                                        '<footer>' +
                                            '<phi-button ng-click="vm.confirm()">eliminar</phi-button>' +
                                            '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' +
                                        '</footer>' +
                                    '</form>',
                    },

                    error: {
                        template: '<h1>error!</h1>'
                    }

                }

            };


        };


    }

})();
/*
This element provides an interface with a phi filesystem endpoint
(see phi/filesystem.api)

<phi-api-resource-files-editor url="http://valid/phi/filesystem/"></phi-api-resource-files-editor>

*/


(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiApiResourceFilesEditor", phiApiResourceFilesEditor);


    phiApiResourceFilesEditor.$inject = ["phiApi", "FileUploader"];
    function phiApiResourceFilesEditor(phiApi, FileUploader) {

        return {

            restrict: "E",

            scope: {
                "src":      "@",
                "onSelect": "&",
                "onChange": "&"
            },

            template:   '<div>' +

                            '<ul>' +
                                '<li ng-repeat="item in items" class="phi-api-resource-files-file" ng-class="{selected: selected.url == item.url}" ng-click="select(item)">' +
                                    '<a class="thumbnail" target="_blank" href="{{item.url}}">' +
                                        '<img ng-if="!!item.thumbnail" ng-src="{{item.thumbnail}}" />' +
                                    '</a>' +
                                    '<div class="details">' +
                                        '<phi-input ng-model="item.title" ng-change="change(item)" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 1000, \'blur\': 0 } }"></phi-input>' +
                                        '<p>{{item.size|bytes}} - {{item.name}}</p>' +
                                    '</div>' +
                                    '<a class="phi-api-resource-files-file-delete" ng-click="delete(item, $event)" phi-icon="fa-trash-o"></a>' +
                                '</li>' +
                            '</ul>' +

                            '<div ng-if="uploader">' +

                                '<ul>' +
                                    '<li ng-repeat="item in uploader.queue" class="phi-api-resource-files-file">' +
                                        '<div class="thumbnail">' +
                                            '<div ng-if="item.file.type.substring(0,5) == \'image\'" ng-thumb="{file: item._file, height: 100}"></div>' +
                                        '</div>' +
                                        '<div class="details">' +
                                            '<h3 ng-bind="item.file.name"></h3>' +
                                        '</div>' +
                                        '<progress max="100" value="{{item.progress}}"></progress>' +
                                        '<a class="phi-api-resource-files-file-delete" ng-click="item.remove()" phi-icon="fa-times"></a>' +
                                    '</li>' +
                                '</ul>' +

                                '<div class="phi-api-filesystem-dropzone" nv-file-over uploader="uploader" ng-click="clickDropZone()">' +
                                    '<div nv-file-drop uploader="uploader">Arrastra archivos aqu&iacute; o haz click</div>' +
                                '</div>' +
                                '<input class="file-input" type="file" nv-file-select uploader="uploader" multiple />' +

                            '</div>' +

                        '</div>',

            link: phiApiResourceFilesEditorLink
        };


        function phiApiResourceFilesEditorLink(scope, element, attributes) {

            scope.selected  = scope.ngModel;
            scope.items     = [];
            scope.uploader  = null;

            scope.reload = function() {

                return phiApi.get(scope.src)
                        .then(function (response) {
                            scope.items = response.data;
                        });

            };

            scope.delete = function(item, event) {

                event.stopPropagation();

                if (!confirm("Eliminar este archivo?")) {
                    return;
                }

                phiApi.delete(item.endpoint + "/" + item.path)
                    .then(function () {
                        scope.items.splice(scope.items.indexOf(item), 1);
                        scope.onChange({items: scope.items});
                    });

            };

            scope.select = function(item) {
                if (attributes.onSelect) {
                    scope.selected = item;
                    scope.onSelect({item: item});
                }
            };


            scope.change = function(item) {
                phiApi.put(item.endpoint + "/" + item.path, item);
            };


            attributes.$observe("src", function(src) {

                var uploadsUrl = phiApi.host ? phiApi.host + "/" + scope.src : scope.src;

                scope.uploader = new FileUploader({url: uploadsUrl, headers: {
                    'Authorization': 'Bearer ' + phiApi.tokenString
                }});

                scope.uploader.onAfterAddingAll = function(addedItems) {
                    scope.uploader.uploadAll();
                };

                scope.uploader.onCompleteAll = function() {
                    scope.uploader.clearQueue();
                    scope.reload().then(function() {
                        scope.onChange({items: scope.items});
                    });
                };

                scope.reload();

            });


            scope.clickDropZone = function() {

                var inputs = element.find('input');
                for (var cont = 0; cont < inputs.length; cont++) {
                    if ( inputs[cont].type == "file" ) {
                        inputs[cont].click();
                        break;
                    }
                }

            };



        }



    }

})();
angular.module("phidias-angular").run(["$templateCache", function($templateCache) {$templateCache.put("/components/elements/phi-event-editor/phi-event-editor.html","<div class=\"bootstrap\">\n    <div class=\"form-inline date-range\">\n        <div class=\"form-group\">\n            <input bs-datepicker autoclose=\"true\" type=\"text\" name=\"startDate\" ng-model=\"vm.event.startDate\" class=\"form-control\" size=\"10\" placeholder=\"fecha inicial\" ng-change=\"vm.sanitize()\" />\n            <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"startTime\" ng-model=\"vm.event.startDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" ng-show=\"!vm.event.allDay\" />\n        </div>\n        a\n        <div class=\"form-group\">\n            <input bs-datepicker autoclose=\"true\" type=\"text\" name=\"endDate\" ng-model=\"vm.event.endDate\" class=\"form-control\" size=\"10\" placeholder=\"fecha final\" data-min-date=\"{{vm.minDate}}\" ng-change=\"vm.sanitize()\" />\n            <input bs-timepicker autoclose=\"false\" type=\"text\" name=\"endTime\" ng-model=\"vm.event.endDate\" class=\"form-control\" size=\"8\" placeholder=\"hora\" ng-show=\"!vm.event.allDay\" />\n        </div>\n    </div>\n    <div class=\"form-inline date-options\">\n        <div class=\"form-group\">\n            <input type=\"checkbox\" id=\"allDayChbox\" ng-model=\"vm.event.allDay\" />\n            <label for=\"allDayChbox\">Todo el dia</label>\n        </div>\n        <div class=\"form-group\">\n            <input type=\"checkbox\" id=\"repeatsChbox\" ng-checked=\"!!vm.event.repeat\" ng-click=\"vm.event.repeat = !!vm.event.repeat ? null : vm.defaultRepeat\" />\n            <label for=\"repeatsChbox\">Repetir ...</label>\n        </div>\n    </div>\n    <div class=\"repeat\" ng-if=\"!!vm.event.repeat\">\n        <phi-event-repeat ng-model=\"vm.event.repeat\"></phi-event-repeat>\n    </div>\n</div>");
$templateCache.put("/components/elements/phi-event-repeat/phi-event-repeat.html","<div>\n\n    <div class=\"every\">\n        <label>se repite</label>\n        <select ng-model=\"vm.repeat.every\">\n            <option value=\"day\">Cada día</option>\n            <option value=\"week\">Cada semana</option>\n            <option value=\"month\">Cada mes</option>\n            <option value=\"year\">Cada año</option>\n        </select>\n    </div>\n\n    <div ng-show=\"vm.repeat.every\" class=\"interval\">\n        <label>Repetir cada</label>\n        <select ng-model=\"vm.repeat.interval\">\n            <option value=\"1\">1</option>\n            <option value=\"2\">2</option>\n            <option value=\"3\">3</option>\n            <option value=\"4\">4</option>\n            <option value=\"5\">5</option>\n            <option value=\"6\">6</option>\n            <option value=\"7\">7</option>\n            <option value=\"8\">8</option>\n            <option value=\"9\">9</option>\n            <option value=\"10\">10</option>\n            <option value=\"11\">11</option>\n            <option value=\"12\">12</option>\n            <option value=\"13\">13</option>\n            <option value=\"14\">14</option>\n            <option value=\"15\">15</option>\n            <option value=\"16\">16</option>\n            <option value=\"17\">17</option>\n            <option value=\"18\">18</option>\n            <option value=\"19\">19</option>\n            <option value=\"20\">20</option>\n            <option value=\"21\">21</option>\n            <option value=\"22\">22</option>\n            <option value=\"23\">23</option>\n            <option value=\"24\">24</option>\n            <option value=\"25\">25</option>\n            <option value=\"26\">26</option>\n            <option value=\"27\">27</option>\n            <option value=\"28\">28</option>\n            <option value=\"29\">29</option>\n            <option value=\"30\">30</option>\n        </select>\n\n        <span ng-switch=\"vm.repeat.every\">\n            <span ng-switch-when=\"day\">días</span>\n            <span ng-switch-when=\"week\">semanas</span>\n            <span ng-switch-when=\"month\">meses</span>\n            <span ng-switch-when=\"year\">años</span>\n        </span>\n    </div>\n\n    <div ng-show=\"vm.repeat.every == \'week\'\" class=\"week\">\n        <label>Día</label>\n        <ul>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-mo\" ng-model=\"vm.checkedDays[1]\" ng-change=\"vm.toggleDay(1, vm.checkedDays[1])\" />\n                <label for=\"event-repeat-day-mo\">L</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-tu\" ng-model=\"vm.checkedDays[2]\" ng-change=\"vm.toggleDay(2, vm.checkedDays[2])\" />\n                <label for=\"event-repeat-day-tu\">M</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-we\" ng-model=\"vm.checkedDays[3]\" ng-change=\"vm.toggleDay(3, vm.checkedDays[3])\" />\n                <label for=\"event-repeat-day-we\">X</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-th\" ng-model=\"vm.checkedDays[4]\" ng-change=\"vm.toggleDay(4, vm.checkedDays[4])\" />\n                <label for=\"event-repeat-day-th\">J</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-fr\" ng-model=\"vm.checkedDays[5]\" ng-change=\"vm.toggleDay(5, vm.checkedDays[5])\" />\n                <label for=\"event-repeat-day-fr\">V</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-sa\" ng-model=\"vm.checkedDays[6]\" ng-change=\"vm.toggleDay(6, vm.checkedDays[6])\" />\n                <label for=\"event-repeat-day-sa\">S</label>\n            </li>\n            <li>\n                <input type=\"checkbox\" id=\"event-repeat-day-su\" ng-model=\"vm.checkedDays[7]\" ng-change=\"vm.toggleDay(7, vm.checkedDays[7])\" />\n                <label for=\"event-repeat-day-su\">D</label>\n            </li>\n        </ul>\n    </div>\n\n    <div ng-show=\"vm.repeat.every == \'month\'\" class=\"month\">\n        <label>Repetir cada</label>\n        <ul>\n            <li>\n                <input id=\"event-repeat-month-day\" type=\"radio\" value=\"\" ng-model=\"vm.repeat.on\" />\n                <label for=\"event-repeat-month-day\">día del mes</label>\n            </li>\n            <li>\n                <input id=\"event-repeat-month-weekday\" type=\"radio\" value=\"weekday\" ng-model=\"vm.repeat.on\" />\n                <label for=\"event-repeat-month-weekday\">día de la semana</label>\n            </li>\n        </ul>\n    </div>\n\n    <p ng-show=\"vm.repeat.every\" class=\"summary\">\n        <span>Este evento se repetirá </span><span ng-bind=\"vm.getSummary()\"></span>\n    </p>\n\n</div>");
$templateCache.put("/components/elements/phi-post/phi-post.html","<phi-post-header>\r\n    <phi-post-icon>\r\n        <iron-image ng-src=\"{{vm.post.author.avatar}}\" sizing=\"cover\"></iron-image>\r\n    </phi-post-icon>\r\n    <phi-post-preview>\r\n        <phi-post-author ng-bind=\"vm.post.author.firstName + \' \' + vm.post.author.lastName\"></phi-post-author>\r\n        <phi-post-date ng-bind=\"vm.post.publishDate\"></phi-post-date>\r\n    </phi-post-preview>\r\n</phi-post-header>\r\n<phi-post-body>\r\n    <!--<phi-post-description ng-bind-html=\"vm.post.description\"></phi-post-description>-->\r\n    <phi-post-blocks>\r\n        <phi-block\r\n            ng-repeat=\"block in vm.post.blocks\"\r\n            ng-model=\"block\">\r\n        </phi-block>\r\n    </phi-post-blocks>\r\n</phi-post-body>");
$templateCache.put("/components/elements/phi-notification/settings/phi-notification-settings.html","<phi-setting ng-repeat=\"setting in vm.settings\" class=\"setting-transport transport-{{setting.transport}}\" ng-class=\"{open: setting.isOpen, closed: !setting.isOpen, enabled: setting.isEnabled, disabled: !setting.isEnabled}\">\n\n    <phi-setting-header ng-click=\"setting.isOpen = !setting.isOpen\">\n        <phi-setting-icon></phi-setting-icon>\n        <phi-setting-contents>\n            <phi-setting-title ng-bind=\"vm.getTransportName(setting.transport)\"></phi-setting-title>\n            <phi-setting-notice ng-repeat=\"notice in vm.describeSetting(setting)\" ng-bind=\"notice\"></phi-setting-notice>\n        </phi-setting-contents>\n    </phi-setting-header>\n\n    <phi-setting-body>\n\n        <phi-checkbox ng-model=\"setting.isEnabled\">recibir notificaciones</phi-checkbox>\n\n        <phi-setting-schedule>\n            <phi-checkbox ng-model=\"setting.hasSchedule\" ng-change=\"vm.toggleScheduling(setting, setting.hasSchedule)\">consolidar en un envio diario</phi-checkbox>\n            <div phi-visible=\"{{!!setting.hasSchedule}}\" phi-visible-animation=\"scale\">\n                <uib-timepicker class=\"bootstrap\" ng-model=\"setting.scheduleDate\" minute-step=\"10\" ng-change=\"setting.schedule = vm.toHour(setting.scheduleDate)\"></uib-timepicker>\n            </div>\n        </phi-setting-schedule>\n\n        <phi-drawer ng-class=\"{open: setting.drawerIsOpen, closed: !setting.drawerIsOpen}\">\n\n            <phi-drawer-title ng-click=\"setting.drawerIsOpen = !setting.drawerIsOpen\">filtrar por tipo</phi-drawer-title>\n\n            <phi-drawer-body>\n                <phi-setting ng-repeat=\"typeSetting in setting.types\" ng-class=\"{open: typeSetting.isOpen, closed: !typeSetting.isOpen, enabled: typeSetting.isEnabled, disabled: !typeSetting.isEnabled}\">\n                    <phi-setting-header ng-click=\"typeSetting.isOpen = !typeSetting.isOpen\">\n                        <phi-setting-icon>{{type.icon}}</phi-setting-icon>\n                        <phi-setting-contents>\n                            <phi-setting-title ng-bind=\"typeSetting.type\"></phi-setting-title>\n                            <phi-setting-notice ng-repeat=\"notice in vm.describeSetting(typeSetting)\" ng-bind=\"notice\"></phi-setting-notice>\n                        </phi-setting-contents>\n                    </phi-setting-header>\n                    <phi-setting-body>\n                        <phi-checkbox ng-model=\"typeSetting.isEnabled\">recibir notificaciones</phi-checkbox>\n                        <phi-setting-schedule>\n                            <phi-checkbox ng-model=\"typeSetting.hasSchedule\" ng-change=\"vm.toggleScheduling(typeSetting, typeSetting.hasSchedule)\">consolidar en un envio diario</phi-checkbox>\n                            <div phi-visible=\"{{!!typeSetting.hasSchedule}}\" phi-visible-animation=\"scale\">\n                                <uib-timepicker class=\"bootstrap\" ng-model=\"typeSetting.scheduleDate\" minute-step=\"10\" ng-change=\"typeSetting.schedule = vm.toHour(typeSetting.scheduleDate)\"></uib-timepicker>\n                            </div>\n                        </phi-setting-schedule>\n                    </phi-setting-body>\n                </phi-setting>\n            </phi-drawer-body>\n\n        </phi-drawer>\n\n    </phi-setting-body>\n</phi-setting>\n\n<phi-button ng-click=\"vm.save()\">Guardar</phi-button>");
$templateCache.put("/components/elements/phi-post/editor/phi-post-editor.html","<div>\n\n    <div sv-root sv-part=\"vm.post.blocks\" sv-on-sort=\"vm.reorder()\">\n\n        <div ng-repeat=\"(key, block) in vm.post.blocks\" ng-init=\"block.ctrl = {}\" class=\"phi-post-editor-block\" sv-element>\n\n            <div class=\"phi-post-editor-block-toolbar\" sv-handle>\n\n                <div class=\"phi-post-editor-block-toolbar-menu\">\n                    <phi-button\n                        class=\"cancel\"\n                        ng-blur=\"block.menuShown = false\"\n                        id=\"menu_toggler_{{post.id}}_{{key}}\"\n                        ng-show=\"block.ctrl.currentState == \'default\'\"\n                        ng-click=\"block.menuShown = !block.menuShown\"\n                        phi-icon=\"fa-ellipsis-v\">\n                    </phi-button>\n\n                    <phi-button\n                        class=\"cancel\"\n                        ng-blur=\"block.menuShown = false\"\n                        ng-show=\"block.ctrl.currentState != \'default\'\"\n                        ng-click=\"block.ctrl.go(\'default\')\"\n                        phi-icon=\"fa-arrow-left\">\n                    </phi-button>\n\n                    <div\n                        phi-tooltip-for=\"menu_toggler_{{post.id}}_{{key}}\"\n                        phi-tooltip-origin=\"top right\"\n                        phi-tooltip-align=\"bottom right\"\n                        phi-visible=\"{{!!block.menuShown}}\"\n                        phi-visible-animation=\"slide-bottom\">\n\n                        <phi-menu phi-texture=\"paper\">\n                            <phi-menu-item ng-repeat=\"item in block.ctrl.states\" ng-click=\"block.menuShown = false; block.ctrl.go(item)\">\n                                <phi-icon icon=\"{{item.icon}}\"></phi-icon>\n                                {{item}}\n                            </phi-menu-item>\n                        </phi-menu>\n                    </div>\n                </div>\n\n            </div>\n\n            <phi-block\n                ng-model=\"block\"\n                controller-assign=\"block.ctrl\"\n                on-change=\"vm.attachBlock(block)\"\n                on-destroy=\"vm.removeBlock(block)\"\n            >\n            </phi-block>\n\n        </div>\n\n    </div>\n\n\n    <div>\n        <div phi-visible=\"{{!!adderIsOpen}}\" phi-visible-animation=\"scale\">\n            <phi-list-item ng-repeat=\"insertable in vm.insertable\" ng-click=\"adderIsOpen = false; vm.addBlock(insertable);\" phi-icon-left=\"{{insertable.icon}}\">\n                <span ng-bind=\"insertable.title\"></span>\n            </phi-list-item>\n        </div>\n\n        <phi-list-item ng-click=\"adderIsOpen = !adderIsOpen\" phi-icon-left=\"{{adderIsOpen ? \'fa-times\' : \'fa-plus\'}}\">\n            <span ng-bind=\"adderIsOpen ? \'cancelar\' : \'adjuntar\'\"></span>\n        </phi-list-item>        \n    </div>\n\n    <!--<paper-card>\n        <iron-collapse ng-attr-opened=\"{{adderIsOpen ? \'opened\' : undefined}}\">\n            <div>\n                <div ng-repeat=\"insertable in vm.insertable\">\n                    <phi-list-item ng-click=\"$parent.adderIsOpen = false; vm.addBlock(insertable);\">\n                        <phi-icon icon=\"{{insertable.icon}}\" bind-polymer></phi-icon>\n                        <span ng-bind=\"insertable.title\"></span>\n                    </phi-list-item>\n                </div>\n\n            </div>\n        </iron-collapse>\n\n        <phi-list-item ng-click=\"adderIsOpen = !adderIsOpen\">\n            <iron-icon icon=\"{{adderIsOpen ? \'close\' : \'add\'}}\"></iron-icon>\n            <span ng-bind=\"adderIsOpen ? \'cancelar\' : \'adjuntar\'\"></span>\n        </phi-list-item>\n    </paper-card>-->\n\n</div>");}]);