(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('addDocCtrl', ['$log', '$scope', 'config', 'authService', 'docService', 'firebaseService', function ($log, $scope, config, authService, docService, firebaseService) {
        $log.debug('addDocCtrl controller called');

        $scope.model = {};

        $scope.enableEditDoc = config.enableEditDoc && authService.isAdmin();

        $scope.projectList = docService.getProjectList();

        $scope.categoryList = [];

        $scope.onProjectChange = function () {
            $scope.categoryList.length = 0;

            var project = docService.getProject($scope.model.projectId);

            if (project) {
                project.categories.forEach(function (c) {
                    $scope.categoryList.push({
                        categoryId: c.name,
                        categoryName: c.display || "Empty"
                    });
                });
            }
        };

        $scope.addDocument = function () {
            $scope.error = '';

            var project = docService.getProject($scope.model.projectId);

            var existDoc = project.docs.filter(function (d) {
                return d.docId === $scope.model.docId;
            })[0];

            if (existDoc) {
                $scope.error = "Duplicate document id not allowed";
                return;
            }

            $scope.model.projectIndex = -1;
            $scope.model.docIndex = -1;

            $scope.model.projectIndex = $scope.projectList.findIndex(function (p) {
                return p.projectId === $scope.model.projectId;
            });

            $scope.model.docIndex = project.docs.length;

            firebaseService.addDocument($scope.model).then(function () {
                docService.redirectTo("/" + $scope.model.projectId + "/" + $scope.model.docId);
            }, function (err) {
                $scope.error = "Unable to add document";
            });
        };

        docService.setCurrentProject(false);

    }]);
})();
