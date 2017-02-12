(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

    app.config(['$routeProvider', '$locationProvider', '$logProvider', '$httpProvider', 'config',
        function ($routeProvider, $locationProvider, $logProvider, $httpProvider, config) {

            if (config.isLoginEnable()) {
                $routeProvider.when('/login', {
                    templateUrl: '/app/views/loginTemplate.html',
                    controller: 'loginCtrl'
                });
            }

            $routeProvider.when('/add', {
                templateUrl: '/app/views/addDocTemplate.html',
                controller: 'addDocCtrl'
            });

            $routeProvider
                .when('/', {// project list
                    templateUrl: '/app/views/projectListTemplate.html',
                    controller: 'projectListCtrl'
                })
                .when('/edit/:projectId', {
                    templateUrl: '/app/views/editDocTemplate.html',
                    controller: 'editDocCtrl'
                })
                .when('/edit/:projectId/:docId', {
                    templateUrl: '/app/views/editDocTemplate.html',
                    controller: 'editDocCtrl'
                })
                .when('/search', {
                    templateUrl: '/app/views/searchTemplate.html',
                    controller: 'searchCtrl'
                })
                .when('/search?q=:term', {
                    templateUrl: '/app/views/searchTemplate.html',
                    controller: 'searchCtrl'
                })
                .when('/:projectId', {// home page for project
                    templateUrl: '/app/views/docTemplate.html',
                    controller: 'docCtrl'
                })
                .when('/:projectId/:docId*', {// documentation page    // :docId* will accept subpath
                    templateUrl: '/app/views/docTemplate.html',
                    controller: 'docCtrl'
                });

            $routeProvider.otherwise({
                template: '<not-found404></not-found404>'
            });


            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            //$locationProvider.hashPrefix('!');

            var debugEnabled = config.debugEnabled;
            if (!debugEnabled && window.localStorage) {
                debugEnabled = JSON.parse(
                    window.localStorage.getItem('debugEnabled') || "false"
                ) === true;
            }

            $logProvider.debugEnabled(debugEnabled);

            $httpProvider.interceptors.push('authInterceptorService');
        }]);

    app.run(['authService', function (authService) {
        authService.fillAuthData();
    }]);

    //angular.bootstrap(document, 'app');

})();
