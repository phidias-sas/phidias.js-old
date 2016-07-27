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