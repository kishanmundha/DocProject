(function () {
    'use strict';

    var app = angular.module('app');

    app.factory('authService', ['$http', '$q', 'localStorageService', 'config', 'firebaseService', function ($http, $q, localStorageService, config, firebaseService) {

        var serviceBase = config.apiServiceBaseUri;
        var authServiceFactory = {};
        var adminEmail = "kishan.mundha@gmail.com";

        var _authentication = {
            isAuth: false
        };

        var _login = function (method) {

            var promise = firebaseService.firebaseLogin(method);

            promise.then(function (user) {
                _authentication.isAuth = true;
                _authentication.displayname = user.displayName;
                _authentication.email = user.email;
                _authentication.isAdmin = user.email === adminEmail;

                localStorageService.set('authorizationData', _authentication);
            });

            return promise;
        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');

            _authentication.isAuth = false;
            _authentication.isAdmin = false;
            _authentication.displayname = "";
            _authentication.email = '';

            firebaseService.logOut();

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.displayname = authData.displayname;
                _authentication.email = authData.email;
                _authentication.isAdmin = authData.email === adminEmail;
            }

        };

        var _getFirstName = function () {
            return _authentication.first_name;
        };

        var _getUserFullName = function () {
            //return _authentication.first_name + (_authentication.last_name ? ' ' + _authentication.last_name : '');
            return _authentication.displayname;
        };

        var _getUserEmail = function () {

            return _authentication.email;
        };

        var _isAuthenticated = function () {
            return _authentication.isAuth;
        };

        var _isAdmin = function() {
            return _authentication.isAuth && _authentication.isAdmin;
        };

        authServiceFactory.isAuthenticated = _isAuthenticated;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.getFirstName = _getFirstName;
        authServiceFactory.getUserFullName = _getUserFullName;
        authServiceFactory.getUserEmail = _getUserEmail;

        authServiceFactory.isAdmin = _isAdmin;

        return authServiceFactory;
    }]);
})();