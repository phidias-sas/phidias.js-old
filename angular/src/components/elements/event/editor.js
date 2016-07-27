(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiEventEditor", phiEventEditor);

    function phiEventEditor() {
        return {
            restrict: "E",
            scope: {
                event: "=ngModel"
            },
            controller:       phiEventEditorController,
            controllerAs:     "vm",
            bindToController: true,
            templateUrl:      '/components/elements/event/editor.html'
        };
    }

    function phiEventEditorController() {

        var vm = this;

        vm.defaultRepeat = {
            interval: '1',
            every: 'week'
        };

        vm.minDate = null;

        vm.toggleRepeat = function(value) {
            if (value == undefined) {
                value = !vm.event.repeat;
            }
            vm.event.repeat = value ? vm.defaultRepeat : null;
        };

        vm.sanitize = function() {
            if (vm.event.endDate < vm.event.startDate) {
                vm.event.endDate = vm.event.startDate;
            }

            vm.minDate = new Date();
            vm.minDate.setDate(vm.event.startDate.getDate() - 1);
        };

        vm.sanitize();
    }

})();