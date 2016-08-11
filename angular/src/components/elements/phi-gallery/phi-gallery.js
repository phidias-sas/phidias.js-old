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