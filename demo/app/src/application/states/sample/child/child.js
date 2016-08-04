(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample.child", {
            url:         "/:id",
            templateUrl:  "/application/states/sample/child/child.html",
            controller:   childController,
            controllerAs: "vm"
        });
    }

    childController.$inject = ["$state", "$scope", "phiApi"];
    function childController($state, $scope, phiApi) {

        var vm   = this;

        vm.id          = $state.params.id;
        vm.title       = "sample";
        vm.description = "some description";

        var parent = $scope.$parent.vm;
        parent.description = "At state " + vm.id;
        parent.isCollapsed = vm.id != 'one';
    }


})();