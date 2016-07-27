/*
phiStorage.session.set('name', value);
phiStorage.session.get('name', defaultValue);
phiStorage.session.clear('name');
phiStorage.session.clear(); // clears all

phiStorage.local.set('name', value);
phiStorage.local.get('name', defaultValue);
phiStorage.local.clear('name');
phiStorage.local.clear(); // clears all

*/
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .factory('phiStorage', phiStorage);

    function phiStorage() {

        return {
            session: getWrapper(window.sessionStorage),
            local:   getWrapper(window.localStorage)
        };

    };

    function getWrapper(storage) {

        return {

            set: function(name, value) {
                storage[name] = angular.toJson(value);
            },

            get: function(name, defaultValue) {
                return storage[name] === undefined ? defaultValue : angular.fromJson(storage[name]);
            },

            clear: function(name) {

                if (name !== undefined) {
                    return storage.removeItem(name);
                }

                return storage.clear();
            }

        }

    };

})();