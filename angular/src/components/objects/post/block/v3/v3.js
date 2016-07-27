(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiObjectPostBlockV3", phiObjectPostBlockV3);

    phiObjectPostBlockV3.$inject = ["phiApi", "$http"];
    function phiObjectPostBlockV3(phiApi, $http) {
        return function(phiObject) {

            function initialize() {
                if ( !phiObject.ngModel.url ) {
                    phiObject.go("error");
                    return;
                }
                phiObject.go("default");
            }

            function defaultController() {

                var vm = this;

                $http.get(phiObject.ngModel.url, {
                    headers: {'Authorization': 'Bearer ' + phiApi.tokenString}
                }).then(function(response) {
                    vm.body = response.data;
                }, function() {
                    phiObject.go("error");
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