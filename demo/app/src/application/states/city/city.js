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