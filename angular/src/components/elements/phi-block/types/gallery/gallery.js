(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockGallery", phiBlockGallery);

    phiBlockGallery.$inject = ["phiApi"];
    function phiBlockGallery(phiApi) {

        return function(phiBlock) {

            return {

                initialize: initialize,

                states: {

                    default: {
                        controller: defaultController,
                        controllerAs: "vm",
                        template:   '<div>' + 
                                        '<ul class="phi-gallery-thumbnails">' + 
                                            '<li ng-repeat="image in vm.images" ng-click="vm.control.select($index)"><img ng-src="{{image.thumbnail}}" alt="{{image.name}}" /></li>' + 
                                        '</ul>' + 
                                        '<phi-gallery control="vm.control">' + 
                                            '<div ng-repeat="image in vm.images">' + 
                                                '<img ng-src="{{image.url}}" alt="{{image.name}}" />' + 
                                            '</div>' + 
                                        '</phi-gallery>' + 
                                    '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        template:     '<phi-api-resource-files-editor src="{{phiBlock.ngModel.url}}"></phi-api-resource-files-editor>'
                    },

                    delete: {
                        template:   '<form>' + 
                                        '<h1>Eliminar esta galería ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button ng-click="phiBlock.destroy()">eliminar</phi-button>' + 
                                            '<phi-button ng-click="phiBlock.go(\'default\')" class="cancel">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
                    }

                }

            };

            //////////////////////

            function initialize() {

                if (phiBlock.ngModel.url) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

            }


            function defaultController() {

                var vm     = this;
                vm.images  = [];
                vm.control = {};

                phiApi.get(phiBlock.ngModel.url + '/files')
                    .then(function(response) {
                        vm.images = response.data;
                    });

            }


            function editorController() {

                if ( !phiBlock.ngModel.url ) {
                    //make one up I guess!
                    var random = Math.floor((Math.random() * 10000) + 1);

                    phiBlock.ngModel.url = phiBlock.ngModel.collectionUrl + "/block" + random;
                    phiBlock.change();
                }

            }

        }


    }

})();