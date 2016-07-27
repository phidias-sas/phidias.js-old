(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .directive("phiEventRepeat", phiEventRepeat);

    function phiEventRepeat() {
        return {
            restrict: "E",
            scope: {
                repeat: "=ngModel"
            },
            controller:       phiEventRepeatController,
            controllerAs:     "vm",
            bindToController: true,
            templateUrl:      '/components/elements/event/repeat.html'
        };
    }

    phiEventRepeatController.$inject = ["$scope"];
    function phiEventRepeatController($scope) {

        var vm = this;

        vm.checkedDays = [];
        vm.summary     = "";

        $scope.$watch("vm.repeat", function() {
            if (typeof vm.repeat.on == "object") {
                vm.checkedDays = [];
                for (var cont = 0; cont < vm.repeat.on.length; cont++) {
                    vm.checkedDays[parseInt(vm.repeat.on[cont])] = true;
                }
            }
        }, true);

        vm.sayDay = function(day) {
            switch (day) {
                case 1:
                    return "lunes";
                case 2:
                    return "martes";
                case 3:
                    return "miércoles";
                case 4:
                    return "jueves";
                case 5:
                    return "viernes";
                case 6:
                    return "sábado";
                case 7:
                    return "domingo";
                default:
                    return "???";
            }
        };

        vm.toggleDay = function(weekDay, value) {

            if (typeof vm.repeat.on != 'object') {
                vm.repeat.on = [];
            }

            if (value) {
                if (vm.repeat.on.indexOf(weekDay) == -1) {
                    vm.repeat.on.push(weekDay);
                }
            } else {
                vm.repeat.on.splice(vm.repeat.on.indexOf(weekDay), 1);
            }

        };

        vm.getSummary = function() {

            if (!vm.repeat.every) {
                return "no se repite";
            }

            var summary = "cada ";

            if (vm.repeat.interval > 1) {
                summary += vm.repeat.interval + " ";
            }

            switch (vm.repeat.every) {
                case "day":
                    summary += (vm.repeat.interval > 1) ? "dias" : "dia";
                break;

                case "week":
                    summary += (vm.repeat.interval > 1) ? "semanas" : "semana";

                    var dayNames = [];

                    if (typeof vm.repeat.on == 'object') {
                        for (var cont = 0; cont < vm.repeat.on.length; cont++) {
                            dayNames.push(vm.sayDay(vm.repeat.on[cont]));
                        }
                    }

                    if (dayNames.length) {
                        summary += " los ";
                    }

                    if (dayNames.length > 2) {
                        summary += " " + dayNames.slice(0, dayNames.length-2).join(", ") + ", " + dayNames.slice(dayNames.length-2).join(" y ");
                    } else {
                        summary += " " + dayNames.join(" y ");
                    }

                break;

                case "month":
                    summary += (vm.repeat.interval > 1) ? "meses" : "mes";

                    summary += (vm.repeat.on == "weekday") ? " el día de la semana" : " el día del mes";

                break;

                case "year":
                    summary += (vm.repeat.interval > 1) ? "años" : "año";
                break;
            }

            return summary;
        };


    }

})();