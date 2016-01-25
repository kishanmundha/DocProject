(function () {
    'use strict';
    var app = angular.module('app');
    app.controller('loginCtrl', ['$log', '$scope', function ($log, $scope) {
            $log.debug('loginCtrl controller called');

            $scope.user = {
                username: '',
                password: ''
            };

            $scope.onLogin = function() {
                $log.debug('login success');
            };
        }]);
})();
