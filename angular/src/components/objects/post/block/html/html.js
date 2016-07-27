(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiObjectPostBlockHtml", phiObjectPostBlockHtml);

    phiObjectPostBlockHtml.$inject = ["phiApi", "$http"];
    function phiObjectPostBlockHtml(phiApi, $http) {
        return function(phiObject) {

            function initialize() {

                if ( phiObject.ngModel.url ) {
                    phiObject.go("default");
                    return;
                }

                if ( !phiObject.ngModel.collectionUrl ) {
                    phiObject.go("error");
                    return;
                }

                phiApi.post(phiObject.ngModel.collectionUrl)
                    .then(function(response) {

                        phiObject.ngModel.url = response.headers("location");

                        // Play nice:  report ngModel changes to phiObject
                        phiObject.change();

                        phiObject.go("editor");
                    });

            }


            function defaultController() {

                var vm = this;

                phiApi.get(phiObject.ngModel.url)
                    .then(function(response) {
                        vm.body = response.data.body;
                    });
            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm = this;

                phiApi.get(phiObject.ngModel.url)
                    .then(function(response) {

                        vm.body = response.data.body;

                        $scope.$watch("vm.body", function(newValue, oldValue) {
                            if (newValue == oldValue || oldValue == undefined || newValue == undefined) {
                                return;
                            }
                            save(newValue);
                        });

                    });

                function save(htmlBody) {
                    phiApi.put(phiObject.ngModel.url, {body: htmlBody});
                }

            }


            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {

                    phiApi.delete(phiObject.ngModel.url)
                        .then(function() {
                            phiObject.destroy();
                        });

                }

                function cancel() {
                    phiObject.go("default");
                }

            }



            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:   defaultController,
                        controllerAs: 'vm',
                        template:     '<div ng-bind-html="vm.body"></div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:     '<text-angular ng-model="vm.body" ng-model-options="{default: 920, blur: 0}"></text-angular>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:     '<h1>Eliminar este texto ?</h1>' +
                                      '<phi-button class="danger" ng-click="vm.confirm()">Eliminar</phi-button>'  +
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancelar</phi-button>'
                    },

                    error: {
                        template: '<h1>error!</h1>'
                    }

                }

            };

        }


    }

})();