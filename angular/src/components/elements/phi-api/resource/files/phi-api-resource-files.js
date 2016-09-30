(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiApiResourceFiles", phiApiResourceFiles);

    function phiApiResourceFiles() {

        return {

            restrict: "E",
            scope: {
                src: "@"
            },
            controller:       phiApiResourceFilesController,
            controllerAs:     "vm",
            bindToController: true,

            template:   '<ul>' +
                            '<li ng-repeat="item in vm.files" class="phi-api-resource-files-file" ng-click="vm.download(item)">' +
                                '<span class="thumbnail">' +
                                    '<img ng-if="!!item.thumbnail" ng-src="{{item.thumbnail}}" />' +
                                '</span>' +
                                '<span class="details">' +
                                    '<h3 ng-bind="item.title"></h3>' +
                                    '<p>{{item.size|bytes}} - {{item.name}}</p>' +
                                '</span>' +
                            '</li>' +
                        '</ul>'
        };

    }

    phiApiResourceFilesController.$inject = ["phiApi"];
    function phiApiResourceFilesController(phiApi) {

        var vm   = this;
        vm.files = [];

        vm.download = function(item) {
            window.open(item.url, "_blank");
        };

        phiApi.get(vm.src)
            .then(function(response) {
                vm.files = response.data;
            });

    }

})();