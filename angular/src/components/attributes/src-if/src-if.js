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