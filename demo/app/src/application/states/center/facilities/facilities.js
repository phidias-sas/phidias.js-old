(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state)
        .controller("centerFacilitiesController", centerFacilitiesController);


    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("center.facilities", {
            url:          "/facilities",
            templateUrl:  "/application/states/center/facilities/facilities.html",
            controller:   "centerFacilitiesController",
            controllerAs: "vm"
        });

    };


    centerFacilitiesController.$inject = ["phiApi", "$state"];
    function centerFacilitiesController(phiApi, $state) {

        var vm        = this;
        vm.facilities = [];
        vm.gallery    = {};

        reload();

        ///////////////////////////////

        function reload() {

            phiApi.get("centers/" + $state.params.centerId + "/facilities", {sort: "-publishDate"})
                .then(function (response) {
                    vm.facilities = response.data;
                });

        }


    }

})();