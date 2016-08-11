(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockHtml", phiBlockHtml);

    phiBlockHtml.$inject = ["phiApi"];
    function phiBlockHtml(phiApi) {

        return function(phiBlock) {

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                if ( !phiBlock.ngModel.collectionUrl ) {
                    phiBlock.go("error");
                    return;
                }

                phiApi.post(phiBlock.ngModel.collectionUrl)
                    .then(function(response) {

                        phiBlock.ngModel.url = response.headers("location");

                        // Play nice:  report ngModel changes to phiBlock
                        phiBlock.change();

                        phiBlock.go("editor");
                    });

            }


            defaultController.$inject = ["$sce"];
            function defaultController($sce) {

                var vm = this;

                phiApi.get(phiBlock.ngModel.url)
                    .then(function(response) {
                        vm.body = $sce.trustAsHtml(response.data.body);
                    });
            }


            editorController.$inject = ["$scope", "$sce"];
            function editorController($scope, $sce) {

                var vm = this;

                phiApi.get(phiBlock.ngModel.url)
                    .then(function(response) {

                        vm.body = $sce.trustAsHtml(response.data.body);

                        $scope.$watch("vm.body", function(newValue, oldValue) {
                            if (newValue == oldValue || oldValue == undefined || newValue == undefined) {
                                return;
                            }
                            save(newValue);
                        });

                    });

                function save(htmlBody) {
                    phiApi.put(phiBlock.ngModel.url, {body: htmlBody});
                }

            }


            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {

                    phiApi.delete(phiBlock.ngModel.url)
                        .then(function() {
                            phiBlock.destroy();
                        });

                }

                function cancel() {
                    phiBlock.go("default");
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