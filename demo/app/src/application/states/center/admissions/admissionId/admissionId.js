(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("admissionHome", {
            parent:       "app",
            url:          "/centers/:centerId/admissions/:admissionId",
            templateUrl:  "/application/states/center/admissions/admissionId/admissionId.html",
            controller:   admissionHomeController,
            controllerAs: "vm"
        });

    };

    admissionHomeController.$inject = ["phiApi", "$state"]
    function admissionHomeController(phiApi, $state) {

        var centerUrl = "centers/" + $state.params.centerId;
        var postUrl   = "nodes/" + $state.params.centerId + "/posts/" + $state.params.admissionId;

        var vm    = this;
        vm.center = null;
        vm.post   = null;

        activate();

        /////////////////////////

        function activate() {

            phiApi.get(postUrl)
                .then(function(response) {
                    vm.post     = response.data;
                    vm.post.url = postUrl;
                });

            phiApi.get(centerUrl)
                .then(function(response) {
                    vm.center = response.data;
                });

        };   


    };

})();