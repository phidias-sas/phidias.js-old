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


