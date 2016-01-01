(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginCtrl', ['$log', '$scope', 'authService', function ($log, $scope, authService) {
            $log.debug('loginCtrl controller called');

            $scope.user = {
                username: '',
                password: ''
            };

            $scope.login = function () {
                $scope.isLoging = true;

                $scope.loginError = '';
                $scope.loginSuccess = '';

                if (!$scope.user.username || !$scope.user.password) {
                    $scope.loginError = 'Username and password required';
                    $scope.isLoging = false;
                    return;
                }

                authService.login($scope.user).then(function () {
                    $scope.loginSuccess = 'Login success';
                    $scope.isLoging = false;
                }, function (err) {
                    $scope.loginError = err.error;
                    $scope.isLoging = false;
                });

            };
        }]);
})();
