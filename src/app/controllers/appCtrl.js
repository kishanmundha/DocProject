(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('appCtrl', ['$scope', '$location', 'authService', 'docService', '$log', '$route', function ($scope, $location, authService, docService, $log, $route) {
            //$scope.project = {'projectId':'cati'};
            $scope.currentDoc = undefined;
            $scope.docList = [];
            $scope.searchResult = [];

            $scope.isAuthenticated = authService.isAuthenticated;
            $scope.getUserFirstName = authService.getFirstName;
            $scope.getUserFullName = authService.getUserFullName;
            $scope.getUserEmail = authService.getUserEmail;
            $scope.logOut = authService.logOut;

            var redirectTo = function (url, forceReload) {
                var oldUrl = $location.$$url;

                $log.debug('appCtrl.redirectTo -> url =>' + url);

                if (url === oldUrl) {
                    if (forceReload)
                        $route.reload();
                    return;
                }

                var query = url.split('?');

                url = query[0];

                query = query[1];

                $location.search({});

                if (query) {
                    query = query.split('&')
                            .filter(function (item) {
                                return item && item.trim();
                            })
                            .map(function (item) {
                                var a = item.split('=');
                                return {key: a[0], value: decodeURIComponent(a[1])};
                            });

                    var obj = {};
                    query.forEach(function (item) {
                        obj[item.key] = item.value;
                    });

                    $location.search(obj);
                }

                $location.path(url);
            };

            $scope.$on('redirectTo', function (evt, arg1, arg2) {
                redirectTo(arg1, arg2);
            });

            $scope.changeProject = function (project) {
                $scope.project = project;

                if (!project) {
                    $scope.setNavigationVisiblity(false);
                }
            };

            $scope.$on('changeProject', function (evt, args) {
                $scope.changeProject(args);
            });

            $scope.changeDoc = function (doc) {
                $scope.currentDoc = doc;
            };

            $scope.$on('changeDoc', function (evt, args) {
                $scope.changeDoc(args);
            });

            $scope.setNavigationVisiblity = function (state) {
                $scope.isNavigationShow = state === true;
                $scope.search = '';
            };
            $scope.searchPage = function (term) {
                $scope.searchResult = docService.searchDoc(term, $scope.project.docs);
            };

        }]);

})();