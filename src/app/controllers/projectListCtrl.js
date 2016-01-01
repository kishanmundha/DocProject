(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('projectListCtrl', ['$scope', 'docService', function ($scope, docService) {
            $scope.projects = docService.getProjectList();

            docService.setCurrentProject(false);
        }]);

})();