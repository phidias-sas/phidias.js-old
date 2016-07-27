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