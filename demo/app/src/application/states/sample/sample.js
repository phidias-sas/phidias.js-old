(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample", {
            url:         "/sample",
            templateUrl:  "/application/states/sample/sample.html",
            controller:   sampleController,
            controllerAs: "vm",
            data:         {order: 1}
        });
    }

    sampleController.$inject = ["$state", "$scope", "phiApi"];
    function sampleController($state, $scope, phiApi) {

        var vm   = this;
        vm.title = "sample";

        vm.isVisible = true;
        vm.visibleAnimation = '';
        vm.cities = [];

        vm.isLoading = true;
        phiApi.get("regions/all/cities?limit=5")
            .then(function(response) {
                vm.cities = response.data;
                vm.isLoading = false;
            });

    }


})();