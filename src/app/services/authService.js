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

                $http.post(config.apiLogin, user).success(function (response) {

                    localStorageService.set('authorizationData', {
						token: response.token,
						username: response.username,
						first_name: response.first_name,
						last_name: response.last_name,
						email: response.email
						});

                    _authentication.isAuth = true;
                    _authentication.username = response.username;
					_authentication.first_name = response.first_name;
					_authentication.last_name = response.last_name;
					_authentication.email = response.email;

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
				_authentication.username = '';
				_authentication.first_name = '';
				_authentication.last_name = '';
				_authentication.email = '';
                _authentication.useRefreshTokens = false;

            };

            var _fillAuthData = function () {

                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    _authentication.isAuth = true;
                    _authentication.username = authData.username;
                    _authentication.username = authData.username;
					_authentication.first_name = authData.first_name;
					_authentication.last_name = authData.last_name;
					_authentication.email = authData.email;
                }

            };
            
            var _getFirstName = function() {
				return _authentication.first_name;
            };
			
			var _getUserFullName = function() {
                return _authentication.first_name + (_authentication.last_name ? ' ' + _authentication.last_name: '');
			};
			
			var _getUserEmail = function() {
                
                return _authentication.email;
			};
			
			var _isAuthenticated = function() {
				return _authentication.isAuth;
			};

			authServiceFactory.isAuthenticated = _isAuthenticated;
            authServiceFactory.login = _login;
            authServiceFactory.logOut = _logOut;
            authServiceFactory.fillAuthData = _fillAuthData;
            authServiceFactory.authentication = _authentication;
            authServiceFactory.getFirstName = _getFirstName;
			authServiceFactory.getUserFullName = _getUserFullName;
			authServiceFactory.getUserEmail = _getUserEmail;

            return authServiceFactory;
        }]);
})();