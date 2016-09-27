(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockImage", phiBlockImage);

    phiBlockImage.$inject = ["phiApi"];
    function phiBlockImage(phiApi) {
        return function(phiBlock) {

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

            }

            function defaultController() {
                var vm = this;
            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm    = this;
                vm.save   = save;
                vm.cancel = cancel;

                /////////////////

                function save() {
                    phiBlock.change();
                    phiBlock.go("default");
                }

                function cancel() {
                    phiBlock.go("default");
                }
            }

            function deleteController() {

                var vm     = this;
                vm.confirm = confirm;
                vm.cancel  = cancel;

                /////////////////

                function confirm() {
                    phiBlock.destroy();
                }

                function cancel() {
                    phiBlock.go("default");
                }

            }


            return {

                initialize: initialize,

                menu: [
                    {
                        label: 'editar',
                        icon:  'fa-pencil',
                        state: 'editor'
                    },

                    {
                        label: 'eliminar',
                        icon:  'fa-times',
                        state: 'delete'
                    }
                ],

                states: {

                    default: {
                        controller:     defaultController,
                        controllerAs:   'vm',
                        template:       '<img ng-src="{{phiBlock.ngModel.url}}" width="100%" />'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<fieldset>' +

                                            '<phi-input ng-model="phiBlock.ngModel.url" label="URL de youtube"></phi-input>' +

                                            '<p ng-show="!!phiBlock.ngModel.isInvalid">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                            '<div ng-show="!!phiBlock.ngModel.url" class="description">' +
                                                '<img ng-if="!!phiBlock.ngModel.url" ng-src="{{phiBlock.ngModel.url}}" width="100%" />' +
                                            '</div>' +

                                            '<footer>' +
                                                '<phi-button ng-show="!!phiBlock.ngModel.url" ng-click="vm.save()">aceptar</phi-button>' +
                                                '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' +
                                            '</footer>' +

                                        '</fieldset>' +
                                    '</form>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<h1>Quitar esta imágen ?</h1>' +
                                        '<footer>' +
                                            '<phi-button class="danger" ng-click="vm.confirm()">eliminar</phi-button>' +
                                            '<phi-button class="cancel" ng-click="vm.cancel()">cancelar</phi-button>' +
                                        '</footer>' +
                                    '</form>',
                    },

                    error: {
                        template: '<h1>error!</h1>'
                    }

                }

            };


        };


    }

})();