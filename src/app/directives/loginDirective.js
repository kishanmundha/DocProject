(function () {
    'use strict';

    var app = angular.module('app');

    app.directive('loginForm', ['$log', 'authService', function ($log, authService) {
            return {
                restrict: 'EA',
                //require: '^ngModel',
                scope: {
                    ngModel: '=',
                    onLogin: '&',
                    onLoginAttempt: '&'
                },
                templateUrl: '/app/partials/loginTemplate.html',
                link: function ($scope, element, attrs, ctrls) {
                    if (!$scope.ngModel)
                        $scope.ngModel = {};

                    $log.debug('loginForm scope => ', $scope);
                    $log.debug(element, attrs, ctrls);
                    window.temp = ctrls;

                    $scope.user = $scope.ngModel;
                    $scope.loginSuccessed = false;

                    $scope.login = function () {
                        $scope.isLoging = true;

                        //$scope.loginError = '';
                        //$scope.loginSuccess = '';

                        if (!$scope.user.username || !$scope.user.password) {
                            $scope.onLoginAttempt();
                            $scope.loginError = 'Username and password required';
                            $scope.loginSuccess = '';
                            $scope.isLoging = false;
                            return;
                        }

                        authService.login($scope.user).then(function () {
                            $scope.onLoginAttempt();
                            $scope.loginError = '';
                            $scope.loginSuccess = 'Login success';
                            $scope.loginSuccessed = true;
                            $scope.isLoging = false;
                            $scope.onLogin();
                        }, function (err) {
                            $scope.onLoginAttempt();
                            $scope.loginError = err.error;
                            $scope.isLoging = false;
                        });
                    };

                }
            };
        }]);

})();