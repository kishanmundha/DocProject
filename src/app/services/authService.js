(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('authService', ['$http', '$q', 'localStorageService', 'config', function ($http, $q, localStorageService, config) {

            var serviceBase = config.apiServiceBaseUri;
            var authServiceFactory = {};

            var _authentication = {
                isAuth: false,
                username: ""
            };

            var _login = function (user) {

                var deferred = $q.defer();

                $http.post(serviceBase + 'login', user).success(function (response) {

                    localStorageService.set('authorizationData', {token: response.token, username: response.username});

                    _authentication.isAuth = true;
                    _authentication.username = response.username;

                    deferred.resolve(response);

                }).error(function (err) {
                    _logOut();
                    deferred.reject(err);
                });

                return deferred.promise;

            };

            var _logOut = function () {

                localStorageService.remove('authorizationData');

                _authentication.isAuth = false;
                _authentication.username = "";
                _authentication.useRefreshTokens = false;

            };

            var _fillAuthData = function () {

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    _authentication.isAuth = true;
                    _authentication.username = authData.username;
                }

            };

            authServiceFactory.login = _login;
            authServiceFactory.logOut = _logOut;
            authServiceFactory.fillAuthData = _fillAuthData;
            authServiceFactory.authentication = _authentication;

            return authServiceFactory;
        }]);
})();