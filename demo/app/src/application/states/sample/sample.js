(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample", {
            abstract:    true,
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
        vm.description = "some description";
        vm.foo = "FOO";

    }


})();