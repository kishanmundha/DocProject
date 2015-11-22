
(function () {
    'use strict'

    var app = angular.module('app');

    app.controller('projectListCtrl', ['$scope', '$location', 'docService', function ($scope, $location, docService) {
        $scope.projects = docService.getProjectList();

        docService.setCurrentProject(false);
    }]);

})();