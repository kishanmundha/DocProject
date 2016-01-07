(function () {
    'use strict';
    
    var app = angular.module('app');
    
    app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService',
        function ($q, $injector, $location, localStorageService) {

            var _request = function (config) {

                config.headers = config.headers || {};

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    config.headers['x-access-token'] = authData.token;
                }

                return config;
            };

            var _responseError = function (rejection) {
                if (rejection.status === 401) {
                    var authService = $injector.get('authService');
                    var loginModalService = $injector.get('loginModalService');
                    var authData = localStorageService.get('authorizationData');

                    authService.logOut();
                    loginModalService.login();
                }
                return $q.reject(rejection);
            };

            return {
                request: _request,
                responseError: _responseError
            };
        }]);
})();