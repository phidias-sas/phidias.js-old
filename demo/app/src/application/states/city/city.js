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