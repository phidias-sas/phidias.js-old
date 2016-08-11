(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("center", {
            parent:      "app",
            abstract:    true,
            url:         "/centers/:centerId",
            templateUrl:  "/application/states/center/center.html",
            controller:   centerController,
            controllerAs: "vm",
            data:         {order: 1}
        });
    }

    centerController.$inject = ["$state", "phiApi"];
    function centerController($state, phiApi) {

        var centerUrl = "/centers/" + $state.params.centerId;

        var vm       = this;
        vm.centerId  = $state.params.centerId;
        vm.isLoading = false;
        vm.center    = null;

        vm.load = function() {

            vm.isLoading = true;

            phiApi.get(centerUrl)
                .then(function(response) {
                    vm.center = response.data;
                })
                .finally(function() {
                    vm.isLoading = false;
                });
        };



        initialize();

        function initialize() {
            vm.load();
        }

    }


})();