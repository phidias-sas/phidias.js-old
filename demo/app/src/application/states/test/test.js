(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("test", {
            url:         "/test/:number",
            templateUrl:  "/application/states/test/test.html",
            controller:   testController,
            controllerAs: "vm",
            data:         {order: 2}
        });
    }

    testController.$inject = ["$state", "$scope", "phiApi"];
    function testController($state, $scope, phiApi) {
        var vm   = this;
        vm.title = "test";
    }

})();