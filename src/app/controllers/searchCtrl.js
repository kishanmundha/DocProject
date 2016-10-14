(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('searchCtrl', ['$log', '$scope', 'docService', '$routeParams', '$timeout', function ($log, $scope, docService, $routeParams, $timeout) {
            $log.debug('searchCtrl controller called');

            docService.setCurrentProject(false);

            $scope.term = $routeParams.q;
            $scope.inContent = $routeParams.c === "true";
            $scope.q = $routeParams.q;
            $scope.c = $routeParams.c;

            $timeout(function () {
                $('input[autofocus]').focus();
            }, 10);

            if ($scope.term) {
                $scope.searchResult = docService.searchDoc($scope.term, $scope.inContent);
            }

            $scope.search = function () {
                if (!$scope.term)
                    return;

                docService.redirectTo('/docs/search?q=' + encodeURIComponent($scope.term) + '&c=' + $scope.inContent, true);
                //$scope.searchResult = docService.searchDoc($scope.term);
            };
        }]);
})();
