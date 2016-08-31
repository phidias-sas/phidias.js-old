(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory("phiBlockForm", phiBlockForm);

    phiBlockForm.$inject = ["phiApi", "phiApp"];
    function phiBlockForm(phiApi, phiApp) {
        return function(phiBlock) {

            var templateFieldPreview = '<div class="phi-form-editor-field-preview" ng-switch="field.type">' +

                                            '<div ng-switch-when="text">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<input ng-model="vm.currentRecord[field.name]" type="text" />' +
                                            '</div>' +

                                            '<div ng-switch-when="textarea">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<textarea ng-model="vm.currentRecord[field.name]"></textarea>' +
                                            '</div>' +

                                            '<div ng-switch-when="select">' +
                                                '<label ng-bind="field.title"></label>' +
                                                '<select ng-model="vm.currentRecord[field.name]">' +
                                                    '<option value="">---</option>' +
                                                    '<option ng-repeat="line in field.options|lines track by $index" value="{{line}}">{{line}}</option>' +
                                                '</select>' +
                                            '</div>' +

                                            '<div ng-switch-when="checkbox">' +
                                                '<phi-checkbox ng-model="vm.currentRecord[field.name]"> {{field.title}}</phi-checkbox>' +
                                            '</div>' +

                                            '<p class="description" ng-bind="field.description"></p>' +

                                        '</div>';


            var templateEditor = '<form class="phi-form-editor">' +

                                    '<fieldset class="description">' +
                                        '<phi-input multiline ng-model="phiBlock.form.description" label="descripci&oacute;n" ng-model-options="{ updateOn: \'default blur\', debounce: { \'default\': 920, \'blur\': 0 } }" ng-change="vm.save()"></phi-input>' +
                                    '</fieldset>' +

                                    '<fieldset class="fields" sv-root sv-part="phiBlock.form.fields" sv-on-sort="vm.reorder()">' +

                                        '<div ng-repeat="field in phiBlock.form.fields" sv-element class="phi-form-editor-field">' +

                                            '<div class="phi-form-editor-field-toolbar" sv-handle>' +
                                                '<a phi-icon="fa-times" ng-click="vm.removeField(field)" href="">&nbsp;</a>' +
                                            '</div>' +

                                            '<div class="phi-form-editor-field-controls">' +

                                                '<phi-select label="tipo" ng-model="field.type">' +
                                                    '<phi-option value="text">texto</phi-option>' +
                                                    '<phi-option value="textarea">textarea</phi-option>' +
                                                    '<phi-option value="select">lista</phi-option>' +
                                                    '<phi-option value="checkbox">checkbox</phi-option>' +
                                                '</phi-select>' +

                                                '<phi-input label="titulo" ng-model="field.title"></phi-input>' +

                                                '<phi-input multiline label="descripci&oacute;n" ng-model="field.description"></phi-input>' +

                                                '<div ng-show="field.type == \'select\'">' +
                                                    '<phi-input multiline label="opciones" ng-model="field.options"></phi-input>' +
                                                    '<p class="notice">Escribe una opci&oacute;n por l&iacute;nea</p>' +
                                                '</div>' +
                                            '</div>' +

                                            templateFieldPreview +

                                        '</div>' +

                                        '<div class="phi-form-editor-field-new" phi-icon-left="fa-plus" ng-click="vm.addField()">Agregar campo</div>' +

                                    '</fieldset>' +


                                '</form>';


            function initialize() {

                if (phiBlock.ngModel.url) {

                    phiApi.get(phiBlock.ngModel.url)
                        .then(function(response) {
                            phiBlock.form = response.data;
                            phiBlock.go("default");
                        });

                } else {

                    phiApi.post(phiBlock.ngModel.collectionUrl)
                        .then(function(response) {
                            phiBlock.ngModel.url = response.headers("location");
                            phiBlock.form        = response.data;
                            phiBlock.form.fields = [];
                            phiBlock.change();
                            phiBlock.go("editor");
                        });

                }
            }


            function defaultController() {

                var recordsUrl = 'people/' + phiApp.user.id + '/data/entities/' + phiBlock.form.id + '/records';

                var vm           = this;
                vm.currentRecord = null;
                vm.records       = [];

                phiApi.get(recordsUrl)
                    .then(function(response) {
                        vm.records = response.data;
                    });


                vm.saveCurrentRecord = function() {

                    if (!recordsUrl) {
                        return;
                    }

                    phiApi.post(recordsUrl, vm.currentRecord)
                        .then(function(response) {
                            vm.records       = [response.data];
                            vm.currentRecord = {};
                        });

                }
            }

            editorController.$inject = ["$scope", "$timeout"];
            function editorController($scope, $timeout) {

                var vm         = this;
                vm.addField    = addField;
                vm.removeField = removeField;
                vm.save        = save;
                vm.reorder     = reorder;

                //////////////////////////////////////////

                var saveTimer = null;

                $scope.$watch("phiBlock.form.fields", function(current, previous) {

                    if (current == previous) {
                        return;
                    }

                    $timeout.cancel(saveTimer);
                    saveTimer = $timeout(vm.save, 1000);

                }, true);



                function addField() {

                    var newField = {
                        type: "text",
                        order: phiBlock.form.fields.length
                    };

                    phiBlock.form.fields.push(newField);

                };

                function removeField(field) {

                    if (confirm('Deseas eliminar este campo ?')) {
                        phiBlock.form.fields.splice(phiBlock.form.fields.indexOf(field), 1);
                    }

                };

                function save() {
                    phiApi.put(phiBlock.ngModel.url, phiBlock.form);
                };


                function reorder() {
                    var fieldIds = [];
                    for (var cont = 1; cont <= phiBlock.form.fields.length; cont++) {
                        phiBlock.form.fields[cont-1].order = cont;
                    }
                };

            };


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

            };




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
                        controller:   defaultController,
                        controllerAs: "vm",
                        template:   '<div>' +
                                        '<form ng-if="!vm.records.length">' +
                                            '<p ng-bind="phiBlock.form.description"></p>' +
                                            '<fieldset>' +
                                                '<div ng-repeat="field in phiBlock.form.fields">' +
                                                    templateFieldPreview +
                                                '</div>' +
                                            '</fieldset>' +

                                            '<footer>' +
                                                '<phi-button ng-click="vm.saveCurrentRecord()">Guardar</phi-button>' +
                                            '</footer>' +
                                        '</form>' +

                                        '<div ng-if="!!vm.records.length">' +
                                            '<fieldset ng-repeat="record in vm.records">' +
                                                '<div ng-repeat="field in phiBlock.form.fields">' +
                                                    '<strong ng-bind="field.title"></strong>: ' +
                                                    '<span ng-if="field.type != \'checkbox\'" ng-bind="record.values[field.name]"></span>' +
                                                    '<span ng-if="field.type == \'checkbox\'" ng-bind="record.values[field.name] == 1 ? \'si\' : \'no\'"></span>' +
                                                '</div>' +
                                            '</fieldset>' +
                                        '</div>' +

                                    '</div>'
                    },

                    editor: {
                        controller:   editorController,
                        controllerAs: "vm",
                        template:     templateEditor
                    },

                    delete: {
                        controller:   deleteController,
                        controllerAs: 'vm',
                        template:     '<h1>Eliminar este formulario ?</h1>' +
                                      '<phi-button class="danger" ng-click="vm.confirm()">Eliminar</phi-button>'  +
                                      '<phi-button class="cancel" ng-click="vm.cancel()">Cancelar</phi-button>'
                    }

                }

            };

        };


    }

})();