(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("city", {
            url:         "/cities/:city",
            templateUrl:  "/application/states/city/city.html",
            controller:   cityController,
            controllerAs: "vm"
        });
    }

    cityController.$inject = ["$state", "phiApi"];
    function cityController($state, phiApi) {
        var vm  = this;
        vm.city = $state.params.city;

        vm.centers   = [];
        vm.isLoading = false;

        vm.page  = 1;
        vm.total = null;

        vm.find = function(query) {

            query = query == undefined ? '' : query.trim();

            vm.isLoading = true;
            phiApi.get("centers", {page: vm.page, search: query, 'filters[city]': vm.city})
                .then(function (response) {
                    vm.centers = response.data;
                    vm.page    = parseInt(response.headers('x-phidias-collection-page'));
                    vm.total   = parseInt(response.headers('x-phidias-collection-total'));
                })
                .finally(function() {
                    vm.isLoading = false;
                });            

        }

        initialize();

        //////////////////////////////

        function initialize() {
            vm.find();
        }
    }

})();