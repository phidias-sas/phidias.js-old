(function() {
    'use strict';

    angular.module("phidias-angular")
        .directive('phiNotificationSettings', phiNotificationSettings);

    phiNotificationSettings.$inject = ["phiApi"];
    function phiNotificationSettings(phiApi) {

        return {

            restrict: 'E',

            scope: {
                personId: "@",
                allowEdit: "="
            },

            templateUrl: '/components/elements/phi-notification-settings/phi-notification-settings.html',
            controller: phiNotificationSettingsController,
            controllerAs: 'vm',
            bindToController: true
        };


        function phiNotificationSettingsController() {

            var vm = this;
            var destinationsUrl = "people/" + vm.personId + "/notification/destinations";

            vm.transports = [
                {
                    name: 'email',
                    label: 'e-Mail',
                    image: phiApi.host + "/icons/fa-envelope.png",
                    allowEdit: true,
                    defaultText: 'mi correo principal'
                },

                {
                    name: 'sms',
                    label: 'SMS',
                    image: phiApi.host + "/icons/fa-envelope.png",
                    allowEdit: true,
                    defaultText: 'mi teléfono principal'
                },

                // {
                //     name: 'slack',
                //     label: 'Slack',
                //     image: phiApi.host + "/icons/fa-envelope.png",
                //     allowEdit: true
                // },

                {
                    name: 'gcm',
                    label: 'Android',
                    image: phiApi.host + "/icons/fa-envelope.png",
                    defaultText: 'app móvil'
                },

                {
                    name: 'apn',
                    label: 'Apple',
                    image: phiApi.host + "/icons/fa-envelope.png",
                    defaultText: 'app móvil'
                }
            ];

            vm.types        = [];
            vm.destinations = [];

            vm.isLoading = false;
            vm.save      = save;
            vm.remove    = remove;

            vm.scheduleHours = [];

            for (var hour = 5; hour <= 23; hour++) {
                var hour12 = hour > 12 ? hour-12 : hour;
                var ampm   = hour > 12 ? 'pm' : 'am';

                vm.scheduleHours.push({
                    label: hour12 + ':00 ' + ampm,
                    value: hour + '00'
                }, {
                    label: hour12 + ':30 ' + ampm,
                    value: hour + '30'
                });
            }


            initialize();

            ///////////

            function save(destination) {

                var request  = null;
                vm.isLoading = true;

                if (destination.id != undefined) {
                    request = phiApi.put(destinationsUrl + "/" + destination.id, destination);
                } else {
                    request = phiApi.post(destinationsUrl, destination)
                        .then(function(response) {
                            vm.destinations.push(sanitizeDestination(response.data));
                        });
                }

                request.finally(function() {
                    vm.isLoading = false;
                });

            }

            function remove(destination) {
                if (!confirm('eliminar este destinatario?')) {
                    return;
                }

                phiApi.remove(destinationsUrl + "/" + destination.id)
                    .then(function() {
                        vm.destinations.splice(vm.destinations.indexOf(destination), 1);
                    });
            }


            function initialize() {
                phiApi.get("types/post")
                    .then(function(response) {
                        vm.types = response.data;
                        phiApi.get(destinationsUrl)
                            .then(function(response) {
                                vm.destinations = response.data.map(sanitizeDestination);
                            });
                    });
            }



            function sanitizeDestination(destination) {

                sanitizeSchedule(destination);

                /* Fill preferences */
                var allPreferences = [];

                if (destination.preferences == undefined) {
                    destination.preferences = [];
                }

                for (var cont = 0; cont < vm.types.length; cont++) {

                    var type       = vm.types[cont];
                    var preference = findPreference(destination.preferences, type.singular);

                    if (preference) {
                        allPreferences.push(sanitizeSchedule(preference));
                    } else {
                        // settings for this type are not explicitly declared.  Crete default:
                        allPreferences.push({
                            type: type.singular,
                            isEnabled: true
                        });
                    }
                }

                destination.preferences = allPreferences;

                return destination;
            }



            function sanitizeSchedule(preference) {

                preference.isEnabled = preference.isEnabled == "1";

                preference.hasSchedule = !!preference.schedule;
                if (preference.hasSchedule) {
                    preference.scheduleDate = new Date(null, null, null, preference.schedule.slice(0, 2), preference.schedule.slice(-2));
                }
                return preference;
            }


            function findPreference(preferences, typeName) {

                if (preferences == undefined) {
                    return null;
                }

                for (var cont = 0; cont < preferences.length; cont++) {
                    var preference = preferences[cont];
                    if (preference.type == typeName) {
                        return preference;
                    }
                }

                return null;
            }


        }

    };

})();