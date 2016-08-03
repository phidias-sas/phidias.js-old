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


    initialize.$inject = ["$rootScope", "$state", "phiApi"];
    function initialize($rootScope, $state, phiApi) {

        $rootScope.$state = $state;
        $rootScope.phiApi = phiApi;

        phiApi.setHost("http://api.mejorescolegios.es");

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



/*
Testing angular JS animations
https://docs.angularjs.org/guide/animations
*/


angular.module("phidias-demo-app").animation('.main-view', ["$timeout", function($timeout) {

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
      return function(isCancelled) {
      }
    }
  }
}]);



})();
(function() {
    'use strict';

    angular
        .module("phidias-demo-app")
        .config(state);

    state.$inject = ["$stateProvider"];
    function state($stateProvider) {
        $stateProvider.state("sample", {
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

        vm.isVisible = true;
        vm.visibleAnimation = '';
        vm.cities = [];

        vm.isLoading = true;
        phiApi.get("regions/all/cities?limit=5")
            .then(function(response) {
                vm.cities = response.data;
                vm.isLoading = false;
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

            phiApi.get("regions/all/cities", {limit: 4, search: query})
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
        $stateProvider.state("test", {
            url:         "/test/:number",
            templateUrl:  "/application/states/test/test.html",
            controller:   testController,
            controllerAs: "vm",
            data:         {order: 2}
        });
    }

    testController.$inject = ["$state", "$scope", "phiApi"];
    function testController($state, $scope, phiApi) {
        var vm   = this;
        vm.title = "test";
    }

})();
angular.module("phidias-demo-app").run(["$templateCache", function($templateCache) {$templateCache.put("/application/states/city/city.html","<phi-state id=\"city\">\r\n    <phi-state-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/madrid.jpg\')\" phi-color-tint=\"#000\">\r\n        <div class=\"header\">\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca colegios en {{vm.city}}\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                />\r\n            </div>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <h1>\r\n            <strong ng-bind=\"vm.isLoading ? \'buscando\' : vm.total\"></strong>\r\n            <span>colegios en</span>\r\n            <span ng-bind=\"vm.city\"></span>\r\n        </h1>\r\n\r\n        <section id=\"centers\" phi-layout=\"row\" phi-layout-wrap>\r\n            <phi-card ng-repeat=\"center in vm.centers\" class=\"center\">\r\n                <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\">\r\n                    <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                </phi-card-cover>\r\n\r\n                <phi-card-contents>\r\n                    <div class=\"logo\" ng-if=\"center.logo\">\r\n                        <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                    </div>\r\n                    <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                    <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                </phi-card-contents>\r\n\r\n            </phi-card>\r\n        </section>\r\n\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/sample/sample.html","<phi-state>\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: $state.current.name != \'default\'}\">\r\n        <div>\r\n            <h1>Page Title</h1>\r\n            <p>Cover subtext</p>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-navigation>\r\n        <phi-menu>\r\n            <phi-menu-item ui-sref=\"default\" ui-sref-active=\"active\">Default</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"test({number: 1})\" ui-sref-active=\"active\">Sample 1</phi-menu-item>\r\n            <phi-menu-item ui-sref=\"test({number: 2})\" ui-sref-active=\"active\">Sample 2</phi-menu-item>\r\n        </phi-menu>\r\n    </phi-state-navigation>\r\n\r\n    <phi-state-contents ui-view>\r\n        <h1>Contents are loading</h1>\r\n    </phi-state-contents>\r\n</phi-state>");
$templateCache.put("/application/states/home/home.html","<phi-state id=\"home\">\r\n    <phi-state-cover style=\"background-image: url(\'img/cover.jpg\')\" phi-color-tint=\"#01579b\" ng-class=\"{collapsed: searchIsFocused || !!vm.query}\">\r\n        <div class=\"header\">\r\n            <h1>Encuentra el mejor colegio</h1>\r\n            <div class=\"search\" phi-icon-left=\"{{vm.isLoading ? \'fa-spinner\' : \'fa-search\'}}\" phi-icon-animation=\"{{vm.isLoading ? \'spin\' : \'\'}}\">\r\n                <input type=\"text\"\r\n                    placeholder=\"Busca por ciudad o nombre del colegio\"\r\n                    ng-model=\"vm.query\"\r\n                    ng-model-options=\"{debounce: 400}\"\r\n                    ng-change=\"vm.find(vm.query)\"\r\n                    ng-focus=\"searchIsFocused = true\"\r\n                    ng-blur=\"searchIsFocused = false\" \r\n                />\r\n            </div>\r\n        </div>\r\n    </phi-state-cover>\r\n\r\n    <phi-state-contents>\r\n\r\n        <section id=\"cities\" phi-layout=\"row\" phi-layout-wrap>\r\n            <phi-card class=\"phi-card-image\" ng-repeat=\"city in vm.cities\" ui-sref=\"city({city: city.name})\">\r\n                <phi-card-cover style=\"background-image: url(\'http://beta.mejorescolegios.es/img/cities/{{city.name}}.jpg\')\"></phi-card-cover>\r\n                <phi-card-contents>\r\n                    <h1 ng-bind=\"city.name\"></h1>\r\n                    <p><strong ng-bind=\"city.count\"></strong> colegios</p>\r\n                </phi-card-contents>\r\n            </phi-card>\r\n        </section>\r\n\r\n        <section id=\"centers\" phi-layout=\"row\" phi-layout-wrap>\r\n            <phi-card ng-repeat=\"center in vm.centers\" class=\"center\">\r\n                <phi-card-cover style=\"background-image: url(\'{{center.cover}}\'), url(\'img/cover.jpg\')\">\r\n                    <h1 class=\"title\" ng-bind=\"center.name\"></h1>\r\n                </phi-card-cover>\r\n\r\n                <phi-card-contents>\r\n                    <div class=\"logo\" ng-if=\"center.logo\">\r\n                        <img ng-src=\"{{center.logo}}\" alt=\"{{center.name}}\" />\r\n                    </div>\r\n                    <p class=\"description\" ng-bind=\"center.category\"></p>\r\n                    <p class=\"address\" phi-icon-left=\"fa-map-marker\">{{center.address}}, {{center.city}}, {{center.region}}, {{center.postalCode}}</p>\r\n                </phi-card-contents>\r\n\r\n            </phi-card>\r\n        </section>\r\n\r\n    </phi-state-contents>\r\n\r\n</phi-state>");
$templateCache.put("/application/states/test/test.html","<section>\r\n    <h1>phi-visible</h1>\r\n\r\n    <input type=\"checkbox\"\" ng-model=\"vm.isVisible\">phi-visible</input>\r\n\r\n    <select ng-model=\"vm.visibleAnimation\">\r\n        <option value=\"\">default</option>\r\n        <option value=\"scale\">scale</option>\r\n        <option value=\"slide-top\">slide-top</option>\r\n        <option value=\"slide-right\">slide-right</option>\r\n        <option value=\"slide-bottom\">slide-bottom</option>\r\n        <option value=\"slide-left\">slide-left</option>\r\n        <option value=\"zoom-in\">zoom-in</option>\r\n        <option value=\"zoom-out\">zoom-out</option>\r\n    </select>\r\n\r\n    <div>\r\n        <code>\r\n            &lt;div phi-visible=\"{{!!vm.isVisible}}\" phi-visible-animation=\"{{vm.visibleAnimation}}\"&gt;\r\n            &lt;/div&gt;\r\n        </code>\r\n\r\n        <h1 phi-visible=\"{{!!vm.isVisible}}\" phi-visible-animation=\"{{vm.visibleAnimation}}\" phi-texture=\"paper\" class=\"phi-padded\">\r\n            Hello\r\n        </h1>\r\n    </div>\r\n\r\n</section>");}]);