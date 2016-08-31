(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockV3", phiBlockV3);

    phiBlockV3.$inject = ["phiApi", "$http", "$sce"];
    function phiBlockV3(phiApi, $http, $sce) {
        return function(phiBlock) {

            function initialize() {
                if ( !phiBlock.ngModel.url ) {
                    phiBlock.go("error");
                    return;
                }
                phiBlock.go("default");
            }

            function defaultController() {

                var vm = this;

                $http.get(phiBlock.ngModel.url, {
                    headers: {'Authorization': 'Bearer ' + phiApi.token}
                }).then(function(response) {
                    // vm.body = response.data;
                    vm.body = $sce.trustAsHtml(response.data);
                }, function() {
                    phiBlock.go("error");
                });

            }

            return {
                initialize: initialize,
                states: {
                    default: {
                        controller:   defaultController,
                        controllerAs: 'vm',
                        template:     '<div ng-bind-html="vm.body"></div>'
                    },
                    error: {
                        template: '<h1>Error cargando datos adjuntos</h1>'
                    }
                }
            };

        }


    }

})();