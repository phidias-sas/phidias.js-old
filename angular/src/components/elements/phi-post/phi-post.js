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