(function () {
    'use strict';

    var app = angular.module('app');

    app.service('loginModalService', ['$log', '$modal',
        function ($log, $modal) {

            var login = function () {
                $modal.open({
                    template: '<div class="modal-header"><b>Login</b></div><div class="modal-body"><div class="msg msg-warning" ng-if="!loginAttempted">You must log in to continue</div><div data-login-form ng-model="user" on-login-attempt="onLoginAttempt()" on-login="onLogin()"></div></div>',
                    //backdrop: 'static',
                    //keyboard: false,
                    size: 'sm',
                    windowClass: 'modalCenter',
                    controller: ['$scope', '$modalInstance', '$timeout', function ($scope, $modalInstance, $timeout) {
                            $scope.onLoginAttempt = function () {
                                $scope.loginAttempted = true;
                            };

                            $scope.onLogin = function () {
                                $log.debug('login success');
                                $timeout(function () {
                                    $modalInstance.close();
                                }, 1000);
                            };
                        }]
                });
            };

            return {
                login: login
            };
        }]);

})();