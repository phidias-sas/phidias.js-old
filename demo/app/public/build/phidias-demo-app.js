(function() {
    'use strict';

    angular.module("phidias-demo-app", [
        "phidias-angular", 
        "ui.router", 
        "ngAnimate"
    ]);

})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(defaultState)
        .run(initialize);

    defaultState.$inject = ["$urlRouterProvider"];
    function defaultState($urlRouterProvider) {

        /*
        So the following line was causing an infinite redirect
        when we redirected via stateChangeStart (see run.js).
        Workaround as found in https://github.com/angular-ui/ui-router/issues/2183
        */
        // $urlRouterProvider.otherwise('/default');

        $urlRouterProvider.otherwise(function($injector, $location){
            var $state = $injector.get("$state");
            $state.go('home');
        });
    };


    initialize.$inject = ["$rootScope", "$state", "phiApi", "phiApp"];
    function initialize($rootScope, $state, phiApi, phiApp) {

        $rootScope.$state = $state;
        $rootScope.phiApp = phiApp;
        $rootScope.phiApi = phiApi;

        /* Determine state transition direction */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.stateChangeDirection = 'right';
            if (fromState.data == undefined || fromState.data.order == undefined || toState.data == undefined || toState.data.order == undefined) {
                return;
            }
            $rootScope.stateChangeDirection = fromState.data.order < toState.data.order ? 'right' : 'left'; 
        });
    }



})();

/*
Testing angular JS animations
https://docs.angularjs.org/guide/animations
*/


angular
    .module("phidias-demo-app")
    .animation('.main-view', ["$timeout", function($timeout) {

        var duration = 290;

        var incomingCover = null;

        return {
            enter : function(element, done) {

                incomingCover = element.find('phi-state-cover');

                element.addClass('ng-enter');
                $timeout(function() {
                    element.addClass('ng-enter-active');
                }, 0);

                $timeout(function() {
                    element.removeClass('ng-enter ng-enter-active');
                    done();
                }, duration);

                // optional onDone or onCancel callback
                // function to handle any post-animation
                // cleanup operations
                return function(isCancelled) {
                }
            },

            leave : function(element, done) {

                var targetCoverHeight = incomingCover[0].clientHeight;

                var outgoingCover = element.find('phi-state-cover');
                outgoingCover.css("max-height", "none");
                outgoingCover.css("height", outgoingCover[0].clientHeight + "px");

                incomingCover.css("height", outgoingCover[0].clientHeight + "px");

                element.addClass('ng-leave');

                $timeout(function() {
                    element.addClass('ng-leave-active');
                    outgoingCover.css("height", targetCoverHeight + "px");
                    incomingCover.css("height", targetCoverHeight + "px");
                }, 0);

                $timeout(function() {
                    element.removeClass('ng-leave ng-leave-active');
                    outgoingCover.css("height", "auto");
                    incomingCover.css("height", "auto");
                    done();
                }, duration);


                // optional onDone or onCancel callback
                // function to handle any post-animation
                // cleanup operations
                return function(isCancelled) {}
            }
        }
}]);



