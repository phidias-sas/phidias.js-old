(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state)
        .controller("centerAdmissionsController", centerAdmissionsController);


    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("center.admissions", {
            url:          "/admissions",
            templateUrl:  "/application/states/center/admissions/admissions.html",
            controller:   "centerAdmissionsController",
            controllerAs: "vm"
        });

    };


    centerAdmissionsController.$inject = ["$state", "$scope", "phiApi"];
    function centerAdmissionsController($state, $scope, phiApi) {

        var processesUrl = "nodes/" + $state.params.centerId + "/posts/";

        var vm       = this;
        vm.parent    = $scope.$parent.vm;
        vm.processes = [];

        reload();

        ///////////////////////

        function reload() {

            phiApi.get(processesUrl, {type: "process"})
                  .then(function(response) {
                        vm.processes = response.data;
                  });

        };        

    }

})();