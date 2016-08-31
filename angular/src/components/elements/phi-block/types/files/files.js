(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockFiles", phiBlockFiles);

    phiBlockFiles.$inject = ["phiApi"];
    function phiBlockFiles(phiApi) {

        return function(phiBlock) {

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
                        template:   '<phi-api-resource-files src="{{phiBlock.ngModel.url}}"></phi-api-resource-files>'
                    },

                    editor: {
                        controller:   editorController,
                        template:     '<phi-api-resource-files-editor src="{{phiBlock.ngModel.url}}"></phi-api-resource-files-editor>'
                    },

                    delete: {
                        template:   '<form>' + 
                                        '<h1>Eliminar esta carpeta ?</h1>' +
                                        '<footer>' + 
                                            '<phi-button class="danger" ng-click="phiBlock.destroy()">eliminar</phi-button>' + 
                                            '<phi-button class="cancel" ng-click="phiBlock.go(\'default\')">cancelar</phi-button>' + 
                                        '</footer>' + 
                                    '</form>',
                    }

                }

            };

            //////////////////////

            function initialize() {

                if ( phiBlock.ngModel.url ) {
                    phiBlock.go("default");
                    return;
                }

                phiBlock.go("editor");

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