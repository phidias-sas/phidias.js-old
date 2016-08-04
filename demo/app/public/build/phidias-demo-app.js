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
        $stateProvider.state("center", {
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
            url:         "/cities/:city",
            templateUrl:  "/application/states/city/city.html",
            controller:   cityController,
            controllerAs: "vm"
        });
    }

    cityController.$inject = ["$state", "phiApi"];
    function cityController($state, phiApi) {
        var vm  = this;
        vm.city = $state.params.city;

        vm.centers   = [];
        vm.isLoading = false;

        vm.page  = 1;
        vm.total = null;

        vm.find = function(query) {

            query = query == undefined ? '' : query.trim();

            vm.isLoading = true;
            phiApi.get("centers", {page: vm.page, search: query, 'filters[city]': vm.city})
                .then(function (response) {
                    vm.centers = response.data;
                    vm.page    = parseInt(response.headers('x-phidias-collection-page'));
                    vm.total   = parseInt(response.headers('x-phidias-collection-total'));
                })
                .finally(function() {
                    vm.isLoading = false;
                });            

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
        $stateProvider.state("home", {
            url:         "/",
            templateUrl:  "/application/states/home/home.html",
            controller:   homeController,
            controllerAs: "vm"
        });
    }

    homeController.$inject = ["phiApi"];
    function homeController(phiApi) {

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

    homeController.$inject = ["$state", "$scope", "phiApi"];
    function homeController($state, $scope, phiApi) {

        var vm     = this;
        var center = $scope.$parent.vm.center;

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
angular.module("phidias-demo-app").run(["$templateCache", function($templateCache) {$templateCache.put("/application/states/center/center.html","<phi-state class=\"state-center\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: !!vm.isCollapsed}\">\r\n        <div class=\"header\">\r\n            <h1 ng-bind=\"vm.center.name\"></h1>\r\n            <p ng-bind=\"vm.center.category\"></p>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-navigation>\r\n        <phi-menu>\r\n            <phi-menu-item ui-sref=\"center.home({centerId: vm.centerId})\" ui-sref-active=\"active\">Inicio</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"center.facilities({centerId: vm.centerId})\" ui-sref-active=\"active\">Instalaciones</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"center.admissions({centerId: vm.centerId})\" ui-sref-active=\"active\">Admisiones</phi-menu-item>\r\n        </phi-menu>\r\n    </phi-state-navigation>\r\n\r\n    <phi-state-contents ui-view>\r\n        <h1>... loading ...</h1>\r\n    </phi-state-contents>\r\n</phi-state>");
$templateCache.put("/application/states/city/city.html","<phi-state id=\"city\">\r\n    <phi-state-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/{{vm.city}}.jpg\')\" phi-color-tint=\"#000\">\r\n        <div class=\"header\">\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca colegios en {{vm.city}}\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                />\r\n            </div>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <h1 class=\"total\">\r\n            <strong ng-bind=\"vm.isLoading ? \'buscando\' : vm.total\"></strong>\r\n            <span>colegios en</span>\r\n            <span ng-bind=\"vm.city\"></span>\r\n        </h1>\r\n\r\n        <section id=\"centers\" phi-grid>\r\n\r\n            <a ng-repeat=\"center in vm.centers\" ui-sref=\"center.home({centerId: center.id})\" target=\"_blank\">\r\n                <phi-card class=\"center\">\r\n                    <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\" phi-color-tint=\"#444\">\r\n                        <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                    </phi-card-cover>\r\n\r\n                    <phi-card-contents>\r\n                        <div class=\"logo\" ng-if=\"center.logo\">\r\n                            <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                        </div>\r\n                        <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                        <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                    </phi-card-contents>\r\n                </phi-card>\r\n            </a>\r\n\r\n        </section>\r\n\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/home/home.html","<phi-state id=\"home\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: searchIsFocused || !!vm.query}\">\r\n        <div class=\"header\">\r\n            <h1>Encuentra el mejor colegio</h1>\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca por ciudad o nombre del colegio\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                    ng-focus=\"searchIsFocused = true\"\r\n                    ng-blur=\"searchIsFocused = false\" \r\n                />\r\n            </div>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <section id=\"cities\" phi-grid>\r\n\r\n            <phi-card class=\"city\" ng-repeat=\"city in vm.cities\" ui-sref=\"city({city: city.name})\">\r\n                <phi-card-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/{{city.name}}.jpg\')\"></phi-card-cover>\r\n                <phi-card-contents>\r\n                    <h1 ng-bind=\"city.name\"></h1>\r\n                    <p><strong ng-bind=\"city.count\"></strong> colegios</p>\r\n                </phi-card-contents>\r\n            </phi-card>\r\n\r\n        </section>\r\n\r\n        <section id=\"centers\" phi-grid>\r\n\r\n            <phi-card class=\"center\" ng-repeat=\"center in vm.centers\" ui-sref=\"center.home({centerId: center.id})\">\r\n                <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\">\r\n                    <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                </phi-card-cover>\r\n                <phi-card-contents>\r\n                    <div class=\"logo\" ng-if=\"center.logo\">\r\n                        <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                    </div>\r\n                    <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                    <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                </phi-card-contents>\r\n            </phi-card>\r\n\r\n        </section>\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/sample/sample.html","<phi-state class=\"state-sample\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: !!vm.isCollapsed}\">\r\n        <div>\r\n            <h1 ng-bind=\"vm.title\"></h1>\r\n            <p ng-bind=\"vm.description\"></p>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-navigation>\r\n        <phi-menu>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'one\'})\" ui-sref-active=\"active\">One</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'two\'})\" ui-sref-active=\"active\">Two</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"sample.child({id: \'three\'})\" ui-sref-active=\"active\">Three</phi-menu-item>\r\n        </phi-menu>\r\n    </phi-state-navigation>\r\n\r\n    <phi-state-contents ui-view>\r\n        <h1>... loading ...</h1>\r\n    </phi-state-contents>\r\n</phi-state>");
$templateCache.put("/application/states/center/home/home.html","<div>\r\n    <h1>Detalles del centro</h1>\r\n</div>");
$templateCache.put("/application/states/sample/child/child.html","<div>\r\n    <h1>State <strong ng-bind=\"vm.id\"></strong></h1>\r\n</div>");}]);