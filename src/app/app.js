
        (function () {
            'use strict'

            var app = angular.module('app', ['ngRoute', 'ngSanitize']);

            app.config(['$routeProvider', '$locationProvider',
                function ($routeProvider, $locationProvider) {
                    $routeProvider
                            .when('/docs', {// project list
                                templateUrl: 'app/views/projectListTemplate.html',
                                controller: 'projectListCtrl'
                            })
                            .when('/docs/:projectId', {// home page for project
                                templateUrl: 'app/views/docTemplate.html',
                                controller: 'docCtrl'
                            })
                            .when('/docs/:projectId/:docId', {// documentation page
                                templateUrl: 'app/views/docTemplate.html',
                                controller: 'docCtrl'
                            })
                            .when('/error', {
                                template: '<div style="width:400px; text-align:center; margin:0px auto; font-size:20px; font-weight:bold; padding-top:40px;">Sorry, This page not found</div>'
                            })
                            .when('/', {
                                redirectTo: '/docs'
                            })
                            .otherwise({
                                redirectTo: '/error'
                            });

                    $locationProvider.hashPrefix('!');
                }]);

            //angular.bootstrap(document, 'app');
        })();
