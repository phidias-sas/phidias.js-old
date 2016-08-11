(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(route);

    route.$inject = ["$stateProvider"];
    function route($stateProvider) {

        $stateProvider.state("user.dashboard", {
            url:          "/dashboard",
            templateUrl:  "/application/states/user/dashboard/dashboard.html",
            controller:   userDashboardController,
            controllerAs: "state"
        });

    };

    userDashboardController.$inject = ["phiApp", "phiApi"];
    function userDashboardController(phiApp, phiApi) {

        var centersUrl = "/people/" + phiApp.user.id + "/centers";
        var claimsUrl  = "/people/" + phiApp.user.id + "/claims";

        var vm          = this;
        vm.reload       = reload;
        vm.claims       = []; //claimed centers
        vm.centers      = []; //inscribed centers
        vm.getTimestamp = getTimestamp;

        activate();

        ////////////////////

        function activate() {
            vm.reload();
        };


        function reload() {

            phiApi.get(centersUrl)
                .then(function(response) {
                    vm.centers = response.data;
                });

            phiApi.get(claimsUrl)
                .then(function(response) {
                    vm.claims = response.data;
                });

        };

        function getTimestamp(uuid) {
            return Math.floor(parseInt(uuid, 36) / 10000) + 1424445470;
        };        
    }

})();