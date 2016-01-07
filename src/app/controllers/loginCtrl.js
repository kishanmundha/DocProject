(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginCtrl', ['$log', '$scope', 'authService', 'loginModalService', function ($log, $scope, authService, loginModalService) {
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
            
            $scope.onLogin = function() {
                $log.debug('login success');
            };
            
            $scope.openDialog = function() {
                loginModalService.login();
                /*
                $modal.open({
                    template: '<div class="modal-header"><b>Login</b></div><div class="modal-body"><div data-login-form ng-model="user" on-login="onLogin()"></div></div>',
                    //backdrop: 'static',
                    //keyboard: false,
                    windowClass: 'modalCenter'
                });
                */
            };
        }]);
})();
