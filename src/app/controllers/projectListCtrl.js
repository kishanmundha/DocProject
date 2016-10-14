(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('projectListCtrl', ['$scope', 'docService', '$timeout', function ($scope, docService, $timeout) {
            $scope.projects = docService.getProjectList();

            docService.setCurrentProject(false);

            $timeout(function () {
                $('input[autofocus]').focus();
            }, 10);
        }]);

})();