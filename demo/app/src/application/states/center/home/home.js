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

    homeController.$inject = ["$state", "phiApi"];
    function homeController($state, phiApi) {

        var postsUrl = "nodes/" + $state.params.centerId + "/posts";

        var vm    = this;
        vm.reload = reload;

        vm.post   = null;

        reload();

        ///////////////////////////

        function reload() {

            phiApi.get(postsUrl, {type: "home"})
                .then(function(response) {
                    if (!response.data.length) {
                        return;
                    }
                    vm.post     = response.data[0];
                    vm.post.url = postsUrl + "/" + response.data[0].id;
                });
        }

    }


})();