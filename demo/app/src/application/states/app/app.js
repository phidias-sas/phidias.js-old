(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("app", {
            abstract:    true,
            templateUrl:  "/application/states/app/app.html"
        });
    }

})();