(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter("momentCalendar", calendar)
        .filter("momentFormat", format)
        .filter("momentFromNow", fromNow);

    function calendar() {
        return function(timestamp) {
            return moment(timestamp*1000).calendar();
        };
    }

    function format() {
        return function(timestamp, formatString) {
            return moment(timestamp*1000).format(formatString);
        };        
    }

    function fromNow() {
        return function(timestamp) {
            return moment(timestamp*1000).fromNow();
        };
    }


})();