(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(route);


    route.$inject = ["$stateProvider"];
    function route($stateProvider) {

        $stateProvider.state("user.profile", {
            url:          "/profile",
            templateUrl:  "/application/states/user/profile/profile.html",
            controller:   userProfileController,
            controllerAs: "vm"
        });

    };

    userProfileController.$inject = ["$scope", "phiApi", "$timeout"];
    function userProfileController($scope, phiApi, $timeout) {

        var vm    = this;
        vm.parent = $scope.$parent.vm;
        vm.save   = save;
        vm.status = {
            loading: false,
            saved: false
        }

        /////////////////////////////

        function save() {

            vm.status.loading = true;

            phiApi.put("people/" + vm.parent.person.id, vm.parent.person)

                .then(function() {
                    vm.status.saved = true;

                    $timeout(function() {
                        vm.status.saved = false;
                    }, 2000)

                })

                .finally(function() {
                    vm.status.loading = false;
                });
        };

    }

})();