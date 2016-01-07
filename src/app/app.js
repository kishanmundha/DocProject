(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngSanitize', 'ngAnimate', 'ui.bootstrap']);

    app.config(['$routeProvider', '$locationProvider', '$logProvider', '$httpProvider', 'config',
        function ($routeProvider, $locationProvider, $logProvider, $httpProvider, config) {
            $routeProvider
                    .when('/docs', {// project list
                        templateUrl: '/app/views/projectListTemplate.html',
                        controller: 'projectListCtrl'
                    })
                    .when('/docs/edit/:projectId', {
                        templateUrl: '/app/views/editDocTemplate.html',
                        controller: 'editDocCtrl'
                    })
                    .when('/docs/edit/:projectId/:docId', {
                        templateUrl: '/app/views/editDocTemplate.html',
                        controller: 'editDocCtrl'
                    })
                    .when('/docs/:projectId', {// home page for project
                        templateUrl: '/app/views/docTemplate.html',
                        controller: 'docCtrl'
                    })
                    .when('/docs/:projectId/:docId*', {// documentation page    // :docId* will accept subpath
                        templateUrl: '/app/views/docTemplate.html',
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

            if (config.isLoginEnable()) {
                $routeProvider.when('/login', {
                    templateUrl: '/app/views/loginTemplate.html',
                    controller: 'loginCtrl'
                });
            }

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
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
