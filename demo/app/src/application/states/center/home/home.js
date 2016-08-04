(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("center.home", {
            url:         "/home",
            templateUrl:  "/application/states/center/home/home.html",
            controller:   homeController,
            controllerAs: "vm"
        });
    }

    homeController.$inject = ["$state", "$scope", "phiApi"];
    function homeController($state, $scope, phiApi) {

        var vm     = this;
        var center = $scope.$parent.vm.center;

    }


})();