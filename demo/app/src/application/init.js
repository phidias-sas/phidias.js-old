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
