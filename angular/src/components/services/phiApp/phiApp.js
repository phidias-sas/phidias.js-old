/*

Notificaciones:

phiApp.on('notification', function(notification) {

    // see https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/API.md

    // notification.message,
    // notification.title,
    // notification.count,
    // notification.sound,
    // notification.image,
    // notification.additionalData
    // notification.additionalData.foreground
    // notification.additionalData.coldstart

});


Simular una notificacion desde consola:

var phiApp = angular.element(document.body).scope().$root.phiApp;

phiApp.broadcast('notification', {
    message: null,
    title: null,
    count: null,
    sound: null,
    image: null,
    additionalData: {
        foreground: true,
        postId: '4p54wr2b',
        threadId: '5719121132bc2'
    }
});

*/
(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .provider("phiApp", phiApp);

    function phiApp() {

        var provider  = this;
        provider.$get = getService;

        /////////////////////////////////////////////////////

        getService.$inject = ["$rootScope", "$document", "$http", "phiStorage", "phiApi", "phiJwt", "$q", "$httpParamSerializer"];
        function getService($rootScope, $document, $http, phiStorage, phiApi, phiJwt, $q, $httpParamSerializer) {

            var service = {

                // application settings
                isLoaded: false,
                title:    null,
                endpoint: null,
                logo:     null,
                loadCode: loadCode,
                clear:    clear,

                // google client id,
                googleClientId: null,

                // authentication
                isAuthenticated: false,
                token: null, // string.  authentication token
                user: null,

                setToken: setToken,
                logout: logout,
                authenticate: authenticate,
                googleSignIn: googleSignIn,

                // navigation history
                previousState: null,


                // UX helpers
                loginShown: false,

                showLogin: function() {
                    service.loginShown = true;
                },

                hideLogin: function() {
                    service.loginShown = false;
                },

                loginController:  loginController,
                signupController: signupController

            }

            activate();


            ///////

            function activate() {
                var data = {};
                angular.merge(data, getDataFromMetaTags());
                angular.merge(data, phiStorage.local.get("phiApp"));
                load(data);
            }

            function loadCode(code, rackUrl) {

                if (rackUrl == undefined) {
                    rackUrl = "http://phidias.io/";
                }

                return $http.get(rackUrl + "/code/" + code)
                    .then(function(response) {
                        load({
                            title:    response.data.title,
                            logo:     response.data.logo,
                            endpoint: response.data.url
                        });
                    });

            }


            function load(appData) {

                if (!appData) {
                    return;
                }

                service.title          = appData.title          || service.title;
                service.logo           = appData.logo           || service.logo;
                service.token          = appData.token          || service.token;
                service.googleClientId = appData.googleClientId || service.googleClientId;

                if (appData.endpoint) {
                    service.isLoaded       = true;
                    service.endpoint       = appData.endpoint;
                    phiApi.setHost(service.endpoint);
                }

                if (service.token) {
                    service.setToken(service.token);
                }

                store();
            }

            function store() {
                phiStorage.local.set("phiApp", {
                    title:          service.title,
                    endpoint:       service.endpoint,
                    logo:           service.logo,
                    token:          service.token,
                    googleClientId: service.googleClientId
                });
            }

            function clear() {
                phiStorage.clear("phiApp");
                load(getDataFromMetaTags());
            }

            function setToken(strToken) {
                service.token           = strToken;
                service.user            = phiJwt.decode(strToken);
                service.isAuthenticated = true;

                phiApi.setToken(strToken);
                registerPushNotifications();

                store();
                $rootScope.$broadcast("phiAppLogin");
            }

            function logout() {

                if (service.user && service.user.id && window.device && window.device.uuid) {
                    phiApi.delete("people/" + service.user.id + "/devices/" + window.device.uuid);
                }

                service.token = null;
                service.user  = null;
                service.isAuthenticated = false;
                phiApi.setToken(false);

                store();
                $rootScope.$broadcast("phiAppLogout");
            }

            function authenticate(username, password) {

                var deferred = $q.defer();

                phiApi.post('oauth/token', 'grant_type=client_credentials',
                        {
                            headers: {
                                'Authorization': 'Basic ' + btoa(username + ':' + password),
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }
                    )
                    .then(function(response) {
                        service.setToken(response.data.access_token);
                        deferred.resolve(service.user);
                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;
            }

            function googleSignIn() {

                var deferred = $q.defer();

                getGoogleAuthorizationCode()
                    .then(function(authorizationCode) {
                        phiApi
                            .post("oauth/google", {
                                code: authorizationCode
                            })
                            .then(function (response) {
                                service.setToken(response.data.access_token);
                                deferred.resolve(service.user);
                            }, function(error) {
                                deferred.reject(error);
                            });
                    });

                return deferred.promise;

            }


            function registerPushNotifications() {

                if (typeof PushNotification == "undefined") {
                    return;
                }

                var push = PushNotification.init({
                    android: {
                        senderID: service.googleClientId
                    },
                    ios: {
                        alert: "true",
                        badge: "true",
                        sound: "true"
                    },
                    windows: {}
                });

                push.on('registration', function(data) {

                    if (!window.device || !window.device.platform) {
                        return;
                    }

                    phiApi.post("people/" + service.user.id + "/devices/", {
                        token:    data.registrationId,
                        platform: window.device.platform,
                        model:    window.device.model,
                        uuid:     window.device.uuid
                    });

                });

                push.on('notification', function(data) {
                    // data.message,
                    // data.title,
                    // data.count,
                    // data.sound,
                    // data.image,
                    // data.additionalData
                    $rootScope.$broadcast("phiAppNotification", data);
                });

                push.on('error', function(e) {
                    alert(e.message);
                });

            }




            function getGoogleAuthorizationCode() {

                var deferred = $q.defer();

                // https://developers.google.com/identity/protocols/OAuth2UserAgent#formingtheurl
                var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?" + $httpParamSerializer({
                    "redirect_uri":  "http://www.phidias.co/googlesignin.html",
                    "client_id":     service.googleClientId + ".apps.googleusercontent.com",
                    "scope":         "email",
                    "response_type": "code",
                    "prompt":        "select_account"
                });

                // Open the OAuth consent page in the InAppBrowser
                var authWindow = window.open(authUrl, '_blank');

                // Listen (one time) for messages sent from authWindow
                var listenMessage = function(event) {

                    if (event.data.status == 'success') {
                        deferred.resolve(event.data.code);
                    } else {
                        deferred.reject(event.data.error);
                    }

                    window.removeEventListener('message', listenMessage);
                }
                window.addEventListener('message', listenMessage);


                // Within phonegap, the created window will NOT have a window.opener, so
                // use this instead:
                authWindow.addEventListener('loadstart', function(e) {
                    var url   = e.url;
                    var code  = new RegExp(/\?code=(.+)$/).exec(url);
                    var error = new RegExp(/\?error=(.+)$/).exec(url);

                    var result = {};

                    if (code) {
                        result.status = 'success';
                        result.code   = code[1];
                    } else if (error) {
                        result.status = 'error';
                        result.error  = error[1];
                    }

                    if (code || error) {
                        window.postMessage(result, "*");
                        authWindow.close();
                    }
                });
                return deferred.promise;
            }



            function getDataFromMetaTags() {

                var retval = {};

                /* Obtain data from metatags (in public/index.html) */
                var metas = $document.find('meta');

                for (var cont = 0; cont < metas.length; cont++) {

                    /* Obtain endpoint from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-endpoint") {
                        retval.endpoint = metas[cont].content;
                    }

                    /* Obtain title from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-title") {
                        retval.title = metas[cont].content;
                    }

                    /* Obtain logo from "phi-endpoint" metatag */
                    if (metas[cont].name == "phi-logo") {
                        retval.logo = metas[cont].content;
                    }

                    /* Obtain googleClientId from "phi-google-client-id" metatag */
                    if (metas[cont].name == "phi-google-client-id") {
                        retval.googleClientId = metas[cont].content;
                    }

                }

                return retval;
            }


            function loginController() {

                var vm = this;

                vm.isLoading   = false;
                vm.error       = null;

                vm.credentials = {
                    username: null,
                    password: null
                };

                vm.login = function() {

                    vm.isLoading = true;

                    service.authenticate(vm.credentials.username, vm.credentials.password).then(

                        function(response) {
                            service.hideLogin();
                        },

                        function(response) {

                            switch (response.data.error) {
                                case "Phidias\\OAuth\\Exception\\UserNotFound":
                                    vm.error = "usuario no encontrado";
                                break;

                                case "Phidias\\OAuth\\Exception\\WrongPassword":
                                    vm.error = "contrasena incorrecta";
                                break;

                                case "Phidias\\OAuth\\Exception\\UserNotActive":
                                    vm.error = "este usuario aun no esta activado";
                                break;

                                default:
                                    vm.error = "ha ocurrido un error iniciando la sesion";
                                break;
                            }
                        }

                    ).finally(function() {
                        vm.isLoading = false;
                    });

                };

            };


            signupController.$inject = ["$scope", "$stateParams"];
            function signupController($scope, $stateParams) {

                var vm = this;

                vm.isLoading         = false;           
                vm.account           = {};
                vm.errors            = {};
                vm.verificationEmail = null;
                vm.signup            = signup;

                activate();

                //////////////////////////

                function activate() {
                    $scope.$watch(
                        function () {
                            return vm.account;
                        }, 
                        function (newValue, oldValue) {
                            for (var property in newValue) {
                                if (newValue[property] != oldValue[property]) {
                                    delete vm.errors[property];
                                }
                            }
                        }
                    );
                };


                function signup() {

                    // Include all stateParams as
                    // registration payload
                    vm.account.payload = $stateParams;

                    vm.isLoading = true;

                    phiApi.post("accounts", vm.account)
                        .then(
                            function(response) {
                                vm.verificationEmail = response.data.email
                            },

                            function(response) {
                                vm.errors = response.data.data;
                            }
                        )
                        .finally(function() {
                            vm.isLoading = false;
                        });

                };



            };


            return service;


        }

    }

})();