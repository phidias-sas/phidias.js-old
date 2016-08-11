(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state)

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("user", {
            parent:      "app",
            abstract:     true,
            url:          "/user",
            templateUrl:  "/application/states/user/user.html",
            controller:   userController,
            controllerAs: "vm"
        });

    };

    userController.$inject = ["phiApp", "phiApi"];
    function userController(phiApp, phiApi) {

        var personUrl = "/people/" + phiApp.user.id;

        var vm        = this;
        vm.person     = null;
        vm.reload     = reload;

        activate();

        /////////////////////////

        function activate() {
            vm.reload();
        };

        function reload() {
            phiApi.get(personUrl)
                .then(function(response) {
                    vm.person = response.data;
                });
        };

    };


})();