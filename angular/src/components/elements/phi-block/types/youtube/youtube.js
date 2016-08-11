(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockYoutube", phiBlockYoutube);

    phiBlockYoutube.$inject = ["phiApi"];
    function phiBlockYoutube(phiApi) {
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

                if (phiBlock.ngModel.url) {
                    phiBlock.ngModel.videoId   = getYoutubeId(phiBlock.ngModel.url);
                    phiBlock.ngModel.isInvalid = !phiBlock.ngModel.videoId;
                    phiBlock.ngModel.thumbnail = phiBlock.ngModel.videoId ? "https://img.youtube.com/vi/" + phiBlock.ngModel.videoId + "/0.jpg" : null;
                }

            }


            editorController.$inject = ["$scope"];
            function editorController($scope) {

                var vm    = this;
                vm.save   = save;
                vm.cancel = cancel;

                $scope.$watch("phiBlock.ngModel.url", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    phiBlock.ngModel.videoId   = getYoutubeId(current);
                    phiBlock.ngModel.isInvalid = !!current && !phiBlock.ngModel.videoId;
                    phiBlock.ngModel.thumbnail = phiBlock.ngModel.videoId ? "https://img.youtube.com/vi/" + phiBlock.ngModel.videoId + "/0.jpg" : null;

                });

                /////////////////

                function save() {
                    phiBlock.change();
                    phiBlock.go("default");
                }

                function cancel() {

                    if (!phiBlock.ngModel.videoId) {
                        phiBlock.destroy();
                    } else {
                        phiBlock.go("default");
                    }

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

            function getYoutubeId(url) {

                if (!url.trim().length) {
                    return null;
                }

                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                var match  = url.match(regExp);
                if (match && match[2].length == 11) {
                    return match[2];
                } else {
                    return null;
                }
            }


            return {

                initialize: initialize,

                states: {

                    default: {
                        controller:     defaultController,
                        controllerAs:   'vm',
                        template:       '<div>' +
                                            '<p ng-show="!phiBlock.ngModel.videoId">El v&iacute;deo no es v&aacute;lido</p>' +
                                            '<p ng-show="!!phiBlock.ngModel.videoId" ng-bind="phiBlock.ngModel.title"></p>' +
                                            '<iframe ng-if="!!phiBlock.ngModel.videoId" width="100%" height="420" ng-src="{{\'https://www.youtube.com/embed/\' + phiBlock.ngModel.videoId | trustAsResourceUrl}}" frameborder="0" allowfullscreen></iframe>' +
                                        '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<fieldset>' +

                                            '<phi-input ng-model="phiBlock.ngModel.url" label="URL de youtube"></phi-input>' +

                                            '<p ng-show="!!phiBlock.ngModel.isInvalid">Debes ingresar una direcci&oacute;n v&aacute;lida de YouTube</p>' +

                                            '<div ng-show="!!phiBlock.ngModel.videoId" class="description">' +
                                                '<phi-input ng-model="phiBlock.ngModel.title" label="titulo"></phi-input>' +
                                                '<phi-input multiline ng-model="phiBlock.ngModel.description" label="descripci&oacute;n"></phi-input>' +
                                                '<img ng-if="!!phiBlock.ngModel.thumbnail" ng-src="{{phiBlock.ngModel.thumbnail}}" />' +
                                            '</div>' +

                                            '<footer style="margin-top: 16px">' +  // !!!! remove built in styles
                                                '<phi-button ng-show="!!phiBlock.ngModel.videoId" ng-click="vm.save()">aceptar</phi-button>' +
                                                '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' +
                                            '</footer>' +

                                        '</fieldset>' +
                                    '</form>'
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:   '<form>' +
                                        '<h1>Eliminar este video ?</h1>' +
                                        '<footer>' +
                                            '<phi-button ng-click="vm.confirm()">eliminar</phi-button>' +
                                            '<phi-button ng-click="vm.cancel()" class="cancel">cancelar</phi-button>' +
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