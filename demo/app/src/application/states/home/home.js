(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("home", {
            url:         "/",
            templateUrl:  "/application/states/home/home.html",
            controller:   homeController,
            controllerAs: "vm"
        });
    }

    homeController.$inject = ["phiApi"];
    function homeController(phiApi) {

        var vm = this;

        vm.query     = null;

        vm.cities    = [];
        vm.centers   = [];
        vm.isLoading = false;

        vm.find = function(query) {

            if (query == undefined) {
                query = '';
            }
            query = query.trim();

            vm.isLoading = true;

            phiApi.get("regions/all/cities", {limit: 4, search: query})
                .then(function (response) {
                    vm.cities = response.data;
                    vm.isLoading = false;
                });

            if (query) {

                phiApi.get("centers", {search: query})
                    .then(function (response) {
                        vm.centers = response.data;
                    })
                    .finally(function() {
                        vm.isLoading = false;
                    });

            } else {
                vm.centers = [];
            }

        }

        initialize();

        //////////////////////////////

        function initialize() {
            vm.find();
        }
    }


})();