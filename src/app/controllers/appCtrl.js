﻿(function () {
    'use strict';

    var app = angular.module('app');

    app.controller('appCtrl', ['$scope', '$location', 'authService', function ($scope, $location, authService) {
            //$scope.project = {'projectId':'cati'};
            $scope.currentDoc = undefined;
            $scope.docList = [];
            $scope.searchResult = [];
            
			$scope.isAuthenticated = authService.isAuthenticated;
            $scope.getUserFirstName = authService.getFirstName;
			$scope.getUserFullName = authService.getUserFullName;
			$scope.getUserEmail = authService.getUserEmail;
			$scope.logOut = authService.logOut;

            $scope.changeProject = function (project) {
                $scope.project = project;
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

                if (!term) {
                    // clear result on clearing search input
                    $scope.searchResult = [];
                    return;
                }

                var terms = term.split(' ');

                var results = [];
				
				/*jshint loopfunc: true */
                for (var i = 0; i < terms.length; i++) {
                    var result = $scope.project.docs.filter(function (item) {
                        //console.debug(item.tags, item);
                        if (!item.tags)
                            return false;

                        // only retrun output which docs have content
                        if (item.noDoc === true)
                            return false;

                        var tags = item.tags.split(',');

                        //console.debug(tags);

                        var s = tags.filter(function (tag) {
                            return tag.toLowerCase().indexOf(terms[i].toLowerCase()) !== -1;
                        });

                        //console.debug(s);

                        return 0 !== s.length;
                        //console.debug(item);
                    });

                    if (i === 0) {
                        results = result;
                    } else {
                        // This query reset results array with filter
                        // match more word
                        results = results.filter(function (item) {
                            return 0 !== result.filter(function (item2) {
                                return item === item2;
                            }).length;
                        });
                    }
                }

                $scope.searchResult = results;

                //console.debug($scope.searchResult);
            };

        }]);

})();