(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("app", {
            abstract:    true,
            templateUrl:  "/application/states/app/app.html"
        });
    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("center", {
            parent:      "app",
            abstract:    true,
            url:         "/centers/:centerId",
            templateUrl:  "/application/states/center/center.html",
            controller:   centerController,
            controllerAs: "vm",
            data:         {order: 1}
        });
    }

    centerController.$inject = ["$state", "phiApi"];
    function centerController($state, phiApi) {

        var centerUrl = "/centers/" + $state.params.centerId;

        var vm       = this;
        vm.centerId  = $state.params.centerId;
        vm.isLoading = false;
        vm.center    = null;

        vm.load = function() {

            vm.isLoading = true;

            phiApi.get(centerUrl)
                .then(function(response) {
                    vm.center = response.data;
                })
                .finally(function() {
                    vm.isLoading = false;
                });
        };



        initialize();

        function initialize() {
            vm.load();
        }

    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("city", {
            parent:      "app",
            url:         "/cities/:city",
            templateUrl:  "/application/states/city/city.html",
            controller:   cityController,
            controllerAs: "vm"
        });
    }

    cityController.$inject = ["$state", "phiApi", "$timeout"];
    function cityController($state, phiApi, $timeout) {
        var vm  = this;
        vm.city = $state.params.city;

        vm.centers   = [];
        vm.isLoading = false;

        vm.page  = 1;
        vm.total = null;

        vm.find = function(query) {

            query = query == undefined ? '' : query.trim();

            vm.isLoading = true;
            phiApi.get("centers", {limit: 21, page: vm.page, search: query, 'filters[city]': vm.city})
                .then(function (response) {
                    vm.centers = response.data;
                    vm.page    = parseInt(response.headers('x-phidias-collection-page'));
                    vm.total   = parseInt(response.headers('x-phidias-collection-total'));
                })
                .finally(function() {
                    vm.isLoading = false;
                });            

        }


        /* Current view */
        vm.view = 'grid';

        vm.setView = function(view) {
            if (vm.view == view) {
                return;
            }
            vm.view = view;

            if (vm.view == 'map') {
                vm.map.initialize();
            }
        }



        vm.map = {

            googleMap:           null,
            markers:             [],
            isInitialized:       false,
            boundsChangePromise: null,

            initialize: function() {

                if (vm.map.isInitialized) {
                    return;
                }

                // initialize the map object
                vm.map.googleMap = new google.maps.Map(document.getElementById("google-map"), {
                    center: {lat: -3.4497434, lng: -76.5334475},
                    zoom: 15
                });

                // Always redraw (!!! this "fixes" the fact that google map does not re-create the map instance)
                $timeout(function() {
                    google.maps.event.trigger(vm.map.googleMap, "resize");
                }, 100);

                // update search filters when bounds change (delayed 500ms)
                google.maps.event.addListener(vm.map.googleMap, 'bounds_changed', function() {

                    $timeout.cancel(vm.map.boundsChangePromise);

                    vm.map.boundsChangePromise = $timeout(function() {
                        console.log("map bounds changed!", vm.map.googleMap.getBounds().toUrlValue());
                    }, 500);

                });

                vm.map.isInitialized = true;
                vm.map.setMarkers(vm.centers, true);
            },


            clear: function() {
                for (var i = 0; i < vm.map.markers.length; i++) {
                    vm.map.markers[i].setMap(null);
                }
                vm.map.markers = [];
            },

            setMarkers: function(centers, focusFirstResult) {

                vm.map.clear();

                if (!centers.length) {
                    return;
                }

                centers.forEach(function(center) {

                    if (center.count === undefined || center.count == 1) {

                        // Single center marker

                        // var marker = new CustomMarker(
                        //     vm.map.googleMap,
                        //     new google.maps.LatLng(center.latitude, center.longitude),
                        //     "phi-marker-center",
                        //     center.name
                        // );

                        var marker = new google.maps.Marker({
                            map:   vm.map.googleMap,
                            title: center.name,
                            icon:  "img/pin-active.png",
                            position: {
                                lat: parseFloat(center.latitude),
                                lng: parseFloat(center.longitude)
                            }
                        });

                        marker.centerId = center.id;

                        marker.addListener('click', function() {
                            window.open($state.href("center.home", {centerId: this.centerId}), '_blank');
                        });

                    } else {

                        // Cluster marker

                        var marker = new CustomMarker(
                            vm.map.googleMap,
                            new google.maps.LatLng(center.latitude, center.longitude),
                            "phi-marker-cluster",
                            center.count
                        );

                        marker.addListener('click', function() {
                            vm.map.googleMap.setCenter(this.getPosition());
                            vm.map.googleMap.setZoom(vm.map.googleMap.getZoom() + 3);
                        });

                    }

                    vm.map.markers.push(marker);

                });

                if (focusFirstResult) {
                    vm.map.googleMap.setCenter({
                        lat: parseFloat(centers[0].latitude),
                        lng: parseFloat(centers[0].longitude)
                    });
                }

            }


        };



        initialize();

        //////////////////////////////

        function initialize() {
            vm.find();
        }
    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("home", {
            parent:     "app",
            url:         "/",
            templateUrl:  "/application/states/home/home.html",
            controller:   homeController,
            controllerAs: "vm"
        });
    }

    homeController.$inject = ["phiApi", "$scope"];
    function homeController(phiApi, $scope) {

        var vm = this;

        vm.query     = null;

        vm.cities    = [];
        vm.centers   = [];
        vm.isLoading = false;

        vm.find = function(query) {

            if (query == undefined) {
                query = '';
            }
            query = query.trim();

            vm.isLoading = true;

            phiApi.get("regions/all/cities", {limit: !query ? 3 : 6, search: query})
                .then(function (response) {
                    vm.cities = response.data;
                    vm.isLoading = false;
                });

            if (query) {

                phiApi.get("centers", {search: query})
                    .then(function (response) {
                        vm.centers = response.data;
                    })
                    .finally(function() {
                        vm.isLoading = false;
                    });

            } else {
                vm.centers = [];
            }

        }

        initialize();

        //////////////////////////////

        function initialize() {
            vm.find();
        }
    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample", {
            abstract:    true,
            url:         "/sample",
            templateUrl:  "/application/states/sample/sample.html",
            controller:   sampleController,
            controllerAs: "vm",
            data:         {order: 1}
        });
    }

    sampleController.$inject = ["$state", "$scope", "phiApi"];
    function sampleController($state, $scope, phiApi) {

        var vm   = this;

        vm.title = "sample";
        vm.description = "some description";
        vm.foo = "FOO";

    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state)
        .controller("centerAdmissionsController", centerAdmissionsController);


    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("center.admissions", {
            url:          "/admissions",
            templateUrl:  "/application/states/center/admissions/admissions.html",
            controller:   "centerAdmissionsController",
            controllerAs: "vm"
        });

    };


    centerAdmissionsController.$inject = ["$state", "$scope", "phiApi"];
    function centerAdmissionsController($state, $scope, phiApi) {

        var processesUrl = "nodes/" + $state.params.centerId + "/posts/";

        var vm       = this;
        vm.parent    = $scope.$parent.vm;
        vm.processes = [];

        reload();

        ///////////////////////

        function reload() {

            phiApi.get(processesUrl, {type: "process"})
                  .then(function(response) {
                        vm.processes = response.data;
                  });

        };        

    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state)
        .controller("centerFacilitiesController", centerFacilitiesController);


    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("center.facilities", {
            url:          "/facilities",
            templateUrl:  "/application/states/center/facilities/facilities.html",
            controller:   "centerFacilitiesController",
            controllerAs: "vm"
        });

    };


    centerFacilitiesController.$inject = ["phiApi", "$state"];
    function centerFacilitiesController(phiApi, $state) {

        var vm        = this;
        vm.facilities = [];
        vm.gallery    = {};

        reload();

        ///////////////////////////////

        function reload() {

            phiApi.get("centers/" + $state.params.centerId + "/facilities", {sort: "-publishDate"})
                .then(function (response) {
                    vm.facilities = response.data;
                });

        }


    }

})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("center.home", {
            url:         "/home",
            templateUrl:  "/application/states/center/home/home.html",
            controller:   homeController,
            controllerAs: "vm"
        });
    }

    homeController.$inject = ["$state", "phiApi"];
    function homeController($state, phiApi) {

        var postsUrl = "nodes/" + $state.params.centerId + "/posts";

        var vm    = this;
        vm.reload = reload;

        vm.post   = null;

        reload();

        ///////////////////////////

        function reload() {

            phiApi.get(postsUrl, {type: "home"})
                .then(function(response) {
                    if (!response.data.length) {
                        return;
                    }
                    vm.post     = response.data[0];
                    vm.post.url = postsUrl + "/" + response.data[0].id;
                });
        }

    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample.child", {
            url:         "/:id",
            templateUrl:  "/application/states/sample/child/child.html",
            controller:   childController,
            controllerAs: "vm"
        });
    }

    childController.$inject = ["$state", "$scope", "phiApi"];
    function childController($state, $scope, phiApi) {

        var vm   = this;

        vm.id          = $state.params.id;
        vm.title       = "sample";
        vm.description = "some description";

        var parent = $scope.$parent.vm;
        parent.description = "At state " + vm.id;
        parent.isCollapsed = vm.id != 'one';
    }


})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {

        $stateProvider.state("admissionHome", {
            parent:       "app",
            url:          "/centers/:centerId/admissions/:admissionId",
            templateUrl:  "/application/states/center/admissions/admissionId/admissionId.html",
            controller:   admissionHomeController,
            controllerAs: "vm"
        });

    };

    admissionHomeController.$inject = ["phiApi", "$state"]
    function admissionHomeController(phiApi, $state) {

        var centerUrl = "centers/" + $state.params.centerId;
        var postUrl   = "nodes/" + $state.params.centerId + "/posts/" + $state.params.admissionId;

        var vm    = this;
        vm.center = null;
        vm.post   = null;

        activate();

        /////////////////////////

        function activate() {

            phiApi.get(postUrl)
                .then(function(response) {
                    vm.post     = response.data;
                    vm.post.url = postUrl;
                });

            phiApi.get(centerUrl)
                .then(function(response) {
                    vm.center = response.data;
                });

        };   


    };

})();
angular.module("phidias-demo-app").run(["$templateCache", function($templateCache) {$templateCache.put("/application/states/app/app.html","<phi-app-bar>\r\n    <div>\r\n        <a ng-if=\"$state.current.name != \'home\'\" href class=\"back\" phi-icon-left=\"fa-arrow-left\" onclick=\"history.go(-1)\"></a>\r\n\r\n        <div class=\"authentication\">\r\n            <div id=\"main-user\" ng-if=\"phiApp.isAuthenticated\">\r\n\r\n                <h1 ng-bind=\"phiApp.user.firstName + \' \' + phiApp.user.lastName\" ng-click=\"userTooltipIsVisible = !userTooltipIsVisible\"></h1>\r\n\r\n                <div phi-tooltip-for=\"main-user\" phi-visible=\"{{userTooltipIsVisible}}\" phi-visible-animation=\"slide-bottom\">\r\n                    <phi-menu phi-texture=\"paper\">\r\n                        <phi-menu-item phi-icon-left=\"fa-home\" ui-sref=\"home\">Mi perfil</phi-menu-item>\r\n                        <phi-menu-item phi-icon-left=\"fa-times\" ng-click=\"phiApp.logout()\">Salir</phi-menu-item>\r\n                    </phi-menu>\r\n                </div>\r\n\r\n            </div>\r\n            <div ng-if=\"!phiApp.isAuthenticated\">\r\n                <a href ng-click=\"phiApp.showLogin()\">Ingresar</a>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</phi-app-bar>\r\n\r\n<div class=\"main-view\" ui-view></div>\r\n\r\n\r\n<!-- Login modal -->\r\n<div phi-modal id=\"login-modal\" phi-visible=\"{{phiApp.loginShown}}\" ng-click=\"phiApp.hideLogin()\">\r\n\r\n    <div>\r\n\r\n        <div class=\"actions\" ng-click=\"$event.stopPropagation()\">\r\n            <a href ng-class=\"{active: !phiApp.loginRegistering}\" ng-click=\"phiApp.loginRegistering = false\">Ya tengo una cuenta</a>\r\n            <a href ng-class=\"{active: phiApp.loginRegistering}\" ng-click=\"phiApp.loginRegistering = true\">Crear una cuenta nueva</a>\r\n        </div>\r\n\r\n        <div phi-texture=\"paper\" class=\"phi-padded\" ng-click=\"$event.stopPropagation()\">\r\n\r\n            <div ng-show=\"!phiApp.loginRegistering\" ng-controller=\"phiApp.loginController as loginController\">\r\n\r\n                <button ng-click=\"phiApp.googleSignIn().then(phiApp.hideLogin)\">Google?</button>\r\n\r\n                <form ng-submit=\"loginController.login()\">\r\n                    <fieldset>\r\n                        <phi-input ng-model=\"loginController.credentials.username\" label=\"email\" ng-change=\"loginController.error = null\"></phi-input>\r\n                        <phi-input ng-model=\"loginController.credentials.password\" label=\"contrase&ntilde;a\" type=\"password\" ng-change=\"loginController.error = null\"></phi-input>\r\n                    </fieldset>\r\n\r\n                    <footer>\r\n                        <button phi-button type=\"submit\" ng-disabled=\"loginController.isLoading || !loginController.credentials.username.trim().length || !!loginController.error\" ng-class=\"{error: !!loginController.error}\">\r\n                            <span ng-show=\"loginController.isLoading\">cargando</span>\r\n                            <span ng-show=\"!loginController.isLoading\" ng-bind=\"loginController.error || \'ingresar\'\"></span>\r\n                        </button>                                \r\n                    </footer>\r\n                </form>\r\n            </div>\r\n\r\n\r\n            <div ng-show=\"phiApp.loginRegistering\" ng-controller=\"phiApp.signupController as signupController\">\r\n\r\n                <div ng-if=\"signupController.verificationEmail\">\r\n                    <p>En unos minutos recibir&aacute;s un mensaje a <strong ng-bind=\"signupController.verificationEmail\"></strong> con instrucciones para activar tu cuenta</p>\r\n                    <a href ng-click=\"phiApp.hideLogin()\">cerrar</a>\r\n                </div>\r\n\r\n                <form ng-submit=\"signupController.signup()\" ng-show=\"!signupController.verificationEmail\">\r\n\r\n                    <fieldset>\r\n                        <phi-input ng-model=\"signupController.account.email\" label=\"email\"></phi-input>\r\n                        <span class=\"error\" ng-show=\"signupController.errors.email\" ng-bind=\"signupController.errors.email\"></span>\r\n\r\n                        <phi-input ng-model=\"signupController.account.firstName\" label=\"nombre\"></phi-input>\r\n                        <span class=\"error\" ng-show=\"signupController.errors.firstName\" ng-bind=\"signupController.errors.firstName\"></span>\r\n\r\n                        <phi-input ng-model=\"signupController.account.lastName\" label=\"apellido\"></phi-input>\r\n                        <span class=\"error\" ng-show=\"signupController.errors.lastName\" ng-bind=\"signupController.errors.lastName\"></span>\r\n\r\n                        <phi-input ng-model=\"signupController.account.password\" label=\"elige una contrase&ntilde;a\" type=\"password\"></phi-input>\r\n                        <span class=\"error\" ng-show=\"signupController.errors.password\" ng-bind=\"signupController.errors.password\"></span>\r\n\r\n                        <phi-input ng-model=\"signupController.account.password2\" label=\"escribe tu contrase&ntilde;a nuevamente\" type=\"password\"></phi-input>\r\n                        <span class=\"error\" ng-show=\"signupController.errors.password2\" ng-bind=\"signupController.errors.password2\"></span>\r\n                    </fieldset>\r\n\r\n                    <footer>\r\n                        <button phi-button type=\"submit\" ng-disabled=\"signupController.isLoading\">\r\n                            <span ng-show=\"!signupController.isLoading\">crear cuenta</span>\r\n                            <span ng-show=\"signupController.isLoading\">creando</span>\r\n                        </button>\r\n                    </footer>\r\n\r\n                </form>\r\n\r\n            </div>\r\n\r\n\r\n        </div>\r\n    </div>\r\n\r\n\r\n</div>");
$templateCache.put("/application/states/center/center.html","<phi-state class=\"state-center\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: !!vm.isCollapsed}\">\r\n        <div class=\"header\">\r\n            <h1 ng-bind=\"vm.center.name\"></h1>\r\n            <p ng-bind=\"vm.center.category\"></p>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-navigation>\r\n        <phi-menu>\r\n            <phi-menu-item ui-sref=\"center.home({centerId: vm.centerId})\" ui-sref-active=\"active\">Inicio</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"center.facilities({centerId: vm.centerId})\" ui-sref-active=\"active\">Instalaciones</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"center.admissions({centerId: vm.centerId})\" ui-sref-active=\"active\">Admisiones</phi-menu-item>\r\n        </phi-menu>\r\n    </phi-state-navigation>\r\n\r\n    <phi-state-contents ui-view>\r\n        <h1>... loading ...</h1>\r\n    </phi-state-contents>\r\n</phi-state>");
$templateCache.put("/application/states/city/city.html","<phi-state id=\"city\">\r\n\r\n    <phi-state-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/{{vm.city}}.jpg\')\" phi-color-tint=\"#000\">\r\n        <div class=\"header\">\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca colegios en {{vm.city}}\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                />\r\n            </div>\r\n        </div>\r\n\r\n        <phi-state-navigation>\r\n            <div>\r\n                <h1 class=\"total\">\r\n                    <strong ng-bind=\"vm.isLoading ? \'buscando\' : vm.total\"></strong>\r\n                    <span>colegios en</span>\r\n                    <span ng-bind=\"vm.city\"></span>\r\n                </h1>\r\n\r\n                <phi-menu>\r\n                    <phi-menu-item phi-icon-left=\"fa-th-large\"   ng-click=\"vm.setView(\'grid\')\" ng-class=\"{active: vm.view == \'grid\'}\">matriz</phi-menu-item>\r\n                    <phi-menu-item phi-icon-left=\"fa-bars\"       ng-click=\"vm.setView(\'list\')\" ng-class=\"{active: vm.view == \'list\'}\">lista</phi-menu-item>\r\n                    <phi-menu-item phi-icon-left=\"fa-map-marker\" ng-click=\"vm.setView(\'map\')\"  ng-class=\"{active: vm.view == \'map\'}\">mapa</phi-menu-item>\r\n                </phi-menu>\r\n            </div>\r\n        </phi-state-navigation>\r\n\r\n    </phi-state-cover>\r\n\r\n\r\n\r\n    <phi-state-contents>\r\n\r\n        <div id=\"google-map\" ng-show=\"vm.view == \'map\'\"></div>\r\n\r\n        <section id=\"centers\" phi-grid ng-show=\"vm.view != \'map\'\">\r\n\r\n            <a ng-repeat=\"center in vm.centers\" ui-sref=\"center.home({centerId: center.id})\" target=\"_blank\">\r\n                <phi-card class=\"center\">\r\n                    <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\" phi-color-tint=\"#444\">\r\n                        <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                    </phi-card-cover>\r\n\r\n                    <phi-card-contents>\r\n                        <div class=\"logo\" ng-if=\"center.logo\">\r\n                            <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                        </div>\r\n                        <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                        <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                    </phi-card-contents>\r\n                </phi-card>\r\n            </a>\r\n\r\n        </section>\r\n\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/home/home.html","<phi-state id=\"home\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#2196F3\" ng-class=\"{collapsed: searchIsFocused || !!vm.query}\">\r\n        <div class=\"header\">\r\n            <h1>Encuentra el mejor colegio</h1>\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca por ciudad o nombre del colegio\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                    ng-focus=\"searchIsFocused = true\"\r\n                    ng-blur=\"searchIsFocused = false\" \r\n                />\r\n            </div>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <section id=\"cities\" phi-grid>\r\n            <phi-card class=\"city\" ng-repeat=\"city in vm.cities\" ui-sref=\"city({city: city.name})\">\r\n                <phi-card-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/{{city.name}}.jpg\')\"></phi-card-cover>\r\n                <phi-card-contents>\r\n                    <h1 ng-bind=\"city.name\"></h1>\r\n                    <p><strong ng-bind=\"city.count\"></strong> colegios</p>\r\n                </phi-card-contents>\r\n            </phi-card>\r\n        </section>\r\n\r\n        <section id=\"centers\" phi-grid>\r\n            <phi-card class=\"center\" ng-repeat=\"center in vm.centers\" ui-sref=\"center.home({centerId: center.id})\">\r\n                <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\">\r\n                    <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                </phi-card-cover>\r\n                <phi-card-contents>\r\n                    <div class=\"logo\" ng-if=\"center.logo\">\r\n                        <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                    </div>\r\n                    <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                    <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                </phi-card-contents>\r\n            </phi-card>\r\n        </section>\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/sample/sample.html","<phi-state class=\"state-sample\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: !!vm.isCollapsed}\">\r\n        <div>\r\n            <h1 ng-bind=\"vm.title\"></h1>\r\n            <p ng-bind=\"vm.description\"></p>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-navigation>\r\n        <phi-menu>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'one\'})\" ui-sref-active=\"active\">One</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'two\'})\" ui-sref-active=\"active\">Two</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'three\'})\" ui-sref-active=\"active\">Three</phi-menu-item>\r\n        </phi-menu>\r\n    </phi-state-navigation>\r\n\r\n    <phi-state-contents ui-view>\r\n        <h1>... loading ...</h1>\r\n    </phi-state-contents>\r\n</phi-state>");
$templateCache.put("/application/states/center/admissions/admissions.html","<div id=\"state-center-admissions\">\r\n\r\n    <div ng-repeat=\"post in vm.processes\">\r\n        <a ui-sref=\"admissionHome({centerId: vm.parent.center.id, admissionId: post.id})\" class=\"post phi-padded\" phi-texture=\"paper\">\r\n            <h1 ng-bind=\"post.title\"></h1>\r\n            <p ng-bind=\"post.description\"></p>\r\n        </a>\r\n    </div>\r\n\r\n</div>");
$templateCache.put("/application/states/center/facilities/facilities.html","<div id=\"state-center-facilities\">\r\n\r\n    <code>{{vm}}</code>\r\n\r\n    <div class=\"facilities\" phi-layout=\"row\" phi-layout-wrap>\r\n\r\n        <div class=\"facility\" phi-texture=\"paper\" ng-repeat=\"facility in vm.facilities\">\r\n            <h3 ng-bind=\"facility.type\"></h3>\r\n            <h1 ng-bind=\"facility.title\"></h1>\r\n            <!--<phidias-api-resource ng-repeat=\"block in facility.blocks\" type=\"{{block.type}}\" src=\"{{block.url|trustAsResourceUrl}}\"></phidias-api-resource>-->\r\n            <phi-post ng-model=\"facility\"></phi-post>\r\n        </div>\r\n\r\n    </div>\r\n\r\n</div>");
$templateCache.put("/application/states/center/home/home.html","<div id=\"state-center-home\">\r\n    <phi-post ng-model=\"vm.post\" phi-texture=\"paper\"></phi-post>\r\n    <!--<phi-post-editor ng-model=\"vm.post\" phi-texture=\"paper\"></phi-post-editor>-->\r\n</div>");
$templateCache.put("/application/states/sample/child/child.html","<div>\r\n    <h1>State <strong ng-bind=\"vm.id\"></strong></h1>\r\n</div>");
$templateCache.put("/application/states/center/admissions/admissionId/admissionId.html","<phi-state>\r\n\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\">\r\n        <div class=\"header\">\r\n            <nav class=\"breadcrumbs\">\r\n                <a ui-sref=\"center.admissions({centerId: vm.center.id})\" ng-bind=\"vm.center.name\"></a>\r\n            </nav>\r\n            <h1 ng-bind=\"vm.post.title\"></h1>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <p ng-bind=\"vm.post.description\" class=\"phi-padded\"></p>\r\n\r\n        <div class=\"phi-padded\" phi-texture=\"paper\">\r\n            <phi-post ng-model=\"vm.post\"></phi-post>\r\n        </div>\r\n\r\n        <div class=\"phi-padded\" phi-texture=\"paper\">\r\n            <phi-post-editor ng-model=\"vm.post\"></phi-post-editor>\r\n        </div>\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");}]);