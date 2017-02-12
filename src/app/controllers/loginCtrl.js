(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginCtrl', ['$log', '$scope', 'authService', 'docService', function ($log, $scope, authService, docService) {
            $log.debug('loginCtrl controller called');

            $scope.user = {
                username: '',
                password: ''
            };

            $scope.onLogin = function () {
                $log.debug('login success');
            };

            $scope.login = function(method) {
                authService.login(method).then(function() {
                    docService.redirectTo('/');
                });
            };
        }]);
})();
