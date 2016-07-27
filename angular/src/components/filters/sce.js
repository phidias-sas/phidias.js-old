(function() {
    'use strict';

    angular
        .module("phidias-angular")
        .filter('trustAsResourceUrl', trustAsResourceUrl)
        .filter('trustAsUrl', trustAsUrl)
        .filter('trustAsHtml', trustAsHtml);

    trustAsResourceUrl.$inject = ["$sce"];
    function trustAsResourceUrl($sce) {
        return $sce.trustAsResourceUrl;
    }

    trustAsUrl.$inject = ["$sce"];
    function trustAsUrl($sce) {
        return $sce.trustAsUrl;
    }

    trustAsHtml.$inject = ["$sce"];
    function trustAsHtml($sce) {
        return $sce.trustAsHtml;
    }

})();