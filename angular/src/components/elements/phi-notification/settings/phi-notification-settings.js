(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive('phiNotificationSettings', phiNotificationSettings);

    phiNotificationSettings.$inject = ["phiApi"];
    function phiNotificationSettings(phiApi) {

        return {

            restrict: 'E',

            scope: {
                personId: "@"
            },

            templateUrl: '/components/elements/notification/settings/settings.html',
            controller: phiNotificationSettingsController,
            controllerAs: 'vm',
            bindToController: true
        };


        function phiNotificationSettingsController() {

            var vm          = this;
            var settingsUrl = "people/" + vm.personId + "/notifications/settings";

            vm.types    = [];
            vm.settings = {};

            vm.getTransportName = getTransportName;
            vm.toHour           = toHour;

            vm.toggleScheduling = toggleScheduling;
            vm.describeSetting  = describeSetting;

            vm.save = save;

            initialize();

            ////////////////

            function initialize() {
                phiApi.get("types/post")
                    .then(function(response) {
                        vm.types = response.data;
                        phiApi.get(settingsUrl)
                            .then(function(response) {
                                vm.settings = response.data.map(sanitizeSetting);
                            });
                    });
            }

            function getTransportName(transport) {
                switch (transport) {
                    case 'mobile':
                        return 'aplicación móvil';
                    break;
                    default:
                        return transport;
                    break;
                }
            }

            function sanitizeSetting(setting) {
                setting.hasSchedule = !!setting.schedule;
                if (setting.hasSchedule) {
                    setting.scheduleDate = new Date(null, null, null, setting.schedule.slice(0, 2), setting.schedule.slice(-2));
                }
                fillMissingTypes(setting);
                return setting;
            }

            function fillMissingTypes(setting) {

                // if this setting is already a type setting, ignore
                if (setting.type != undefined) {
                    return setting;
                }

                var typeSettings = [];

                for (var cont = 0; cont < vm.types.length; cont++) {

                    var type        = vm.types[cont];
                    var typeSetting = findTypeSetting(setting.types, type.singular);

                    if (typeSetting) {
                        typeSettings.push(sanitizeSetting(typeSetting));
                    } else {
                        // settings for this type are not explicitly declared.  Crete default:
                        typeSettings.push({
                            type: type.singular,
                            isEnabled: true
                        });
                    }
                }

                setting.types = typeSettings;
                return setting;
            }

            function findTypeSetting(settingArray, typeName) {

                if (settingArray == undefined) {
                    return null;
                }

                for (var cont = 0; cont < settingArray.length; cont++) {
                    var typeSetting = settingArray[cont];
                    if (typeSetting.type == typeName) {
                        return typeSetting;
                    }
                }

                return null;

            }



            function toHour(date) {
                var hours   = ("00"+String(date.getHours())).slice(-2);
                var minutes = ("00"+String(date.getMinutes())).slice(-2);
                return hours+minutes;
            }


            function save() {
                phiApi.post(settingsUrl, vm.settings)
                    .then(function(response) {
                        initialize(); // reload everything
                    });
            }

            function toggleScheduling(setting, isEnabled) {
                if (!setting.scheduleDate) {
                    setting.scheduleDate = new Date(null, null, null, 17, 0);
                }
                setting.schedule = isEnabled ? vm.toHour(setting.scheduleDate) : null;
            }

            function describeSetting(setting) {

                var notices = [];

                if (!setting.isEnabled) {
                    notices.push('desactivado');
                    return notices;
                }

                if (setting.hasSchedule) {
                    var hours   = setting.scheduleDate.getHours();
                    var minutes = ('00' + String(setting.scheduleDate.getMinutes())).slice(-2);
                    var am      = hours >= 12 ? 'pm' : 'am';

                    if (hours >= 12) {
                        hours = hours - 12;
                    }

                    if (hours == 0) {
                        hours = 12;
                    }

                    notices.push('se envia un consolidado a las ' + hours + ':' + minutes + ' ' + am);
                } else {
                    notices.push('activado');
                }

                if (setting.types) {

                    var disabledTypes = [];

                    for (var cont = 0; cont < setting.types.length; cont++) {

                        var typeSetting = setting.types[cont];
                        var type        = getType(typeSetting.type);

                        if (!typeSetting.isEnabled) {
                            disabledTypes.push(type.plural);
                            continue;
                        }

                        if (typeSetting.hasSchedule) {
                            notices.push((type.gender ? 'los ' : 'las ') + type.plural + ' se consolidan');
                        }
                    }

                    if (disabledTypes.length > 0) {
                        notices.push("excepto " + disabledTypes.join(", "));
                    }
                }

                return notices;

            }

            function getType(typeName) {
                for (var cont = 0; cont < vm.types.length; cont++) {
                    if (vm.types[cont].singular == typeName) {
                        return vm.types[cont];
                    }
                }
                return null;
            }



        }

    };

})();